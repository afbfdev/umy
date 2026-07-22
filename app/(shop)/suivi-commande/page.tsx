import type { Metadata } from "next";
import Link from "next/link";
import { OrderTracker } from "@/components/orders/order-tracker";

export const metadata: Metadata = {
  title: "Suivi de commande",
  description: "Suivez l'état de votre commande UMY avec votre référence.",
};

export default function SuiviCommandePage() {
  return (
    <div className="container py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">Service client</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">Suivi de commande</h1>
        <p className="mt-5 leading-relaxed text-bordeaux/70">
          Renseignez la référence reçue par e-mail (UMY-XXXXXX) ainsi que votre
          adresse e-mail pour consulter l'état de votre commande.
        </p>
      </header>

      <OrderTracker />

      <p className="mt-12 max-w-2xl text-sm text-bordeaux/60">
        Vous n'avez pas votre référence ?{" "}
        <Link href="/contact" className="text-bordeaux underline">
          Contactez-nous
        </Link>
        .
      </p>
    </div>
  );
}
