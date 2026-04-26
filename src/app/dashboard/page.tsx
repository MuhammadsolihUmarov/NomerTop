import { auth } from "@/auth";
import DashboardView from "./DashboardView";
import { redirect } from "next/navigation";

const API_SERVER_URL = process.env.INTERNAL_API_URL || 'http://localhost:8000';

async function fetchFromBackend(endpoint: string, email: string) {
  const response = await fetch(`${API_SERVER_URL}${endpoint}`, {
    headers: {
      'X-User-Email': email
    },
    cache: 'no-store'
  });
  if (!response.ok) return null;
  return response.json();
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const identifier = session.user.email || session.user.phone || session.user.id;

  // Try to fetch from backend, fall back to session data if offline
  let user: any = null;
  let plates: any[] = [];
  let notifications: any[] = [];

  try {
    user = await fetchFromBackend('/users/me', identifier);
    if (user) {
      plates = await fetchFromBackend('/users/me/plates', identifier) || [];
      notifications = await fetchFromBackend('/users/me/notifications', identifier) || [];
    }
  } catch {
    // backend offline — use session data
  }

  // Fall back to session data when backend is unavailable
  if (!user) {
    user = {
      id: session.user.id,
      name: session.user.name || identifier,
      email: session.user.email || null,
      phone: session.user.phone || null,
    };
  }

  return (
    <DashboardView
      user={user}
      plates={plates}
      notifications={notifications}
    />
  );
}

