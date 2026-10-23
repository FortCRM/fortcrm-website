import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

/** Huisstijl van de oorspronkelijke fortcrm.nl */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}", "./public/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        viridiaan: "#2C6C4F",
        salie: "#5B8073",
        vermiljoen: "#DB7F28",
        oker: "#D99F3C",
        omber: "#8B5E3C",
        inkt: "rgb(var(--color-inkt) / <alpha-value>)",
        krijt: "rgb(var(--color-krijt) / <alpha-value>)",
        // vaste achtergrond van de eerste tabelkolom, gelijk aan krijt + salie/10
        tabelkop: "rgb(var(--color-tabelkop) / <alpha-value>)",
      },
      fontFamily: {
        display: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      opacity: { 8: "0.08" },
    },
  },
  plugins: [typography],
};
