import { cn } from "@/lib/utils";
import { ORDER_STATUS_META, type OrderStatusValue, type StatusTone } from "@/lib/orders";

const TONE_CLASSES: Record<StatusTone, string> = {
  amber: "bg-amber-100 text-amber-800 ring-amber-600/20",
  blue: "bg-blue-100 text-blue-800 ring-blue-600/20",
  violet: "bg-violet-100 text-violet-800 ring-violet-600/20",
  green: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  red: "bg-red-100 text-red-800 ring-red-600/20",
};

const DOT_CLASSES: Record<StatusTone, string> = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  green: "bg-emerald-500",
  red: "bg-red-500",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatusValue;
  className?: string;
}) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[meta.tone],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASSES[meta.tone])} />
      {meta.label}
    </span>
  );
}
