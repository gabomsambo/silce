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
        primary: "#1a1a1a",
        tan: "#D2B48C",
        muted: "#F5F5F5",
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
