"use client";

import { useEffect, useState } from "react";

/**
 * Retourne `true` dès que la page est défilée au-delà du seuil donné.
 * Utile pour condenser la barre de navigation au scroll.
 */
export function useScrolled(threshold: number = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
