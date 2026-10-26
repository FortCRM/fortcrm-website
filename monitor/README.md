# fortcrm-formulier-monitor

Cloudflare Worker die dagelijks om 07:17 UTC (08:17 of 09:17 Nederlandse tijd) controleert of de formulier-webhook van fortcrm.nl werkt. Bij twee mislukte pogingen achter elkaar volgt een melding in de Google Chat-space voor foutmeldingen.

Waarom buiten n8n: als n8n uitvalt of de flow niet actief is, merkt n8n dat zelf niet. Fouten verderop in de flow (Pipedrive, data table) vangt de errorworkflow "Error melding n8n flow" al af.

## Wat er gecontroleerd wordt

- POST `{ "soort": "ping" }` naar de webhook, met `Origin: https://fortcrm.nl`, net als de site.
- De flow "Websiteformulieren naar Pipedrive" antwoordt daarop `{ "ok": true, "ping": true }` en slaat niets op.
- Fout als: geen antwoord binnen 15 seconden, een status anders dan 2xx, CORS die fortcrm.nl niet toestaat, of een ander antwoord dan de ping.

## Eenmalig instellen

1. Maak in Google Chat, in de foutmeldingen-space, een webhook aan: Apps en integraties > Webhooks > Toevoegen. Kopieer de URL.
2. In deze map:

   ```
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put CHAT_WEBHOOK_URL
   ```

   Plak bij de laatste stap de webhook-URL. Deel die URL niet in chats of documenten.

3. Testen zonder te wachten: `npx wrangler dev --test-scheduled` en dan `curl "http://localhost:8787/__scheduled?cron=17+7+*+*+*"`.

## Logboek

De uitkomst van elke check staat in Cloudflare onder Workers > fortcrm-formulier-monitor > Logs.
