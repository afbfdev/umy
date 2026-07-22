import { ALLOWED_MIME } from "@/lib/storage/local";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

/** Vrai si les variables Supabase Storage sont présentes (→ prod). */
export function isSupabaseStorageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

/**
 * Envoie une image dans un bucket **public** Supabase Storage (via l'API REST,
 * sans dépendance) et renvoie son URL publique. Persistant, adapté à Vercel.
 */
export async function saveImageSupabase(
  bytes: Buffer,
  mime: string,
): Promise<string> {
  const ext = ALLOWED_MIME.get(mime);
  if (!ext) throw new Error("Type de fichier non autorisé.");
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Supabase Storage non configuré.");
  }

  const name = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": mime,
        "x-upsert": "true",
        "cache-control": "public, max-age=31536000, immutable",
      },
      body: new Uint8Array(bytes),
    },
  );

  if (!res.ok) {
    throw new Error(`Supabase Storage ${res.status}: ${await res.text()}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${name}`;
}
