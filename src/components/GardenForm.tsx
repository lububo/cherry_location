"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapPicker = dynamic(
  () => import("./MapPicker").then((mod) => mod.MapPicker),
  { ssr: false }
);
const DEFAULT_CENTER: [number, number] = [42.7339, 25.4858];

export function GardenForm({
  onSaved,
  initialName,
  initialRegion,
}: {
  onSaved?: () => void;
  initialName?: string;
  initialRegion?: string;
}) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [region, setRegion] = useState(initialRegion ?? "");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [coordinatesText, setCoordinatesText] = useState("");
  const [isSelfPick, setIsSelfPick] = useState(false);
  const [pricePerKg, setPricePerKg] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  function applyCoordinatesText(text: string) {
    const parts = text.split(",").map((part) => part.trim());
    if (parts.length !== 2) return;
    const lat = Number(parts[0]);
    const lng = Number(parts[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setLatitude(lat);
      setLongitude(lng);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (latitude === null || longitude === null) {
      setError(t("locationRequired"));
      return;
    }

    const response = await fetch("/api/gardens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        region,
        latitude,
        longitude,
        coordinatesText: coordinatesText || undefined,
        isSelfPick,
        pricePerKg: pricePerKg || undefined,
        contactPhone: contactPhone || undefined,
        contactEmail: contactEmail || undefined,
      }),
    });

    if (!response.ok) {
      setError(t("saveError"));
      return;
    }

    const data = await response.json();
    const gardenId = data?.garden?.id as string | undefined;

    if (gardenId && images.length > 0) {
      const formData = new FormData();
      images.slice(0, 5).forEach((file) => formData.append("images", file));
      await fetch(`/api/gardens/${gardenId}/images`, {
        method: "POST",
        body: formData,
      });
    }

    router.refresh();
    onSaved?.();
    setSuccess(t("saveSuccess"));
    setImages([]);
  }

  const markerPosition =
    latitude !== null && longitude !== null
      ? ([latitude, longitude] as [number, number])
      : null;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-ink-700">
            {t("gardenName")}
            <span className="ml-1 text-rose-600">*</span>
          </label>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-ink-700">
            {t("region")}
            <span className="ml-1 text-rose-600">*</span>
          </label>
          <input
            required
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-ink-700">
          {t("images")}
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(event) =>
            setImages(Array.from(event.target.files ?? []).slice(0, 5))
          }
          className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-900 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
        />
        <p className="text-xs text-ink-400">{t("imagesHint")}</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-ink-700">
          {t("coordinates")}
        </label>
          <input
            value={coordinatesText}
            onChange={(event) => {
              setCoordinatesText(event.target.value);
              applyCoordinatesText(event.target.value);
            }}
            placeholder="42.69, 23.32"
            className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        <p className="text-xs text-ink-400">
          {t("coordinatesHint")}
        </p>
      </div>

      <div className="h-[260px] overflow-hidden rounded-xl border border-ink-100">
        <MapPicker
          center={markerPosition ?? DEFAULT_CENTER}
          markerPosition={markerPosition}
          onChange={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
            setCoordinatesText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-ink-700">
            {t("price")}
          </label>
          <input
            value={pricePerKg}
            onChange={(event) => setPricePerKg(event.target.value)}
            className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="selfPick"
            type="checkbox"
            checked={isSelfPick}
            onChange={(event) => setIsSelfPick(event.target.checked)}
            className="h-4 w-4 rounded border-ink-200 text-rose-500"
          />
          <label htmlFor="selfPick" className="text-sm text-ink-700">
            {t("selfPick")}
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-ink-700">
            {t("phone")}
          </label>
          <input
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-ink-700">
            {t("email")}
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {success && <p className="text-sm text-emerald-700">{success}</p>}
      <button
        type="submit"
        className="rounded-xl bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
      >
        {t("save")}
      </button>
    </form>
  );
}
