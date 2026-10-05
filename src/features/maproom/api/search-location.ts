export type MapLocation = {
  lat: number;
  lng: number;
  label: string;
};

type NominatimResult = { lat: string; lon: string; display_name: string };

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export async function searchLocation(query: string): Promise<MapLocation | null> {
  const params = new URLSearchParams({ q: query, format: "json", limit: "1" });
  const res = await fetch(`${NOMINATIM_URL}?${params}`);
  if (!res.ok) throw new Error(`Search failed (${res.status})`);

  const [hit] = (await res.json()) as NominatimResult[];
  return hit
    ? { lat: Number(hit.lat), lng: Number(hit.lon), label: hit.display_name }
    : null;
}
