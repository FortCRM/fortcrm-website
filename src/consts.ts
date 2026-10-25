// Technische instellingen. Teksten staan in Keystatic (src/content/instellingen).
export const SITE = {
  NAME: "FortCRM",
  URL: "https://fortcrm.nl",
  // n8n-workflow "Websiteformulieren naar Pipedrive"
  FORM_ENDPOINT: "https://fortcrm.app.n8n.cloud/webhook/fortcrm-website-formulier",
  SCHEDULER_URL: "https://rf-fortcrm.pipedrive.com/scheduler/dGE6r8sD/kennismaking-fortcrm",
  GA_ID: "G-SLD185WBNG",
  BLOG_IN_FOOTER: 3,
  // pad van de online CRM-check (vroeger /quick-scan/, die redirect staat in public/_redirects)
  CHECK: "/crm-check/",
};

export type Lang = "nl" | "en";
export const pad = (lang: Lang, p = "/") => (lang === "en" ? `/en${p}` : p);
// aparte pagina met alle pakketten en prijzen
export const pakkettenPad = (lang: Lang) => (lang === "en" ? "/en/packages/" : "/pakketten/");
