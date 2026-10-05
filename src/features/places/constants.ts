import type { GroupSize, PaymentMethod, PlaceCategory } from "./types/place";

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  cafe: "Café",
  karinderya: "Karinderya",
  coworking: "Co-working space",
  restaurant: "Restaurant",
  park: "Park",
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  gcash: "GCash",
  maya: "Maya",
  card: "Card",
};

export const GROUP_SIZE_LABELS: Record<GroupSize, string> = {
  solo: "Solo-friendly",
  barkada: "Barkada-friendly",
  both: "Solo & barkada",
};
