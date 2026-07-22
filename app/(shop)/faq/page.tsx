import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes — commandes, livraison, retours, produits.",
};

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Commandes & livraison",
    items: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "Vos commandes sont préparées avec soin et expédiées sous 48 h ouvrées. Comptez ensuite 2 à 4 jours ouvrés pour la livraison en France métropolitaine.",
      },
      {
        q: "La livraison est-elle offerte ?",
        a: "La livraison standard est offerte dès 80 € d'achat. En dessous, elle est facturée 6,90 €.",
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Un e-mail de confirmation vous est envoyé avec votre référence (UMY-XXXXXX). Pour tout suivi, contactez-nous en précisant cette référence.",
      },
    ],
  },
  {
    title: "Paiement",
    items: [
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Le paiement à la livraison est disponible : vous réglez en espèces ou par carte à la réception de votre commande.",
      },
    ],
  },
  {
    title: "Produits",
    items: [
      {
        q: "D'où proviennent vos produits ?",
        a: "Nous travaillons avec des partenaires et fournisseurs sélectionnés pour leur fiabilité. Chaque référence est choisie pour son rapport qualité-prix.",
      },
      {
        q: "Les produits sont-ils garantis ?",
        a: "Les produits bénéficient des garanties légales de conformité. Les informations spécifiques figurent sur chaque fiche produit.",
      },
    ],
  },
  {
    title: "Retours",
    items: [
      {
        q: "Puis-je retourner un article ?",
        a: "Vous disposez de 30 jours pour nous retourner un article non ouvert et en parfait état. Voir la page Livraison & retours pour la marche à suivre.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">Aide</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">Questions fréquentes</h1>
      </header>

      <div className="mx-auto max-w-3xl space-y-12">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-bordeaux/55">
              {group.title}
            </h2>
            <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70 bg-cream-50">
              {group.items.map((item) => (
                <details key={item.q} className="group px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-lg text-bordeaux marker:hidden">
                    {item.q}
                    <Plus className="h-4 w-4 shrink-0 text-bordeaux/50 transition-transform duration-300 group-open:rotate-45" strokeWidth={1.6} />
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-bordeaux/70">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-3xl text-sm text-bordeaux/60">
        Vous ne trouvez pas votre réponse ?{" "}
        <Link href="/contact" className="text-bordeaux underline">
          Contactez-nous
        </Link>
        .
      </p>
    </div>
  );
}
