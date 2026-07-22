import Link from "next/link";

export function LegalPage({
  eyebrow,
  title,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-display-sm text-bordeaux">{title}</h1>
        {note && <p className="mt-4 text-sm text-bordeaux/55">{note}</p>}
      </header>
      <div className="mx-auto max-w-3xl space-y-10">{children}</div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl text-bordeaux">{title}</h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-bordeaux/75">
        {children}
      </div>
    </section>
  );
}

export function LegalFooterNote() {
  return (
    <p className="border-t border-border/60 pt-6 text-sm text-bordeaux/60">
      Une question ?{" "}
      <Link href="/contact" className="text-bordeaux underline">
        Contactez-nous
      </Link>
      .
    </p>
  );
}
