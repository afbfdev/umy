"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  CURRENCIES,
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  isCurrencyCode,
  type CurrencyCode,
} from "@/lib/currency";
import type { Rates } from "@/lib/rates";

type CurrencyContextValue = {
  code: CurrencyCode;
  setCode: (code: CurrencyCode) => void;
  rates: Rates;
};

const STATIC_RATES = Object.fromEntries(
  (Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => [c, CURRENCIES[c].rate]),
) as Rates;

const CurrencyContext = createContext<CurrencyContextValue>({
  code: DEFAULT_CURRENCY,
  setCode: () => {},
  rates: STATIC_RATES,
});

function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function CurrencyProvider({
  children,
  rates,
}: {
  children: React.ReactNode;
  rates: Rates;
}) {
  // Défaut SSR-safe (= sortie serveur), puis hydratation depuis le cookie.
  const [code, setCodeState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    const saved = readCookie(CURRENCY_COOKIE);
    if (saved && isCurrencyCode(saved)) setCodeState(saved);
  }, []);

  function setCode(next: CurrencyCode) {
    setCodeState(next);
    writeCookie(CURRENCY_COOKIE, next);
  }

  return (
    <CurrencyContext.Provider value={{ code, setCode, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
