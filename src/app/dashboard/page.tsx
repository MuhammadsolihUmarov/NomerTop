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

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;

  const user = await fetchFromBackend('/users/me', email);
  if (!user) {
    redirect("/login");
  }

  const plates = await fetchFromBackend('/users/me/plates', email) || [];
  const notifications = await fetchFromBackend('/users/me/notifications', email) || [];

  return (
    <DashboardView 
      user={user} 
      plates={plates} 
      notifications={notifications} 
    />
  );
}

