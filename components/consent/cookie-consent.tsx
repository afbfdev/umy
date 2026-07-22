"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import {
  readConsent,
  writeConsent,
  OPEN_PREFS_EVENT,
} from "@/lib/consent";

export function CookieConsent() {
  const mounted = useMounted();
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    // Première visite (aucun choix mémorisé) → afficher la bannière.
    if (!readConsent()) setVisible(true);

    // Réouverture depuis le footer.
    const open = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setShowPrefs(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_PREFS_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, open);
  }, []);

  function decide(analyticsChoice: boolean) {
    writeConsent(analyticsChoice);
    setVisible(false);
    setShowPrefs(false);
  }

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border/70 bg-cream-50 p-5 shadow-2xl shadow-bordeaux/10 sm:p-6">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 hidden h-6 w-6 shrink-0 text-bordeaux/60 sm:block" strokeWidth={1.5} />
          <div className="flex-1">
            <h2 className="font-serif text-lg text-bordeaux">Cookies &amp; confidentialité</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-bordeaux/70">
              Nous utilisons uniquement des cookies strictement nécessaires au bon
              fonctionnement du site. Aucun traceur publicitaire.{" "}
              <Link href="/cookies" className="text-bordeaux underline">
                En savoir plus
              </Link>
              .
            </p>

            {showPrefs && (
              <div className="mt-4 space-y-3 rounded-lg border border-border/60 bg-cream-100/60 p-4">
                <label className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium text-bordeaux">
                      Strictement nécessaires
                    </span>
                    <span className="block text-xs text-bordeaux/55">
                      Session, panier — indispensables.
                    </span>
                  </span>
                  <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-[#4A141C]" />
                </label>
                <label className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium text-bordeaux">
                      Mesure d'audience
                    </span>
                    <span className="block text-xs text-bordeaux/55">
                      Aucune active aujourd'hui — votre choix sera respecté.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#4A141C]"
                  />
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => decide(true)}
                className="rounded-lg bg-bordeaux px-5 py-2.5 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900"
              >
                Tout accepter
              </button>
              {showPrefs ? (
                <button
                  type="button"
                  onClick={() => decide(analytics)}
                  className="rounded-lg border border-bordeaux/40 px-5 py-2.5 text-sm font-medium text-bordeaux transition-colors hover:border-bordeaux"
                >
                  Enregistrer mes choix
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => decide(false)}
                  className="rounded-lg border border-bordeaux/40 px-5 py-2.5 text-sm font-medium text-bordeaux transition-colors hover:border-bordeaux"
                >
                  Refuser l'optionnel
                </button>
              )}
              {!showPrefs && (
                <button
                  type="button"
                  onClick={() => setShowPrefs(true)}
                  className={cn(
                    "text-sm text-bordeaux/60 underline-offset-2 hover:text-bordeaux hover:underline",
                  )}
                >
                  Personnaliser
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
