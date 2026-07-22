"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Search, XCircle } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_META, type OrderStatusValue } from "@/lib/orders";
import { StatusBadge } from "@/components/admin/status-badge";
import { trackOrder, type TrackedOrder } from "@/lib/actions/track-order";

const FLOW: OrderStatusValue[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export function OrderTracker() {
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await trackOrder(ref, email);
      if (res.ok) setOrder(res.order);
      else {
        setOrder(null);
        setError(res.error);
      }
    });
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-bordeaux/60">
              Référence de commande
            </span>
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="UMY-XXXXXX"
              className="w-full rounded-lg border border-border/70 bg-cream-50 px-3.5 py-2.5 text-sm uppercase text-bordeaux outline-none placeholder:text-bordeaux/35 focus:border-bordeaux"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-bordeaux/60">
              E-mail
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full rounded-lg border border-border/70 bg-cream-50 px-3.5 py-2.5 text-sm text-bordeaux outline-none placeholder:text-bordeaux/35 focus:border-bordeaux"
            />
          </label>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" strokeWidth={1.7} />
          )}
          Suivre ma commande
        </Button>
      </form>

      {order && <OrderResult order={order} />}
    </div>
  );
}

function OrderResult({ order }: { order: TrackedOrder }) {
  const cancelled = order.status === "CANCELLED";
  const currentIndex = FLOW.indexOf(order.status);

  return (
    <div className="rounded-2xl border border-border/70 bg-cream-50 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-serif text-2xl text-bordeaux">{order.orderNumber}</p>
          <p className="mt-1 text-sm text-bordeaux/55">Passée le {order.placedAt}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Frise de statut */}
      {cancelled ? (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle className="h-5 w-5 shrink-0" strokeWidth={1.6} />
          Cette commande a été annulée. Contactez-nous pour toute question.
        </div>
      ) : (
        <ol className="mt-8 grid grid-cols-4 gap-2">
          {FLOW.map((step, i) => {
            const done = i <= currentIndex;
            const active = i === currentIndex;
            return (
              <li key={step} className="flex flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <span
                    className={cn(
                      "h-0.5 flex-1",
                      i === 0 ? "opacity-0" : done ? "bg-bordeaux" : "bg-border",
                    )}
                  />
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs",
                      done
                        ? "border-bordeaux bg-bordeaux text-cream-100"
                        : "border-border bg-cream-50 text-bordeaux/40",
                      active && "ring-2 ring-bordeaux/20",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={2} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "h-0.5 flex-1",
                      i === FLOW.length - 1
                        ? "opacity-0"
                        : i < currentIndex
                          ? "bg-bordeaux"
                          : "bg-border",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "mt-2 text-[0.7rem] leading-tight",
                    active ? "font-medium text-bordeaux" : "text-bordeaux/55",
                  )}
                >
                  {ORDER_STATUS_META[step].label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {/* Articles */}
      <ul className="mt-8 space-y-3 border-t border-border/60 pt-6">
        {order.items.map((i, idx) => (
          <li key={idx} className="flex justify-between gap-3 text-sm">
            <span className="text-bordeaux/75">
              {i.productName}
              <span className="text-bordeaux/45">
                {" "}
                · {i.variantName} × {i.quantity}
              </span>
            </span>
            <span className="whitespace-nowrap text-bordeaux">
              {formatPrice(i.lineTotalCents, order.currency)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1.5 border-t border-border/60 pt-4 text-sm">
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
        <div className="flex justify-between pt-1 text-bordeaux">
          <dt className="font-medium">Total</dt>
          <dd className="font-serif text-lg">
            {formatPrice(order.totalCents, order.currency)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
