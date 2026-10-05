import { CoffeeIcon, LaptopIcon, TreesIcon, UtensilsIcon, SoupIcon, type LucideIcon } from "lucide-react";
import type { PlaceCategory } from "../types/place";

const ICONS: Record<PlaceCategory, LucideIcon> = {
  cafe: CoffeeIcon,
  karinderya: SoupIcon,
  coworking: LaptopIcon,
  restaurant: UtensilsIcon,
  park: TreesIcon,
};

export default function CategoryIcon({ category }: { category: PlaceCategory }) {
  const Icon = ICONS[category];
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
    >
      <Icon className="size-5" />
    </span>
  );
}
