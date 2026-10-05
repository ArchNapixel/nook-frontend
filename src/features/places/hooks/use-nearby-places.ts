"use client";

import { useMemo } from "react";
import type { NearbyPlace } from "../types/place";
import { getDistanceMeters } from "../utils/distance";
import { usePlaces } from "./use-places";

type Origin = { lat: number; lng: number };

/** Places sorted by distance from `origin`, nearest first. */
export function useNearbyPlaces(origin: Origin) {
  const { places, isLoading, hasError } = usePlaces();

  const nearbyPlaces = useMemo<NearbyPlace[]>(
    () =>
      places
        .map((place) => ({ place, distanceMeters: getDistanceMeters(origin, place.location) }))
        .sort((a, b) => a.distanceMeters - b.distanceMeters),
    [places, origin],
  );

  return { nearbyPlaces, isLoading, hasError };
}
