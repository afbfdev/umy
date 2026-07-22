import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

// Les données admin ne doivent jamais être mises en cache statiquement.
export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
