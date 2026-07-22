"use client";

import { ShoppingBag } from "lucide-react";
import { useCart, selectTotalItems } from "@/lib/store/cart";
import { useCartUI } from "@/lib/store/cart-ui";
import { useMounted } from "@/hooks/use-mounted";

export function CartIconButton() {
  const openCart = useCartUI((s) => s.openCart);
  const count = useCart(selectTotalItems);
  const mounted = useMounted();

  return (
    <button
      type="button"
      aria-label={`Panier${mounted && count > 0 ? ` (${count} articles)` : ""}`}
      onClick={openCart}
      className="relative text-bordeaux transition-opacity hover:opacity-60"
    >
      <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bordeaux text-[0.6rem] font-medium text-cream-100">
        {mounted ? count : 0}
      </span>
    </button>
  );
}
