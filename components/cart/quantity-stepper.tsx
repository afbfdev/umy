"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  max,
  min = 1,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  min?: number;
  className?: string;
}) {
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  return (
    <div
      className={cn(
        "inline-flex items-center border border-border/70",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Diminuer la quantité"
        disabled={!canDecrease}
        onClick={() => onChange(value - 1)}
        className="flex h-9 w-9 items-center justify-center text-bordeaux transition-colors hover:bg-nude/40 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={1.6} />
      </button>
      <span className="w-9 text-center text-sm tabular-nums text-bordeaux">
        {value}
      </span>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        disabled={!canIncrease}
        onClick={() => onChange(value + 1)}
        className="flex h-9 w-9 items-center justify-center text-bordeaux transition-colors hover:bg-nude/40 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
      </button>
    </div>
  );
}
