import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre panier — UMY, le concept store en ligne.",
};

export default function CartPage() {
  return (
    <div className="container py-16 md:py-20">
      <header className="mb-10">
        <p className="eyebrow">Votre sélection</p>
        <h1 className="mt-3 text-display-sm text-bordeaux">Panier</h1>
      </header>
      <CartView />
    </div>
  );
}
