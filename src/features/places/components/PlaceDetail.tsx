import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_LABELS, GROUP_SIZE_LABELS, PAYMENT_LABELS } from "../constants";
import type { NearbyPlace } from "../types/place";
import { formatDistance } from "../utils/distance";
import { formatPriceRange } from "../utils/format-price-range";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <Separator />
      <div className="flex justify-between gap-4 py-2.5 text-sm">
        <dt className="shrink-0 text-muted-foreground">{label}</dt>
        <dd className="min-w-0 break-words text-right font-medium text-foreground">{children}</dd>
      </div>
    </>
  );
}

export default function PlaceDetail({
  place,
  distanceMeters,
  onBack,
}: NearbyPlace & { onBack: () => void }) {
  return (
    <div className="p-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ArrowLeftIcon />
        Back to results
      </Button>
      <h2 className="mt-2 break-words text-xl font-semibold text-foreground">{place.name}</h2>
      <p className="text-sm text-muted-foreground">
        {CATEGORY_LABELS[place.category]} · {formatDistance(distanceMeters)} away
      </p>
      <dl className="mt-3">
        <Row label="Address">{place.address}</Row>
        <Row label="Typical spend">{formatPriceRange(place.priceRange)}</Row>
        <Row label="Outlets">{place.hasOutlets ? "Available" : "Not available"}</Row>
        <Row label="Wi-Fi">{place.hasWifi ? "Available" : "Not available"}</Row>
        <Row label="Payment">{place.payments.map((p) => PAYMENT_LABELS[p]).join(", ")}</Row>
        <Row label="Good for">{GROUP_SIZE_LABELS[place.groupSize]}</Row>
      </dl>
    </div>
  );
}
