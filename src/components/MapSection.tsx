"use client";

import dynamic from "next/dynamic";

type GardenPin = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const GardenMap = dynamic(() => import("./GardenMap").then((mod) => mod.GardenMap), {
  ssr: false,
});

export function MapSection({ gardens }: { gardens: GardenPin[] }) {
  return <GardenMap gardens={gardens} />;
}
