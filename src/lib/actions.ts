'use server';

import { normalizePlate, formatPlateDisplay } from "./utils";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const API_SERVER_URL = process.env.INTERNAL_API_URL || 'http://localhost:8000';

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
    return { error: e.message || "Failed to create account." };
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
    return { error: e.message || "Failed to send OTP." };
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
 * Send Message to Plate Owner
 */
export async function sendMessage(formData: FormData) {
  const content = formData.get('message') as string;
  const plateIdOrNumber = formData.get('plateNumber') as string;
  const isQuickMsg = formData.get('isQuickMsg') === 'true';

  if (!content || !plateIdOrNumber) return { error: "Message content is required." };

  const normalized = normalizePlate(plateIdOrNumber);

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


