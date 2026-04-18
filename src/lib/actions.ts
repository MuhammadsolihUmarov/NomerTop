'use server';

import db from "@/lib/db";
import { normalizePlate, formatPlateDisplay } from "./utils";
import { redirect } from "next/navigation";
import { auth, signIn as authSignIn } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * User Registration
 */
export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: "Email and password are required." };

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) return { error: "User already exists with this email." };

    await db.user.create({
      data: { name, email, password }
    });

    return { success: true };
  } catch (e) {
    return { error: "Failed to create account. Please try again." };
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
  
  // Find plate in DB to see if it exists
  const plate = await db.plate.findUnique({
    where: { number: normalized }
  });

  if (plate) {
    redirect(`/plate/${normalized}`);
  } else {
    // If plate doesn't exist, redirect to a page that suggests registration or escrow message
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
    const plate = await db.plate.findUnique({
      where: { number: normalized },
      include: { owner: true }
    });

    if (!plate) return { error: "Vehicle not found." };

    // Create message
    await db.message.create({
      data: {
        content,
        isQuickMsg,
        plateId: plate.id,
      }
    });

    // Create notification for owner
    await db.notification.create({
      data: {
        userId: plate.ownerId,
        title: "New Message for your vehicle",
        body: content.length > 50 ? content.slice(0, 47) + '...' : content,
        type: "MESSAGE"
      }
    });

    revalidatePath(`/plate/${normalized}`);
    return { success: true };
  } catch (e) {
    return { error: "Failed to send message." };
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
  const display = formatPlateDisplay(normalized, country);

  try {
    const existing = await db.plate.findUnique({ where: { number: normalized } });
    if (existing) return { error: "This plate is already registered." };

    const plate = await db.plate.create({
      data: {
        number: normalized,
        displayNumber: display,
        country,
        brand,
        model,
        color,
        ownerId: session.user.id,
      }
    });

    revalidatePath('/dashboard');
    return { success: true, plateId: plate.id };
  } catch (e) {
    return { error: "Failed to register plate." };
  }
}

