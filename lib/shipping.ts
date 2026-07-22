/** Seuil de livraison offerte (centimes). */
export const FREE_SHIPPING_CENTS = 8000; // 80 €
/** Frais de livraison standard (centimes). */
export const STANDARD_SHIPPING_CENTS = 690; // 6,90 €

/** Frais de port en fonction du sous-total. */
export function computeShippingCents(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
}
