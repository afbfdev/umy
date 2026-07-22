import { saveImage as saveImageLocal } from "@/lib/storage/local";
import {
  isSupabaseStorageConfigured,
  saveImageSupabase,
} from "@/lib/storage/supabase";

export { MAX_UPLOAD_BYTES, ALLOWED_MIME } from "@/lib/storage/local";

/**
 * Enregistre une image et renvoie son URL.
 * - **Supabase Storage** si configuré (prod / Vercel — persistant) ;
 * - **système de fichiers local** (`public/uploads/`) sinon (dev).
 */
export async function saveImage(bytes: Buffer, mime: string): Promise<string> {
  if (isSupabaseStorageConfigured()) {
    return saveImageSupabase(bytes, mime);
  }
  return saveImageLocal(bytes, mime);
}
