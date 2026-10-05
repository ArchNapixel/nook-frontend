type Point = { lat: number; lng: number };

const EARTH_RADIUS_M = 6_371_000;

/** About a 10-minute walk. */
export const WALKABLE_METERS = 800;

export function getDistanceMeters(a: Point, b: Point): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters / 10) * 10} m` : `${(meters / 1000).toFixed(1)} km`;
}

const WALK_METERS_PER_MIN = 80;

export function formatWalkTime(meters: number): string {
  return `${Math.max(1, Math.round(meters / WALK_METERS_PER_MIN))} min walk`;
}
