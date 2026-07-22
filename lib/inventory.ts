/** En dessous (inclus) de ce total, le stock est considéré « faible ». */
export const LOW_STOCK_THRESHOLD = 10;

export type StockState = "in" | "low" | "out";

export function stockState(totalStock: number): StockState {
  if (totalStock <= 0) return "out";
  if (totalStock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export const STOCK_META: Record<StockState, { label: string; tone: "green" | "amber" | "red" }> = {
  in: { label: "En stock", tone: "green" },
  low: { label: "Stock faible", tone: "amber" },
  out: { label: "Rupture", tone: "red" },
};
