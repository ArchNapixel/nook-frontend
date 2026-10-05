import { PlugZapIcon, WifiIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "../constants";
import type { NearbyPlace } from "../types/place";
import { WALKABLE_METERS, formatDistance, formatWalkTime } from "../utils/distance";
import { formatPriceRange } from "../utils/format-price-range";
import CategoryIcon from "./CategoryIcon";

type PlaceCardProps = NearbyPlace & {
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export default function PlaceCard({ place, distanceMeters, isSelected, onSelect }: PlaceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(place.id)}
      aria-pressed={isSelected}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        isSelected && "bg-muted ring-1 ring-ring",
      )}
    >
      <CategoryIcon category={place.category} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{place.name}</p>
        <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
          <span className="truncate">
            {CATEGORY_LABELS[place.category]} · {formatPriceRange(place.priceRange)}
          </span>
          {place.hasOutlets && <PlugZapIcon className="size-3.5 shrink-0" aria-label="Has outlets" />}
          {place.hasWifi && <WifiIcon className="size-3.5 shrink-0" aria-label="Has Wi-Fi" />}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-foreground">{formatDistance(distanceMeters)}</p>
        {distanceMeters <= WALKABLE_METERS && (
          <p className="text-xs text-green-700 dark:text-green-400">{formatWalkTime(distanceMeters)}</p>
        )}
      </div>
    </button>
  );
}
