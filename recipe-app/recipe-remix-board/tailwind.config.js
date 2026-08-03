/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Fraunces: warm, characterful serif for recipe names & headings
        display: ["Fraunces", "serif"],
        // Inter: clean, quiet body face so the display face stays special
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(42 30% 85%)",
        background: "hsl(42 45% 96%)",
        foreground: "hsl(90 8% 14%)",
        primary: {
          DEFAULT: "hsl(103 24% 27%)",
          foreground: "hsl(42 45% 97%)",
        },
        // Distinct from primary on purpose: this marks substituted
        // ingredients specifically, so a swap never gets confused with
        // ordinary brand-colored UI (buttons, checkboxes, links).
        accent: {
          DEFAULT: "hsl(14 62% 41%)",
          foreground: "hsl(42 45% 97%)",
        },
        muted: {
          DEFAULT: "hsl(42 32% 91%)",
          foreground: "hsl(90 8% 40%)",
        },
        destructive: {
          DEFAULT: "hsl(4 62% 42%)",
          foreground: "hsl(42 45% 97%)",
        },
        warning: {
          DEFAULT: "hsl(38 72% 51%)",
          foreground: "hsl(30 45% 18%)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.3rem",
      },
    },
  },
  plugins: [],
};
