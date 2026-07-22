"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  priceCents: number;
  currency: string;
  /** Clé pour le dégradé placeholder (slug produit). */
  gradientSeed: string;
  quantity: number;
  /** Stock disponible au moment de l'ajout (borne la quantité). */
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === item.variantId,
          );
          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              item.maxStock,
            );
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: nextQty }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(quantity, item.maxStock) },
            ],
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      setQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) =>
                  i.variantId === variantId
                    ? { ...i, quantity: Math.min(quantity, i.maxStock) }
                    : i,
                ),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: "umy-cart", version: 1 },
  ),
);

/* ── Sélecteurs dérivés (renvoient des primitives → pas de re-render inutile) ── */

export const selectTotalItems = (s: CartState): number =>
  s.items.reduce((n, i) => n + i.quantity, 0);

export const selectSubtotalCents = (s: CartState): number =>
  s.items.reduce((n, i) => n + i.priceCents * i.quantity, 0);
