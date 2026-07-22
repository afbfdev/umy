import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        accent
          ? "border-bordeaux/20 bg-bordeaux text-cream-100"
          : "border-border/70 bg-cream-50",
      )}
    >
      <p
        className={cn(
          "text-xs uppercase tracking-[0.12em]",
          accent ? "text-cream-100/70" : "text-bordeaux/50",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-serif text-3xl",
          accent ? "text-cream-50" : "text-bordeaux",
        )}
      >
        {value}
      </p>
      {hint && (
        <p
          className={cn(
            "mt-1 text-xs",
            accent ? "text-cream-100/60" : "text-bordeaux/45",
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
