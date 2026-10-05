"use client";

import { useEffect, useState } from "react";
import { getPlaces } from "../api/get-places";
import type { Place } from "../types/place";

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    getPlaces()
      .then((result) => !isCancelled && setPlaces(result))
      .catch(() => !isCancelled && setHasError(true))
      .finally(() => !isCancelled && setIsLoading(false));
    return () => {
      isCancelled = true;
    };
  }, []);

  return { places, isLoading, hasError };
}
