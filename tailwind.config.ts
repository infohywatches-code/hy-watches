import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#000000",
          800: "#080809",
          700: "#0E0E11",
          600: "#15151A",
        },
        gold: {
          DEFAULT: "#D4AF37",
          soft: "#C5A059",
        },
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "-apple-system", "'Segoe UI'", "sans-serif"],
        mono: ["'Space Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16,1,0.3,1)",
        mass: "cubic-bezier(0.65,0,0.35,1)",
        spring: "cubic-bezier(0.34,1.32,0.5,1)",
      },
      maxWidth: {
        shell: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
