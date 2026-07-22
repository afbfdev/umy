"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { readConsent, CONSENT_CHANGED_EVENT } from "@/lib/consent";

/**
 * Mesure d'audience first-party, chargée uniquement si le visiteur a consenti
 * (`consent.analytics === true`). N'envoie que le chemin de la page.
 *
 * Pour brancher un outil tiers (GA, Plausible…), remplacez l'appel `fetch` par
 * le chargement conditionnel du script correspondant, en gardant la même garde
 * de consentement.
 */
export function Analytics() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  function send(path: string) {
    if (lastSent.current === path) return;
    if (!readConsent()?.analytics) return; // ← garde de consentement
    lastSent.current = path;
    try {
      void fetch("/api/analytics/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
        keepalive: true,
      });
    } catch {
      /* silencieux */
    }
  }

  // Vue de page à chaque navigation.
  useEffect(() => {
    send(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // L'utilisateur vient d'accepter → tracer la page courante immédiatement.
  useEffect(() => {
    const onChange = () => {
      lastSent.current = null;
      send(pathname);
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
