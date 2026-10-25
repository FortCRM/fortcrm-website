import { config, collection, singleton, fields } from "@keystatic/core";
import { ICOON_OPTIES, KLEUR_OPTIES } from "./src/lib/iconen";

// Keystatic: lokaal schrijft het in de map zelf, online commit het via de GitHub-app naar de repo.
const storage = import.meta.env.DEV
  ? ({ kind: "local" } as const)
  : ({ kind: "github", repo: { owner: "FortCRM", name: "fortcrm-website" } } as const);

const tekst = (label: string, description?: string) => fields.text({ label, description });
const alinea = (label: string, description?: string) => fields.text({ label, description, multiline: true });

const lijst = <T extends Parameters<typeof fields.array>[0]>(element: T, label: string, itemLabel?: (p: any) => string) =>
  fields.array(element, { label, itemLabel });

const icoon = (standaard = "geen") =>
  fields.select({ label: "Icoon", description: "Uit de vaste iconenset van de huisstijl.", options: ICOON_OPTIES, defaultValue: standaard });
const kleur = () =>
  fields.select({ label: "Kleur van de stip", description: "Grijs is neutraal.", options: KLEUR_OPTIES, defaultValue: "grijs" });

const kop = {
  eyebrow: tekst("Klein kopje boven de titel"),
  titel: tekst("Titel"),
};

// ---------- homepage (zelfde opbouw voor NL en EN) ----------
const homeSchema = {
  seo: fields.object(
    {
      titel: tekst("Paginatitel in Google en het tabblad"),
      beschrijving: alinea("Beschrijving in Google", "Ongeveer 150 tekens."),
      deelTitel: tekst("Titel bij delen op LinkedIn en WhatsApp"),
    },
    { label: "Vindbaarheid" },
  ),
  hero: fields.object(
    {
      eyebrow: tekst("Klein kopje boven de titel"),
      titel: tekst("Titel", "Zet het woord dat dun moet tussen _liggende streepjes_, bijvoorbeeld: Pipedrive dat je team _écht_ gebruikt."),
      intro: alinea("Inleiding"),
      uitleg: alinea("Korte uitleg onder de knoppen", "Voor wie niet weet wat een CRM of Pipedrive is. Leeg = verbergen."),
      beeldOnderschrift: tekst("Bijschrift onder het beeld", "Leeg = geen bijschrift."),
      belofte: tekst("Belofte in het vet"),
      knopGesprek: tekst("Knop gesprek plannen"),
      knopPakketten: tekst("Knop naar pakketten"),
      knopScan: tekst("Tekstlink CRM-check", "Bijvoorbeeld: Of doe eerst de CRM-check (2 min). Leeg = verbergen."),
      knopDemo: tekst("Tekstlink demo", "Klein linkje onder de knop naar het formulier. Leeg = verbergen."),
      beeld: fields.image({ label: "Beeld rechts", description: "Bijvoorbeeld een geanonimiseerd Pipedrive-scherm. Leeg = voorbeeldpijplijn.", directory: "public/images/hero", publicPath: "/images/hero/" }),
      beeldAlt: tekst("Omschrijving van het beeld (voor schermlezers)"),
      voetnoot: alinea("Voetnoot bij de belofte"),
    },
    { label: "Bovenaan (hero)" },
  ),
  pipedrive: fields.object(
    {
      ...kop,
      tekst: alinea("Wat het partnerschap jou oplevert"),
      voordelen: lijst(tekst("Voordeel"), "Voordelen van het partnerschap", (p) => p.value),
      functiesTitel: tekst("Kopje boven de functies"),
      functies: lijst(
        fields.object({ titel: tekst("Functie"), tekst: alinea("Korte uitleg"), icoon: icoon() }),
        "Functies van Pipedrive",
        (p) => p.fields.titel.value,
      ),
      knop: tekst("Linktekst proefperiode", "Leeg = verbergen."),
      knopLink: tekst("Link proefperiode", "Partnerlink van FortCRM voor de proefperiode."),
    },
    { label: "Pipedrive-partnerschap", description: "Staat direct onder de hero, met de partnerbadge." },
  ),
  ai: fields.object(
    {
      tonen: fields.checkbox({ label: "Blok tonen", defaultValue: true }),
      ...kop,
      intro: alinea("Intro"),
      kolommen: lijst(
        fields.object({
          titel: tekst("Titel kolom"),
          icoon: icoon(),
          punten: lijst(
            fields.object({ vet: tekst("Vet begin (optioneel)"), tekst: alinea("Tekst") }),
            "Punten",
            (p) => p.fields.vet.value || p.fields.tekst.value,
          ),
        }),
        "Kolommen",
        (p) => p.fields.titel.value,
      ),
      slot: tekst("Slotregel"),
    },
    { label: "AI en koppelingen", description: "Donker blok onder het Pipedrive-partnerschap." },
  ),
  herkenbaar: fields.object(
    {
      ...kop,
      kaarten: lijst(
        fields.object({ citaat: tekst("Citaat"), tekst: alinea("Toelichting") }),
        "Kaarten",
        (p) => p.fields.citaat.value,
      ),
      slotVet: tekst("Slotzin, vet deel"),
      slot: alinea("Slotzin, rest"),
    },
    { label: "Herkenbaar" },
  ),
  aanpak: fields.object(
    {
      ...kop,
      intro: alinea("Inleiding"),
      stappen: lijst(
        fields.object({ titel: tekst("Stap"), tekst: alinea("Uitleg"), resultaat: tekst("Resultaat") }),
        "Stappen",
        (p) => p.fields.titel.value,
      ),
      naderhandTitel: tekst("Daarna: titel"),
      naderhandTekst: alinea("Daarna: tekst"),
    },
    { label: "Aanpak" },
  ),
  voorWie: fields.object(
    {
      ...kop,
      kaarten: lijst(
        fields.object({
          titel: tekst("Titel"),
          tekst: alinea("Tekst"),
          icoon: icoon(),
          foto: fields.image({ label: "Foto", description: "Optioneel. Liggend, minstens 800 px breed.", directory: "public/images/voor-wie", publicPath: "/images/voor-wie/" }),
          pagina: tekst("Link naar landingspagina", "De korte naam van de pagina, bijvoorbeeld weinig-deals. Leeg = geen link."),
        }),
        "Soorten bedrijven",
        (p) => p.fields.titel.value,
      ),
      meerTekst: tekst("Linktekst op de kaarten", "Bijvoorbeeld: Bekijk wat we inrichten"),
      oproep: alinea("Zin onder de kaarten"),
      oproepLink: tekst("Linktekst in die zin", "Dit stuk tekst wordt de link naar de afspraakplanner. Moet letterlijk in de zin staan."),
      nietVoorTitel: tekst("Voor wie niet: titel"),
      nietVoorTekst: alinea("Voor wie niet: tekst"),
    },
    { label: "Voor wie" },
  ),
  scan: fields.object(
    {
      tonen: fields.checkbox({ label: "Blok CRM-check tonen", defaultValue: true }),
      ...kop,
      tekst: alinea("Tekst"),
      knop: tekst("Knop"),
    },
    { label: "CRM-check-blok" },
  ),
  pakketten: fields.object(
    {
      ...kop,
      intro: alinea("Inleiding"),
      kolommen: lijst(
        fields.object({
          naam: tekst("Pakket"),
          prijs: tekst("Prijs", "Bijvoorbeeld €7.950"),
          uitgelicht: fields.checkbox({ label: "Uitgelicht", defaultValue: false }),
          badge: tekst("Label boven het pakket", "Bijvoorbeeld: Meest gekozen. Leeg = geen label."),
          kleur: kleur(),
        }),
        "Pakketten (kolommen)",
        (p) => p.fields.naam.value,
      ),
      rijen: lijst(
        fields.object({
          onderdeel: tekst("Onderdeel"),
          waarden: lijst(tekst("Waarde"), "Waarde per pakket, in dezelfde volgorde als de kolommen. Eén waarde = over de hele breedte."),
        }),
        "Rijen",
        (p) => p.fields.onderdeel.value,
      ),
      prijsnoot: alinea("Noot onder de tabel"),
      slaKnop: tekst("Knop om de onderhoudsabonnementen uit te klappen"),
      slaEyebrow: tekst("SLA: klein kopje"),
      slaTitel: tekst("SLA: titel"),
      slaIntro: alinea("SLA: inleiding"),
      slaKolommen: lijst(
        fields.object({
          naam: tekst("Niveau"),
          prijs: tekst("Prijs per maand"),
          uitgelicht: fields.checkbox({ label: "Uitgelicht", defaultValue: false }),
          badge: tekst("Label boven het niveau", "Leeg = geen label."),
          kleur: kleur(),
        }),
        "SLA-niveaus",
        (p) => p.fields.naam.value,
      ),
      slaRijen: lijst(
        fields.object({ onderdeel: tekst("Onderdeel"), waarden: lijst(tekst("Waarde"), "Waarde per niveau") }),
        "SLA-rijen",
        (p) => p.fields.onderdeel.value,
      ),
      knopVoorstel: tekst("Knop voorstel aanvragen"),
      knopScan: tekst("Tekstlink CRM-check", "Leeg = verbergen."),
    },
    { label: "Pakketten en SLA" },
  ),
  garantie: fields.object(
    {
      getal: tekst("Groot getal", "Bijvoorbeeld 60"),
      getalTekst: tekst("Tekst onder het getal"),
      ...kop,
      punten: lijst(tekst("Punt"), "Punten"),
      noot: tekst("Noot"),
    },
    { label: "Garantie" },
  ),
  waarom: fields.object(
    {
      tonen: fields.checkbox({ label: "Blok Waarom FortCRM tonen", defaultValue: false }),
      ...kop,
      punten: lijst(
        fields.object({ titel: tekst("Titel"), tekst: alinea("Tekst"), icoon: icoon("vinkje") }),
        "Redenen",
        (p) => p.fields.titel.value,
      ),
    },
    { label: "Waarom FortCRM" },
  ),
  team: fields.object(
    {
      ...kop,
      intro: alinea("Inleiding"),
      mensen: lijst(
        fields.object({
          naam: tekst("Naam"),
          rol: tekst("Rol"),
          tekst: alinea("Over"),
          foto: fields.image({ label: "Foto", directory: "public/images/team", publicPath: "/images/team/" }),
          linkedin: fields.url({ label: "LinkedIn-profiel" }),
          linkedinTekst: tekst("Linktekst LinkedIn"),
        }),
        "Mensen",
        (p) => p.fields.naam.value,
      ),
      noot: tekst("Noot onder het team"),
    },
    { label: "Over ons" },
  ),
  bewijs: fields.object(
    {
      logosTitel: tekst("Kopje bij de logo's", "Bijvoorbeeld: Zij werken al met ons"),
      logos: lijst(
        fields.object({
          naam: tekst("Bedrijfsnaam"),
          logo: fields.image({ label: "Logo", description: "Liefst SVG of PNG met transparante achtergrond. Alleen met toestemming van de klant.", directory: "public/images/logos", publicPath: "/images/logos/" }),
        }),
        "Klantlogo's",
        (p) => p.fields.naam.value,
      ),
      cijfers: lijst(
        fields.object({ getal: tekst("Getal", "Bijvoorbeeld 12 of 6 weken"), tekst: tekst("Toelichting") }),
        "Kerncijfers (max. 3)",
        (p) => `${p.fields.getal.value} ${p.fields.tekst.value}`,
      ),
      reviewsEyebrow: tekst("Reviews: klein kopje"),
      reviewsTitel: tekst("Reviews: titel"),
      reviews: lijst(
        fields.object({
          citaat: alinea("Citaat"),
          naam: tekst("Naam"),
          functie: tekst("Functie"),
          bedrijf: tekst("Bedrijf"),
          foto: fields.image({ label: "Foto", directory: "public/images/reviews", publicPath: "/images/reviews/" }),
        }),
        "Reviews",
        (p) => p.fields.naam.value,
      ),
      caseTonen: fields.checkbox({ label: "Uitgelichte case tonen", defaultValue: false }),
      case: fields.object(
        {
          eyebrow: tekst("Klein kopje", "Bijvoorbeeld: Case"),
          klant: tekst("Klant"),
          titel: tekst("Titel"),
          tekst: alinea("Situatie en aanpak"),
          resultaten: lijst(tekst("Resultaat"), "Resultaten", (p) => p.value),
          citaat: alinea("Citaat van de klant (optioneel)"),
          citaatNaam: tekst("Naam en functie bij het citaat"),
          foto: fields.image({ label: "Foto", directory: "public/images/cases", publicPath: "/images/cases/" }),
          link: tekst("Link naar het volledige verhaal (optioneel)"),
        },
        { label: "Case" },
      ),
      videoEyebrow: tekst("Video: klein kopje"),
      videoTitel: tekst("Video: titel"),
      videoUrl: fields.url({ label: "Video: YouTube- of Vimeo-link", description: "Leeg = geen videoblok." }),
    },
    { label: "Bewijs: logo's, cijfers, reviews, case, video", description: "Elk blok verschijnt pas als het is ingevuld." },
  ),
  faq: fields.object(
    {
      ...kop,
      vragen: lijst(
        fields.object({ vraag: tekst("Vraag"), antwoord: alinea("Antwoord") }),
        "Vragen",
        (p) => p.fields.vraag.value,
      ),
    },
    { label: "Veelgestelde vragen" },
  ),
  contact: fields.object(
    {
      ...kop,
      intro: alinea("Inleiding"),
      knopPlanner: tekst("Knop afspraakplanner"),
      reactietijd: tekst("Reactietijd"),
    },
    { label: "Contact" },
  ),
};

// ---------- instellingen: menu, footer, formulier, blogteksten ----------
const instellingenSchema = {
  menu: fields.object(
    {
      pipedrive: tekst("Pipedrive", "Leeg = niet in het menu."),
      aanpak: tekst("Aanpak"),
      pakketten: tekst("Pakketten"),
      voorWie: tekst("Voor wie"),
      overOns: tekst("Over ons"),
      faq: tekst("Veelgestelde vragen"),
      quickscan: tekst("CRM-check", "Leeg = niet in het menu."),
      blog: tekst("Blog"),
      knop: tekst("Knop gesprek plannen"),
      menu: tekst("Menuknop op mobiel"),
      andereTaal: tekst("Link naar de andere taal"),
    },
    { label: "Menu" },
  ),
  bedrijf: fields.object(
    {
      mail: tekst("E-mailadres"),
      telefoon: tekst("Telefoonnummer"),
      kvk: tekst("KvK-nummer"),
      linkedin: fields.url({ label: "LinkedIn-bedrijfspagina" }),
    },
    { label: "Bedrijfsgegevens" },
  ),
  footer: fields.object(
    {
      tagline: alinea("Zin onder het logo"),
      paginas: tekst("Kopje pagina's"),
      contact: tekst("Kopje contact"),
      artikelen: tekst("Kopje laatste artikelen"),
      linkedin: tekst("Linktekst LinkedIn"),
      privacy: tekst("Regel privacyverklaring"),
      partner: tekst("Regel Pipedrive-partner"),
      cookieknop: tekst("Knop cookievoorkeuren"),
    },
    { label: "Footer" },
  ),
  cookies: fields.object(
    { tekst: alinea("Tekst"), weigeren: tekst("Knop weigeren"), akkoord: tekst("Knop akkoord") },
    { label: "Cookiemelding" },
  ),
  formulier: fields.object(
    {
      kop: tekst("Kopje boven het contactformulier", "Bijvoorbeeld: Liever eerst een vraag stellen?"),
      naam: tekst("Label naam"),
      mail: tekst("Label e-mail"),
      bron: tekst("Label hoe ken je ons"),
      bronKies: tekst("Eerste keuze in de lijst"),
      bronOpties: fields.object(
        {
          referral: tekst("Aanbevolen"),
          linkedin: tekst("LinkedIn"),
          zoeken: tekst("Gezocht"),
          netwerk: tekst("Kennen elkaar"),
          pipedrive: tekst("Via Pipedrive"),
          anders: tekst("Anders"),
        },
        { label: "Keuzes hoe ken je ons", description: "Alleen de tekst is aan te passen; de waarde achter elke keuze gaat naar Pipedrive." },
      ),
      keuzeDemo: tekst("Keuze demo", "Bijvoorbeeld: Ik wil een demo. Leeg = geen keuze tonen."),
      keuzeVraag: tekst("Keuze vraag", "Bijvoorbeeld: Ik heb een vraag"),
      vraagDemo: tekst("Label tekstveld bij demo"),
      vraag: tekst("Label vraag"),
      nieuwsbrief: alinea("Vinkje nieuwsbrief onder het formulier", "Aanvinken zet het contact in Pipedrive op geabonneerd voor Campaigns. Leeg = geen vinkje."),
      verstuurDemo: tekst("Knop versturen bij demo"),
      verstuur: tekst("Knop versturen"),
      privacy: tekst("Regel onder het formulier"),
      planner: tekst("Titel afspraakplanner"),
      sluiten: tekst("Knop sluiten"),
    },
    { label: "Contactformulier" },
  ),
  blog: fields.object(
    {
      titel: tekst("Titel blogoverzicht"),
      intro: alinea("Inleiding blogoverzicht"),
      beschrijving: tekst("Beschrijving in Google"),
      terug: tekst("Link terug naar overzicht"),
      tldr: tekst("Kopje samenvatting"),
      cta: alinea("Oproep onder elk artikel"),
      ctaKnop: tekst("Knop onder elk artikel"),
      delen: tekst("Kopje delen"),
      kopieer: tekst("Knop link kopiëren"),
      gekopieerd: tekst("Melding link gekopieerd"),
    },
    { label: "Blog" },
  ),
};

// ---------- landingspagina's ----------
const landingSchema = {
  titel: fields.slug({ name: { label: "Titel in Google en het tabblad" } }),
  beschrijving: alinea("Beschrijving in Google"),
  eyebrow: tekst("Klein kopje"),
  kop: tekst("Grote titel"),
  intro: alinea("Inleiding"),
  pijnTitel: tekst("Kopje herkenbaar"),
  pijnpunten: lijst(tekst("Punt"), "Herkenbare punten"),
  inrichtingTitel: tekst("Kopje wat we inrichten"),
  inrichting: lijst(
    fields.object({ titel: tekst("Titel"), tekst: alinea("Tekst"), icoon: icoon() }),
    "Wat we inrichten",
    (p) => p.fields.titel.value,
  ),
  slot: alinea("Slotzin"),
};

// ---------- blog ----------
const blogSchema = {
  titel: fields.slug({ name: { label: "Titel" } }),
  seoTitel: tekst("SEO-titel", "Korte titel voor Google, max. 50 tekens. Leeg = gewone titel."),
  omschrijving: alinea("Samenvatting", "Staat in het overzicht en in Google."),
  datum: fields.date({ label: "Datum" }),
  tldr: lijst(tekst("Punt"), "Kort samengevat", (p) => p.value),
  vertaling: tekst("Vertaling", "De korte naam (slug) van hetzelfde artikel in de andere taal. Leeg = geen vertaling."),
  inhoud: fields.markdoc({ label: "Artikel", extension: "md" }),
};

const blog = (label: string, map: string) =>
  collection({
    label,
    slugField: "titel",
    path: `src/content/blog/${map}/*`,
    format: { contentField: "inhoud" },
    entryLayout: "content",
    columns: ["titel", "datum"],
    schema: blogSchema,
  });

const landing = (label: string, map: string) =>
  collection({
    label,
    slugField: "titel",
    path: `src/content/landing/${map}/*`,
    format: { data: "yaml" },
    schema: landingSchema,
  });


// ---------- quick scan: alleen de teksten in de uitslag; vragen en scoring blijven code ----------
const drie = (label: string) =>
  fields.object(
    { niet: alinea("Nog niet op orde"), deels: alinea("Gedeeltelijk op orde"), wel: alinea("Op orde") },
    { label },
  );
const type = (label: string) =>
  fields.object(
    { kop: tekst("Kop"), tekst: alinea("Uitleg"), stap1: tekst("Eerste stap 1"), stap2: tekst("Eerste stap 2"), stap3: tekst("Eerste stap 3") },
    { label },
  );
const quickscanSchema = {
  niveaus: fields.object({ niet: tekst("Nog niet op orde"), deels: tekst("Gedeeltelijk op orde"), wel: tekst("Op orde") }, { label: "Labels per niveau" }),
  vastleggen: drie("Vastleggen"),
  opvolgen: drie("Opvolgen"),
  delen: drie("Delen"),
  typeA: type("Uitslag: veel aanvragen en orders"),
  typeB: type("Uitslag: maatwerk en advies"),
  typeC: type("Uitslag: weinig deals, hoge slagingskans"),
  typeD: type("Uitslag: nog zoekend"),
  wens: fields.object(
    { lead: alinea("Geen aanvraag laten liggen"), overzicht: alinea("Overzicht pipeline"), handwerk: alinea("Minder handwerk"), gebruik: alinea("Team dat het gebruikt") },
    { label: "Zin bij wat als eerste opgelost moet worden" },
  ),
};

export default config({
  storage,
  ui: {
    brand: { name: "FortCRM" },
    navigation: {
      Nederlands: ["homeNl", "landingNl", "blogNl", "quickscanNl", "instellingenNl"],
      English: ["homeEn", "landingEn", "blogEn", "instellingenEn"],
    },
  },
  singletons: {
    homeNl: singleton({ label: "Homepage", path: "src/content/home/nl", format: { data: "yaml" }, schema: homeSchema }),
    homeEn: singleton({ label: "Homepage (EN)", path: "src/content/home/en", format: { data: "yaml" }, schema: homeSchema }),
    quickscanNl: singleton({ label: "CRM-check: uitslagteksten", path: "src/content/quickscan/nl", format: { data: "yaml" }, schema: quickscanSchema }),
    instellingenNl: singleton({ label: "Menu, footer en formulier", path: "src/content/instellingen/nl", format: { data: "yaml" }, schema: instellingenSchema }),
    instellingenEn: singleton({ label: "Menu, footer en formulier (EN)", path: "src/content/instellingen/en", format: { data: "yaml" }, schema: instellingenSchema }),
  },
  collections: {
    landingNl: landing("Landingspagina's", "nl"),
    landingEn: landing("Landingspagina's (EN)", "en"),
    blogNl: blog("Blog", "nl"),
    blogEn: blog("Blog (EN)", "en"),
  },
});
