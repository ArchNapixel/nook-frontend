"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import AuthDialog from "@/features/auth/components/AuthDialog";
import ProfileMenu from "@/features/auth/components/ProfileMenu";
import { useAuth } from "@/features/auth/context/AuthProvider";
import PlacesPanel from "@/features/places/components/PlacesPanel";
import { useNearbyPlaces } from "@/features/places/hooks/use-nearby-places";
import { CAMPUS_GATE } from "@/lib/constants/campus";
import type { MapLocation } from "../api/search-location";
import { useUserLocation } from "../hooks/use-user-location";
import { DEFAULT_MAP_STYLE, MAP_STYLES, type MapStyleId } from "../map-styles";
import LocationPrompt from "./LocationPrompt";
import MapStyleSwitcher from "./MapStyleSwitcher";
import MaproomSearch from "./MaproomSearch";

// Leaflet touches `window`, so it can't render on the server.
const MaproomMap = dynamic(() => import("./MaproomMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
});

export default function Maproom() {
  const [searchResult, setSearchResult] = useState<MapLocation | null>(null);
  const [mapStyleId, setMapStyleId] = useState<MapStyleId>(DEFAULT_MAP_STYLE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { user, signIn, signOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const enableLocation = useCallback(() => setIsLocationEnabled(true), []);

  const userPosition = useUserLocation(isLocationEnabled);
  const { nearbyPlaces, isLoading, hasError } = useNearbyPlaces(userPosition ?? CAMPUS_GATE);

  return (
    <main className="relative h-dvh w-full">
      <MaproomMap
        mapStyle={MAP_STYLES.find((s) => s.id === mapStyleId) ?? MAP_STYLES[0]}
        searchResult={searchResult}
        userPosition={userPosition}
        places={nearbyPlaces.map(({ place }) => place)}
        selectedId={selectedId}
        onSelectPlace={setSelectedId}
      />
      <PlacesPanel
        nearbyPlaces={nearbyPlaces}
        isLoading={isLoading}
        hasError={hasError}
        originLabel={userPosition ? "near you" : `near ${CAMPUS_GATE.name}`}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <MaproomSearch onResult={setSearchResult} />
      <ProfileMenu user={user} onSignInClick={() => setIsAuthOpen(true)} onSignOut={signOut} />
      <MapStyleSwitcher value={mapStyleId} onChange={setMapStyleId} />
      <LocationPrompt onAllow={enableLocation} />
      {isAuthOpen && (
        <AuthDialog
          onClose={() => setIsAuthOpen(false)}
          onAuthenticated={(u) => {
            signIn(u);
            setIsAuthOpen(false);
          }}
        />
      )}
    </main>
  );
}
