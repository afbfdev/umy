"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight, FolderTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { coverStyle } from "@/lib/visuals";
import { Highlight } from "@/components/search/highlight";
import { Price } from "@/components/currency/price";
import type { Suggestion, CategorySuggestion } from "@/lib/search-types";

export function NavSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState<CategorySuggestion[]>([]);
  const [products, setProducts] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Suggestions (debounce + annulation des requêtes obsolètes)
  useEffect(() => {
    const query = q.trim();
    if (!open || query.length < 2) {
      setCategories([]);
      setProducts([]);
      setActive(-1);
      setLoading(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(query)}`,
          { signal: ac.signal },
        );
        const data = (await res.json()) as {
          categories: CategorySuggestion[];
          products: Suggestion[];
        };
        setCategories(data.categories ?? []);
        setProducts(data.products ?? []);
        setActive(-1);
      } catch {
        /* requête annulée ou erreur — ignorée */
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, open]);

  function close() {
    setOpen(false);
    setCategories([]);
    setProducts([]);
    setActive(-1);
    abortRef.current?.abort();
  }

  function goToSearch() {
    const query = q.trim();
    if (!query) return;
    close();
    router.push(`/recherche?q=${encodeURIComponent(query)}`);
  }

  function goTo(href: string) {
    close();
    router.push(href);
  }

  // Liste plate pour la navigation clavier : catégories puis produits.
  const entries: string[] = [
    ...categories.map((c) => `/categories/${c.slug}`),
    ...products.map((p) => `/produits/${p.slug}`),
  ];

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, entries.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter" && active >= 0 && entries[active]) {
      e.preventDefault();
      goTo(entries[active]);
    }
  }

  const query = q.trim();
  const hasResults = categories.length > 0 || products.length > 0;
  const catOffset = categories.length; // décalage d'index pour les produits

  return (
    <>
      <button
        type="button"
        aria-label="Rechercher"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
        className="text-bordeaux transition-opacity hover:opacity-60"
      >
        {open ? (
          <X className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
        ) : (
          <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-border/60 bg-cream-100/95 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch();
            }}
            className="container flex items-center gap-3 py-4"
          >
            <Search className="h-5 w-5 shrink-0 text-bordeaux/40" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onInputKeyDown}
              autoComplete="off"
              aria-label="Rechercher un produit"
              placeholder="Rechercher un produit, une catégorie…"
              className="w-full bg-transparent text-base text-bordeaux outline-none placeholder:text-bordeaux/35"
            />
            {loading && (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-bordeaux/40" />
            )}
            <button
              type="submit"
              className="shrink-0 rounded-full bg-bordeaux px-5 py-2 text-sm font-medium text-cream-100 transition-colors hover:bg-bordeaux-900"
            >
              Rechercher
            </button>
          </form>

          {query.length >= 2 && (
            <div className="container pb-4">
              {!hasResults ? (
                <p className="px-1 pb-2 text-sm text-bordeaux/50">
                  {loading ? "Recherche…" : `Aucune suggestion pour « ${query} »`}
                </p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border/60 bg-cream-50">
                  {/* Catégories */}
                  {categories.length > 0 && (
                    <ul>
                      <li className="px-3 pt-3 text-[0.65rem] uppercase tracking-[0.14em] text-bordeaux/40">
                        Catégories
                      </li>
                      {categories.map((c, i) => (
                        <li key={c.slug}>
                          <button
                            type="button"
                            onMouseEnter={() => setActive(i)}
                            onClick={() => goTo(`/categories/${c.slug}`)}
                            className={cn(
                              "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                              active === i ? "bg-nude/25" : "hover:bg-nude/15",
                            )}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-nude/30 text-bordeaux/70">
                              <FolderTree className="h-4 w-4" strokeWidth={1.6} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-serif text-bordeaux">
                                <Highlight text={c.name} query={q} />
                              </span>
                              <span className="block text-xs text-bordeaux/50">
                                {c.productCount} produit{c.productCount > 1 ? "s" : ""}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Produits */}
                  {products.length > 0 && (
                    <ul
                      className={cn(
                        categories.length > 0 && "border-t border-border/60",
                      )}
                    >
                      <li className="px-3 pt-3 text-[0.65rem] uppercase tracking-[0.14em] text-bordeaux/40">
                        Produits
                      </li>
                      {products.map((s, j) => {
                        const idx = catOffset + j;
                        return (
                          <li key={s.slug}>
                            <button
                              type="button"
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => goTo(`/produits/${s.slug}`)}
                              className={cn(
                                "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                                active === idx ? "bg-nude/25" : "hover:bg-nude/15",
                              )}
                            >
                              <span
                                className="h-11 w-9 shrink-0 overflow-hidden rounded-[2px]"
                                style={coverStyle(s.imageUrl, s.slug)}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-serif text-bordeaux">
                                  <Highlight text={s.name} query={q} />
                                </span>
                                <span className="block truncate text-xs text-bordeaux/50">
                                  {s.categoryName}
                                  {s.tagline ? ` · ${s.tagline}` : ""}
                                </span>
                              </span>
                              {s.minPriceCents !== null && (
                                <Price
                                  cents={s.minPriceCents}
                                  className="shrink-0 text-sm text-bordeaux"
                                />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Tous les résultats */}
                  <button
                    type="button"
                    onClick={goToSearch}
                    className="flex w-full items-center justify-between gap-2 border-t border-border/60 px-3 py-2.5 text-sm text-bordeaux/70 transition-colors hover:bg-nude/15 hover:text-bordeaux"
                  >
                    Voir tous les résultats pour « {query} »
                    <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
