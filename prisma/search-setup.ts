import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Recherche tolérante aux accents & rapide :
 * - extensions `unaccent` (retrait des accents) et `pg_trgm` (LIKE indexable) ;
 * - fonction IMMUTABLE `umy_norm` (minuscules + sans accents) → indexable ;
 * - index GIN trigram sur les colonnes recherchées.
 *
 * À relancer uniquement si la base est recréée de zéro (idempotent).
 */
const statements = [
  `CREATE EXTENSION IF NOT EXISTS unaccent`,
  `CREATE EXTENSION IF NOT EXISTS pg_trgm`,
  `CREATE OR REPLACE FUNCTION umy_norm(text) RETURNS text
     AS $$ SELECT lower(public.unaccent('public.unaccent'::regdictionary, $1)) $$
     LANGUAGE sql IMMUTABLE`,
  `CREATE INDEX IF NOT EXISTS idx_products_name_norm
     ON products USING gin (umy_norm(name) gin_trgm_ops)`,
  `CREATE INDEX IF NOT EXISTS idx_products_tagline_norm
     ON products USING gin (umy_norm(coalesce(tagline,'')) gin_trgm_ops)`,
  `CREATE INDEX IF NOT EXISTS idx_products_family_norm
     ON products USING gin (umy_norm(coalesce(family,'')) gin_trgm_ops)`,
  `CREATE INDEX IF NOT EXISTS idx_categories_name_norm
     ON categories USING gin (umy_norm(name) gin_trgm_ops)`,
];

async function main() {
  for (const sql of statements) {
    await prisma.$executeRawUnsafe(sql);
  }
  const [{ ok }] = await prisma.$queryRawUnsafe<{ ok: string }[]>(
    `SELECT umy_norm('Néroli Été') AS ok`,
  );
  console.log(`✓ Recherche accent-insensible prête — umy_norm('Néroli Été') = '${ok}'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
