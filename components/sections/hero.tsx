"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Décor doux en fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 80% 10%, #DDBFB933 0%, transparent 55%)," +
            "radial-gradient(90% 70% at 10% 90%, #EBE5D9 0%, transparent 60%)",
        }}
      />

      <div className="container grid min-h-[88vh] items-center gap-12 py-20 lg:grid-cols-2">
        {/* Colonne texte */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl"
        >
          <motion.p variants={item} className="eyebrow">
            Le concept store · 2026
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-display-sm text-bordeaux md:text-display"
          >
            Tout ce qu'il vous faut,
            <span className="block italic text-bordeaux/80">au même endroit.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-md text-base leading-relaxed text-bordeaux/70"
          >
            Mode, beauté, maison, high-tech et bien plus : une sélection soignée
            de produits pour tous, à petits prix, livrés avec soin.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/categories">Découvrir la boutique</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/la-maison">La Maison</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Colonne visuelle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2px] shadow-2xl shadow-bordeaux/10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, #4A141C 0%, #6B222C 45%, #A2404C 100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif text-[7rem] leading-none tracking-[0.2em] text-cream-100/95">
                U
              </span>
              <span className="mt-4 text-xs uppercase tracking-luxe text-cream-100/70">
                Le concept store
              </span>
            </div>
          </div>

          {/* Pastille flottante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="absolute -bottom-6 -left-4 hidden rounded-full bg-cream-100 px-6 py-4 shadow-xl shadow-bordeaux/10 sm:block"
          >
            <p className="font-serif text-lg text-bordeaux">Nouveautés</p>
            <p className="text-xs text-bordeaux/60">Chaque semaine</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
