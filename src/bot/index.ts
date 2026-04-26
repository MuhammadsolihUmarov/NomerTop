import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Context, Telegraf, session, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { PrismaClient } from '@prisma/client';

// ── .env ──────────────────────────────────────────────────────────────────────
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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN || BOT_TOKEN === 'your_token_here') {
  process.stderr.write('❌ TELEGRAM_BOT_TOKEN not set\n');
  process.exit(1);
}

// ── i18n ──────────────────────────────────────────────────────────────────────
type Lang = 'uz' | 'ru' | 'en';

const T = {
  uz: {
    welcome:      (n: string) => `Salom, ${n}! 👋\n\n<b>NomerTop</b> — raqam bo'yicha anonim xabar.\n\nTanlang:`,
    reg1:         '🚗 <b>1/3</b> — Davlat raqamini yuboring:\n\n<code>01 A 777 AA</code>',
    reg2:         '✏️ <b>2/3</b> — Mashina nomi:\n\n<code>Chevrolet Cobalt</code>',
    reg3:         '📸 <b>3/3</b> — Rasm yuboring yoki o\'tkazib yuboring:',
    regDone:      (d: string, f: string, b?: string) => `✅ <b>${d}</b> qo'shildi! ${f}${b ? `\n🚘 ${b}` : ''}\n\nXabarlar sizga yetkaziladi.`,
    regMine:      (d: string) => `✅ Bu allaqachon sizniki: <b>${d}</b>`,
    regTaken:     (n: string) => `❌ <b>${n}</b> boshqasiga bog'langan.\n\nSizning mashinangizmi? Qo'llab-quvvatlashga yozing.`,
    searchAsk:    '🔍 Raqamni yuboring:\n\n<code>01 A 777 AA</code>',
    notFound:     (n: string) => `❌ <b>${n}</b> ro'yxatdan o'tmagan.`,
    found:        (d: string, f: string, i: string) => `🔍 <b>${d}</b>  ${f}\n\n✅ Egasi bor${i ? `\n🚘 ${i}` : ''}`,
    pickMsg:      '📩 Yubormoqchi bo\'lgan xabarni tanlang:',
    sent:         (d: string) => `✅ Xabar <b>${d}</b> egasiga yuborildi!`,
    noCars:       'Mashina yo\'q.\n«🚗» tugmasini bosing.',
    cancelled:    'Bekor qilindi.',
    badFormat:    '❌ Format noto\'g\'ri:\n\n<code>01 A 777 AA</code>',
    deleted:      (d: string) => `🗑 <b>${d}</b> — o'chirildi.`,
    notYours:     'Mashina topilmadi.',
    langChanged:  '✅ Til o\'zgartirildi.',
    pickLang:     'Tilni tanlang:',
    carsTitle:    (n: number) => `Mashinalaringiz (${n} ta):`,
    ownerNotif:   (d: string, s: string, m: string) => `📩 <b>${d}</b> raqamingizga xabar:\n\n"${m}"\n\n— ${s}`,
    quick: [
      '💡 Chiroqlaringiz yoniq!',
      '🚧 Yo\'lni to\'sib turibsiz',
      '🪟 Oynachangiz ochiq',
      '🙏 Surib qo\'ya olasizmi?',
      '🔑 Kalitingizni unutibsiz?',
    ],
    btnAdd:    '🚗 Mashina qo\'shish',
    btnFind:   '🔍 Qidirish',
    btnMine:   '📋 Mashinalarim',
    btnLang:   '🌐 Til',
    btnCancel: '❌ Bekor',
    btnSkip:   '⏭ Rasmni o\'tkazib yuborish',
    btnSend:   '📩 Xabar yuborish',
    btnDel:    '❌ O\'chirish',
  },
  ru: {
    welcome:      (n: string) => `Привет, ${n}! 👋\n\n<b>NomerTop</b> — анонимные сообщения по номеру.\n\nВыберите:`,
    reg1:         '🚗 <b>1/3</b> — Отправьте номер:\n\n<code>01 A 777 AA</code>',
    reg2:         '✏️ <b>2/3</b> — Название машины:\n\n<code>Chevrolet Cobalt</code>',
    reg3:         '📸 <b>3/3</b> — Отправьте фото или пропустите:',
    regDone:      (d: string, f: string, b?: string) => `✅ <b>${d}</b> добавлен! ${f}${b ? `\n🚘 ${b}` : ''}\n\nСообщения будут приходить сюда.`,
    regMine:      (d: string) => `✅ Уже ваш: <b>${d}</b>`,
    regTaken:     (n: string) => `❌ <b>${n}</b> принадлежит другому.\n\nВаша машина? Обратитесь в поддержку.`,
    searchAsk:    '🔍 Отправьте номер:\n\n<code>01 A 777 AA</code>',
    notFound:     (n: string) => `❌ <b>${n}</b> не зарегистрирован.`,
    found:        (d: string, f: string, i: string) => `🔍 <b>${d}</b>  ${f}\n\n✅ Есть владелец${i ? `\n🚘 ${i}` : ''}`,
    pickMsg:      '📩 Выберите сообщение:',
    sent:         (d: string) => `✅ Сообщение отправлено владельцу <b>${d}</b>!`,
    noCars:       'Машин нет.\nНажмите «🚗».',
    cancelled:    'Отменено.',
    badFormat:    '❌ Неверный формат:\n\n<code>01 A 777 AA</code>',
    deleted:      (d: string) => `🗑 <b>${d}</b> — удалён.`,
    notYours:     'Машина не найдена.',
    langChanged:  '✅ Язык изменён.',
    pickLang:     'Выберите язык:',
    carsTitle:    (n: number) => `Ваши машины (${n}):`,
    ownerNotif:   (d: string, s: string, m: string) => `📩 Сообщение на <b>${d}</b>:\n\n"${m}"\n\n— ${s}`,
    quick: [
      '💡 Фары горят!',
      '🚧 Машина перекрывает проезд',
      '🪟 Окно открыто',
      '🙏 Можете отъехать?',
      '🔑 Забыли ключи?',
    ],
    btnAdd:    '🚗 Добавить машину',
    btnFind:   '🔍 Найти',
    btnMine:   '📋 Мои машины',
    btnLang:   '🌐 Язык',
    btnCancel: '❌ Отмена',
    btnSkip:   '⏭ Без фото',
    btnSend:   '📩 Написать',
    btnDel:    '❌ Удалить',
  },
  en: {
    welcome:      (n: string) => `Hi, ${n}! 👋\n\n<b>NomerTop</b> — anonymous messages by plate.\n\nChoose:`,
    reg1:         '🚗 <b>1/3</b> — Send plate number:\n\n<code>01 A 777 AA</code>',
    reg2:         '✏️ <b>2/3</b> — Car name (make + model):\n\n<code>Chevrolet Cobalt</code>',
    reg3:         '📸 <b>3/3</b> — Send a photo or skip:',
    regDone:      (d: string, f: string, b?: string) => `✅ <b>${d}</b> added! ${f}${b ? `\n🚘 ${b}` : ''}\n\nMessages will come here.`,
    regMine:      (d: string) => `✅ Already yours: <b>${d}</b>`,
    regTaken:     (n: string) => `❌ <b>${n}</b> belongs to another account.\n\nYour car? Contact support.`,
    searchAsk:    '🔍 Send plate number:\n\n<code>01 A 777 AA</code>',
    notFound:     (n: string) => `❌ <b>${n}</b> is not registered.`,
    found:        (d: string, f: string, i: string) => `🔍 <b>${d}</b>  ${f}\n\n✅ Owner registered${i ? `\n🚘 ${i}` : ''}`,
    pickMsg:      '📩 Choose a message:',
    sent:         (d: string) => `✅ Message sent to owner of <b>${d}</b>!`,
    noCars:       'No cars.\nTap «🚗».',
    cancelled:    'Cancelled.',
    badFormat:    '❌ Wrong format:\n\n<code>01 A 777 AA</code>',
    deleted:      (d: string) => `🗑 <b>${d}</b> — removed.`,
    notYours:     'Car not found.',
    langChanged:  '✅ Language set.',
    pickLang:     'Choose language:',
    carsTitle:    (n: number) => `Your cars (${n}):`,
    ownerNotif:   (d: string, s: string, m: string) => `📩 Message to <b>${d}</b>:\n\n"${m}"\n\n— ${s}`,
    quick: [
      '💡 Lights are on!',
      '🚧 Car is blocking the way',
      '🪟 Window is open',
      '🙏 Can you move?',
      '🔑 Forgot your keys?',
    ],
    btnAdd:    '🚗 Add car',
    btnFind:   '🔍 Search',
    btnMine:   '📋 My cars',
    btnLang:   '🌐 Language',
    btnCancel: '❌ Cancel',
    btnSkip:   '⏭ Skip photo',
    btnSend:   '📩 Message',
    btnDel:    '❌ Remove',
  },
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Pending { number: string; display: string; country: string; brandModel?: string }
interface SessionData {
  lang?: Lang;
  step?: 'reg_plate' | 'reg_name' | 'reg_photo' | 'search';
  pending?: Pending;
}
interface BotContext extends Context { session: SessionData }

// ── Init ──────────────────────────────────────────────────────────────────────
const db = new PrismaClient();
const bot = new Telegraf<BotContext>(BOT_TOKEN);
bot.use(session({ defaultSession: (): SessionData => ({}) }));

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizePlate(p: string) { return p.replace(/[\s-]/g, '').toUpperCase(); }
function formatPlate(n: string, c = 'UZ') {
  if (c === 'UZ' && n.length === 8) return `${n.slice(0,2)} | ${n.slice(2,3)} ${n.slice(3,6)} ${n.slice(6)}`;
  if (c === 'RU' && n.length >= 8) return `${n[0]} ${n.slice(1,4)} ${n.slice(4,6)} | ${n.slice(6)}`;
  if (c === 'KZ' && n.length >= 7) return `${n.slice(0,3)} | ${n.slice(3,6)} | ${n.slice(6)}`;
  return n.replace(/(.{2,3})(?=.)/g, '$1 ');
}
function detectCountry(n: string) {
  if (/^\d{2}[A-Z]/.test(n)) return 'UZ';
  if (/^[ABEKMHOPCTX]\d{3}[ABEKMHOPCTX]{2}/.test(n)) return 'RU';
  if (/^\d{3}[A-Z]{2,3}\d{2}/.test(n)) return 'KZ';
  return 'OTH';
}
const FLAG: Record<string, string> = { UZ: '🇺🇿', RU: '🇷🇺', KZ: '🇰🇿', OTH: '🌐' };

function getLang(ctx: BotContext): Lang {
  if (ctx.session.lang) return ctx.session.lang;
  const code = ctx.from?.language_code ?? '';
  if (code.startsWith('ru')) return 'ru';
  if (code.startsWith('en')) return 'en';
  return 'uz'; // default
}

// Validation
function hasCyrillic(s: string) { return /[А-ЯЁа-яёЎўҚқҒғҲҳ]/u.test(s); }
function isValidPlate(n: string) {
  // UZ: 01A777AA | RU: A123AA77 | KZ: 123ABC01 | generic 4-10 Latin+digits
  return /^[A-Z0-9]{4,10}$/.test(n);
}
const cyrillicError: Record<Lang, string> = {
  uz: '❌ Kirill harflari qabul qilinmaydi.\nLotin harflarida kiriting: <code>01 A 777 AA</code>',
  ru: '❌ Кириллица не принимается.\nВведите латиницей: <code>01 A 777 AA</code>',
  en: '❌ Cyrillic not accepted.\nUse Latin: <code>01 A 777 AA</code>',
};

function t(ctx: BotContext) { return T[getLang(ctx)]; }

async function upsertUser(tgId: string, firstName: string, lastName?: string | null) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return db.user.upsert({ where: { telegramId: tgId }, update: { name }, create: { telegramId: tgId, name } });
}

function mainMenu(ctx: BotContext) {
  const l = t(ctx);
  return Markup.keyboard([[l.btnAdd, l.btnFind], [l.btnMine, l.btnLang]]).resize();
}
function cancelMenu(ctx: BotContext) {
  return Markup.keyboard([[t(ctx).btnCancel]]).resize();
}
function photoMenu(ctx: BotContext) {
  const l = t(ctx);
  return Markup.keyboard([[l.btnSkip], [l.btnCancel]]).resize();
}

// ── /start ────────────────────────────────────────────────────────────────────
bot.command('start', async (ctx) => {
  ctx.session = {};
  await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
  await ctx.reply(t(ctx).welcome(ctx.from.first_name), { parse_mode: 'HTML', ...mainMenu(ctx) });
});

// ── LANGUAGE button ───────────────────────────────────────────────────────────
for (const lang of ['uz', 'ru', 'en'] as Lang[]) {
  bot.hears(T[lang].btnLang, async (ctx) => {
    ctx.session.step = undefined;
    await ctx.reply(
      t(ctx).pickLang,
      Markup.inlineKeyboard([
        [Markup.button.callback('🇺🇿 O\'zbekcha', 'lang:uz')],
        [Markup.button.callback('🇷🇺 Русский',   'lang:ru')],
        [Markup.button.callback('🇬🇧 English',   'lang:en')],
      ]),
    );
  });
}
bot.action(/^lang:(\w+)$/, async (ctx) => {
  ctx.session.lang = ctx.match[1] as Lang;
  await ctx.answerCbQuery(t(ctx).langChanged);
  await ctx.editMessageText(t(ctx).langChanged);
  await ctx.reply(t(ctx).welcome(ctx.from?.first_name ?? ''), { parse_mode: 'HTML', ...mainMenu(ctx) });
});

// ── REGISTER: step 1 ─────────────────────────────────────────────────────────
for (const lang of ['uz', 'ru', 'en'] as Lang[]) {
  bot.hears(T[lang].btnAdd, async (ctx) => {
    ctx.session = { ...ctx.session, step: 'reg_plate', pending: undefined };
    await ctx.reply(t(ctx).reg1, { parse_mode: 'HTML', ...cancelMenu(ctx) });
  });
}

// ── SEARCH ────────────────────────────────────────────────────────────────────
for (const lang of ['uz', 'ru', 'en'] as Lang[]) {
  bot.hears(T[lang].btnFind, async (ctx) => {
    ctx.session = { ...ctx.session, step: 'search', pending: undefined };
    await ctx.reply(t(ctx).searchAsk, { parse_mode: 'HTML', ...cancelMenu(ctx) });
  });
}

// ── MY CARS ───────────────────────────────────────────────────────────────────
for (const lang of ['uz', 'ru', 'en'] as Lang[]) {
  bot.hears(T[lang].btnMine, async (ctx) => {
    ctx.session.step = undefined;
    const user = await db.user.findUnique({
      where: { telegramId: String(ctx.from.id) },
      include: { plates: { include: { photos: true } } },
    });
    if (!user?.plates.length) return ctx.reply(t(ctx).noCars, mainMenu(ctx));
    await ctx.reply(t(ctx).carsTitle(user.plates.length), mainMenu(ctx));
    for (const plate of user.plates) {
      const info = [plate.brand, plate.model, plate.color].filter(Boolean).join(' · ');
      const caption = `🚗 <b>${plate.displayNumber}</b>  ${FLAG[plate.country] ?? '🌐'}\n` + (info ? `└ ${info}` : '');
      const kb = Markup.inlineKeyboard([[Markup.button.callback(t(ctx).btnDel, `del:${plate.id}`)]]);
      if (plate.photos[0]) {
        await ctx.replyWithPhoto(plate.photos[0].url, { caption, parse_mode: 'HTML', ...kb });
      } else {
        await ctx.reply(caption, { parse_mode: 'HTML', ...kb });
      }
    }
  });
}

// ── CANCEL ────────────────────────────────────────────────────────────────────
for (const lang of ['uz', 'ru', 'en'] as Lang[]) {
  bot.hears(T[lang].btnCancel, async (ctx) => {
    ctx.session = { lang: ctx.session.lang };
    await ctx.reply(t(ctx).cancelled, mainMenu(ctx));
  });
}

// ── SKIP PHOTO ────────────────────────────────────────────────────────────────
for (const lang of ['uz', 'ru', 'en'] as Lang[]) {
  bot.hears(T[lang].btnSkip, async (ctx) => {
    if (ctx.session.step !== 'reg_photo') return;
    await savePlate(ctx, undefined);
  });
}

// ── DELETE plate ──────────────────────────────────────────────────────────────
bot.action(/^del:(.+)$/, async (ctx) => {
  const plate = await db.plate.findFirst({ where: { id: ctx.match[1], owner: { telegramId: String(ctx.from?.id) } } });
  if (!plate) return ctx.answerCbQuery(t(ctx).notYours, { show_alert: true });
  await db.plate.delete({ where: { id: plate.id } });
  await ctx.answerCbQuery('✅');
  try { await ctx.editMessageCaption(t(ctx).deleted(plate.displayNumber), { parse_mode: 'HTML' }); }
  catch { try { await ctx.editMessageText(t(ctx).deleted(plate.displayNumber), { parse_mode: 'HTML' }); } catch { /* ignore */ } }
});

// ── SEND predefined message ───────────────────────────────────────────────────
// callback_data: qm:PLATENORM:LANG:INDEX  (e.g. qm:01A777AA:uz:0)
bot.action(/^qm:([^:]+):([^:]+):(\d+)$/, async (ctx) => {
  const [, plateNum, lang, idxStr] = ctx.match;
  const msgLang = (lang as Lang) in T ? (lang as Lang) : getLang(ctx);
  const msgText = T[msgLang].quick[parseInt(idxStr)];
  if (!msgText) return ctx.answerCbQuery('?');

  const plate = await db.plate.findUnique({ where: { number: plateNum }, include: { owner: true } });
  if (!plate) return ctx.answerCbQuery('❌');

  const senderUser = await upsertUser(String(ctx.from?.id ?? 0), ctx.from?.first_name ?? 'User', ctx.from?.last_name);
  await db.message.create({
    data: {
      content: msgText,
      senderName: senderUser.name ?? 'Anonim',
      plateId: plate.id,
      isQuickMsg: true,
    },
  });

  if (plate.owner.telegramId) {
    await bot.telegram.sendMessage(
      plate.owner.telegramId,
      T[msgLang].ownerNotif(plate.displayNumber, senderUser.name ?? 'Anonim', msgText),
      { parse_mode: 'HTML' },
    ).catch(() => {/* best-effort */});
  }

  await ctx.answerCbQuery('✅');
  await ctx.editMessageReplyMarkup(undefined);
  await ctx.reply(t(ctx).sent(plate.displayNumber), { parse_mode: 'HTML', ...mainMenu(ctx) });
});

// ── MSG button on search result ───────────────────────────────────────────────
bot.action(/^msg:([^:]+):(\w+)$/, async (ctx) => {
  const plateNum = ctx.match[1];
  const lang = getLang(ctx);
  await ctx.answerCbQuery();
  const msgs = T[lang].quick;
  const buttons = msgs.map((m, i) => [Markup.button.callback(m, `qm:${plateNum}:${lang}:${i}`)]);
  await ctx.reply(t(ctx).pickMsg, Markup.inlineKeyboard(buttons));
});

// ── PHOTO upload (reg step 3) ─────────────────────────────────────────────────
bot.on(message('photo'), async (ctx) => {
  if (ctx.session.step !== 'reg_photo') return;
  const photos = ctx.message.photo;
  const fileId = photos[photos.length - 1].file_id;
  await savePlate(ctx, fileId);
});

// ── TEXT ──────────────────────────────────────────────────────────────────────
bot.on(message('text'), async (ctx) => {
  const step = ctx.session.step;
  if (!step) return;
  const raw = ctx.message.text.trim();

  // ── reg plate — stay in loop on bad input ──────────────────────────────────
  if (step === 'reg_plate') {
    if (hasCyrillic(raw)) return ctx.reply(cyrillicError[getLang(ctx)], { parse_mode: 'HTML' });
    const n = normalizePlate(raw);
    if (!isValidPlate(n)) return ctx.reply(t(ctx).badFormat, { parse_mode: 'HTML' });
    const user = await upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.last_name);
    const existing = await db.plate.findUnique({ where: { number: n } });
    if (existing) {
      ctx.session.step = undefined;
      if (existing.ownerId === user.id) return ctx.reply(t(ctx).regMine(existing.displayNumber), { parse_mode: 'HTML', ...mainMenu(ctx) });
      return ctx.reply(t(ctx).regTaken(n), { parse_mode: 'HTML', ...mainMenu(ctx) });
    }
    const country = detectCountry(n);
    ctx.session = { ...ctx.session, step: 'reg_name', pending: { number: n, display: formatPlate(n, country), country } };
    return ctx.reply(t(ctx).reg2, { parse_mode: 'HTML', ...cancelMenu(ctx) });
  }

  // ── reg name ───────────────────────────────────────────────────────────────
  if (step === 'reg_name') {
    ctx.session = { ...ctx.session, step: 'reg_photo', pending: { ...ctx.session.pending!, brandModel: raw } };
    return ctx.reply(t(ctx).reg3, { parse_mode: 'HTML', ...photoMenu(ctx) });
  }

  // ── search — stay in loop on bad input ─────────────────────────────────────
  if (step === 'search') {
    if (hasCyrillic(raw)) return ctx.reply(cyrillicError[getLang(ctx)], { parse_mode: 'HTML' });
    const n = normalizePlate(raw);
    if (!isValidPlate(n)) return ctx.reply(t(ctx).badFormat, { parse_mode: 'HTML' });
    // Only exit loop after valid input
    ctx.session.step = undefined;
    const plate = await db.plate.findUnique({ where: { number: n }, include: { photos: true, owner: true } });
    if (!plate) return ctx.reply(t(ctx).notFound(n), { parse_mode: 'HTML', ...mainMenu(ctx) });
    const info = [plate.brand, plate.model, plate.color].filter(Boolean).join(' · ');
    const caption = t(ctx).found(plate.displayNumber, FLAG[plate.country] ?? '🌐', info);
    const lang = getLang(ctx);
    const kb = Markup.inlineKeyboard([[Markup.button.callback(t(ctx).btnSend, `msg:${n}:${lang}`)]]);
    if (plate.photos[0]) {
      await ctx.replyWithPhoto(plate.photos[0].url, { caption, parse_mode: 'HTML', ...kb });
    } else {
      await ctx.reply(caption, { parse_mode: 'HTML', ...kb });
    }
  }
});

// ── Save plate helper ─────────────────────────────────────────────────────────
async function savePlate(ctx: BotContext, photoFileId: string | undefined) {
  const pending = ctx.session.pending!;
  const lang = getLang(ctx);
  ctx.session = { lang };
  const user = await upsertUser(String(ctx.from!.id), ctx.from!.first_name, (ctx.from as any)?.last_name);
  const parts = (pending.brandModel ?? '').split(' ');
  await db.plate.create({
    data: {
      number: pending.number,
      displayNumber: pending.display,
      country: pending.country,
      brand: parts[0] || null,
      model: parts.slice(1).join(' ') || null,
      ownerId: user.id,
      verifiedStatus: 'APPROVED',
      ...(photoFileId ? { photos: { create: { url: photoFileId } } } : {}),
    },
  });
  const l = T[lang];
  // Use explicit reply_markup to guarantee the main menu keyboard appears
  await ctx.reply(
    l.regDone(pending.display, FLAG[pending.country] ?? '🌐', pending.brandModel),
    {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [[l.btnAdd, l.btnFind], [l.btnMine, l.btnLang]],
        resize_keyboard: true,
      },
    },
  );
}

// ── Launch ────────────────────────────────────────────────────────────────────
bot.launch({ dropPendingUpdates: true }).then(() => {
  process.stdout.write(`✅ NomerTop bot started! @${bot.botInfo?.username ?? ''}\n`);
});
process.once('SIGINT',  () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
