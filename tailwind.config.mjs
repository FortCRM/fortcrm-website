import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Lora", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        // FortCRM-accent, spaarzaam gebruikt: knoppen en markeringen
        fort: { DEFAULT: "#4D763D", dark: "#9CC48A" },
        oker: "#D99F3C",
      },
    },
  },
  plugins: [typography],
};
