import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "La Maison",
  description:
    "Qui nous sommes, notre sélection et nos engagements — UMY, le concept store en ligne.",
};

const values = [
  {
    title: "Une sélection soignée",
    text: "Des produits choisis un à un, dans toutes les catégories, pour leur qualité et leur juste prix.",
  },
  {
    title: "Au service du client",
    text: "Commande simple, paiement à la livraison et une équipe à votre écoute à chaque étape.",
  },
  {
    title: "Consommer responsable",
    text: "Des partenaires de confiance et des emballages pensés pour limiter notre empreinte.",
  },
];

export default function LaMaisonPage() {
  return (
    <div>
      {/* Intro */}
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">La Maison</p>
          <h1 className="mt-6 text-display-sm text-bordeaux md:text-display">
            Une boutique pour tous,
            <span className="block italic text-bordeaux/80">tout au même endroit.</span>
          </h1>
          <p className="mt-8 text-base leading-relaxed text-bordeaux/70">
            {siteConfig.name} est né d'une idée simple : réunir en un seul endroit
            le meilleur de chaque catégorie — mode, beauté, maison, high-tech et
            bien plus — avec une sélection soignée, des prix justes et un service
            attentionné.
          </p>
        </div>
      </section>

      {/* Histoire — texte + panneau */}
      <section className="border-y border-border/60 bg-cream-200/40">
        <div className="container grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-lg">
            <p className="eyebrow">Notre histoire</p>
            <h2 className="mt-4 text-display-sm text-bordeaux">
              De l'idée à votre panier
            </h2>
            <p className="mt-6 leading-relaxed text-bordeaux/70">
              Nous avons commencé avec une poignée de produits et une conviction :
              acheter en ligne devrait être simple, sûr et agréable. Aujourd'hui,
              notre catalogue grandit chaque semaine, catégorie après catégorie.
            </p>
            <p className="mt-4 leading-relaxed text-bordeaux/70">
              Chaque référence est choisie pour son rapport qualité-prix et sa
              fiabilité — pour que vous trouviez, du quotidien à l'exceptionnel,
              exactement ce qu'il vous faut.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[3px] shadow-2xl shadow-bordeaux/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/la-maison-histoire.jpg?v=2"
                alt="Acheter en ligne, simplement"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Savoir-faire — panneau + texte */}
      <section className="container grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 aspect-[4/5] w-full overflow-hidden rounded-[3px] shadow-2xl shadow-bordeaux/10 lg:order-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/la-maison-promesse.jpg?v=2"
            alt="Bien choisir vos produits"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="order-1 max-w-lg lg:order-2">
          <p className="eyebrow">Notre promesse</p>
          <h2 className="mt-4 text-display-sm text-bordeaux">
            Bien choisir, pour vous
          </h2>
          <p className="mt-6 leading-relaxed text-bordeaux/70">
            Nous testons, comparons et négocions pour ne garder que des produits
            qui tiennent leurs promesses. Pas de superflu : le bon produit, au bon
            prix, disponible tout de suite.
          </p>
          <p className="mt-4 leading-relaxed text-bordeaux/70">
            Et parce que la confiance compte, vous réglez à la livraison et
            profitez de retours simples sous 30 jours.
          </p>
        </div>
      </section>

      {/* Engagements */}
      <section className="border-t border-border/60 bg-cream-200/40">
        <div className="container py-20">
          <div className="mb-14 max-w-xl">
            <p className="eyebrow">Nos engagements</p>
            <h2 className="mt-4 text-display-sm text-bordeaux">
              Une exigence, trois promesses
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title}>
                <span className="font-serif text-4xl text-nude-400">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-serif text-xl text-bordeaux">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bordeaux/65">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 text-center">
        <h2 className="mx-auto max-w-2xl text-display-sm text-bordeaux">
          Explorez la boutique
        </h2>
        <p className="mx-auto mt-4 max-w-md text-bordeaux/70">
          Des milliers de produits à venir, dans toutes les catégories — il y a
          forcément ce qu'il vous faut.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/categories">Voir toutes les catégories</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
