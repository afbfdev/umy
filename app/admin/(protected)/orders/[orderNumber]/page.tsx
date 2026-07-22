import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, Phone, MapPin, Truck } from "lucide-react";
import { getOrderByNumber } from "@/lib/data/orders";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { type OrderStatusValue } from "@/lib/orders";
import { StatusBadge } from "@/components/admin/status-badge";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await getOrderByNumber(params.orderNumber);
  if (!order) notFound();

  const status = order.status as OrderStatusValue;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-bordeaux/60 transition-colors hover:text-bordeaux"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
        Commandes
      </Link>

      {/* En-tête */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl text-bordeaux">
              {order.orderNumber}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-bordeaux/55">
            Passée le {formatDateTime(order.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-nude/25 px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-bordeaux">
          Paiement à la livraison
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Colonne principale */}
        <div className="space-y-6">
          {/* Articles */}
          <section className="overflow-hidden rounded-xl border border-border/70 bg-cream-50">
            <h2 className="border-b border-border/60 px-5 py-3.5 text-sm font-medium text-bordeaux">
              Articles ({order.items.length})
            </h2>
            <ul className="divide-y divide-border/50">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-bordeaux">
                      {item.productName}
                    </p>
                    <p className="text-xs text-bordeaux/50">
                      {item.variantName} · {formatPrice(item.unitPriceCents, order.currency)}{" "}
                      × {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-bordeaux">
                    {formatPrice(item.lineTotalCents, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-border/60 px-5 py-4 text-sm">
              <div className="flex justify-between text-bordeaux/70">
                <dt>Sous-total</dt>
                <dd>{formatPrice(order.subtotalCents, order.currency)}</dd>
              </div>
              <div className="flex justify-between text-bordeaux/70">
                <dt>Livraison</dt>
                <dd>
                  {order.shippingCents === 0
                    ? "Offerte"
                    : formatPrice(order.shippingCents, order.currency)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2 font-medium text-bordeaux">
                <dt>Total</dt>
                <dd className="font-serif text-lg">
                  {formatPrice(order.totalCents, order.currency)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Gestion du statut */}
          <section className="rounded-xl border border-border/70 bg-cream-50 p-5">
            <h2 className="mb-4 text-sm font-medium text-bordeaux">
              Gérer la commande
            </h2>
            <OrderStatusForm orderNumber={order.orderNumber} status={status} />
          </section>
        </div>

        {/* Colonne latérale */}
        <aside className="space-y-6">
          {/* Client */}
          <section className="rounded-xl border border-border/70 bg-cream-50 p-5">
            <h2 className="mb-3 text-sm font-medium text-bordeaux">Client</h2>
            <p className="text-sm font-medium text-bordeaux">
              {order.firstName} {order.lastName}
            </p>
            <div className="mt-3 space-y-2 text-sm text-bordeaux/70">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-bordeaux/40" strokeWidth={1.5} />
                <a href={`mailto:${order.email}`} className="hover:text-bordeaux">
                  {order.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-bordeaux/40" strokeWidth={1.5} />
                <a href={`tel:${order.phone}`} className="hover:text-bordeaux">
                  {order.phone}
                </a>
              </p>
            </div>
          </section>

          {/* Livraison */}
          <section className="rounded-xl border border-border/70 bg-cream-50 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-bordeaux">
              <MapPin className="h-4 w-4 text-bordeaux/50" strokeWidth={1.5} />
              Adresse de livraison
            </h2>
            <address className="text-sm not-italic leading-relaxed text-bordeaux/75">
              {order.address}
              {order.addressLine2 && (
                <>
                  <br />
                  {order.addressLine2}
                </>
              )}
              <br />
              {order.postalCode} {order.city}
              <br />
              {order.country}
            </address>
            {order.notes && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-nude/15 p-3 text-xs text-bordeaux/70">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-bordeaux/50" strokeWidth={1.5} />
                <span>{order.notes}</span>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
