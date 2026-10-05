import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Place } from "@/features/places/types/place";

const pct = (n: number, total: number) => (total ? `${Math.round((n / total) * 100)}% of spots` : "—");

export default function AdminStats({ places }: { places: Place[] }) {
  const total = places.length;
  const withOutlets = places.filter((p) => p.hasOutlets).length;
  const withWifi = places.filter((p) => p.hasWifi).length;
  const studyReady = places.filter((p) => p.hasOutlets && p.hasWifi).length;
  const digitalPay = places.filter((p) => p.payments.some((m) => m === "gcash" || m === "maya")).length;
  const avgSpend = total
    ? Math.round(places.reduce((sum, p) => sum + (p.priceRange.min + p.priceRange.max) / 2, 0) / total)
    : 0;

  const stats = [
    { label: "Total spots", value: String(total), note: "In the directory" },
    { label: "Avg. spend", value: `₱${avgSpend}`, note: "Per person, midpoint" },
    { label: "With outlets", value: String(withOutlets), note: pct(withOutlets, total) },
    { label: "With Wi-Fi", value: String(withWifi), note: pct(withWifi, total) },
    { label: "Study-ready", value: String(studyReady), note: "Outlets + Wi-Fi" },
    { label: "GCash / Maya", value: String(digitalPay), note: pct(digitalPay, total) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map(({ label, value, note }) => (
        <Card key={label} size="sm">
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
            <p className="text-xs text-muted-foreground">{note}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
