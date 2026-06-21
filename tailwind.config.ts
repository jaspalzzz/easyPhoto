import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1120px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        paper: "hsl(var(--paper))",
        surface: "hsl(var(--surface))",
        ink: {
          DEFAULT: "hsl(var(--ink))",
          soft: "hsl(var(--ink-soft))",
          faint: "hsl(var(--ink-faint))",
        },
        hairline: {
          DEFAULT: "hsl(var(--hairline))",
          strong: "hsl(var(--hairline-strong))",
        },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          soft: "hsl(var(--success-soft))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
          muted: "hsl(var(--brand-muted))",
          soft: "hsl(var(--brand-soft))",
        },
        cta: {
          DEFAULT: "hsl(var(--cta))",
          foreground: "hsl(var(--cta-foreground))",
          muted: "hsl(var(--cta-muted))",
        },
      },
      // Crafted, restrained radius scale (was 11px+ everywhere).
      borderRadius: {
        none: "0",
        sm: "3px",
        DEFAULT: "5px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "12px",
        "3xl": "14px",
        full: "9999px",
      },
      boxShadow: {
        // One whisper of elevation for the live working surface only.
        panel: "0 1px 2px hsl(30 12% 12% / 0.05), 0 1px 1px hsl(30 12% 12% / 0.03)",
        // Menu/popover pop — still subtle.
        pop: "0 10px 30px -12px hsl(30 12% 12% / 0.22), 0 2px 6px -2px hsl(30 12% 12% / 0.08)",
        // MARKETING HOMEPAGE ONLY (the flat tool pages stay shadow-free): a
        // navy-tinted elevation pair for the premium surfaces — resting + lifted.
        soft: "0 1px 3px hsl(222 47% 11% / 0.06), 0 1px 2px hsl(222 47% 11% / 0.04)",
        lift: "0 18px 40px -16px hsl(222 47% 11% / 0.20), 0 6px 14px -8px hsl(222 47% 11% / 0.10)",
        none: "none",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
