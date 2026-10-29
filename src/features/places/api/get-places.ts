import { apiGet } from "@/lib/api";
import type { Place } from "../types/place";

type ApiSpot = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
};

// ponytail: the backend has no category/payments/groupSize yet, so those use defaults; add them to the Spot model when needed
export async function getPlaces(): Promise<Place[]> {
  const spots = await apiGet<ApiSpot[]>("/spots?limit=100");
  return spots.map((s) => ({
    id: s.id,
    name: s.name,
    category: "cafe",
    address: s.address,
    location: { lat: s.latitude, lng: s.longitude },
    priceRange: { min: s.minPrice, max: s.maxPrice },
    hasOutlets: s.amenities.includes("OUTLET"),
    hasWifi: s.amenities.includes("WIFI"),
    payments: ["cash"],
    groupSize: "both",
  }));
}
