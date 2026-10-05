export type PlaceCategory = "cafe" | "karinderya" | "coworking" | "restaurant" | "park";
export type PaymentMethod = "cash" | "gcash" | "maya" | "card";
export type GroupSize = "solo" | "barkada" | "both";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  location: { lat: number; lng: number };
  /** Typical spend per person, in pesos. */
  priceRange: { min: number; max: number };
  hasOutlets: boolean;
  hasWifi: boolean;
  payments: PaymentMethod[];
  groupSize: GroupSize;
}

export interface NearbyPlace {
  place: Place;
  distanceMeters: number;
}
