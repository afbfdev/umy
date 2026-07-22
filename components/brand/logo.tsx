/**
 * Logotype UMY — image officielle détourée (fond transparent).
 * - `variant="bordeaux"` (défaut) → `/logo.png`, pour les fonds clairs.
 * - `variant="cream"` → `/logo-cream.png`, pour les fonds foncés.
 * La taille se pilote par la hauteur : `className="h-6 w-auto"`.
 */
export function Logo({
  className,
  title = "UMY",
  variant = "bordeaux",
}: {
  className?: string;
  title?: string;
  variant?: "bordeaux" | "cream";
}) {
  const src = variant === "cream" ? "/logo-cream.png" : "/logo.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} className={className} />
  );
}
