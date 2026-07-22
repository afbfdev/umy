import { CURRENCIES, type CurrencyCode } from "@/lib/currency";

export type Rates = Record<CurrencyCode, number>;

/** Taux statiques utilisés en repli si l'API est indisponible. */
const FALLBACK: Rates = Object.fromEntries(
  (Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => [c, CURRENCIES[c].rate]),
) as Rates;

const API = "https://open.er-api.com/v6/latest/EUR";

/**
 * Taux de change EUR → devise, récupérés en direct et **mis en cache 1 h**
 * (Next Data Cache, tag `fx-rates`). Repli automatique sur les taux statiques
 * en cas d'échec réseau ou de réponse invalide.
 */
export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch(API, {
      next: { revalidate: 3600, tags: ["fx-rates"] },
      // Ne jamais bloquer le rendu : si l'API tarde, on retombe sur le statique.
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as {
      result?: string;
      rates?: Record<string, number>;
    };
    if (data.result !== "success" || !data.rates) return FALLBACK;

    const out: Rates = { ...FALLBACK };
    for (const code of Object.keys(FALLBACK) as CurrencyCode[]) {
      const v = data.rates[code];
      if (typeof v === "number" && v > 0) out[code] = v;
    }
    out.EUR = 1;
    return out;
  } catch {
    return FALLBACK;
  }
}
