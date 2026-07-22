"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCIES, CURRENCY_LIST } from "@/lib/currency";
import { useCurrency } from "@/components/currency/currency-provider";

export function CurrencySwitcher() {
  const { code, setCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = CURRENCIES[code];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choisir la devise"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-bordeaux transition-colors hover:bg-nude/30"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-medium">{current.code}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-bordeaux/50 transition-transform", open && "rotate-180")}
          strokeWidth={1.6}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border/70 bg-cream-50 py-1 shadow-2xl shadow-bordeaux/10"
        >
          {CURRENCY_LIST.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                role="option"
                aria-selected={c.code === code}
                onClick={() => {
                  setCode(c.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-nude/20",
                  c.code === code ? "text-bordeaux" : "text-bordeaux/75",
                )}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1">
                  <span className="block font-medium">{c.label}</span>
                  <span className="block text-xs text-bordeaux/45">{c.code}</span>
                </span>
                {c.code === code && (
                  <Check className="h-4 w-4 text-bordeaux" strokeWidth={1.8} />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
