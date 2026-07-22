import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalFooterNote } from "@/components/legal/legal";

export const metadata: Metadata = {
  title: "Politique cookies",
  description: "Les cookies et le stockage local utilisés par le site UMY.",
};

const rows = [
  {
    name: "umy_admin_session",
    type: "Cookie (httpOnly)",
    purpose: "Maintenir la session de l'espace d'administration.",
    duration: "7 jours",
    essential: "Strictement nécessaire",
  },
  {
    name: "umy-cart",
    type: "Stockage local",
    purpose: "Conserver le contenu du panier entre les visites.",
    duration: "Jusqu'à suppression",
    essential: "Strictement nécessaire",
  },
];

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="Vos données" title="Politique cookies">
      <LegalSection title="Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un petit fichier déposé sur votre appareil lors de la
          visite d'un site. Certaines fonctionnalités reposent aussi sur le
          « stockage local » de votre navigateur, qui fonctionne de manière
          similaire.
        </p>
      </LegalSection>

      <LegalSection title="Ce que nous utilisons">
        <p>
          Nous n'utilisons <strong>aucun cookie publicitaire ni de traçage</strong>.
          Seuls des éléments strictement nécessaires au fonctionnement du site sont
          employés :
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-[0.1em] text-bordeaux/45">
                <th className="py-2 pr-4 font-medium">Nom</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Finalité</th>
                <th className="py-2 pr-4 font-medium">Durée</th>
                <th className="py-2 font-medium">Catégorie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-bordeaux/75">
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className="py-3 pr-4 font-medium text-bordeaux">{r.name}</td>
                  <td className="py-3 pr-4">{r.type}</td>
                  <td className="py-3 pr-4">{r.purpose}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">{r.duration}</td>
                  <td className="py-3">{r.essential}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="Consentement">
        <p>
          Les éléments listés ci-dessus étant strictement nécessaires au
          fonctionnement du site, ils ne requièrent pas votre consentement
          préalable. Si des cookies de mesure d'audience ou de personnalisation
          venaient à être ajoutés, une bannière de consentement vous serait
          proposée au préalable.
        </p>
      </LegalSection>

      <LegalSection title="Gérer les cookies">
        <p>
          Vous pouvez à tout moment supprimer les cookies et vider le stockage local
          depuis les réglages de votre navigateur. La suppression du stockage local
          videra votre panier.
        </p>
      </LegalSection>

      <LegalSection title="En savoir plus">
        <p>
          Consultez notre{" "}
          <Link href="/confidentialite" className="text-bordeaux underline">
            politique de confidentialité
          </Link>{" "}
          pour le détail du traitement de vos données.
        </p>
      </LegalSection>

      <LegalFooterNote />
    </LegalPage>
  );
}
