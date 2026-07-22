"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Price } from "@/components/currency/price";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart, selectSubtotalCents, selectTotalItems } from "@/lib/store/cart";
import { useCartUI } from "@/lib/store/cart-ui";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { FREE_SHIPPING_CENTS } from "@/lib/shipping";

export function CartSheet() {
  const open = useCartUI((s) => s.open);
  const setOpen = useCartUI((s) => s.setOpen);
  const closeCart = useCartUI((s) => s.closeCart);

  const items = useCart((s) => s.items);
  const count = useCart(selectTotalItems);
  const subtotal = useCart(selectSubtotalCents);

  const remaining = Math.max(0, FREE_SHIPPING_CENTS - subtotal);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Votre panier{count > 0 ? ` · ${count}` : ""}</SheetTitle>
          <SheetDescription className="sr-only">
            Contenu de votre panier et récapitulatif de commande.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-8 w-8 text-bordeaux/30" strokeWidth={1.2} />
            <p className="text-bordeaux/60">Votre panier est vide.</p>
            <Button variant="outline" onClick={closeCart} asChild>
              <Link href="/categories">Découvrir nos univers</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Liste défilante */}
            <div className="flex-1 divide-y divide-border/60 overflow-y-auto px-6">
              {items.map((item) => (
                <CartLineItem
                  key={item.variantId}
                  item={item}
                  onNavigate={closeCart}
                />
              ))}
            </div>

            {/* Récapitulatif */}
            <div className="border-t border-border/60 px-6 py-5">
              {remaining > 0 ? (
                <p className="mb-4 text-xs text-bordeaux/60">
                  Plus que{" "}
                  <Price cents={remaining} className="text-bordeaux" />{" "}
                  pour la livraison offerte.
                </p>
              ) : (
                <p className="mb-4 text-xs text-bordeaux">
                  ✓ Livraison offerte débloquée.
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.12em] text-bordeaux/60">
                  Sous-total
                </span>
                <Price cents={subtotal} className="font-serif text-xl text-bordeaux" />
              </div>
              <p className="mt-1 text-xs text-bordeaux/45">
                Taxes incluses. Livraison calculée à l'étape suivante.
              </p>

              <Button size="lg" className="mt-5 w-full" asChild>
                <Link href="/panier" onClick={closeCart}>
                  Voir le panier
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
