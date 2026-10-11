import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./design/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Design-system tokens (src/styles/tokens.css). New components use only these.
        hso: {
          canvas: "hsl(var(--hso-canvas))",
          surface: "hsl(var(--hso-surface))",
          sunken: "hsl(var(--hso-surface-sunken))",
          line: "hsl(var(--hso-line))",
          "line-strong": "hsl(var(--hso-line-strong))",
          fg: "hsl(var(--hso-fg))",
          muted: "hsl(var(--hso-fg-muted))",
          subtle: "hsl(var(--hso-fg-subtle))",
          coral: "hsl(var(--hso-coral))",
          "coral-strong": "hsl(var(--hso-coral-strong))",
          "coral-tint": "hsl(var(--hso-coral-tint))",
          green: "hsl(var(--hso-green))",
          "green-strong": "hsl(var(--hso-green-strong))",
          "green-tint": "hsl(var(--hso-green-tint))",
          "neutral-tint": "hsl(var(--hso-neutral-tint))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        coral: { DEFAULT: "hsl(var(--coral))", foreground: "hsl(var(--coral-foreground))" },
        sage: { DEFAULT: "hsl(var(--sage))", foreground: "hsl(var(--sage-foreground))" },
        ochre: { DEFAULT: "hsl(var(--ochre))", foreground: "hsl(var(--ochre-foreground))" },
        sunny: "hsl(var(--sunny))",
        sky: "hsl(var(--sky))",
        ink: "hsl(var(--ink))",
        cream: "hsl(var(--cream))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        // One family across the site (tokens.css --hso-font). `display` is kept as an
        // alias so existing classes resolve to the same face.
        display: ["Inter Variable", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        sans: ["Inter Variable", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        "gradient-warm": "var(--gradient-warm)",
        "gradient-coral": "var(--gradient-coral)",
        "gradient-ink": "var(--gradient-ink)",
      },
      // Type scale: Tailwind's own text-xs..text-3xl already equal the token scale
      // (12/14/16/18/20/24/30, tokens.css). No custom size names: tailwind-merge
      // would read "text-hso-xs" as a color and drop it next to "text-hso-muted".
      maxWidth: { "hso-page": "var(--hso-page-max)" },
      minHeight: { "hso-tap": "var(--hso-tap)" },
      minWidth: { "hso-tap": "var(--hso-tap)" },
      height: { "hso-nav": "var(--hso-nav-height)" },
      boxShadow: {
        "hso-hover": "var(--hso-shadow-hover)",
        "hso-overlay": "var(--hso-shadow-overlay)",
        editorial: "var(--shadow-editorial)",
        soft: "var(--shadow-soft)",
      },
      borderRadius: {
        hso: "var(--hso-radius)",
        "hso-sm": "var(--hso-radius-sm)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "marquee": "marquee 40s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
