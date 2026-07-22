import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Commande",
  description: "Finalisez votre commande — paiement à la livraison.",
};

export default function CommandePage() {
  return (
    <div className="container py-16 md:py-20">
      <nav className="mb-8 text-xs uppercase tracking-[0.15em] text-bordeaux/50">
        <Link href="/panier" className="hover:text-bordeaux">
          Panier
        </Link>
        <span className="mx-2">/</span>
        <span className="text-bordeaux">Commande</span>
      </nav>

      <header className="mb-10">
        <p className="eyebrow">Finaliser</p>
        <h1 className="mt-3 text-display-sm text-bordeaux">Votre commande</h1>
      </header>

      <CheckoutForm />
    </div>
  );
}
