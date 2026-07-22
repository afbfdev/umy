import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { ManageCookiesButton } from "@/components/consent/manage-cookies-button";

const columns = [
  {
    title: "Maison",
    links: [
      { label: "Notre histoire", href: "/la-maison" },
      { label: "Savoir-faire", href: "/la-maison" },
      { label: "Engagements", href: "/la-maison" },
      { label: "Boutiques", href: "/boutiques" },
    ],
  },
  {
    title: "Service client",
    links: [
      { label: "Livraison & retours", href: "/livraison" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Suivi de commande", href: "/suivi-commande" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "CGV", href: "/cgv" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-cream-200/50">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          {/* Bloc marque + newsletter */}
          <div>
            <Logo className="h-9 w-auto text-bordeaux" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bordeaux/70">
              {siteConfig.description}
            </p>
            <form className="mt-6 flex max-w-xs items-center border-b border-bordeaux/30 pb-2">
              <input
                type="email"
                placeholder="Votre e-mail"
                className="w-full bg-transparent text-sm text-bordeaux placeholder:text-bordeaux/40 focus:outline-none"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-[0.18em] text-bordeaux hover:opacity-60"
              >
                S'inscrire
              </button>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-bordeaux/70 transition-colors hover:text-bordeaux"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-bordeaux/50 sm:flex-row">
          <p>
            © {siteConfig.name} {siteConfig.tagline}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <ManageCookiesButton className="text-bordeaux/60 underline-offset-2 transition-colors hover:text-bordeaux hover:underline" />
            <span>Conçu avec soin en France.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
