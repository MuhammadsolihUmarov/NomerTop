'use server';

import { normalizePlate, formatPlateDisplay } from "./utils";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import db from "./db";

const API_SERVER_URL = process.env.INTERNAL_API_URL || 'http://localhost:8000';

function isNetworkError(e: any): boolean {
  const msg = (e?.message || '').toLowerCase();
  return msg.includes('fetch failed') || msg.includes('econnrefused') || msg.includes('connect');
}

async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_SERVER_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

/**
 * User Registration
 */
export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  try {
    await serverFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email: email || undefined, phone: phone || undefined, password }),
    });
    return { success: true };
  } catch (e: any) {
    if (!isNetworkError(e)) return { error: e.message || 'Xato yuz berdi.' };

    // Backend offline — register locally
    try {
      const orConditions = [
        ...(phone ? [{ phone }] : []),
        ...(email ? [{ email }] : []),
      ];
      const { createHash } = await import('crypto');
      const hashed = createHash('sha256').update(password).digest('hex');

      if (orConditions.length) {
        const existing = await db.user.findFirst({ where: { OR: orConditions } });
        if (existing) {
          if (existing.password) return { error: 'PHONE_EXISTS' };
          // User was created by OTP with no password — let them set one now
          await db.user.update({
            where: { id: existing.id },
            data: { name: name || existing.name, password: hashed },
          });
          return { success: true };
        }
      }

      await db.user.create({
        data: { name: name || phone, email: email || null, phone: phone || null, password: hashed },
      });
      return { success: true };
    } catch {
      return { error: 'Ro\'yxatdan o\'tishda xato yuz berdi.' };
    }
  }
}

/**
 * Send OTP Code
 */
export async function sendOtp(phone: string) {
  try {
    const response = await serverFetch('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
    return { success: true, debug_code: response.debug_code };
  } catch (e: any) {
    if (!isNetworkError(e)) {
      return { error: e.message || 'Xato yuz berdi.' };
    }

    // Backend unreachable — local OTP via Prisma
    try {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      await db.verificationToken.deleteMany({ where: { identifier: phone } });
      await db.verificationToken.create({ data: { identifier: phone, token: code, expires } });

      await db.user.upsert({
        where: { phone },
        update: {},
        create: { phone, name: phone },
      });

      console.log(`[OTP] ${phone} → ${code}`);
      return { success: true, debug_code: code };
    } catch (dbErr: any) {
      return { error: 'Server bilan aloqa yo\'q. Keyinroq urinib ko\'ring.' };
    }
  }
}

/**
 * Plate Search
 */
export async function searchPlate(formData: FormData) {
  const query = formData.get('query') as string;
  const country = formData.get('country') as string || 'UZ';
  if (!query) return;

  const normalized = normalizePlate(query);
  
  try {
    const plate = await serverFetch(`/plates/${normalized}`);
    if (plate) {
      redirect(`/plate/${normalized}`);
    }
  } catch (e) {
    // If 404, redirect to not-found
    redirect(`/plate/not-found?q=${normalized}&c=${country}`);
  }
}

/**
 * Forward message to Telegram if plate owner has a Telegram account
 */
async function notifyViaTelegram(telegramId: string, plateDisplay: string, content: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token === 'your_token_here') return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text: `📩 <b>${plateDisplay}</b> raqamingizga yangi xabar:\n\n"${content}"`,
        parse_mode: 'HTML',
      }),
    });
  } catch {
    // Telegram notification is best-effort, never block the main flow
  }
}

/**
 * Send Message to Plate Owner
 */
export async function sendMessage(formData: FormData) {
  const content = formData.get('message') as string;
  const plateIdOrNumber = formData.get('plateNumber') as string;
  const isQuickMsg = formData.get('isQuickMsg') === 'true';

  if (!content || !plateIdOrNumber) return { error: "Message content is required." };

  const normalized = normalizePlate(plateIdOrNumber);

  // Try to deliver via Telegram if owner is a Telegram user
  try {
    const plate = await db.plate.findUnique({
      where: { number: normalized },
      include: { owner: true },
    });
    if (plate?.owner?.telegramId) {
      await notifyViaTelegram(plate.owner.telegramId, plate.displayNumber, content);
    }
  } catch { /* ignore */ }

  try {
    await serverFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({
        content,
        plateNumber: normalized,
        isQuickMsg,
      }),
    });

    revalidatePath(`/plate/${normalized}`);
    return { success: true };
  } catch (e: any) {
    return { error: e.message || "Failed to send message." };
  }
}

/**
 * Register New Plate
 */
export async function registerPlate(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const number = formData.get('number') as string;
  const country = formData.get('country') as string || 'UZ';
  const brand = formData.get('brand') as string;
  const model = formData.get('model') as string;
  const color = formData.get('color') as string;

  const normalized = normalizePlate(number);

  try {
    // Note: We need to pass the user context to FastAPI. 
    // Since we are migrating, we'll assume the FastAPI 'plates' endpoint 
    // can take an 'ownerId' if we use a service-to-server call, 
    // OR we use the registered user's token.
    // For simplicity in this step, I'll update main.py to accept ownerId in a header or body if it's from internal.
    // Actually, I'll just use a mock login or pass the email.
    
    // I'll update main.py to allow passing owner info for now or use a dedicated internal endpoint.
    // But better: Get a token for the current user or use a Master Token.
    
    await serverFetch('/plates', {
      method: 'POST',
      body: JSON.stringify({
        number: normalized,
        country,
        brand,
        model,
        color,
      }),
      headers: {
        // We'll need a way to authorize this. 
        // For now, I'll assume we pass the user's ID in a header and the backend trusts it (INTERNAL).
        'X-User-ID': session.user.id || '',
      }
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (e: any) {
    return { error: e.message || "Failed to register plate." };
  }
}


