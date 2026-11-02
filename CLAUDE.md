# fortcrm-website

Website fortcrm.nl. Astro 5 + Tailwind 3, gehost op Cloudflare Pages, teksten en blog in Keystatic. Zie `README.md` voor waar welke inhoud staat.

## Status

- Joost Beers doet FortCRM voortaan alleen. Het Pipedrive-partnership verhuist naar zijn persoonlijke label, met een eigen nieuwe site (aparte repo). Deze site blijft voorlopig bestaan.
- Standaardbranch is `astro`, niet `main`.

## Commando's

```
npm install
npm run dev      # http://localhost:4321, beheer op /keystatic
npm run build    # naar dist/
npm run check    # astro check
```

## Hoe het werkt

- Cloudflare Pages bouwt bij elke push (`npm run build`, uitvoer `dist`). Config in `wrangler.jsonc`.
- Keystatic online via de GitHub-app `fortcrm-keystatic`. Opslaan in Keystatic is een commit.
- Formulieren (contact en CRM-check) posten naar de n8n-workflow "Websiteformulieren naar Pipedrive" op fortcrm.app.n8n.cloud. Endpoint in `src/consts.ts`. CORS-lijst in die workflow aanpassen bij een nieuw domein.
- `monitor/` is een losse Cloudflare Worker met een eigen `wrangler.jsonc`.
- Huisstijl: kleuren krijt, inkt, viridiaan, salie, vermiljoen, oker, omber; fonts Space Grotesk, Inter, JetBrains Mono. Tokens in `tailwind.config.mjs` en `src/styles/global.css`.

## Regels

- Nederlands is leidend; een NL-wijziging gaat niet vanzelf naar EN.
- Geen em dash.
- Geen verzonnen cijfers of testimonials.
- Secrets alleen als versleutelde secret in Cloudflare, nooit in de repo.
