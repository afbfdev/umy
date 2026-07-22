import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
        xl: "4rem",
      },
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      colors: {
        /* ──────────────────────────────────────────────
         * Charte graphique UMY
         * ────────────────────────────────────────────── */
        // Beige / Crème doux — fonds
        cream: {
          DEFAULT: "#EBE5D9",
          50: "#FAF8F4",
          100: "#F4F1EA",
          200: "#EBE5D9",
          300: "#DED5C3",
          400: "#CFC3AC",
        },
        // Bordeaux / Marron profond — texte, accents, boutons
        bordeaux: {
          DEFAULT: "#4A141C",
          50: "#F6E9EB",
          100: "#E4BEC4",
          300: "#A2404C",
          500: "#6B222C",
          700: "#4A141C",
          900: "#2E0C11",
        },
        // Rose poudré / Nude — détails secondaires
        nude: {
          DEFAULT: "#DDBFB9",
          100: "#F3E7E4",
          200: "#EAD5D0",
          300: "#DDBFB9",
          400: "#CBA29A",
        },

        /* ──────────────────────────────────────────────
         * Tokens sémantiques (compat. Shadcn UI, via HSL)
         * ────────────────────────────────────────────── */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        // Serif hybride élégant pour les titres
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        // Sans-serif minimaliste pour le corps de texte
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Échelle d'affichage pour les grands titres éditoriaux
        "display-sm": ["2.75rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display": ["4rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-lg": ["5.5rem", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
      },
      letterSpacing: {
        luxe: "0.28em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
