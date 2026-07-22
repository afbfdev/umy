import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-7xl text-bordeaux/20">404</p>
      <h1 className="mt-4 font-serif text-3xl text-bordeaux">
        Cette page s'est évaporée
      </h1>
      <p className="mt-3 max-w-sm text-bordeaux/60">
        La page recherchée n'existe pas ou n'est plus disponible.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
