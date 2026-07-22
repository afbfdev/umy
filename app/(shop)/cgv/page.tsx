import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalFooterNote } from "@/components/legal/legal";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de la maison UMY.",
};

export default function CgvPage() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Conditions générales de vente"
      note="Les éléments entre crochets sont à compléter par l'éditeur."
    >
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions générales de vente (CGV) régissent les ventes de
          produits proposés sur le site <strong>UMY — Le concept store</strong>,
          édité par <strong>[Raison sociale]</strong>. Toute commande implique
          l'acceptation sans réserve des présentes CGV.
        </p>
      </LegalSection>

      <LegalSection title="2. Produits">
        <p>
          Les produits sont présentés avec la plus grande exactitude possible. Les
          photographies et visuels n'ont pas de valeur contractuelle. Les produits
          sont proposés dans la limite des stocks disponibles.
        </p>
      </LegalSection>

      <LegalSection title="3. Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TTC), hors frais
          de livraison. L'éditeur se réserve le droit de modifier ses prix à tout
          moment ; les produits sont facturés sur la base du tarif en vigueur au
          moment de la validation de la commande.
        </p>
      </LegalSection>

      <LegalSection title="4. Commande">
        <p>
          La commande est validée après confirmation par le client. Un e-mail
          récapitulatif comportant une référence (UMY-XXXXXX) est envoyé. L'éditeur
          se réserve le droit d'annuler toute commande en cas de litige ou de
          motif légitime.
        </p>
      </LegalSection>

      <LegalSection title="5. Paiement">
        <p>
          Le paiement s'effectue <strong>à la livraison</strong> (espèces ou carte à
          la réception). D'autres moyens de paiement pourront être proposés
          ultérieurement.
        </p>
      </LegalSection>

      <LegalSection title="6. Livraison">
        <p>
          Les modalités et délais sont détaillés sur la page{" "}
          <Link href="/livraison" className="text-bordeaux underline">
            Livraison &amp; retours
          </Link>
          . La livraison standard est offerte dès 80 € d'achat.
        </p>
      </LegalSection>

      <LegalSection title="7. Droit de rétractation et retours">
        <p>
          Conformément à la loi, le client dispose d'un délai de{" "}
          <strong>14 jours</strong> pour exercer son droit de rétractation. La
          maison étend ce délai à <strong>30 jours</strong> pour les articles non
          ouverts et en parfait état. Pour des raisons d'hygiène, les produits de
          hygiène (soin, cosmétique…) descellés ne peuvent être repris.
        </p>
      </LegalSection>

      <LegalSection title="8. Garanties">
        <p>
          Les produits bénéficient des garanties légales de conformité et des vices
          cachés prévues par le Code de la consommation et le Code civil.
        </p>
      </LegalSection>

      <LegalSection title="9. Données personnelles">
        <p>
          Le traitement des données est décrit dans notre{" "}
          <Link href="/confidentialite" className="text-bordeaux underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="10. Droit applicable et litiges">
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige, une
          solution amiable sera recherchée avant toute action judiciaire. Le client
          peut recourir à un médiateur de la consommation : [nom et coordonnées du
          médiateur].
        </p>
      </LegalSection>

      <LegalFooterNote />
    </LegalPage>
  );
}
