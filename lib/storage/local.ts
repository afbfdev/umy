import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 Mo

/** Types MIME autorisés → extension de fichier. */
export const ALLOWED_MIME = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Écrit une image dans `public/uploads/` et renvoie son URL publique.
 * (Abstraction locale — remplaçable par S3 / Supabase Storage en prod.)
 */
export async function saveImage(bytes: Buffer, mime: string): Promise<string> {
  const ext = ALLOWED_MIME.get(mime);
  if (!ext) throw new Error("Type de fichier non autorisé.");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, name), bytes);
  return `/uploads/${name}`;
}
