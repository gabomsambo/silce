import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1a1a1a",
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
          DEFAULT: "#F5F5F5",
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
        tan: "#D2B48C",
        // Accessible companion to `tan` for TEXT and meaningful icons on light
        // surfaces. `tan` itself is 1.97:1 on white and fails WCAG AA; this is
        // the same hue/saturation darkened to 38% lightness -> 5.13:1 on white
        // and >=4.5:1 on every light surface in use. Backgrounds, decorative
        // tints and dark-surface text keep plain `tan`.
        "tan-ink": "#8B6737",
        // Hover partner for `tan-ink` on light surfaces. On a light background
        // hover must get DARKER, never fainter: an opacity modifier fades the
        // ink toward the page and drops contrast exactly when the user signals
        // interest. Same hue/saturation at 30% lightness -> 7.30:1 on white and
        // >=6.5:1 on every light surface in use.
        "tan-hover": "#6E512B",
        // Coastal Palette - Beach vacation aesthetic
        "coastal-blue": "#0EA5E9",      // Ocean blue (Tailwind sky-500)
        "coastal-teal": "#14B8A6",      // Coastal teal (Tailwind teal-500)
        "coastal-aqua": "#22D3EE",      // Bright aqua (Tailwind cyan-400)
        "coastal-sand": "#FCD34D",      // Sandy yellow (Tailwind amber-300)
        "coastal-mist": "#F0F9FF",      // Soft blue-gray (Tailwind sky-50)
        "coastal-sunrise": "#FB923C",   // Peachy sunrise (Tailwind orange-400)
        "coastal-foam": "#A5F3FC",      // Seafoam (Tailwind cyan-200)
        "coastal-dune": "#FDE68A",      // Light sand (Tailwind amber-200)
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out",
        "fade-in-delay": "fadeIn 1s ease-out 0.3s both",
        "fade-in-delay-2": "fadeIn 1s ease-out 0.6s both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
