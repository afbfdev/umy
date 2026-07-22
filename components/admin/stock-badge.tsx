import { cn } from "@/lib/utils";
import { stockState, STOCK_META } from "@/lib/inventory";

const TONE: Record<"green" | "amber" | "red", string> = {
  green: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  amber: "bg-amber-100 text-amber-800 ring-amber-600/20",
  red: "bg-red-100 text-red-800 ring-red-600/20",
};

export function StockBadge({
  total,
  className,
}: {
  total: number;
  className?: string;
}) {
  const meta = STOCK_META[stockState(total)];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONE[meta.tone],
        className,
      )}
    >
      {meta.label}
      <span className="opacity-60">· {total}</span>
    </span>
  );
}
