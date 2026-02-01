"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function SearchFilters({
  initialQ,
  initialRegion,
  initialSort,
}: {
  initialQ?: string;
  initialRegion?: string;
  initialSort?: string;
}) {
  const t = useTranslations("app");
  const router = useRouter();
  const [q, setQ] = useState(initialQ ?? "");
  const [region, setRegion] = useState(initialRegion ?? "");
  const [sort, setSort] = useState(initialSort ?? "name");

  const params = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (region) sp.set("region", region);
    if (sort && sort !== "name") sp.set("sort", sort);
    return sp.toString();
  }, [q, region, sort]);

  function apply() {
    router.push(params ? `?${params}` : "?");
  }

  return (
    <form
      suppressHydrationWarning
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
      className="grid gap-4 rounded-2xl border border-ink-100 bg-white p-4 md:grid-cols-[2fr_1fr_1fr_auto]"
    >
      <div className="relative">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder={t("filters.search")}
          className="w-full rounded-xl border border-ink-100 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              router.push(region || sort !== "name" ? `?${params.replace(/(^|&)q=[^&]*/g, "").replace(/^&/, "")}` : "?");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-ink-200 px-2 py-0.5 text-xs text-ink-600"
          >
            ×
          </button>
        )}
      </div>
      <div className="relative">
        <input
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          placeholder={t("filters.region")}
          className="w-full rounded-xl border border-ink-100 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        {region && (
          <button
            type="button"
            onClick={() => {
              setRegion("");
              router.push(q || sort !== "name" ? `?${params.replace(/(^|&)region=[^&]*/g, "").replace(/^&/, "")}` : "?");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-ink-200 px-2 py-0.5 text-xs text-ink-600"
          >
            ×
          </button>
        )}
      </div>
      <div className="relative">
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="w-full rounded-xl border border-ink-100 px-4 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
        >
          <option value="name">{t("filters.sortName")}</option>
          <option value="price">{t("filters.sortPrice")}</option>
        </select>
        {sort !== "name" && (
          <button
            type="button"
            onClick={() => {
              setSort("name");
              router.push(q || region ? `?${params.replace(/(^|&)sort=[^&]*/g, "").replace(/^&/, "")}` : "?");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-ink-200 px-2 py-0.5 text-xs text-ink-600"
          >
            ×
          </button>
        )}
      </div>
      <button
        type="submit"
        className="rounded-xl bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
      >
        {t("filters.apply")}
      </button>
    </form>
  );
}
