/**
 * Dégradés placeholder aux couleurs de la maison — à remplacer par de
 * vraies photos (`next/image`) une fois les visuels disponibles.
 * Déterministe : une même clé (slug) donne toujours le même dégradé.
 */
const GRADIENTS = [
  "linear-gradient(150deg, #4A141C 0%, #6B222C 55%, #A2404C 100%)",
  "linear-gradient(150deg, #CBA29A 0%, #DDBFB9 60%, #F3E7E4 100%)",
  "linear-gradient(150deg, #DED5C3 0%, #EBE5D9 55%, #FAF8F4 100%)",
  "linear-gradient(150deg, #6B222C 0%, #A2404C 50%, #CBA29A 100%)",
];

export function placeholderGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

/**
 * Style de fond « cover » : image réelle si disponible, sinon dégradé
 * déterministe déduit de `seed`.
 */
export function coverStyle(
  imageUrl: string | null | undefined,
  seed: string,
): import("react").CSSProperties {
  if (imageUrl) {
    return {
      backgroundImage: `url("${imageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return { background: placeholderGradient(seed) };
}
