/* FortCRM attributie: herkomst van de bezoeker vastleggen voor GA4 en Pipedrive.
   - First-touch: alleen bij het eerste bezoek. Last-touch: bij elke nieuwe campagnewaarde
     (UTM of click-ID). Beide in de first-party cookie fc_attr, 90 dagen.
   - Alleen met analytics-toestemming (localStorage fortcrm-consent = granted).
     Zonder toestemming blijft de touch van deze pagina in het geheugen en wordt hij pas
     bewaard als de bezoeker alsnog toestemming geeft. Bij weigeren gaat de cookie weg.
   - Geen persoonsgegevens naar GA4: events krijgen alleen technische parameters.
   API: window.FortAttr.collect() -> Promise<object> met platte velden voor de webhook,
        window.FortAttr.event(naam, params), FortAttr.consent(true|false). */
(function () {
  'use strict';
  var CFG = window.FORTCRM || {};
  var COOKIE = 'fc_attr';
  var DAGEN = 90;
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var CLICK = ['gclid', 'fbclid', 'msclkid', 'li_fat_id'];

  var magOpslaan = function () {
    try { return localStorage.getItem('fortcrm-consent') === 'granted'; } catch (e) { return false; }
  };
  var leesCookie = function (naam) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + naam.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  };
  var schrijf = function (waarde) {
    var verloopt = new Date(Date.now() + DAGEN * 864e5).toUTCString();
    document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(waarde)) +
      '; expires=' + verloopt + '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  };
  var wis = function () { document.cookie = COOKIE + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax'; };
  var bewaard = function () {
    try { var v = JSON.parse(leesCookie(COOKIE) || 'null'); return v && typeof v === 'object' ? v : null; } catch (e) { return null; }
  };
  var kort = function (v, n) { return String(v || '').trim().slice(0, n || 150); };

  // Touch van deze paginaweergave: UTM, click-ID's, referrer (zonder query) en landingspagina.
  var touch = (function () {
    var q = new URLSearchParams(location.search), t = {}, campagne = false;
    UTM.concat(CLICK).forEach(function (k) {
      var v = kort(q.get(k), k === 'gclid' || k === 'fbclid' || k === 'msclkid' || k === 'li_fat_id' ? 300 : 150);
      if (v) { t[k] = v; campagne = true; }
    });
    var ref = '';
    try {
      if (document.referrer) {
        var r = new URL(document.referrer);
        if (r.hostname !== location.hostname) ref = r.origin + r.pathname;
      }
    } catch (e) {}
    t.referrer = kort(ref, 300);
    t.landing_page = location.pathname;
    t.ts = new Date().toISOString();
    return { waarden: t, campagne: campagne };
  })();

  var handtekening = function (t) {
    return UTM.concat(CLICK).map(function (k) { return t[k] || ''; }).join('|');
  };

  // First-touch alleen als er nog niets is; last-touch bij een nieuwe campagnewaarde.
  var bijwerken = function () {
    if (!magOpslaan()) return;
    var s = bewaard();
    if (!s || !s.ft) { schrijf({ v: 1, ft: touch.waarden, lt: touch.waarden }); return; }
    if (touch.campagne && handtekening(touch.waarden) !== handtekening(s.lt || {})) {
      s.lt = touch.waarden;
      schrijf(s);
    }
  };

  // GA4 client_id uit de _ga cookie (GA1.1.123.456 -> 123.456)
  var clientIdUitCookie = function () {
    var m = leesCookie('_ga').match(/^GA\d\.\d\.(.+)$/);
    return m ? m[1] : '';
  };
  // session_id uit _ga_<container>: GS1.1.<sid>.… of GS2.1.s<sid>$o…
  var sessionIdUitCookie = function () {
    if (!CFG.gaId) return '';
    var c = leesCookie('_ga_' + CFG.gaId.replace(/^G-/, ''));
    var m = c.match(/^GS1\.\d\.(\d+)\./) || c.match(/^GS2\.\d\.s(\d+)/);
    return m ? m[1] : '';
  };
  // Eerst via gtag (betrouwbaarst), anders uit de cookies. Nooit langer dan 800 ms wachten.
  var gaGet = function (veld, fallback) {
    return new Promise(function (klaar) {
      var gedaan = false;
      var af = function (v) { if (!gedaan) { gedaan = true; klaar(v ? String(v) : fallback()); } };
      setTimeout(function () { af(''); }, 800);
      try {
        if (typeof window.gtag === 'function' && CFG.gaId) window.gtag('get', CFG.gaId, veld, af);
        else af('');
      } catch (e) { af(''); }
    });
  };

  var plat = function (prefix, t) {
    var o = {};
    UTM.forEach(function (k) { o[prefix + k.replace('utm_', '')] = (t && t[k]) || ''; });
    o[prefix + 'referrer'] = (t && t.referrer) || '';
    o[prefix + 'landing_page'] = (t && t.landing_page) || '';
    o[prefix + 'ts'] = (t && t.ts) || '';
    return o;
  };

  var FortAttr = {
    // Platte velden voor de webhook. Zonder toestemming: alleen consent=denied.
    collect: function () {
      if (!magOpslaan()) return Promise.resolve({ consent: 'denied' });
      bijwerken();
      var s = bewaard() || { ft: touch.waarden, lt: touch.waarden };
      return Promise.all([gaGet('client_id', clientIdUitCookie), gaGet('session_id', sessionIdUitCookie)]).then(function (ids) {
        var o = { consent: 'granted', ga_client_id: ids[0], ga_session_id: ids[1] };
        var ft = plat('ft_', s.ft), lt = plat('lt_', s.lt);
        Object.keys(ft).forEach(function (k) { o[k] = ft[k]; });
        Object.keys(lt).forEach(function (k) { o[k] = lt[k]; });
        // click-ID's: last-touch heeft voorrang, anders first-touch
        CLICK.forEach(function (k) { o[k] = (s.lt && s.lt[k]) || (s.ft && s.ft[k]) || ''; });
        return o;
      });
    },
    // GA4-event zonder persoonsgegevens. Consent Mode bepaalt of er cookies meegaan.
    event: function (naam, params) {
      var p = { page_location: location.origin + location.pathname };
      Object.keys(params || {}).forEach(function (k) { p[k] = params[k]; });
      try { if (typeof window.gtag === 'function') window.gtag('event', naam, p); } catch (e) {}
    },
    // Aangeroepen door de cookiebanner
    consent: function (ok) { if (ok) bijwerken(); else wis(); }
  };

  window.FortAttr = FortAttr;
  bijwerken();
})();
