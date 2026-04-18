import db from "@/lib/db";
import { normalizePlate } from "@/lib/utils";
import PlateDetailView from "./PlateDetailView";
import { notFound } from "next/navigation";

interface Params {
  id: string;
}

export default async function PlatePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const normalized = normalizePlate(id);

  const plate = await db.plate.findUnique({
    where: { number: normalized },
    include: {
      owner: {
        select: {
          name: true,
        }
      }
    }
  });

  return (
    <PlateDetailView 
      plateNumber={normalized} 
      isRegistered={!!plate} 
      plateData={plate} 
    />
  );
}
