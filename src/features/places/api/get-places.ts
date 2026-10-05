import { MOCK_PLACES } from "../data/mock-places";
import type { Place } from "../types/place";

// ponytail: serves mock data; swap the body for an api.get("/places") call once the backend exists
export async function getPlaces(): Promise<Place[]> {
  return MOCK_PLACES;
}
