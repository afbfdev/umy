export type CurrencyCode = "EUR" | "MAD" | "XOF" | "GBP" | "USD";

export type CurrencyConfig = {
  code: CurrencyCode;
  label: string;
  flag: string;
  locale: string;
  /** Taux de conversion depuis l'euro (base). Démo — à remplacer par une API FX. */
  rate: number;
};

/** Devise de base dans laquelle les prix sont stockés. */
export const BASE_CURRENCY: CurrencyCode = "EUR";
export const DEFAULT_CURRENCY: CurrencyCode = "EUR";
export const CURRENCY_COOKIE = "umy-currency";

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: { code: "EUR", label: "Euro", flag: "🇫🇷", locale: "fr-FR", rate: 1 },
  MAD: { code: "MAD", label: "Dirham marocain", flag: "🇲🇦", locale: "fr-MA", rate: 10.85 },
  XOF: { code: "XOF", label: "Franc CFA", flag: "🇸🇳", locale: "fr-SN", rate: 655.957 },
  GBP: { code: "GBP", label: "Livre sterling", flag: "🇬🇧", locale: "en-GB", rate: 0.85 },
  USD: { code: "USD", label: "Dollar US", flag: "🇺🇸", locale: "en-US", rate: 1.08 },
};

export const CURRENCY_LIST: CurrencyConfig[] = Object.values(CURRENCIES);

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCIES;
}

/**
 * Formate un montant stocké en **centimes d'euro** vers la devise choisie.
 * `rate` = taux EUR→devise (live) ; à défaut, le taux statique de la config.
 */
export function formatMoney(
  baseCents: number,
  code: CurrencyCode,
  rate?: number,
): string {
  const cfg = CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY];
  const amount = (baseCents / 100) * (rate ?? cfg.rate);
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.code,
  }).format(amount);
}
