import type { Metadata } from "next";
import { Mail, Phone, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question ? L'équipe UMY vous répond.",
};

export default function ContactPage() {
  return (
    <div className="container py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">Nous écrire</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">Contact</h1>
        <p className="mt-5 leading-relaxed text-bordeaux/70">
          Une question sur un produit, une commande ou un conseil ? Écrivez-nous,
          nous vous répondons sous 48 h ouvrées.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <ContactForm />

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-cream-50 p-6">
            <h2 className="mb-4 text-sm font-medium text-bordeaux">Coordonnées</h2>
            <ul className="space-y-4 text-sm text-bordeaux/75">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-bordeaux/40" strokeWidth={1.5} />
                <a href="mailto:contact@umy.dev" className="hover:text-bordeaux">
                  contact@umy.dev
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-bordeaux/40" strokeWidth={1.5} />
                <a href="tel:+33100000000" className="hover:text-bordeaux">
                  +33 1 00 00 00 00
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-bordeaux/40" strokeWidth={1.5} />
                <span>Du lundi au vendredi, 9 h – 18 h</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-cream-50 p-6">
            <h2 className="mb-2 text-sm font-medium text-bordeaux">Service client</h2>
            <p className="text-sm leading-relaxed text-bordeaux/65">
              Pour le suivi d'une commande, précisez votre référence
              <span className="text-bordeaux"> (UMY-XXXXXX)</span> dans votre message.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
