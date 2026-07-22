/**
 * Configuration centrale de la marque.
 * ⚑ Pour renommer la maison partout, il suffit de modifier `name` / `tagline`.
 */
export const siteConfig = {
  name: "UMY",
  tagline: "Le concept store",
  description:
    "UMY — Le concept store en ligne. Mode, beauté, maison, high-tech et bien plus : une sélection soignée pour tous, livrée avec soin.",
  url: "https://umy.example.com",
  nav: [
    { label: "Boutique", href: "/categories" },
    { label: "La Maison", href: "/la-maison" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
