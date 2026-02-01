"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/LogoutButton";

export function TopNav() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-sm font-semibold">
        <Link href={`/${locale}#search`} className="text-ink-700 hover:text-ink-900">
          {t("search")}
        </Link>
        {mounted && (
          session?.user ? (
            <Link href={`/${locale}/profile`} className="text-ink-700 hover:text-ink-900">
              {t("profile")}
            </Link>
          ) : (
            <>
              <Link href={`/${locale}/login`} className="text-ink-700 hover:text-ink-900">
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white"
              >
                {t("register")}
              </Link>
            </>
          )
        )}
      </div>
      {mounted && session?.user && <LogoutButton />}
    </nav>
  );
}
