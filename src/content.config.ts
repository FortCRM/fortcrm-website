import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Alle inhoud wordt in Keystatic beheerd; hier leest Astro dezelfde bestanden.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    titel: z.string(),
    omschrijving: z.string().default(""),
    datum: z.coerce.date(),
    tldr: z.array(z.string()).default([]),
    vertaling: z.string().nullish(),
  }),
});

const landing = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/landing" }),
  schema: z.object({
    titel: z.string(),
    beschrijving: z.string().default(""),
    eyebrow: z.string().default(""),
    kop: z.string(),
    intro: z.string().default(""),
    pijnTitel: z.string().default(""),
    pijnpunten: z.array(z.string()).default([]),
    inrichtingTitel: z.string().default(""),
    inrichting: z.array(z.object({ titel: z.string(), tekst: z.string() })).default([]),
    slot: z.string().default(""),
  }),
});

const home = defineCollection({ loader: glob({ pattern: "*.yaml", base: "./src/content/home" }), schema: z.any() });
const instellingen = defineCollection({ loader: glob({ pattern: "*.yaml", base: "./src/content/instellingen" }), schema: z.any() });

const quickscan = defineCollection({ loader: glob({ pattern: "*.yaml", base: "./src/content/quickscan" }), schema: z.any() });

export const collections = { blog, landing, home, instellingen, quickscan };
