import { normalizePlate } from "@/lib/utils";
import PlateDetailView from "./PlateDetailView";

const API_SERVER_URL = process.env.INTERNAL_API_URL || 'http://localhost:8000';

async function getPlateData(number: string) {
  try {
    const response = await fetch(`${API_SERVER_URL}/plates/${number}`, {
      cache: 'no-store' // Ensure we get fresh data
    });
    if (!response.ok) return null;
    return response.json();
  } catch (e) {
    return null;
  }
}

interface Params {
  id: string;
}

export default async function PlatePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const normalized = normalizePlate(id);

  const plate = await getPlateData(normalized);

  return (
    <PlateDetailView 
      plateNumber={normalized} 
      isRegistered={!!plate} 
      plateData={plate} 
    />
  );
}

