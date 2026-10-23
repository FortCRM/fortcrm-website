import { getCollection, getEntry } from "astro:content";
import type { Lang } from "@consts";

export async function home(lang: Lang) {
  const e = await getEntry("home", lang);
  if (!e) throw new Error(`Homepage ${lang} ontbreekt`);
  return e.data as any;
}

export async function instellingen(lang: Lang) {
  const e = await getEntry("instellingen", lang);
  if (!e) throw new Error(`Instellingen ${lang} ontbreken`);
  return e.data as any;
}

const slugVan = (id: string) => id.split("/").slice(1).join("/");

export async function posts(lang: Lang) {
  return (await getCollection("blog"))
    .filter((p) => p.id.startsWith(`${lang}/`))
    .map((p) => ({ ...p, slug: slugVan(p.id) }))
    .sort((a, b) => b.data.datum.valueOf() - a.data.datum.valueOf());
}

export async function landingspaginas(lang: Lang) {
  return (await getCollection("landing"))
    .filter((p) => p.id.startsWith(`${lang}/`))
    .map((p) => ({ ...p, slug: slugVan(p.id) }));
}
