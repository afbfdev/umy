import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Recherche tolérante aux accents & rapide :
 * - extensions `unaccent` et `pg_trgm` ;
 * - fonction IMMUTABLE `umy_norm` (minuscules + sans accents) → indexable ;
 * - index GIN trigram sur les colonnes recherchées.
 *
 * Portable : le schéma des extensions est détecté à l'exécution
 * (public en local, `extensions` sur Supabase). Idempotent.
 */
async function schemaOf(ext: string): Promise<string> {
  const rows = await prisma.$queryRawUnsafe<{ schema: string }[]>(
    `SELECT n.nspname AS schema
     FROM pg_extension e JOIN pg_namespace n ON n.oid = e.extnamespace
     WHERE e.extname = $1`,
    ext,
  );
  return rows[0]?.schema ?? "public";
}

async function main() {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS unaccent`);
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);

  const ua = await schemaOf("unaccent");
  const tg = await schemaOf("pg_trgm");

  // Fonction de normalisation (schéma de l'extension qualifié explicitement).
  await prisma.$executeRawUnsafe(
    `CREATE OR REPLACE FUNCTION umy_norm(text) RETURNS text
       LANGUAGE sql IMMUTABLE
       AS $$ SELECT lower("${ua}".unaccent('${ua}.unaccent'::regdictionary, $1)) $$`,
  );

  // Index GIN trigram (operator class qualifiée par le schéma de pg_trgm).
  const indexes: [string, string, string][] = [
    ["idx_products_name_norm", "products", "umy_norm(name)"],
    ["idx_products_tagline_norm", "products", "umy_norm(coalesce(tagline,''))"],
    ["idx_products_family_norm", "products", "umy_norm(coalesce(family,''))"],
    ["idx_categories_name_norm", "categories", "umy_norm(name)"],
  ];
  for (const [name, table, expr] of indexes) {
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS ${name} ON ${table} USING gin (${expr} "${tg}".gin_trgm_ops)`,
    );
  }

  const [{ ok }] = await prisma.$queryRawUnsafe<{ ok: string }[]>(
    `SELECT umy_norm('Néroli Été') AS ok`,
  );
  console.log(
    `✓ Recherche prête — extensions: unaccent=${ua}, pg_trgm=${tg} · umy_norm('Néroli Été')='${ok}'`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
