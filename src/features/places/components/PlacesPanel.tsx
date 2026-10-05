"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { NearbyPlace } from "../types/place";
import PlaceCard from "./PlaceCard";
import PlaceDetail from "./PlaceDetail";

type PlacesPanelProps = {
  nearbyPlaces: NearbyPlace[];
  isLoading: boolean;
  hasError: boolean;
  originLabel: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

// Mobile: bottom sheet. Desktop (sm+): left panel under the search bar, sized to its content.
const PANEL_CLASS =
  "absolute inset-x-0 bottom-0 z-10 flex max-h-[45dvh] flex-col rounded-t-2xl bg-card text-card-foreground shadow-xl ring-1 ring-foreground/10 " +
  "sm:inset-x-auto sm:bottom-auto sm:left-4 sm:top-20 sm:max-h-[calc(100dvh-6rem)] sm:w-[24rem] sm:rounded-2xl";

export default function PlacesPanel({
  nearbyPlaces,
  isLoading,
  hasError,
  originLabel,
  selectedId,
  onSelect,
}: PlacesPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const selected = nearbyPlaces.find(({ place }) => place.id === selectedId);

  let body: React.ReactNode;
  if (selected) {
    body = <PlaceDetail {...selected} onBack={() => onSelect(null)} />;
  } else if (isLoading) {
    body = (
      <div className="space-y-2 p-3" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  } else if (hasError) {
    body = <p role="alert" className="p-4 text-sm text-destructive">Couldn’t load spots. Reload the page to try again.</p>;
  } else if (nearbyPlaces.length === 0) {
    body = <p className="p-4 text-sm text-muted-foreground">No spots to show yet.</p>;
  } else {
    body = (
      <ul className="p-1.5">
        {nearbyPlaces.map((item) => (
          <li key={item.place.id}>
            <PlaceCard {...item} isSelected={false} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section aria-label="Places" className={PANEL_CLASS}>
      {!selected && (
        <header className="flex shrink-0 items-center gap-2 px-4 py-2.5">
          <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">Spots {originLabel}</h2>
          {!isLoading && !hasError && <Badge variant="secondary">{nearbyPlaces.length}</Badge>}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsCollapsed((c) => !c)}
            aria-label={isCollapsed ? "Show spots" : "Hide spots"}
            aria-expanded={!isCollapsed}
          >
            <ChevronDownIcon className={cn("transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </header>
      )}
      {(selected || !isCollapsed) && <div className="min-h-0 flex-1 overflow-y-auto border-t border-border/60">{body}</div>}
    </section>
  );
}
