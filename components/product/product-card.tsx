import Link from "next/link";
import { coverStyle } from "@/lib/visuals";
import { lowestPriceCents, type ProductCard as ProductCardData } from "@/lib/data/catalog";
import { Price } from "@/components/currency/price";

export function ProductCard({ product }: { product: ProductCardData }) {
  const from = lowestPriceCents(product.variants);
  const soldOut = product.variants.every((v) => v.stock <= 0);

  return (
    <Link href={`/produits/${product.slug}`} className="group block">
      {/* Visuel */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          style={coverStyle(product.imageUrl, product.slug)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bordeaux/25 to-transparent" />

        {product.isFeatured && !soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-cream-100/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-bordeaux">
            Signature
          </span>
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-bordeaux/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-cream-100">
            Épuisé
          </span>
        )}

        {/* Nom en réserve dans le visuel */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="font-serif text-2xl text-cream-50">{product.name}</span>
        </div>
      </div>

      {/* Infos */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg leading-tight text-bordeaux">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-bordeaux/50">
              {product.tagline}
            </p>
          )}
        </div>
        {from !== null && (
          <div className="whitespace-nowrap text-right">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-bordeaux/40">
              {product.variants.length > 1 ? "dès" : ""}
            </p>
            <Price cents={from} className="font-sans text-sm text-bordeaux" />
          </div>
        )}
      </div>
    </Link>
  );
}
