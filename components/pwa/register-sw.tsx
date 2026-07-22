"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* enregistrement échoué — l'app fonctionne sans SW */
      });
    }
  }, []);

  return null;
}
