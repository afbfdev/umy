import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Hors ligne",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-cream-100 px-6 text-center">
      <Logo className="h-8 w-auto text-bordeaux" />
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-nude/30 text-bordeaux">
        <WifiOff className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <div>
        <h1 className="font-serif text-2xl text-bordeaux">Vous êtes hors ligne</h1>
        <p className="mt-2 max-w-sm text-sm text-bordeaux/60">
          Cette page n'est pas disponible sans connexion. Revenez dès que vous êtes
          de nouveau en ligne.
        </p>
      </div>
    </div>
  );
}
