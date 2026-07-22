import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalFooterNote } from "@/components/legal/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment la maison UMY protège et traite vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      eyebrow="Vos données"
      title="Politique de confidentialité"
      note="Conforme au RGPD. Les éléments entre crochets sont à compléter par l'éditeur."
    >
      <LegalSection title="Responsable du traitement">
        <p>
          Le responsable du traitement des données est{" "}
          <strong>[Raison sociale]</strong>, [adresse]. Contact : [email].
        </p>
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>Nous collectons uniquement les données nécessaires :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Identité et contact (nom, e-mail, téléphone) ;</li>
          <li>Adresse de livraison ;</li>
          <li>Détail des commandes ;</li>
          <li>Messages envoyés via le formulaire de contact.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Finalités et base légale">
        <ul className="list-disc space-y-1 pl-5">
          <li>Traiter et livrer vos commandes (exécution du contrat) ;</li>
          <li>Répondre à vos demandes (intérêt légitime) ;</li>
          <li>Respecter nos obligations légales et comptables.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>
          Vos données sont destinées aux seuls services habilités de la maison et,
          le cas échéant, à nos prestataires (transporteur, service d'e-mail) dans
          la stricte mesure nécessaire. Elles ne sont jamais vendues.
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Les données de commande sont conservées le temps requis par les
          obligations légales (notamment comptables). Les messages de contact sont
          conservés le temps nécessaire au traitement de la demande.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
          d'effacement, de limitation, d'opposition et de portabilité. Pour les
          exercer, écrivez à [email]. Vous pouvez également introduire une
          réclamation auprès de la CNIL.
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          appropriées pour protéger vos données (accès restreints, mots de passe
          chiffrés, connexions sécurisées).
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          L'usage des cookies est détaillé dans notre{" "}
          <Link href="/cookies" className="text-bordeaux underline">
            politique cookies
          </Link>
          .
        </p>
      </LegalSection>

      <LegalFooterNote />
    </LegalPage>
  );
}
