import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { RegisterSW } from "@/components/pwa/register-sw";
import "./globals.css";

// Serif hybride élégant — titres
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

// Sans-serif géométrique minimaliste — corps de texte
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    locale: "fr_FR",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#4A141C",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${jost.variable}`}>
      <body className="min-h-dvh font-sans">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
