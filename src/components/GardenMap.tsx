"use client";

import { useMemo } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";

type GardenPin = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_CENTER: [number, number] = [42.7339, 25.4858];

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function GardenMap({ gardens }: { gardens: GardenPin[] }) {
  const center = useMemo(() => {
    if (gardens.length === 0) return DEFAULT_CENTER;
    const avgLat =
      gardens.reduce((sum, g) => sum + g.latitude, 0) / gardens.length;
    const avgLng =
      gardens.reduce((sum, g) => sum + g.longitude, 0) / gardens.length;
    return [avgLat, avgLng] as [number, number];
  }, [gardens]);

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gardens.map((garden) => (
          <Marker
            key={garden.id}
            position={[garden.latitude, garden.longitude]}
            icon={markerIcon}
          >
            <Popup>{garden.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
