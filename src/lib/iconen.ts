// Iconenset uit de oude fortcrm.nl, uitgebreid. Gedeeld met Keystatic (keuzelijst) en de site.
// Alle paden in een 24x24 vlak, lijndikte 1.7, kleur via currentColor.
export const ICONEN = {
  geen: { label: "Geen icoon", svg: "" },
  vinkje: { label: "Vinkje", svg: '<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.4"/>' },
  tabel: { label: "Spreadsheet", svg: '<rect x="3" y="4" width="14" height="16" rx="1.5"/><path d="M3 9.5h14M8.5 9.5V20"/><path d="M18 13l3 3-3 3"/>' },
  gesprek: { label: "Gesprek met vraag", svg: '<path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 4v-4H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"/><path d="M10 10.2c0-1 .8-1.7 1.8-1.7 1 0 1.7.6 1.7 1.5 0 .8-.5 1.1-1 1.5-.4.3-.7.6-.7 1.2"/><circle cx="11.8" cy="15.3" r="0.6"/>' },
  zandloper: { label: "Zandloper", svg: '<path d="M6 4h12M6 20h12M7 4c0 4 3.5 5 3.5 8s-3.5 4-3.5 8M17 4c0 4-3.5 5-3.5 8s3.5 4 3.5 8"/>' },
  grafiek: { label: "Grafiek", svg: '<path d="M4 20V11M10 20V4M16 20v-6"/><path d="M2.5 20.5h19"/>' },
  offerte: { label: "Offerte", svg: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>' },
  mensen: { label: "Team", svg: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.5c2.6 0 4.5 1.6 4.5 4.5"/>' },
  trechter: { label: "Trechter (veel aanvragen)", svg: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>' },
  bliksem: { label: "Snel / automatisering", svg: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>' },
  koppeling: { label: "Koppeling", svg: '<path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.5-1.5"/>' },
  ai: { label: "AI", svg: '<path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"/><path d="M19 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>' },
  schild: { label: "Veilig", svg: '<path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/>' },
  doel: { label: "Doel", svg: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>' },
  klok: { label: "Tijd", svg: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
  hand: { label: "Persoonlijk contact", svg: '<path d="M7 11V6.5a1.5 1.5 0 013 0V11M10 10V4.5a1.5 1.5 0 013 0V10M13 10V5.5a1.5 1.5 0 013 0V12M16 9.5a1.5 1.5 0 013 0V14c0 4-3 7-7 7-3 0-4.5-1.5-6-4l-2.2-3.8a1.5 1.5 0 012.6-1.5L7 13"/>' },
  mail: { label: "E-mail", svg: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>' },
  agenda: { label: "Agenda", svg: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>' },
  afspraak: { label: "Afspraak inplannen", svg: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15.5l2 2 4-4"/>' },
  chat: { label: "Berichten / WhatsApp", svg: '<path d="M20 11.5a8 8 0 01-11.7 7.1L4 20l1.4-4.1A8 8 0 1120 11.5z"/><path d="M9 10.5h6M9 13.5h4"/>' },
  notitie: { label: "AI-notities", svg: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h3"/><path d="M19.5 13.5l.6 1.5 1.4.5-1.4.5-.6 1.5-.6-1.5-1.4-.5 1.4-.5z"/>' },
  mobiel: { label: "Mobiele app", svg: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>' },
  project: { label: "Projecten / planning", svg: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h6M9 13h7M7 17h4"/>' },
  herhalen: { label: "Bijsturen / herhalen", svg: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>' },
} as const;

export type IcoonNaam = keyof typeof ICONEN;
export const ICOON_OPTIES = Object.entries(ICONEN).map(([value, i]) => ({ value, label: i.label }));

// Kleuren uit de huisstijl. Tailwind-klassen staan voluit zodat ze in de build komen.
export const KLEUREN = {
  viridiaan: { label: "Viridiaan (groen)", hex: "#2C6C4F", zacht: "bg-viridiaan/15", pil: "bg-viridiaan/10", lijn: "border-viridiaan/40", vol: "bg-viridiaan", links: "border-l-viridiaan" },
  salie: { label: "Salie", hex: "#5B8073", zacht: "bg-salie/15", pil: "bg-salie/15", lijn: "border-salie/40", vol: "bg-salie", links: "border-l-salie" },
  vermiljoen: { label: "Vermiljoen (oranje)", hex: "#DB7F28", zacht: "bg-vermiljoen/15", pil: "bg-vermiljoen/10", lijn: "border-vermiljoen/40", vol: "bg-vermiljoen", links: "border-l-vermiljoen" },
  oker: { label: "Oker", hex: "#D99F3C", zacht: "bg-oker/20", pil: "bg-oker/20", lijn: "border-oker/40", vol: "bg-oker", links: "border-l-oker" },
  omber: { label: "Omber (bruin)", hex: "#8B5E3C", zacht: "bg-omber/15", pil: "bg-omber/15", lijn: "border-omber/40", vol: "bg-omber", links: "border-l-omber" },
  grijs: { label: "Grijs", hex: "currentColor", zacht: "bg-inkt/8", pil: "bg-inkt/8", lijn: "border-inkt/20", vol: "bg-inkt/35", links: "border-l-inkt/35" },
} as const;

export type KleurNaam = keyof typeof KLEUREN;
export const KLEUR_OPTIES = Object.entries(KLEUREN).map(([value, k]) => ({ value, label: k.label }));
export const REEKS: KleurNaam[] = ["viridiaan", "salie", "vermiljoen", "oker", "omber"];
export const kleurBij = (i: number, reeks: KleurNaam[] = REEKS) => KLEUREN[reeks[i % reeks.length]];
