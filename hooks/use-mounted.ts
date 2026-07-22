"use client";

import { useEffect, useState } from "react";

/**
 * `false` au premier rendu (SSR + hydratation), `true` ensuite.
 * Évite les décalages d'hydratation pour tout ce qui dépend du
 * localStorage (panier persistant).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
