"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { placeholderGradient } from "@/lib/visuals";
import { Price } from "@/components/currency/price";
import { useCart, type CartItem } from "@/lib/store/cart";
import { QuantityStepper } from "@/components/cart/quantity-stepper";

export function CartLineItem({
  item,
  onNavigate,
}: {
  item: CartItem;
  /** Appelé au clic sur le produit (ex. fermer le tiroir). */
  onNavigate?: () => void;
}) {
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-5">
      {/* Vignette */}
      <Link
        href={`/produits/${item.productSlug}`}
        onClick={onNavigate}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[2px]"
        style={{ background: placeholderGradient(item.gradientSeed) }}
        aria-label={item.productName}
      >
        <span className="absolute inset-0 flex items-center justify-center font-serif text-xs text-cream-100/50">
          UMY
        </span>
      </Link>

      {/* Détails */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div>
            <Link
              href={`/produits/${item.productSlug}`}
              onClick={onNavigate}
              className="font-serif text-base leading-tight text-bordeaux hover:opacity-70"
            >
              {item.productName}
            </Link>
            <p className="mt-0.5 text-xs text-bordeaux/50">{item.variantName}</p>
          </div>
          <button
            type="button"
            aria-label="Retirer du panier"
            onClick={() => removeItem(item.variantId)}
            className="h-fit text-bordeaux/40 transition-colors hover:text-bordeaux"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            value={item.quantity}
            max={item.maxStock}
            onChange={(q) => setQuantity(item.variantId, q)}
          />
          <Price
            cents={item.priceCents * item.quantity}
            className="text-sm text-bordeaux"
          />
        </div>
      </div>
    </div>
  );
}
