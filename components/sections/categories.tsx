"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { coverStyle } from "@/lib/visuals";

export type HomeCategory = {
  name: string;
  slug: string;
  description: string | null;
  count: string;
  imageUrl: string | null;
};

/**
 * Grille asymétrique : la 1ʳᵉ carte occupe une grande tuile,
 * les suivantes s'organisent autour pour un rythme éditorial.
 */
const spans = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

export function Categories({ categories }: { categories: HomeCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container py-24">
      {/* En-tête de section */}
      <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Explorer</p>
          <h2 className="mt-4 max-w-lg text-display-sm text-bordeaux">
            Nos rayons
          </h2>
        </div>
        <Link
          href="/categories"
          className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-bordeaux"
        >
          Toutes les catégories
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </Link>
      </div>

      {/* Grille */}
      <div className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[220px] md:grid-cols-4">
        {categories.map((category, i) => (
          <CategoryCard
            key={category.slug}
            category={category}
            className={spans[i % spans.length]}
            index={i}
            large={i === 0}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  className,
  index,
  large,
}: {
  category: HomeCategory;
  className?: string;
  index: number;
  large?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/categories/${category.slug}`}
        className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-[3px] p-6 md:p-8"
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          style={coverStyle(category.imageUrl, category.slug)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bordeaux/50 via-bordeaux/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

        <div className="relative z-10">
          <span className="text-[0.65rem] uppercase tracking-luxe text-cream-100/80">
            {category.count}
          </span>
          <h3
            className={cn(
              "mt-2 font-serif text-cream-50",
              large ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl",
            )}
          >
            {category.name}
          </h3>
          {category.description && (
            <p
              className={cn(
                "mt-2 max-w-xs text-sm leading-relaxed text-cream-100/85 opacity-0 transition-all duration-500 group-hover:opacity-100",
                large ? "block" : "hidden md:block",
              )}
            >
              {category.description}
            </p>
          )}

          <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cream-50">
            Découvrir
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
