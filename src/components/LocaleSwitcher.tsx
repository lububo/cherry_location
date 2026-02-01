"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const otherLocale = locale === "bg" ? "en" : "bg";
  if (!mounted) return null;

  const nextPath = `/${otherLocale}${pathname.replace(/^\/(en|bg)/, "")}`;
  const nextUrl = searchParams.toString()
    ? `${nextPath}?${searchParams.toString()}`
    : nextPath;

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(() => {
          document.cookie = `NEXT_LOCALE=${otherLocale}; path=/`;
          router.push(nextUrl);
          router.refresh();
        })
      }
      className="rounded-full border border-ink-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-500 transition hover:border-ink-400 hover:text-ink-700"
    >
      {otherLocale}
    </button>
  );
}
