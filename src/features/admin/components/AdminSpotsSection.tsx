"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_LABELS } from "@/features/places/constants";
import type { Place, PlaceCategory } from "@/features/places/types/place";
import AdminPlacesTable from "./AdminPlacesTable";

export default function AdminSpotsSection({ places }: { places: Place[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PlaceCategory | "all">("all");

  const q = query.trim().toLowerCase();
  const visible = places.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (!q || p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)),
  );
  const categories = [...new Set(places.map((p) => p.category))];

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            Spots <Badge variant="secondary">{visible.length}</Badge>
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <Label htmlFor="admin-spot-search" className="sr-only">
              Search spots
            </Label>
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-spot-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or address"
              className="h-9 pl-8"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          {(["all", ...categories] as const).map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === "all" ? "All" : CATEGORY_LABELS[c]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {visible.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">No spots match your filters.</p>
        ) : (
          <AdminPlacesTable places={visible} />
        )}
      </CardContent>
    </Card>
  );
}
