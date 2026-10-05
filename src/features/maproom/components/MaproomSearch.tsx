"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchLocation, type MapLocation } from "../api/search-location";

export default function MaproomSearch({ onResult }: { onResult: (location: MapLocation) => void }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    try {
      const location = await searchLocation(q);
      if (location) onResult(location);
      else setError("No places found. Try a different search.");
    } catch {
      setError("Search is unavailable right now. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="absolute left-3 right-[4.5rem] top-3 z-20 sm:left-4 sm:right-auto sm:top-4 sm:w-[24rem]">
      <form
        onSubmit={handleSubmit}
        className="flex items-center rounded-full bg-background pr-1 shadow-lg ring-1 ring-foreground/10 focus-within:ring-2 focus-within:ring-ring"
      >
        <Label htmlFor="maproom-search" className="sr-only">
          Search places
        </Label>
        <Input
          id="maproom-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search NOOK"
          className="h-11 flex-1 rounded-full border-0 bg-transparent px-5 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <Button type="submit" variant="ghost" size="icon-lg" disabled={isLoading} aria-label="Search" className="rounded-full text-primary">
          <SearchIcon />
        </Button>
      </form>
      {isLoading && (
        <p className="mt-2 rounded-lg bg-background px-4 py-2 text-sm text-muted-foreground shadow-lg">Searching…</p>
      )}
      {error && (
        <p role="alert" className="mt-2 rounded-lg bg-background px-4 py-2 text-sm text-destructive shadow-lg">
          {error}
        </p>
      )}
    </div>
  );
}
