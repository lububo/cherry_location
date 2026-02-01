"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function LoginLinks() {
  const locale = useLocale();
  const t = useTranslations("app.actions");

  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      <Link
        href={`/${locale}/login`}
        className="rounded-full border border-ink-200 px-3 py-1 text-ink-500 transition hover:border-ink-400 hover:text-ink-700"
      >
        {t("login")}
      </Link>
      <Link
        href={`/${locale}/register`}
        className="rounded-full bg-ink-900 px-3 py-1 text-white transition hover:bg-ink-800"
      >
        {t("register")}
      </Link>
    </div>
  );
}
