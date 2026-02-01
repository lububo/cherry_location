"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-500 transition hover:border-ink-400 hover:text-ink-700"
    >
      Sign out
    </button>
  );
}
