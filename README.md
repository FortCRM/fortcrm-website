# fortcrm.nl

Astro-site, gehost op Cloudflare Pages. Teksten en blog worden beheerd in Keystatic. De opmaak volgt de huisstijl van de oorspronkelijke fortcrm.nl: kleuren krijt, inkt, viridiaan, salie, vermiljoen, oker en omber; lettertypes Space Grotesk, Inter en JetBrains Mono.

## Lokaal draaien

```bash
npm install
npm run dev
```

Site op http://localhost:4321, beheer op http://localhost:4321/keystatic. Lokaal schrijft Keystatic direct in de bestanden.

## Waar staat wat

| Wat | Waar | Te bewerken in Keystatic |
| --- | --- | --- |
| Homepage NL en EN | `src/content/home/` | Homepage |
| Menu, footer, formulier, cookiemelding, blogteksten | `src/content/instellingen/` | Menu, footer en formulier |
| Landingspagina's (voor wie) | `src/content/landing/` | Landingspagina's |
| Blog | `src/content/blog/nl` en `/en` | Blog |
| Quick scan: teksten in de uitslag | `src/content/quickscan/` | Quick scan: uitslagteksten |
| Teamfoto's | `public/images/team/` | via Over ons |
| Vragen en scoring quick scan, formulierlogica | `public/js/site.js` | nee |
| Formulier-webhook, afspraakplanner, Analytics | `src/consts.ts` | nee |
| Iconen en kleuren voor kaarten | `src/lib/iconen.ts` | kiezen per kaart, nieuwe iconen niet |
| Opmaak en huisstijl | `tailwind.config.mjs`, `src/styles/global.css`, `src/components/` | nee |

## Online

- Cloudflare Pages bouwt bij elke push: `npm run build`, uitvoermap `dist`.
- Keystatic online op `/keystatic` werkt via de GitHub-app van FortCRM. Opslaan is een commit op de gekozen branch, waarna Cloudflare opnieuw bouwt.
- GitHub-app: `fortcrm-keystatic` (FortCRM-organisatie). App-naam staat in `.env.production`, client ID in `wrangler.jsonc`.
- Versleutelde secrets in Cloudflare Pages (Settings, Variables and Secrets): `KEYSTATIC_GITHUB_CLIENT_SECRET` en `KEYSTATIC_SECRET`.

## Formulieren

Contactformulier en quick scan posten naar de n8n-workflow *Websiteformulieren naar Pipedrive*. Die accepteert alleen verzoeken vanaf de domeinen in zijn CORS-lijst.

## Regels

- Geen em dash in teksten.
- Nederlands is leidend; een wijziging in het Nederlands komt niet vanzelf in het Engels.
