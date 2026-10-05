"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CAMPUS_GATE } from "@/lib/constants/campus";
import type { Place } from "@/features/places/types/place";
import type { MapLocation } from "../api/search-location";
import type { MapStyle } from "../map-styles";

const DEFAULT_ZOOM = 15;

function FlyTo({ lat, lng, zoom = 16 }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom);
  }, [map, lat, lng, zoom]);
  return null;
}

type MaproomMapProps = {
  searchResult: MapLocation | null;
  userPosition: { lat: number; lng: number } | null;
  places: Place[];
  selectedId: string | null;
  onSelectPlace: (id: string) => void;
  mapStyle: MapStyle;
};

export default function MaproomMap({
  mapStyle,
  searchResult,
  userPosition,
  places,
  selectedId,
  onSelectPlace,
}: MaproomMapProps) {
  const selected = places.find((p) => p.id === selectedId);

  return (
    <MapContainer
      center={[CAMPUS_GATE.lat, CAMPUS_GATE.lng]}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      className="isolate h-full w-full"
    >
      <TileLayer
        key={mapStyle.id}
        attribution={mapStyle.attribution}
        url={mapStyle.url}
        maxZoom={mapStyle.maxZoom}
        subdomains={mapStyle.subdomains ?? "abc"}
      />
      {mapStyle.labelsUrl && <TileLayer key={`${mapStyle.id}-labels`} url={mapStyle.labelsUrl} maxZoom={mapStyle.maxZoom} />}
      <ZoomControl position="bottomright" />

      {places.map((place) => {
        const isSelected = place.id === selectedId;
        return (
          <CircleMarker
            key={place.id}
            center={[place.location.lat, place.location.lng]}
            radius={isSelected ? 12 : 8}
            pathOptions={{
              color: "#fff",
              weight: 2,
              fillColor: isSelected ? "#c2410c" : "#f97316",
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSelectPlace(place.id) }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              {place.name}
            </Tooltip>
          </CircleMarker>
        );
      })}

      {userPosition && (
        <>
          <CircleMarker
            center={[userPosition.lat, userPosition.lng]}
            radius={8}
            pathOptions={{ color: "#fff", weight: 3, fillColor: "#4285f4", fillOpacity: 1 }}
          />
          <FlyTo lat={userPosition.lat} lng={userPosition.lng} />
        </>
      )}

      {searchResult && (
        <>
          <CircleMarker
            center={[searchResult.lat, searchResult.lng]}
            radius={9}
            pathOptions={{ color: "#fff", weight: 3, fillColor: "#ea4335", fillOpacity: 1 }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              {searchResult.label}
            </Tooltip>
          </CircleMarker>
          <FlyTo lat={searchResult.lat} lng={searchResult.lng} />
        </>
      )}

      {selected && <FlyTo lat={selected.location.lat} lng={selected.location.lng} zoom={17} />}
    </MapContainer>
  );
}
