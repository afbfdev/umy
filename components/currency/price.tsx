"use client";

import { formatMoney } from "@/lib/currency";
import { useCurrency } from "@/components/currency/currency-provider";

/**
 * Affiche un montant stocké en **centimes d'euro**, converti et formaté
 * dans la devise choisie par le visiteur.
 */
export function Price({
  cents,
  className,
}: {
  cents: number;
  className?: string;
}) {
  const { code, rates } = useCurrency();
  return <span className={className}>{formatMoney(cents, code, rates[code])}</span>;
}
