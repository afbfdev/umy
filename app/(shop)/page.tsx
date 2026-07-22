import { Hero } from "@/components/sections/hero";
import { Categories, type HomeCategory } from "@/components/sections/categories";
import { getCategories } from "@/lib/data/catalog";

export const revalidate = 300;

const VALUES = [
  { title: "Sélection soignée", text: "Des produits choisis dans toutes nos catégories." },
  { title: "Livraison rapide", text: "Expédiée sous 48 h, offerte dès 80 € d'achat." },
  { title: "Paiement à la livraison", text: "Réglez à la réception, en toute confiance." },
];

export default async function HomePage() {
  const dbCategories = await getCategories();
  const categories: HomeCategory[] = dbCategories.slice(0, 4).map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    count: `${c._count.products} produit${c._count.products > 1 ? "s" : ""}`,
    imageUrl: c.imageUrl,
  }));

  return (
    <>
      <Hero />
      <Categories categories={categories} />

      {/* Bande valeurs — réassurance discrète */}
      <section className="border-y border-border/60 bg-cream-200/40">
        <div className="container grid gap-8 py-14 text-center sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="font-serif text-xl text-bordeaux">{v.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-bordeaux/65">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
