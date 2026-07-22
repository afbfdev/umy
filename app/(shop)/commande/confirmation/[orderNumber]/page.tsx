import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Truck } from "lucide-react";
import { getOrderByNumber } from "@/lib/data/orders";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/currency/price";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await getOrderByNumber(params.orderNumber);
  if (!order) notFound();

  return (
    <div className="container max-w-3xl py-16 md:py-24">
      {/* En-tête succès */}
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bordeaux text-cream-100">
          <Check className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <h1 className="mt-6 text-display-sm text-bordeaux">Merci {order.firstName} !</h1>
        <p className="mt-3 text-bordeaux/70">
          Votre commande est confirmée. Un récapitulatif a été envoyé à{" "}
          <span className="text-bordeaux">{order.email}</span>.
        </p>
        <p className="mt-4 inline-block rounded-full border border-border/70 px-5 py-2 text-sm tracking-[0.15em] text-bordeaux">
          {order.orderNumber}
        </p>
      </div>

      {/* Paiement à la livraison */}
      <div className="mt-10 flex items-start gap-3 rounded-[3px] border border-bordeaux/25 bg-nude/15 p-5">
        <Truck className="mt-0.5 h-5 w-5 text-bordeaux" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium text-bordeaux">Paiement à la livraison</p>
          <p className="mt-1 text-sm text-bordeaux/65">
            Réglez <Price cents={order.totalCents} /> en espèces ou par carte à la
            réception. Livraison sous 48 h.
          </p>
        </div>
      </div>

      {/* Détails */}
      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="eyebrow mb-3">Livraison</h2>
          <address className="text-sm not-italic leading-relaxed text-bordeaux/75">
            {order.firstName} {order.lastName}
            <br />
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
            <br />
            {order.phone}
          </address>
        </div>

        <div>
          <h2 className="eyebrow mb-3">Articles</h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="text-bordeaux/75">
                  {item.productName}
                  <span className="text-bordeaux/45">
                    {" "}
                    · {item.variantName} × {item.quantity}
                  </span>
                </span>
                <Price
                  cents={item.lineTotalCents}
                  className="whitespace-nowrap text-bordeaux"
                />
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-border/60 pt-4 text-sm">
            <div className="flex justify-between text-bordeaux/70">
              <dt>Sous-total</dt>
              <dd>
                <Price cents={order.subtotalCents} />
              </dd>
            </div>
            <div className="flex justify-between text-bordeaux/70">
              <dt>Livraison</dt>
              <dd>
                {order.shippingCents === 0 ? (
                  "Offerte"
                ) : (
                  <Price cents={order.shippingCents} />
                )}
              </dd>
            </div>
            <div className="flex justify-between pt-1 text-bordeaux">
              <dt className="font-medium">Total</dt>
              <dd className="font-serif text-lg">
                <Price cents={order.totalCents} />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/categories">Continuer mes achats</Link>
        </Button>
      </div>
    </div>
  );
}
