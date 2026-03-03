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
        /* Primary warmth */
        terracotta: "#C4724E",
        amber: "#D4A76A",
        cream: "#F5F0E8",
        "warm-gray": "#B5AFA6",

        /* Secondary earth */
        sage: "#8B9E7E",
        "dusty-rose": "#C9A5A0",
        slate: "#7A8B9A",

        /* Accent */
        coral: "#C95D45",

        /* Neutrals */
        ink: {
          DEFAULT: "#2C2824",
          light: "#5C554E",
          lighter: "#8A847D",
        },
        border: "#E2DCD5",
        surface: "#FAF8F5",
        background: "#F5F0E8",
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
      typography: {
        DEFAULT: {
          css: {
            color: "#2C2824",
            maxWidth: "40rem",
            fontFamily: 'var(--font-serif), "Cormorant Garamond", Georgia, serif',
            lineHeight: "1.75",
            a: {
              color: "#C4724E",
              textDecoration: "none",
              "&:hover": {
                color: "#C95D45",
              },
            },
            strong: {
              color: "#2C2824",
              fontWeight: "600",
            },
            em: {
              fontStyle: "italic",
            },
            blockquote: {
              color: "#5C554E",
              borderLeftColor: "#C4724E",
              fontStyle: "italic",
              quotes: "none",
            },
            h2: {
              color: "#2C2824",
              fontFamily: 'var(--font-sans), "Futura PT", Jost, system-ui, sans-serif',
              fontWeight: "500",
              letterSpacing: "-0.02em",
            },
            h3: {
              color: "#2C2824",
              fontFamily: 'var(--font-sans), "Futura PT", Jost, system-ui, sans-serif',
              fontWeight: "500",
              letterSpacing: "-0.02em",
            },
            h4: {
              color: "#2C2824",
              fontFamily: 'var(--font-sans), "Futura PT", Jost, system-ui, sans-serif',
              fontWeight: "500",
            },
            code: {
              color: "#2C2824",
              fontFamily: 'var(--font-mono), "Degular Mono", "DM Mono", monospace',
              fontWeight: "400",
              fontSize: "0.875em",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            hr: {
              borderColor: "#E2DCD5",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
