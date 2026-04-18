import { auth } from "@/auth";
import db from "@/lib/db";
import DashboardView from "./DashboardView";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const plates = await db.plate.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <DashboardView 
      user={user} 
      plates={plates} 
      notifications={notifications} 
    />
  );
}
