import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Richer forest + teal undertone */
        cps: {
          50: "#ecf5f0",
          100: "#d4e8de",
          200: "#a8cfba",
          300: "#74b08e",
          400: "#3f8f68",
          500: "#267352",
          600: "#1c5c41",
          700: "#174a36",
          800: "#123c2c",
          900: "#0e3024",
          950: "#051a12",
        },
        ink: "#0b1220",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        insetSoft: "inset 0 1px 0 rgba(255,255,255,0.65)",
      },
    },
  },
  plugins: [],
};

export default config;
