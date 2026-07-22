"use client";

import { openCookiePreferences } from "@/lib/consent";

export function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      Gérer les cookies
    </button>
  );
}
