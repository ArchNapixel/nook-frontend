import type { Place } from "../types/place";

export function formatPriceRange({ min, max }: Place["priceRange"]): string {
  return min === 0 && max === 0 ? "Free" : `₱${min}–${max}`;
}
