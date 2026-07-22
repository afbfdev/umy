/**
 * Crée le bucket public Supabase Storage pour les images.
 * Nécessite NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans l'env.
 * Idempotent.  Lancer : npm run storage:setup
 */
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

async function main() {
  if (!SB_URL || !KEY) {
    console.error(
      "✗ Définissez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (voir .env.example).",
    );
    process.exit(1);
  }

  const res = await fetch(`${SB_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: 5 * 1024 * 1024,
      allowed_mime_types: ["image/png", "image/jpeg", "image/webp", "image/gif"],
    }),
  });

  const body = await res.text();
  if (res.ok) {
    console.log(`✓ Bucket public « ${BUCKET} » créé.`);
    return;
  }
  if (res.status === 409 || body.toLowerCase().includes("already exists")) {
    console.log(`• Bucket « ${BUCKET} » déjà présent.`);
    return;
  }
  console.error(`✗ Échec (${res.status}) : ${body}`);
  process.exit(1);
}

main();
