import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Context, Telegraf, session, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { PrismaClient } from '@prisma/client';
// Inlined from src/lib/utils to avoid bundler moduleResolution conflict
function normalizePlate(plate: string) {
  return plate.replace(/[\s-]/g, '').toUpperCase();
}
function formatPlateDisplay(plate: string, country = 'UZ') {
  const n = normalizePlate(plate);
  if (country === 'UZ' && n.length === 8) return `${n.slice(0,2)} | ${n.slice(2,3)} ${n.slice(3,6)} ${n.slice(6)}`;
  if (country === 'RU' && n.length >= 8) return `${n[0]} ${n.slice(1,4)} ${n.slice(4,6)} | ${n.slice(6)}`;
  if (country === 'KZ' && n.length >= 7) return `${n.slice(0,3)} | ${n.slice(3,6)} | ${n.slice(6)}`;
  return n.replace(/(.{2,3})(?=.)/g, '$1 ');
}

// ── Load .env ────────────────────────────────────────────────────────────────
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
  for (const line of env.split(/\r?\n/)) {
    const idx = line.indexOf('=');
    if (idx > 0 && !line.startsWith('#')) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch { /* no .env, use system env */ }

// ── Init ─────────────────────────────────────────────────────────────────────
const db = new PrismaClient();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN || BOT_TOKEN === 'your_token_here') {
  console.error('❌  TELEGRAM_BOT_TOKEN .env faylida to\'g\'ri sozlanmagan.');
  process.exit(1);
}

// ── Types ────────────────────────────────────────────────────────────────────
interface SessionData { step?: 'register' | 'search' }
interface BotContext extends Context { session: SessionData }

// ── Bot ──────────────────────────────────────────────────────────────────────
const bot = new Telegraf<BotContext>(BOT_TOKEN);
bot.use(session({ defaultSession: (): SessionData => ({}) }));

// ── Helpers ───────────────────────────────────────────────────────────────────
function detectCountry(n: string) {
  if (/^\d{2}[A-Z]/.test(n)) return 'UZ';
  if (/^[ABEKMHOPCTX]\d{3}[ABEKMHOPCTX]{2}/.test(n)) return 'RU';
  if (/^\d{3}[A-Z]{2,3}\d{2}/.test(n)) return 'KZ';
  return 'OTH';
}
const FLAG: Record<string, string> = { UZ: '🇺🇿', RU: '🇷🇺', KZ: '🇰🇿', OTH: '🌐' };

async function upsertUser(tgId: string, firstName: string, lastName?: string | null) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return db.user.upsert({ where: { telegramId: tgId }, update: { name }, create: { telegramId: tgId, name } });
}

const MAIN = Markup.keyboard([
  ["🚗 Mashina qo'shish", '🔍 Mashina qidirish'],
  ['📋 Mashinalarim'],
]).resize();

const CANCEL = Markup.keyboard([['❌ Bekor qilish']]).resize();

// ── /start ───────────────────────────────────────────────────────────────────
bot.command('start', async (ctx) => {
  ctx.session = {};
  await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
  await ctx.reply(
    `Salom, ${ctx.from.first_name}! 👋\n\n<b>NomerTop</b> — davlat raqami orqali anonim xabar yuborish xizmati.\n\nQuyidagilardan birini tanlang:`,
    { parse_mode: 'HTML', ...MAIN },
  );
});

// ── Register ─────────────────────────────────────────────────────────────────
bot.hears("🚗 Mashina qo'shish", async (ctx) => {
  ctx.session.step = 'register';
  await ctx.reply('🚗 Mashinangizning davlat raqamini yuboring:\n\n<code>01 A 777 AA</code>', { parse_mode: 'HTML', ...CANCEL });
});

// ── Search ────────────────────────────────────────────────────────────────────
bot.hears('🔍 Mashina qidirish', async (ctx) => {
  ctx.session.step = 'search';
  await ctx.reply("🔍 Qidirayotgan mashinaning raqamini yuboring:\n\n<code>01 A 777 AA</code>", { parse_mode: 'HTML', ...CANCEL });
});

// ── My cars ──────────────────────────────────────────────────────────────────
bot.hears('📋 Mashinalarim', async (ctx) => {
  ctx.session = {};
  const user = await db.user.findUnique({
    where: { telegramId: String(ctx.from.id) },
    include: { plates: true },
  });

  if (!user?.plates.length) {
    return ctx.reply("Sizda hali mashina qo'shilmagan.\n\n\"🚗 Mashina qo'shish\" tugmasini bosing.", MAIN);
  }

  await ctx.reply(`Sizning mashinalaringiz (${user.plates.length} ta):`, MAIN);
  for (const plate of user.plates) {
    const info = [plate.brand, plate.model, plate.color].filter(Boolean).join(' · ');
    await ctx.reply(
      `🚗 <b>${plate.displayNumber}</b>  ${FLAG[plate.country] ?? '🌐'}\n` +
      (info ? `└ ${info}\n` : '') +
      `└ ${plate.verifiedStatus === 'APPROVED' ? '✅ Tasdiqlangan' : '⏳ Tekshirilmoqda'}`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([Markup.button.callback("❌ O'chirish", `del:${plate.id}`)]),
      },
    );
  }
});

// ── Cancel ────────────────────────────────────────────────────────────────────
bot.hears('❌ Bekor qilish', async (ctx) => {
  ctx.session = {};
  await ctx.reply('Bekor qilindi.', MAIN);
});

// ── Delete plate ──────────────────────────────────────────────────────────────
bot.action(/^del:(.+)$/, async (ctx) => {
  const plateId = ctx.match[1];
  const plate = await db.plate.findFirst({ where: { id: plateId, owner: { telegramId: String(ctx.from?.id) } } });
  if (!plate) return ctx.answerCbQuery('Mashina topilmadi yoki sizga tegishli emas.', { show_alert: true });
  await db.plate.delete({ where: { id: plateId } });
  await ctx.answerCbQuery("✅ O'chirildi!");
  await ctx.editMessageText(
    `🗑 <b>${plate.displayNumber}</b> — o'chirildi.\nNomер endi boshqa foydalanuvchi tomonidan ro'yxatdan o'tkazilishi mumkin.`,
    { parse_mode: 'HTML' },
  );
});

// ── Text input ────────────────────────────────────────────────────────────────
bot.on(message('text'), async (ctx) => {
  const step = ctx.session.step;
  if (!step) return;

  const raw = ctx.message.text.trim();
  const normalized = normalizePlate(raw);

  if (normalized.length < 4) {
    return ctx.reply("❌ Noto'g'ri format:\n\n<code>01 A 777 AA</code>", { parse_mode: 'HTML' });
  }

  ctx.session = {};

  if (step === 'register') {
    const user = await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
    const existing = await db.plate.findUnique({ where: { number: normalized } });

    if (existing) {
      if (existing.ownerId === user.id) {
        return ctx.reply(`✅ Bu mashina allaqachon sizniki: <b>${existing.displayNumber}</b>`, { parse_mode: 'HTML', ...MAIN });
      }
      return ctx.reply(
        `❌ <b>${normalized}</b> raqami boshqa foydalanuvchiga bog'langan.\n\nAgar bu sizning mashinangiz bo'lsa, qo'llab-quvvatlashga murojaat qiling.`,
        { parse_mode: 'HTML', ...MAIN },
      );
    }

    const country = detectCountry(normalized);
    const displayNumber = formatPlateDisplay(normalized, country);
    await db.plate.create({ data: { number: normalized, displayNumber, country, ownerId: user.id, verifiedStatus: 'PENDING' } });

    return ctx.reply(
      `✅ <b>${displayNumber}</b> qo'shildi! ${FLAG[country]}\n\nBu raqamga kelgan xabarlar Telegram orqali sizga yetkaziladi.`,
      { parse_mode: 'HTML', ...MAIN },
    );
  }

  if (step === 'search') {
    const plate = await db.plate.findUnique({ where: { number: normalized } });
    if (!plate) {
      return ctx.reply(
        `🔍 <b>${normalized}</b>\n\n❌ Bu raqam ro'yxatdan o'tmagan.\n\nSaytda qidirish: https://nomer.top/search?q=${normalized}`,
        { parse_mode: 'HTML', ...MAIN },
      );
    }
    const info = [plate.brand, plate.model, plate.color].filter(Boolean).join(' · ');
    return ctx.reply(
      `🔍 <b>${plate.displayNumber}</b>  ${FLAG[plate.country] ?? '🌐'}\n\n` +
      `${plate.verifiedStatus === 'APPROVED' ? '✅ Tasdiqlangan' : '⏳ Tekshirilmoqda'}\n` +
      (info ? `🚘 ${info}\n` : '') +
      `\nEgasiga xabar: https://nomer.top/plate/${normalized}`,
      { parse_mode: 'HTML', ...MAIN },
    );
  }
});

// ── Launch ────────────────────────────────────────────────────────────────────
bot.launch({ dropPendingUpdates: true }).then(() => {
  console.log('✅ NomerTop bot ishga tushdi!');
  console.log(`🤖 @${bot.botInfo?.username}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
