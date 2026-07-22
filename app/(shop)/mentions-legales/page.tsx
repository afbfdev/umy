import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-xl text-bordeaux">{title}</h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-bordeaux/75">
        {children}
      </div>
    </section>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="container py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">Informations légales</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">Mentions légales</h1>
        <p className="mt-4 text-sm text-bordeaux/55">
          Les éléments entre crochets sont à compléter par l'éditeur.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-10">
        <Section title="Éditeur du site">
          <p>
            Le site <strong>UMY — Le concept store</strong> est édité par{" "}
            <strong>[Raison sociale]</strong>, [forme juridique] au capital de
            [montant] €.
          </p>
          <p>
            Siège social : [adresse]. RCS [ville] [n° RCS] — SIRET [n° SIRET] — TVA
            intracommunautaire [n° TVA].
          </p>
          <p>Directeur·rice de la publication : [Nom].</p>
          <p>Contact : [email] — [téléphone].</p>
        </Section>

        <Section title="Hébergement">
          <p>
            Le site est hébergé par <strong>[Hébergeur]</strong>, [adresse de
            l'hébergeur], [contact].
          </p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>
            L'ensemble des contenus de ce site (textes, visuels, logos, marque UMY,
            créations) est protégé par le droit de la propriété intellectuelle et
            demeure la propriété exclusive de l'éditeur. Toute reproduction,
            représentation ou diffusion, totale ou partielle, sans autorisation
            écrite préalable, est interdite.
          </p>
        </Section>

        <Section title="Données personnelles">
          <p>
            Les informations recueillies via les formulaires (commande, contact)
            sont nécessaires au traitement de votre demande et destinées à
            l'éditeur. Conformément au RGPD et à la loi Informatique et Libertés,
            vous disposez d'un droit d'accès, de rectification, d'effacement et
            d'opposition sur vos données, en écrivant à [email].
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            Ce site peut déposer des cookies strictement nécessaires à son
            fonctionnement (par exemple la session d'administration). Aucun cookie
            publicitaire n'est utilisé sans votre consentement.
          </p>
        </Section>

        <Section title="Droit applicable">
          <p>
            Les présentes mentions sont régies par le droit français. Tout litige
            relève des tribunaux compétents du ressort du siège de l'éditeur.
          </p>
        </Section>

        <p className="border-t border-border/60 pt-6 text-sm text-bordeaux/60">
          Une question ?{" "}
          <Link href="/contact" className="text-bordeaux underline">
            Contactez-nous
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
