"use client";

import { useEffect, useState } from "react";

type Position = { lat: number; lng: number };

/** One-shot browser geolocation; stays null if disabled, denied or unsupported. */
export function useUserLocation(enabled: boolean) {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPosition({ lat: coords.latitude, lng: coords.longitude }),
      () => {},
    );
  }, [enabled]);

  return position;
}
