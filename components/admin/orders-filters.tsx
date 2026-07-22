import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES, ORDER_STATUS_META, type OrderStatusValue } from "@/lib/orders";

function buildHref(status?: OrderStatusValue, query?: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

export function OrdersFilters({
  status,
  query,
}: {
  status?: OrderStatusValue;
  query?: string;
}) {
  const tabs: { label: string; value?: OrderStatusValue }[] = [
    { label: "Toutes" },
    ...ORDER_STATUSES.map((s) => ({ label: ORDER_STATUS_META[s].label, value: s })),
  ];

  return (
    <div className="space-y-4">
      {/* Recherche */}
      <form action="/admin/orders" method="get" className="relative max-w-md">
        {status && <input type="hidden" name="status" value={status} />}
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bordeaux/40"
          strokeWidth={1.5}
        />
        <input
          type="search"
          name="q"
          defaultValue={query ?? ""}
          placeholder="Référence, nom, e-mail, ville…"
          className="w-full rounded-lg border border-border/70 bg-cream-50 py-2.5 pl-9 pr-3 text-sm text-bordeaux outline-none transition-colors placeholder:text-bordeaux/35 focus:border-bordeaux"
        />
      </form>

      {/* Onglets de statut */}
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const active = status === tab.value || (!status && !tab.value);
          return (
            <Link
              key={tab.label}
              href={buildHref(tab.value, query)}
              className={cn(
                "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                active
                  ? "border-bordeaux bg-bordeaux text-cream-100"
                  : "border-border/70 text-bordeaux/70 hover:border-bordeaux/50 hover:text-bordeaux",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
