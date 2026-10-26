import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import keystatic from "@keystatic/astro";

// Statische site; alleen Keystatic (/keystatic en /api/keystatic) draait als functie op Cloudflare.
export default defineConfig({
  site: "https://fortcrm.nl",
  output: "static",
  adapter: cloudflare({ imageService: "compile" }),
  integrations: [
    react(),
    keystatic(),
    tailwind(),
    sitemap({ filter: (page) => !page.includes("/keystatic") && !page.includes("/404") }),
  ],
  vite: {
    // Keystatic leest zijn geheimen via astro:env; niet voorbundelen
    optimizeDeps: { exclude: ["@keystatic/astro"] },
  },
});
