import type { Metadata } from "next";
import Link from "next/link";
import { Truck, PackageCheck, RotateCcw, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description: "Modalités de livraison et politique de retour de la maison UMY.",
};

const highlights = [
  { icon: Truck, title: "Livraison offerte", text: "Dès 80 € d'achat en France métropolitaine." },
  { icon: Clock, title: "Expédition 48 h", text: "Vos commandes partent sous 48 h ouvrées." },
  { icon: RotateCcw, title: "Retours 30 jours", text: "Articles non ouverts, en parfait état." },
];

export default function LivraisonPage() {
  return (
    <div className="container py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">Service client</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">Livraison &amp; retours</h1>
      </header>

      {/* Points clés */}
      <div className="mb-14 grid gap-4 sm:grid-cols-3">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.title}
              className="rounded-xl border border-border/70 bg-cream-50 p-5"
            >
              <Icon className="h-6 w-6 text-bordeaux" strokeWidth={1.5} />
              <h2 className="mt-3 font-serif text-lg text-bordeaux">{h.title}</h2>
              <p className="mt-1 text-sm text-bordeaux/65">{h.text}</p>
            </div>
          );
        })}
      </div>

      <div className="mx-auto max-w-3xl space-y-12">
        <section>
          <h2 className="font-serif text-2xl text-bordeaux">Livraison</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-bordeaux/75">
            <p>
              Les commandes sont préparées et expédiées sous <strong>48 h ouvrées</strong>.
              Le délai d'acheminement est ensuite de 2 à 4 jours ouvrés en France
              métropolitaine.
            </p>
            <ul className="space-y-2 border-l-2 border-nude pl-4">
              <li>Livraison standard : <strong>6,90 €</strong> — offerte dès 80 €.</li>
              <li>Un e-mail de confirmation avec votre référence vous est envoyé à la validation.</li>
              <li>Paiement à la livraison : réglez en espèces ou par carte à la réception.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl text-bordeaux">
            <PackageCheck className="h-5 w-5 text-bordeaux/60" strokeWidth={1.6} />
            Retours &amp; échanges
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-bordeaux/75">
            <p>
              Vous disposez de <strong>30 jours</strong> à compter de la réception
              pour nous retourner un article <strong>non ouvert et en parfait
              état</strong>, dans son emballage d'origine.
            </p>
            <p>Pour initier un retour :</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>
                Contactez-nous via la page{" "}
                <Link href="/contact" className="text-bordeaux underline">
                  Contact
                </Link>{" "}
                en précisant votre référence de commande.
              </li>
              <li>Nous vous communiquons l'adresse et les modalités de retour.</li>
              <li>
                Le remboursement est effectué sous 14 jours après réception et
                vérification de l'article.
              </li>
            </ol>
            <p className="text-bordeaux/55">
              Pour des raisons d'hygiène, les produits concernés (soin, cosmétique, sous-vêtement…) ouverts
              ou utilisés ne peuvent être ni repris ni échangés.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-bordeaux">Une question ?</h2>
          <p className="mt-3 text-sm leading-relaxed text-bordeaux/75">
            Notre équipe est à votre écoute — consultez la{" "}
            <Link href="/faq" className="text-bordeaux underline">
              FAQ
            </Link>{" "}
            ou{" "}
            <Link href="/contact" className="text-bordeaux underline">
              écrivez-nous
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
