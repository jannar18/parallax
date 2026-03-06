import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Riso Palette */
        paper: "#FDFCEA",
        oxblood: "#471f20",
        scarlet: { DEFAULT: "#f65058", dark: "#d4434a" },
        olive: "#b49f29",
        moss: "#68724d",
        spruce: "#4a635d",

        /* Legacy aliases */
        vermillion: { DEFAULT: "#f65058", light: "#f65058" },
        cream: "#FDFCEA",
        forest: "#4a635d",

        /* Neutrals */
        ink: {
          DEFAULT: "#471f20",
          light: "#6d4344",
          lighter: "#946768",
        },
        border: "#e8e5d8",
        surface: "#f8f6ea",
        background: "#FDFCEA",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Futura PT", "Jost", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Degular Mono", "DM Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.6" }],
        sm: ["0.875rem", { lineHeight: "1.6" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.25rem", { lineHeight: "1.35" }],
        "2xl": ["1.5rem", { lineHeight: "1.35" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
        "5xl": ["3rem", { lineHeight: "1.2" }],
        "6xl": ["3.75rem", { lineHeight: "1.2" }],
        "7xl": ["4.5rem", { lineHeight: "1.2" }],
      },
      fontWeight: {
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
      },
      letterSpacing: {
        tighter: "-0.02em",
        normal: "0",
        wide: "0.05em",
        wider: "0.1em",
      },
      lineHeight: {
        tight: "1.2",
        snug: "1.35",
        normal: "1.6",
        relaxed: "1.75",
      },
      spacing: {
        /* Extended spacing scale for generous section gaps */
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
        38: "9.5rem",
        42: "10.5rem",
      },
      maxWidth: {
        content: "72rem",
        text: "40rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
