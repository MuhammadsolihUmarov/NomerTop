import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Context, Telegraf, session, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { PrismaClient } from '@prisma/client';

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
} catch { /* no .env */ }

// ── Init ─────────────────────────────────────────────────────────────────────
const db = new PrismaClient();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN || BOT_TOKEN === 'your_token_here') {
  process.stderr.write("❌ TELEGRAM_BOT_TOKEN .env faylida to'g'ri sozlanmagan.\n");
  process.exit(1);
}

// ── Types ────────────────────────────────────────────────────────────────────
interface Pending {
  number: string;      // normalized
  display: string;     // formatted
  country: string;
  brandModel?: string;
}

interface SessionData {
  step?: 'reg_plate' | 'reg_name' | 'reg_photo' | 'search' | 'msg';
  pending?: Pending;
  msgTo?: string; // plate.number for send-message flow
}

interface BotContext extends Context { session: SessionData }

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizePlate(p: string) { return p.replace(/[\s-]/g, '').toUpperCase(); }

function formatPlate(n: string, country = 'UZ') {
  if (country === 'UZ' && n.length === 8) return `${n.slice(0,2)} | ${n.slice(2,3)} ${n.slice(3,6)} ${n.slice(6)}`;
  if (country === 'RU' && n.length >= 8) return `${n[0]} ${n.slice(1,4)} ${n.slice(4,6)} | ${n.slice(6)}`;
  if (country === 'KZ' && n.length >= 7) return `${n.slice(0,3)} | ${n.slice(3,6)} | ${n.slice(6)}`;
  return n.replace(/(.{2,3})(?=.)/g, '$1 ');
}

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

async function notifyOwner(telegramId: string, plateDisplay: string, senderName: string, content: string) {
  try {
    await bot.telegram.sendMessage(
      telegramId,
      `📩 <b>${plateDisplay}</b> raqamingizga yangi xabar:\n\n"${content}"\n\n— ${senderName}`,
      { parse_mode: 'HTML' },
    );
  } catch { /* best-effort */ }
}

// ── Bot ──────────────────────────────────────────────────────────────────────
const bot = new Telegraf<BotContext>(BOT_TOKEN);
bot.use(session({ defaultSession: (): SessionData => ({}) }));

const MAIN = Markup.keyboard([
  ["🚗 Mashina qo'shish", '🔍 Mashina qidirish'],
  ['📋 Mashinalarim'],
]).resize();

const CANCEL = Markup.keyboard([['❌ Bekor qilish']]).resize();

const PHOTO_KB = Markup.keyboard([
  ['⏭ Rasmni o\'tkazib yuborish'],
  ['❌ Bekor qilish'],
]).resize();

// ── /start ────────────────────────────────────────────────────────────────────
bot.command('start', async (ctx) => {
  ctx.session = {};
  await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
  await ctx.reply(
    `Salom, ${ctx.from.first_name}! 👋\n\n<b>NomerTop</b> — davlat raqami orqali anonim xabar yuborish xizmati.\n\nQuyidagilardan birini tanlang:`,
    { parse_mode: 'HTML', ...MAIN },
  );
});

// ── REGISTER: step 1 — ask plate ─────────────────────────────────────────────
bot.hears("🚗 Mashina qo'shish", async (ctx) => {
  ctx.session = { step: 'reg_plate' };
  await ctx.reply(
    '🚗 <b>1/3</b> — Mashinangizning davlat raqamini yuboring:\n\n<code>01 A 777 AA</code>',
    { parse_mode: 'HTML', ...CANCEL },
  );
});

// ── SEARCH ───────────────────────────────────────────────────────────────────
bot.hears('🔍 Mashina qidirish', async (ctx) => {
  ctx.session = { step: 'search' };
  await ctx.reply(
    '🔍 Qidirayotgan mashinaning raqamini yuboring:\n\n<code>01 A 777 AA</code>',
    { parse_mode: 'HTML', ...CANCEL },
  );
});

// ── MY CARS ───────────────────────────────────────────────────────────────────
bot.hears('📋 Mashinalarim', async (ctx) => {
  ctx.session = {};
  const user = await db.user.findUnique({
    where: { telegramId: String(ctx.from.id) },
    include: { plates: { include: { photos: true } } },
  });
  if (!user?.plates.length) {
    return ctx.reply("Sizda hali mashina qo'shilmagan.\n\n\"🚗 Mashina qo'shish\" tugmasini bosing.", MAIN);
  }
  await ctx.reply(`Sizning mashinalaringiz (${user.plates.length} ta):`, MAIN);
  for (const plate of user.plates) {
    const info = [plate.brand, plate.model, plate.color].filter(Boolean).join(' · ');
    const caption =
      `🚗 <b>${plate.displayNumber}</b>  ${FLAG[plate.country] ?? '🌐'}\n` +
      (info ? `└ ${info}\n` : '') +
      `└ ✅ Faol`;
    const kb = Markup.inlineKeyboard([Markup.button.callback("❌ O'chirish", `del:${plate.id}`)]);
    if (plate.photos[0]) {
      await ctx.replyWithPhoto(plate.photos[0].url, { caption, parse_mode: 'HTML', ...kb });
    } else {
      await ctx.reply(caption, { parse_mode: 'HTML', ...kb });
    }
  }
});

// ── CANCEL ────────────────────────────────────────────────────────────────────
bot.hears('❌ Bekor qilish', async (ctx) => {
  ctx.session = {};
  await ctx.reply('Bekor qilindi.', MAIN);
});

// ── DELETE (inline) ───────────────────────────────────────────────────────────
bot.action(/^del:(.+)$/, async (ctx) => {
  const plate = await db.plate.findFirst({
    where: { id: ctx.match[1], owner: { telegramId: String(ctx.from?.id) } },
  });
  if (!plate) return ctx.answerCbQuery('Mashina topilmadi.', { show_alert: true });
  await db.plate.delete({ where: { id: plate.id } });
  await ctx.answerCbQuery("✅ O'chirildi!");
  await ctx.editMessageCaption?.(`🗑 <b>${plate.displayNumber}</b> — o'chirildi.`, { parse_mode: 'HTML' })
    ?? await ctx.editMessageText?.(`🗑 <b>${plate.displayNumber}</b> — o'chirildi.`, { parse_mode: 'HTML' });
});

// ── SEND MESSAGE (inline) ─────────────────────────────────────────────────────
bot.action(/^msg:(.+)$/, async (ctx) => {
  const plateNum = ctx.match[1];
  ctx.session = { step: 'msg', msgTo: plateNum };
  await ctx.answerCbQuery();
  await ctx.reply(
    '✏️ Egasiga yubormoqchi bo\'lgan xabaringizni yozing:',
    CANCEL,
  );
});

// ── PHOTO (registration step 3) ───────────────────────────────────────────────
bot.on(message('photo'), async (ctx) => {
  if (ctx.session.step !== 'reg_photo') return;
  const pending = ctx.session.pending!;
  ctx.session = {};

  const user = await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
  const parts = (pending.brandModel ?? '').split(' ');
  const brand = parts[0] || null;
  const model = parts.slice(1).join(' ') || null;

  // Get largest photo file_id
  const photos = ctx.message.photo;
  const fileId = photos[photos.length - 1].file_id;

  const plate = await db.plate.create({
    data: {
      number: pending.number,
      displayNumber: pending.display,
      country: pending.country,
      brand,
      model,
      ownerId: user.id,
      verifiedStatus: 'APPROVED',
      photos: { create: { url: fileId } },
    },
  });

  await ctx.reply(
    `✅ <b>${pending.display}</b> qo'shildi va faollashtirildi! ${FLAG[pending.country]}\n\n` +
    (pending.brandModel ? `🚘 ${pending.brandModel}\n` : '') +
    `Bu raqamga kelgan xabarlar Telegram orqali sizga yetkaziladi.`,
    { parse_mode: 'HTML', ...MAIN },
  );
});

// ── SKIP PHOTO ────────────────────────────────────────────────────────────────
bot.hears("⏭ Rasmni o'tkazib yuborish", async (ctx) => {
  if (ctx.session.step !== 'reg_photo') return ctx.reply('Bekor qilindi.', MAIN);
  const pending = ctx.session.pending!;
  ctx.session = {};

  const user = await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
  const parts = (pending.brandModel ?? '').split(' ');
  const brand = parts[0] || null;
  const model = parts.slice(1).join(' ') || null;

  await db.plate.create({
    data: {
      number: pending.number,
      displayNumber: pending.display,
      country: pending.country,
      brand,
      model,
      ownerId: user.id,
      verifiedStatus: 'APPROVED',
    },
  });

  await ctx.reply(
    `✅ <b>${pending.display}</b> qo'shildi va faollashtirildi! ${FLAG[pending.country]}\n\n` +
    (pending.brandModel ? `🚘 ${pending.brandModel}\n` : '') +
    `Bu raqamga kelgan xabarlar Telegram orqali sizga yetkaziladi.`,
    { parse_mode: 'HTML', ...MAIN },
  );
});

// ── TEXT (handles all step-based text input) ──────────────────────────────────
bot.on(message('text'), async (ctx) => {
  const step = ctx.session.step;
  const text = ctx.message.text.trim();

  // ── step: reg_plate ────────────────────────────────────────────────────────
  if (step === 'reg_plate') {
    const normalized = normalizePlate(text);
    if (normalized.length < 4) {
      return ctx.reply("❌ Noto'g'ri format:\n\n<code>01 A 777 AA</code>", { parse_mode: 'HTML' });
    }
    const user = await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
    const existing = await db.plate.findUnique({ where: { number: normalized } });
    if (existing) {
      ctx.session = {};
      if (existing.ownerId === user.id) {
        return ctx.reply(`✅ Bu mashina allaqachon sizniki: <b>${existing.displayNumber}</b>`, { parse_mode: 'HTML', ...MAIN });
      }
      return ctx.reply(
        `❌ <b>${normalized}</b> raqami boshqa foydalanuvchiga bog'langan.\n\nAgar bu sizning mashinangiz bo'lsa, qo'llab-quvvatlashga murojaat qiling.`,
        { parse_mode: 'HTML', ...MAIN },
      );
    }
    const country = detectCountry(normalized);
    ctx.session = {
      step: 'reg_name',
      pending: { number: normalized, display: formatPlate(normalized, country), country },
    };
    return ctx.reply(
      `🚗 <b>2/3</b> — Mashina nomi (marka va model):\n\n<code>Chevrolet Cobalt</code>`,
      { parse_mode: 'HTML', ...CANCEL },
    );
  }

  // ── step: reg_name ─────────────────────────────────────────────────────────
  if (step === 'reg_name') {
    ctx.session = {
      ...ctx.session,
      step: 'reg_photo',
      pending: { ...ctx.session.pending!, brandModel: text },
    };
    return ctx.reply(
      '📸 <b>3/3</b> — Mashina rasmini yuboring yoki o\'tkazib yuboring:',
      { parse_mode: 'HTML', ...PHOTO_KB },
    );
  }

  // ── step: search ───────────────────────────────────────────────────────────
  if (step === 'search') {
    ctx.session = {};
    const normalized = normalizePlate(text);
    if (normalized.length < 4) {
      return ctx.reply("❌ Noto'g'ri format:\n\n<code>01 A 777 AA</code>", { parse_mode: 'HTML' });
    }
    const plate = await db.plate.findUnique({
      where: { number: normalized },
      include: { photos: true, owner: true },
    });
    if (!plate) {
      return ctx.reply(
        `🔍 <b>${normalized}</b>\n\n❌ Bu raqam ro'yxatdan o'tmagan.`,
        { parse_mode: 'HTML', ...MAIN },
      );
    }
    const info = [plate.brand, plate.model, plate.color].filter(Boolean).join(' · ');
    const caption =
      `🔍 <b>${plate.displayNumber}</b>  ${FLAG[plate.country] ?? '🌐'}\n\n` +
      `✅ Egasi bor\n` +
      (info ? `🚘 ${info}\n` : '');
    const kb = Markup.inlineKeyboard([
      Markup.button.callback('📩 Egasiga xabar yuborish', `msg:${plate.number}`),
    ]);
    if (plate.photos[0]) {
      await ctx.replyWithPhoto(plate.photos[0].url, { caption, parse_mode: 'HTML', ...kb });
    } else {
      await ctx.reply(caption, { parse_mode: 'HTML', ...kb });
    }
    return;
  }

  // ── step: msg ──────────────────────────────────────────────────────────────
  if (step === 'msg') {
    const plateNum = ctx.session.msgTo!;
    ctx.session = {};

    const sender = await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
    const plate = await db.plate.findUnique({
      where: { number: plateNum },
      include: { owner: true },
    });
    if (!plate) return ctx.reply('Mashina topilmadi.', MAIN);

    // Save message to DB
    await db.message.create({
      data: {
        content: text,
        senderName: [ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(' ') || 'Anonim',
        plateId: plate.id,
        isQuickMsg: false,
      },
    });

    // Forward to owner via Telegram
    if (plate.owner.telegramId) {
      await notifyOwner(
        plate.owner.telegramId,
        plate.displayNumber,
        sender.name ?? 'Anonim',
        text,
      );
    }

    await ctx.reply(
      `✅ Xabaringiz <b>${plate.displayNumber}</b> egasiga yuborildi!`,
      { parse_mode: 'HTML', ...MAIN },
    );
    return;
  }
});

// ── Launch ────────────────────────────────────────────────────────────────────
bot.launch({ dropPendingUpdates: true }).then(() => {
  process.stdout.write(`✅ NomerTop bot ishga tushdi! @${bot.botInfo?.username ?? ''}\n`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
