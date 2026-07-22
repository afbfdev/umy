"use client";

import { create } from "zustand";

/** État d'ouverture du tiroir panier (indépendant du contenu). */
type CartUIState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
};

export const useCartUI = create<CartUIState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  openCart: () => set({ open: true }),
  closeCart: () => set({ open: false }),
}));
