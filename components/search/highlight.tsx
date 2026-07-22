import { cn } from "@/lib/utils";

/** Minuscules + suppression des accents (aligné 1:1 sur le texte source). */
function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * Affiche `text` en surlignant la portion correspondant à `query`, de manière
 * insensible aux accents et à la casse. La normalisation (é→e, à→a…) conserve
 * le nombre de caractères, donc les index de la version normalisée s'alignent
 * sur le texte original ; on garde une garde de sécurité si ce n'est pas le cas.
 */
export function Highlight({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const nt = normalize(text);
  const nq = normalize(q);
  const idx = nq ? nt.indexOf(nq) : -1;

  // Pas de correspondance, ou alignement d'index non garanti → texte brut.
  if (idx === -1 || nt.length !== text.length) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <mark
        className={cn(
          "rounded-[2px] bg-nude/60 text-bordeaux",
          className,
        )}
      >
        {text.slice(idx, idx + nq.length)}
      </mark>
      {text.slice(idx + nq.length)}
    </>
  );
}
