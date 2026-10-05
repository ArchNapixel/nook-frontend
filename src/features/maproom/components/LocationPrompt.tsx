"use client";

import { useEffect, useState } from "react";
import { MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type PromptState = "hidden" | "ask" | "denied";

export default function LocationPrompt({ onAllow }: { onAllow: () => void }) {
  const [state, setState] = useState<PromptState>("hidden");

  useEffect(() => {
    if (!navigator.geolocation) return;
    // Permissions API is missing in some browsers; fall back to asking.
    if (!navigator.permissions) {
      Promise.resolve().then(() => setState("ask"));
      return;
    }
    navigator.permissions.query({ name: "geolocation" }).then(({ state: perm }) => {
      if (perm === "granted") onAllow();
      else setState(perm === "denied" ? "denied" : "ask");
    });
  }, [onAllow]);

  if (state === "hidden") return null;

  const isDenied = state === "denied";
  return (
    <Card
      role="region"
      aria-label="Location permission"
      className="absolute inset-x-3 top-20 z-30 shadow-xl sm:inset-x-auto sm:bottom-6 sm:left-[26rem] sm:top-auto sm:w-80"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPinIcon className="size-4 text-primary" />
          {isDenied ? "Location is blocked" : "Use your location?"}
        </CardTitle>
        <CardDescription>
          {isDenied
            ? "Allow location access in your browser's site settings, then reload, to start the map where you are."
            : "NOOK uses your location to open the map where you are and show places nearby."}
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" onClick={() => setState("hidden")}>
          {isDenied ? "Dismiss" : "Not now"}
        </Button>
        {!isDenied && (
          <Button
            onClick={() => {
              setState("hidden");
              onAllow();
            }}
          >
            Allow
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
