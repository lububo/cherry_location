"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type GardenImage = {
  id: string;
  url: string;
};

type Garden = {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  coordinatesText?: string | null;
  isSelfPick: boolean;
  pricePerKg?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  images: GardenImage[];
};

export function GardenEditForm({
  garden,
  onSaved,
  onCancel,
}: {
  garden: Garden;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("profile");
  const [name, setName] = useState(garden.name);
  const [region, setRegion] = useState(garden.region);
  const [coordinatesText, setCoordinatesText] = useState(
    garden.coordinatesText ?? `${garden.latitude}, ${garden.longitude}`
  );
  const [latitude, setLatitude] = useState(garden.latitude);
  const [longitude, setLongitude] = useState(garden.longitude);
  const [isSelfPick, setIsSelfPick] = useState(garden.isSelfPick);
  const [pricePerKg, setPricePerKg] = useState(garden.pricePerKg ?? "");
  const [contactPhone, setContactPhone] = useState(garden.contactPhone ?? "");
  const [contactEmail, setContactEmail] = useState(garden.contactEmail ?? "");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

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

    const response = await fetch(`/api/gardens/${garden.id}`, {
      method: "PATCH",
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

    if (images.length > 0) {
      const formData = new FormData();
      images.slice(0, 5).forEach((file) => formData.append("images", file));
      await fetch(`/api/gardens/${garden.id}/images`, {
        method: "POST",
        body: formData,
      });
    }

    setImages([]);
    onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-4">
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
          {t("coordinates")}
        </label>
        <input
          value={coordinatesText}
          onChange={(event) => {
            setCoordinatesText(event.target.value);
            applyCoordinatesText(event.target.value);
          }}
          className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
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
            id={`selfPick-${garden.id}`}
            type="checkbox"
            checked={isSelfPick}
            onChange={(event) => setIsSelfPick(event.target.checked)}
            className="h-4 w-4 rounded border-ink-200 text-rose-500"
          />
          <label htmlFor={`selfPick-${garden.id}`} className="text-sm text-ink-700">
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

      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink-700">{t("images")}</p>
        {garden.images.length === 0 ? (
          <p className="text-xs text-ink-500">{t("noImages")}</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {garden.images.map((img) => (
              <div
                key={img.id}
                className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-xs"
              >
                <span className="truncate">{img.url}</span>
                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = window.confirm(t("deleteImageConfirm"));
                    if (!confirmed) return;
                    await fetch(`/api/gardens/images/${img.id}`, {
                      method: "DELETE",
                    });
                    onSaved();
                  }}
                  className="text-rose-700 hover:text-rose-800"
                >
                  {t("removeImage")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-ink-700">
          {t("addImages")}
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
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {t("save")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
