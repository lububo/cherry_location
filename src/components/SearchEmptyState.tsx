"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

export function SearchEmptyState({
  q,
  region,
}: {
  q?: string;
  region?: string;
}) {
  const { data: session } = useSession();
  const t = useTranslations("app");
  const locale = useLocale();

  if (!session?.user) {
    return <p>{t("empty")}</p>;
  }

  const params = new URLSearchParams();
  if (q) params.set("prefillName", q);
  if (region) params.set("prefillRegion", region);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span>{t("empty")}</span>
      <Link
        href={`/${locale}/profile?${params.toString()}`}
        className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white"
      >
        <span>+</span>
        {t("addGarden")}
      </Link>
    </div>
  );
}
