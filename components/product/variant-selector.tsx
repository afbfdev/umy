"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { useCartUI } from "@/lib/store/cart-ui";
import { Price } from "@/components/currency/price";

export type VariantOption = {
  id: string;
  name: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  stock: number;
  isDefault: boolean;
};

export function VariantSelector({
  productId,
  productName,
  productSlug,
  variants,
}: {
  productId: string;
  productName: string;
  productSlug: string;
  variants: VariantOption[];
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCartUI((s) => s.openCart);
  const [justAdded, setJustAdded] = useState(false);

  const initial = variants.findIndex((v) => v.isDefault && v.stock > 0);
  const [selectedId, setSelectedId] = useState(
    variants[initial === -1 ? 0 : initial]?.id ?? variants[0]?.id,
  );

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const soldOut = !selected || selected.stock <= 0;

  function handleAdd() {
    if (soldOut) return;
    addItem({
      variantId: selected.id,
      productId,
      productName,
      productSlug,
      variantName: selected.name,
      priceCents: selected.priceCents,
      currency: selected.currency,
      gradientSeed: productSlug,
      maxStock: selected.stock,
    });
    setJustAdded(true);
    openCart();
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="space-y-6">
      {/* Prix */}
      <div className="flex items-baseline gap-3">
        <Price
          cents={selected.priceCents}
          className="font-serif text-3xl text-bordeaux"
        />
        {selected.compareAtCents && selected.compareAtCents > selected.priceCents && (
          <Price
            cents={selected.compareAtCents}
            className="text-base text-bordeaux/40 line-through"
          />
        )}
      </div>

      {/* Déclinaisons */}
      {variants.length > 1 && (
        <div>
          <p className="eyebrow mb-3">Déclinaison</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const disabled = v.stock <= 0;
              const active = v.id === selectedId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedId(v.id)}
                  className={cn(
                    "rounded-[2px] border px-4 py-2.5 text-sm transition-all duration-200",
                    active
                      ? "border-bordeaux bg-bordeaux text-cream-100"
                      : "border-bordeaux/25 text-bordeaux hover:border-bordeaux/60",
                    disabled && "cursor-not-allowed opacity-40 line-through",
                  )}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Disponibilité */}
      <p className="text-sm text-bordeaux/60">
        {soldOut ? (
          "Temporairement épuisé"
        ) : selected.stock <= 5 ? (
          <span className="text-bordeaux">Plus que {selected.stock} en stock</span>
        ) : (
          "En stock · expédié sous 48 h"
        )}
      </p>

      {/* Action */}
      <Button
        size="lg"
        className="w-full sm:w-auto"
        disabled={soldOut}
        onClick={handleAdd}
      >
        {justAdded ? (
          <>
            <Check className="h-4 w-4" strokeWidth={1.8} />
            Ajouté au panier
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
            {soldOut ? "Indisponible" : "Ajouter au panier"}
          </>
        )}
      </Button>
    </div>
  );
}
