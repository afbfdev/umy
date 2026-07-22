import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getOrders } from "@/lib/data/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { isOrderStatus, type OrderStatusValue } from "@/lib/orders";
import { StatusBadge } from "@/components/admin/status-badge";
import { OrdersFilters } from "@/components/admin/orders-filters";
import { Pagination } from "@/components/admin/pagination";

const PER_PAGE = 10;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string; page?: string };
}) {
  const status: OrderStatusValue | undefined =
    searchParams.status && isOrderStatus(searchParams.status)
      ? searchParams.status
      : undefined;
  const query = searchParams.q?.trim() || undefined;
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const { orders, total, pages } = await getOrders({
    status,
    query,
    page,
    perPage: PER_PAGE,
  });

  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-bordeaux/50">
            Gestion
          </p>
          <h1 className="mt-1 font-serif text-3xl text-bordeaux">Commandes</h1>
        </div>
        <p className="text-sm text-bordeaux/55">
          {total} résultat{total > 1 ? "s" : ""}
        </p>
      </header>

      <OrdersFilters status={status} query={query} />

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-cream-50 p-10 text-center text-sm text-bordeaux/60">
          Aucune commande ne correspond à ces critères.
        </div>
      ) : (
        <>
          {/* Tableau — desktop */}
          <div className="hidden overflow-hidden rounded-xl border border-border/70 bg-cream-50 md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-[0.1em] text-bordeaux/45">
                  <th className="px-4 py-3 font-medium">Référence</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Articles</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="group transition-colors hover:bg-nude/15"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${o.orderNumber}`}
                        className="font-medium text-bordeaux hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-bordeaux/80">
                      {o.firstName} {o.lastName}
                      <span className="block text-xs text-bordeaux/45">
                        {o.city}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-bordeaux/70">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-bordeaux/70">
                      {o._count.items}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status as OrderStatusValue} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-bordeaux">
                      {formatPrice(o.totalCents, o.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${o.orderNumber}`}
                        aria-label="Voir la commande"
                        className="inline-flex text-bordeaux/40 transition-colors group-hover:text-bordeaux"
                      >
                        <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cartes — mobile */}
          <ul className="space-y-3 md:hidden">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.orderNumber}`}
                  className="block rounded-xl border border-border/70 bg-cream-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-bordeaux">
                        {o.firstName} {o.lastName}
                      </p>
                      <p className="mt-0.5 text-xs text-bordeaux/50">
                        {o.orderNumber}
                      </p>
                    </div>
                    <StatusBadge status={o.status as OrderStatusValue} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-bordeaux/55">
                      {formatDate(o.createdAt)} · {o._count.items} article
                      {o._count.items > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium text-bordeaux">
                      {formatPrice(o.totalCents, o.currency)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <Pagination page={page} pages={pages} makeHref={makeHref} />
        </>
      )}
    </div>
  );
}
