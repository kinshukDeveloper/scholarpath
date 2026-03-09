import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      colors: {
        // Primary green accent
        emerald: {
          300: "#6ee7b7",
          400: "#34d399",   // ← main accent
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
      },
      // Custom background for cards
      backgroundColor: {
        "card":  "rgb(15 18 30 / 1)",
        "card2": "rgb(20 24 40 / 1)",
      },
      // Keyframes used in components
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
      },
      animation: {
        shimmer:  "shimmer 2s infinite linear",
        "fade-up": "fade-up 0.5s ease forwards",
      },
    },
  },
  plugins: [],
}

export default config