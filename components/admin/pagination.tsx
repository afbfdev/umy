import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Pagination par liens (préserve les autres paramètres de recherche). */
export function Pagination({
  page,
  pages,
  makeHref,
}: {
  page: number;
  pages: number;
  makeHref: (page: number) => string;
}) {
  if (pages <= 1) return null;

  const prev = Math.max(1, page - 1);
  const next = Math.min(pages, page + 1);

  return (
    <div className="flex items-center justify-between gap-4">
      <Link
        href={makeHref(prev)}
        aria-disabled={page <= 1}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-2 text-sm text-bordeaux transition-colors hover:border-bordeaux/50",
          page <= 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
        Précédent
      </Link>

      <span className="text-sm text-bordeaux/60">
        Page {page} sur {pages}
      </span>

      <Link
        href={makeHref(next)}
        aria-disabled={page >= pages}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-2 text-sm text-bordeaux transition-colors hover:border-bordeaux/50",
          page >= pages && "pointer-events-none opacity-40",
        )}
      >
        Suivant
        <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
      </Link>
    </div>
  );
}
