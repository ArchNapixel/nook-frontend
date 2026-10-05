"use client";

import { LayersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MAP_STYLES, type MapStyleId } from "../map-styles";

type MapStyleSwitcherProps = {
  value: MapStyleId;
  onChange: (id: MapStyleId) => void;
};

export default function MapStyleSwitcher({ value, onChange }: MapStyleSwitcherProps) {
  return (
    <div className="absolute right-3 top-[4.25rem] z-20 sm:right-4 sm:top-[4.75rem]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-lg" aria-label="Map style" className="size-11 rounded-lg shadow-lg">
            <LayersIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuRadioGroup value={value} onValueChange={(id) => onChange(id as MapStyleId)}>
            {MAP_STYLES.map(({ id, label }) => (
              <DropdownMenuRadioItem key={id} value={id}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
