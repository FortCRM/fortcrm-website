import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// "Pipedrive dat je team _écht_ gebruikt." -> delen met en zonder nadruk
export function splitNadruk(tekst: string) {
  return tekst.split(/_(.+?)_/).map((deel, i) => ({ deel, nadruk: i % 2 === 1 }));
}

export function formatDatum(datum: Date, lang: "nl" | "en") {
  return datum.toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}
