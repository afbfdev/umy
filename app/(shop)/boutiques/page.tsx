import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, Phone } from "lucide-react";
import { placeholderGradient } from "@/lib/visuals";

export const metadata: Metadata = {
  title: "Boutiques",
  description: "Retrouvez la maison UMY dans nos boutiques et espaces partenaires.",
};

type Boutique = {
  city: string;
  name: string;
  address: string[];
  hours: string;
  phone: string;
};

const boutiques: Boutique[] = [
  {
    city: "Paris",
    name: "Maison UMY — Le Marais",
    address: ["[Numéro et rue]", "75003 Paris"],
    hours: "Lun – Sam · 11 h – 19 h",
    phone: "+33 1 00 00 00 00",
  },
  {
    city: "Lyon",
    name: "UMY — Presqu'île",
    address: ["[Numéro et rue]", "69002 Lyon"],
    hours: "Mar – Sam · 10 h 30 – 19 h",
    phone: "+33 4 00 00 00 00",
  },
  {
    city: "Bordeaux",
    name: "UMY — Triangle d'Or",
    address: ["[Numéro et rue]", "33000 Bordeaux"],
    hours: "Mar – Sam · 10 h – 19 h",
    phone: "+33 5 00 00 00 00",
  },
];

export default function BoutiquesPage() {
  return (
    <div className="container py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">Où nous trouver</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">Nos boutiques</h1>
        <p className="mt-5 leading-relaxed text-bordeaux/70">
          Découvrez nos produits en personne, laissez-vous guider par nos
          conseillers et vivez l'expérience UMY dans un écrin dédié.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {boutiques.map((b) => (
          <article
            key={b.city}
            className="overflow-hidden rounded-2xl border border-border/70 bg-cream-50"
          >
            <div
              className="aspect-[16/10] w-full"
              style={{ background: placeholderGradient(b.city) }}
            />
            <div className="p-6">
              <p className="text-[0.65rem] uppercase tracking-luxe text-bordeaux/45">
                {b.city}
              </p>
              <h2 className="mt-1 font-serif text-xl text-bordeaux">{b.name}</h2>

              <ul className="mt-4 space-y-3 text-sm text-bordeaux/75">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bordeaux/40" strokeWidth={1.5} />
                  <span>{b.address.join(", ")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-bordeaux/40" strokeWidth={1.5} />
                  <span>{b.hours}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-bordeaux/40" strokeWidth={1.5} />
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-bordeaux">
                    {b.phone}
                  </a>
                </li>
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-border/70 bg-cream-200/40 p-8 text-center">
        <h2 className="font-serif text-2xl text-bordeaux">Nous rejoindre autrement</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-bordeaux/65">
          Vous êtes revendeur ou souhaitez distribuer nos produits ? Écrivez-nous
          pour toute demande professionnelle.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-bordeaux px-6 py-3 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900"
        >
          Nous contacter
        </Link>
      </div>

      <p className="mt-8 text-xs text-bordeaux/45">
        Adresses et horaires à compléter par l'éditeur.
      </p>
    </div>
  );
}
