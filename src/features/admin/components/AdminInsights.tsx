import { CATEGORY_LABELS, GROUP_SIZE_LABELS, PAYMENT_LABELS } from "@/features/places/constants";
import type { Place } from "@/features/places/types/place";
import { tally } from "../utils/tally";
import BarCard from "./BarCard";

function priceBand(place: Place) {
  const mid = (place.priceRange.min + place.priceRange.max) / 2;
  if (mid <= 100) return "₱0–100";
  if (mid <= 300) return "₱100–300";
  return "₱300+";
}

export default function AdminInsights({ places }: { places: Place[] }) {
  const total = places.length;
  const categories = tally(places.map((p) => CATEGORY_LABELS[p.category]));
  const bands = ["₱0–100", "₱100–300", "₱300+"].map((label) => ({
    label,
    value: places.filter((p) => priceBand(p) === label).length,
  }));
  const payments = tally(places.flatMap((p) => p.payments.map((m) => PAYMENT_LABELS[m])));
  const groups = tally(places.map((p) => GROUP_SIZE_LABELS[p.groupSize]));
  const amenities = [
    { label: "Outlets + Wi-Fi", value: places.filter((p) => p.hasOutlets && p.hasWifi).length },
    { label: "Outlets only", value: places.filter((p) => p.hasOutlets && !p.hasWifi).length },
    { label: "Wi-Fi only", value: places.filter((p) => !p.hasOutlets && p.hasWifi).length },
    { label: "Neither", value: places.filter((p) => !p.hasOutlets && !p.hasWifi).length },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <BarCard title="Spots by category" description="What kinds of places we list" items={categories} max={total} />
      <BarCard title="Price bands" description="Typical spend per person" items={bands} max={total} />
      <BarCard title="Amenity coverage" description="Outlets and Wi-Fi availability" items={amenities} max={total} />
      <BarCard
        title="Payment methods"
        description="Spots accepting each method"
        items={payments}
        max={total}
      />
      <BarCard title="Group suitability" description="Solo vs. barkada seating" items={groups} max={total} />
    </div>
  );
}
