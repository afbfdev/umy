"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Price } from "@/components/currency/price";
import { Button } from "@/components/ui/button";
import { useCart, selectSubtotalCents, selectTotalItems } from "@/lib/store/cart";
import { useMounted } from "@/hooks/use-mounted";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { computeShippingCents } from "@/lib/shipping";

export function CartView() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const count = useCart(selectTotalItems);
  const subtotal = useCart(selectSubtotalCents);
  const clear = useCart((s) => s.clear);

  // Évite le flash de « panier vide » pendant l'hydratation du localStorage.
  if (!mounted) {
    return <div className="min-h-[40vh]" aria-hidden />;
  }

  const shipping = computeShippingCents(subtotal);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-5 text-center">
        <ShoppingBag className="h-10 w-10 text-bordeaux/25" strokeWidth={1.1} />
        <h1 className="font-serif text-2xl text-bordeaux">Votre panier est vide</h1>
        <p className="max-w-sm text-bordeaux/60">
          Parcourez nos univers pour composer votre sélection.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/categories">Découvrir la maison</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
      {/* Lignes */}
      <div>
        <div className="flex items-baseline justify-between border-b border-border/60 pb-4">
          <p className="text-sm uppercase tracking-[0.15em] text-bordeaux/60">
            {count} {count > 1 ? "articles" : "article"}
          </p>
          <button
            type="button"
            onClick={clear}
            className="text-xs uppercase tracking-[0.12em] text-bordeaux/50 transition-colors hover:text-bordeaux"
          >
            Vider le panier
          </button>
        </div>

        <div className="divide-y divide-border/60">
          {items.map((item) => (
            <CartLineItem key={item.variantId} item={item} />
          ))}
        </div>

        <Link
          href="/categories"
          className="mt-8 inline-flex items-center gap-2 text-sm text-bordeaux/70 transition-colors hover:text-bordeaux"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Continuer mes achats
        </Link>
      </div>

      {/* Récapitulatif */}
      <aside className="h-fit rounded-[3px] border border-border/60 bg-cream-50 p-7 lg:sticky lg:top-28">
        <h2 className="font-serif text-xl text-bordeaux">Récapitulatif</h2>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between text-bordeaux/70">
            <dt>Sous-total</dt>
            <dd>
              <Price cents={subtotal} />
            </dd>
          </div>
          <div className="flex justify-between text-bordeaux/70">
            <dt>Livraison</dt>
            <dd>{shipping === 0 ? "Offerte" : <Price cents={shipping} />}</dd>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-3 text-bordeaux">
            <dt className="font-medium">Total</dt>
            <dd className="font-serif text-lg">
              <Price cents={total} />
            </dd>
          </div>
        </dl>

        <Button size="lg" className="mt-7 w-full" asChild>
          <Link href="/commande">Passer la commande</Link>
        </Button>
        <p className="mt-3 text-center text-xs text-bordeaux/45">
          Paiement à la livraison · sans engagement.
        </p>
      </aside>
    </div>
  );
}
