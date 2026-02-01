"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { GardenForm } from "@/components/GardenForm";
import { GardenEditForm } from "@/components/GardenEditForm";

type Garden = {
  id: string;
  name: string;
  region: string;
  pricePerKg?: string | null;
  latitude: number;
  longitude: number;
  coordinatesText?: string | null;
  isSelfPick: boolean;
  contactPhone?: string | null;
  contactEmail?: string | null;
  images: { id: string; url: string }[];
};

export function UserProfile() {
  const t = useTranslations("profile");
  const [email, setEmail] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "gardens">("profile");
  const editSectionRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const prefillName = searchParams.get("prefillName") ?? "";
  const prefillRegion = searchParams.get("prefillRegion") ?? "";

  async function loadGardens() {
    const res = await fetch("/api/gardens/mine");
    if (!res.ok) {
      setGardens([]);
      return;
    }
    const data = await res.json();
    setGardens(data?.gardens ?? []);
  }

  useEffect(() => {
    loadGardens();
  }, []);

  useEffect(() => {
    if (prefillName || prefillRegion) {
      setActiveTab("gardens");
    }
  }, [prefillName, prefillRegion]);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProfileEmail(data?.email ?? "");
      })
      .catch(() => setProfileEmail(""));
  }, []);

  useEffect(() => {
    if (editingId) {
      editSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editingId]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || undefined,
        currentPassword,
        newPassword: newPassword || undefined,
      }),
    });

    if (!response.ok) {
      setMessage(t("error"));
      return;
    }

    setMessage(t("saved"));
    setCurrentPassword("");
    setNewPassword("");
  }

  return (
    <section id="profile" className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "profile"
              ? "bg-ink-900 text-white"
              : "border border-ink-200 text-ink-700 hover:border-ink-300"
          }`}
        >
          {t("tabProfile")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("gardens")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "gardens"
              ? "bg-ink-900 text-white"
              : "border border-ink-200 text-ink-700 hover:border-ink-300"
          }`}
        >
          {t("tabGardens")}
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink-900">{t("title")}</h2>
          <p className="mt-1 text-sm text-ink-500">{t("subtitle")}</p>
          {editMessage && (
            <p className="mt-3 text-sm text-emerald-700">{editMessage}</p>
          )}

          <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-ink-700">
                {t("registeredEmail")}
              </label>
              <input
                type="email"
                value={profileEmail}
                disabled
                className="w-full rounded-xl border border-ink-200 bg-ink-50 px-4 py-2 text-sm text-ink-900"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-ink-700">
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-700">
                {t("currentPassword")}
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-700">
                {t("newPassword")}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
            {message && <p className="text-sm text-ink-700">{message}</p>}
            <button
              type="submit"
              className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {t("save")}
            </button>
          </form>
        </div>
      )}

      {activeTab === "gardens" && (
        <>
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-900">
              {t("gardens")}
            </h2>
            {gardens.length === 0 ? (
              <p className="mt-2 text-sm text-ink-500">{t("noGardens")}</p>
            ) : (
              <div className="mt-3 space-y-2 text-sm text-ink-700">
                {gardens.map((garden) => (
                  <div
                    key={garden.id}
                    className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-2"
                  >
                    <div>
                      <p className="font-semibold">{garden.name}</p>
                      <p className="text-xs uppercase text-ink-400">
                        {garden.region}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId((id) =>
                            id === garden.id ? null : garden.id
                          )
                        }
                        className="rounded-full border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-700 hover:border-ink-300 hover:text-ink-900"
                      >
                        {editingId === garden.id ? t("closeEdit") : t("edit")}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const confirmed = window.confirm(t("deleteConfirm"));
                          if (!confirmed) return;
                          await fetch(`/api/gardens/${garden.id}`, {
                            method: "DELETE",
                          });
                          loadGardens();
                        }}
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:border-rose-300 hover:text-rose-800"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-900">
              {t("addGarden")}
            </h2>
            <div className="mt-4">
              <GardenForm
                onSaved={loadGardens}
                initialName={prefillName}
                initialRegion={prefillRegion}
              />
            </div>
          </div>

          {editingId && (
            <div
              ref={editSectionRef}
              className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-ink-900">
                {t("editTitle")}
              </h2>
              <GardenEditForm
                garden={gardens.find((g) => g.id === editingId)!}
                onSaved={() => {
                  loadGardens();
                  setEditMessage(t("saveChangesSuccess"));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
