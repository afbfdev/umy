export const CONSENT_KEY = "umy-cookie-consent";
export const OPEN_PREFS_EVENT = "umy:open-cookie-preferences";
export const CONSENT_CHANGED_EVENT = "umy:consent-changed";

export type Consent = {
  /** Toujours vrai — cookies indispensables au fonctionnement. */
  essential: true;
  /** Mesure d'audience (inactive aujourd'hui, choix respecté à l'avenir). */
  analytics: boolean;
  ts: number;
};

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): Consent {
  const consent: Consent = { essential: true, analytics, ts: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: consent }));
  } catch {
    /* stockage indisponible — on ignore silencieusement */
  }
  return consent;
}

/** Rouvre le gestionnaire de préférences (depuis le footer par ex.). */
export function openCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_PREFS_EVENT));
  }
}
