import { prisma } from "@/lib/prisma";

/**
 * Collecte de vues de page — mesure d'audience first-party.
 * Aucune donnée personnelle : uniquement le chemin et l'horodatage.
 * Le client n'appelle cet endpoint que si le consentement « analytics » est donné.
 */
export async function POST(req: Request) {
  let path: unknown;
  try {
    ({ path } = await req.json());
  } catch {
    return new Response(null, { status: 400 });
  }

  if (typeof path !== "string" || !path.startsWith("/") || path.length > 512) {
    return new Response(null, { status: 400 });
  }
  // On ne trace pas l'espace d'administration ni les endpoints techniques.
  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return new Response(null, { status: 204 });
  }

  try {
    await prisma.pageView.create({ data: { path } });
  } catch {
    // On n'échoue jamais côté visiteur pour une mesure d'audience.
  }
  return new Response(null, { status: 204 });
}
