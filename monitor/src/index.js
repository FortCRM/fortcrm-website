// fortcrm-formulier-monitor
// Controleert elk uur of de formulier-webhook van fortcrm.nl bereikbaar is, net zoals de site hem aanroept
// (POST met Origin https://fortcrm.nl). Gaat het twee keer achter elkaar mis, dan volgt een melding in de
// Google Chat-space voor foutmeldingen. Draait bewust buiten n8n: valt n8n uit, dan werkt deze check nog.
//
// De webhook antwoordt op { soort: "ping" } met { ok: true, ping: true } zonder iets op te slaan.
//
// Instellingen (wrangler.jsonc): WEBHOOK_URL, ORIGIN. Geheim: CHAT_WEBHOOK_URL (wrangler secret put).

const TIMEOUT_MS = 15000;
const HERHAAL_NA_MS = 30000;

async function ping(env) {
  const start = Date.now();
  try {
    const r = await fetch(env.WEBHOOK_URL, {
      method: "POST",
      // De webhook staat op "Ignore bots"; een kale user-agent kan dan geweigerd worden
      headers: {
        "Content-Type": "application/json",
        Origin: env.ORIGIN,
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 FortCRM-Formuliercheck",
      },
      body: JSON.stringify({ soort: "ping" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const ms = Date.now() - start;
    if (!r.ok) return { ok: false, reden: `HTTP ${r.status}`, ms };
    // Zonder deze header blokkeert de browser het antwoord, ook al is de status 200
    const cors = r.headers.get("access-control-allow-origin");
    if (cors && cors !== "*" && cors !== env.ORIGIN) return { ok: false, reden: `CORS staat ${env.ORIGIN} niet toe (${cors})`, ms };
    const json = await r.json().catch(() => null);
    if (!json || json.ping !== true) return { ok: false, reden: "onverwacht antwoord (ping-tak ontbreekt of flow gewijzigd)", ms };
    return { ok: true, ms };
  } catch (e) {
    return { ok: false, reden: e && e.name === "TimeoutError" ? `geen antwoord binnen ${TIMEOUT_MS / 1000} s` : `netwerkfout: ${e}`, ms: Date.now() - start };
  }
}

async function meld(env, tekst) {
  if (!env.CHAT_WEBHOOK_URL) { console.log("Geen CHAT_WEBHOOK_URL ingesteld:", tekst); return; }
  await fetch(env.CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ text: tekst }),
  });
}

async function controleer(env) {
  let r = await ping(env);
  if (!r.ok) {
    // Eén keer opnieuw, om een korte hapering niet te melden
    await new Promise((ok) => setTimeout(ok, HERHAAL_NA_MS));
    r = await ping(env);
  }
  console.log(JSON.stringify({ webhook: env.WEBHOOK_URL, ...r }));
  if (!r.ok) {
    await meld(env,
      `*Websiteformulieren fortcrm.nl werken niet*\n` +
      `De webhook gaf twee keer achter elkaar geen goed antwoord: ${r.reden}.\n` +
      `Bezoekers zien nu "Versturen lukte niet". Controleer of de flow "Websiteformulieren naar Pipedrive" actief is in n8n.`);
  }
  return r;
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(controleer(env));
  },
  // Geen publieke trigger: handmatig testen kan met `npx wrangler dev --test-scheduled`
  async fetch() {
    return new Response("Not found", { status: 404 });
  },
};
export { ping, controleer };
