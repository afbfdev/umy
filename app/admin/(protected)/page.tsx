import Link from "next/link";
import { ArrowUpRight, AlertTriangle, PackageX, BarChart3 } from "lucide-react";
import { getOrderStats, getOrders } from "@/lib/data/orders";
import { getInventoryStats, getAnalyticsStats } from "@/lib/data/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_META, type OrderStatusValue } from "@/lib/orders";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminDashboardPage() {
  const [stats, recent, inventory, audience] = await Promise.all([
    getOrderStats(),
    getOrders({ perPage: 6 }),
    getInventoryStats(),
    getAnalyticsStats(),
  ]);

  const activeStatuses: OrderStatusValue[] = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-bordeaux/50">
          Vue d'ensemble
        </p>
        <h1 className="mt-1 font-serif text-3xl text-bordeaux">Tableau de bord</h1>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Chiffre d'affaires"
          value={formatPrice(stats.revenueCents)}
          hint="Hors commandes annulées"
          accent
        />
        <StatCard label="Commandes" value={String(stats.totalOrders)} hint="Total" />
        <StatCard
          label="À traiter"
          value={String(stats.counts.PENDING)}
          hint="En attente"
        />
        <StatCard
          label="Expédiées"
          value={String(stats.counts.SHIPPED)}
          hint="En cours de livraison"
        />
      </div>

      {/* Alerte stock */}
      {(inventory.outOfStock > 0 || inventory.lowStock > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/products?stock=out"
            className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 transition-colors hover:bg-red-100/70"
          >
            <PackageX className="h-6 w-6 text-red-600" strokeWidth={1.6} />
            <div>
              <p className="font-serif text-2xl text-red-700">{inventory.outOfStock}</p>
              <p className="text-xs text-red-700/70">produit(s) en rupture</p>
            </div>
          </Link>
          <Link
            href="/admin/products?stock=low"
            className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 transition-colors hover:bg-amber-100/70"
          >
            <AlertTriangle className="h-6 w-6 text-amber-600" strokeWidth={1.6} />
            <div>
              <p className="font-serif text-2xl text-amber-700">{inventory.lowStock}</p>
              <p className="text-xs text-amber-700/70">produit(s) en stock faible</p>
            </div>
          </Link>
        </div>
      )}

      {/* Répartition par statut */}
      <section className="rounded-xl border border-border/70 bg-cream-50 p-5">
        <h2 className="mb-4 text-sm font-medium text-bordeaux">
          Répartition par statut
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {activeStatuses.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <StatusBadge status={s} />
              <span className="text-sm text-bordeaux/70">{stats.counts[s]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Audience (mesure first-party, conditionnée au consentement) */}
      <section className="rounded-xl border border-border/70 bg-cream-50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-medium text-bordeaux">
            <BarChart3 className="h-4 w-4 text-bordeaux/60" strokeWidth={1.7} />
            Audience · 7 derniers jours
          </h2>
          <span className="font-serif text-2xl text-bordeaux">
            {audience.last7Days}
            <span className="ml-1 text-xs font-sans text-bordeaux/45">vues</span>
          </span>
        </div>
        {audience.top.length === 0 ? (
          <p className="text-sm text-bordeaux/55">
            Aucune vue mesurée. La collecte ne s'active que pour les visiteurs
            ayant accepté la mesure d'audience.
          </p>
        ) : (
          <ul className="space-y-2">
            {audience.top.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate font-mono text-xs text-bordeaux/70">{p.path}</span>
                <span className="shrink-0 text-bordeaux">{p.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Commandes récentes */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-bordeaux">Commandes récentes</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-bordeaux/70 hover:text-bordeaux"
          >
            Tout voir
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
          </Link>
        </div>

        {recent.orders.length === 0 ? (
          <p className="rounded-xl border border-border/70 bg-cream-50 p-6 text-sm text-bordeaux/60">
            Aucune commande pour l'instant.
          </p>
        ) : (
          <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70 bg-cream-50">
            {recent.orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.orderNumber}`}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-nude/15"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-bordeaux">
                      {o.firstName} {o.lastName}
                    </p>
                    <p className="text-xs text-bordeaux/50">
                      {o.orderNumber} · {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <StatusBadge status={o.status as OrderStatusValue} />
                    <span className="text-sm text-bordeaux">
                      {formatPrice(o.totalCents, o.currency)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
