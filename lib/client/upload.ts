/** Envoie un fichier à l'API d'upload admin et renvoie l'URL publique. */
export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (!res.ok || !data.url) {
    throw new Error(data.error ?? "Échec de l'envoi de l'image.");
  }
  return data.url;
}
