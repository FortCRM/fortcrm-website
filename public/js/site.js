/* FortCRM website: quick scan, formulieren, afspraakplanner en cookiebanner.
   Formulieren gaan naar het endpoint uit _config.yml (form_endpoint). Is dat leeg,
   dan opent het contactformulier het mailprogramma met een ingevuld bericht. */
(function () {
  'use strict';
  var CFG = window.FORTCRM || {};

  var send = function (payload) {
    if (!CFG.formEndpoint) return Promise.reject(new Error('geen endpoint'));
    payload.pagina = location.pathname;
    payload.verstuurd = new Date().toISOString();
    return fetch(CFG.formEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r; });
  };

  var Q = [
    { id: 'size', title: 'Hoeveel mensen werken er in je bedrijf?', opts: [
      ['1-4', '1 tot 4 mensen'], ['5-25', '5 tot 25 mensen'], ['26-100', '26 tot 100 mensen'],
      ['101-250', '101 tot 250 mensen'], ['250+', 'Meer dan 250 mensen']] },
    { id: 'type', title: 'Welke omschrijving past het best bij je bedrijf?', opts: [
      ['A', 'Veel aanvragen of orders, met een lage waarde per stuk'],
      ['B', 'Maatwerk en advies, met meerdere gesprekken voor één deal'],
      ['C', 'Weinig offertes, maar elke offerte telt'],
      ['D', 'Geen van deze, of ik weet het niet']] },
    { id: 'vast', part: 'Vastleggen', title: 'Waar staan klantgegevens en afspraken?', opts: [
      [2, 'In één systeem. Iedereen vult het op dezelfde manier in.'],
      [1, 'Deels in een systeem, deels in mailboxen, Excel of hoofden.'],
      [0, 'Verspreid. Elke collega doet het op zijn eigen manier.']] },
    { id: 'volg', part: 'Opvolgen', title: 'Wat gebeurt er met een nieuwe aanvraag of offerte?', opts: [
      [2, 'Er is een vaste route. Er blijft niets liggen.'],
      [1, 'Meestal wordt het opgevolgd, maar het hangt af van de drukte.'],
      [0, 'Opvolgen gebeurt op gevoel, als er tijd is.']] },
    { id: 'deel', part: 'Delen', title: 'Een collega is ziek. Kan een ander zijn klanten overnemen?', opts: [
      [2, 'Ja, binnen een paar minuten. Alles staat in het systeem.'],
      [1, 'Ja, maar er is eerst wat uitzoekwerk nodig.'],
      [0, 'Nee. Wat er is besproken, weet alleen degene die erbij zat.']] },
    { id: 'pain', title: 'Wat wil je als eerste opgelost zien?', opts: [
      ['lead', 'Geen aanvraag of offerte meer laten liggen'],
      ['overzicht', 'Overzicht van je verkoop en verwachte omzet'],
      ['handwerk', 'Minder handwerk en administratie'],
      ['gebruik', 'Een team dat het systeem echt gebruikt']] }
  ];

  var LEVEL = ['Nog niet op orde', 'Gedeeltelijk op orde', 'Op orde'];
  var PART = {
    'Vastleggen': [
      'Klantgegevens staan verspreid. Eerst één plek waar alles terechtkomt, met vaste velden.',
      'Het meeste staat erin, maar niet bij iedereen op dezelfde manier. Vaste velden en afspraken maken het betrouwbaar.',
      'Je legt vast op één plek en op één manier. Dat is de basis voor automatisering en AI.'],
    'Opvolgen': [
      'Opvolgen hangt af van wie er tijd heeft. Een vaste route met herinneringen voorkomt dat deals blijven liggen.',
      'Meestal gaat het goed, maar drukte kost deals. Automatische herinneringen en vaste stappen vangen dat op.',
      'Opvolgen is geregeld. Het blijft de vraag of het ook zo blijft als je groeit.'],
    'Delen': [
      'Kennis zit in hoofden. Zodra iemand er niet is, valt een deal stil.',
      'Overnemen kan, maar kost uitzoekwerk. Dat vraagt om een gedeeld klantbeeld per contact en deal.',
      'Je team kan elkaar overnemen zonder te bellen. Dat is zeldzaam.']
  };
  var TYPE = {
    A: { kop: 'Veel aanvragen en orders', tekst: 'Bij veel aanvragen telt dat elke lead dezelfde route volgt. Snel reageren en automatisch opvolgen levert hier het meeste op.',
      stap: ['Zet alle aanvraagkanalen in één verkoopoverzicht.', 'Leg een vaste route met herinneringen vast.', 'Automatiseer de eerste reactie en de taken erna.'] },
    B: { kop: 'Maatwerk en advies met meerdere gesprekken', tekst: 'Bij meerdere gesprekken per deal gaat informatie verloren tussen de gesprekken. Een compleet klantbeeld per deal maakt het verschil.',
      stap: ['Leg na elk gesprek vast wat er is besproken, met een vaste structuur.', 'Koppel mail en agenda aan de deal.', 'Maak per fase duidelijk wat de volgende stap is.'] },
    C: { kop: 'Weinig deals, hoge slagingskans', tekst: 'Bij weinig offertes mag er geen enkele blijven liggen. Een strakke offerteopvolging is hier goud waard.',
      stap: ['Registreer elke offerte met een opvolgdatum.', 'Laat Pipedrive een taak aanmaken als een offerte blijft liggen.', 'Houd per offerte de kans en de verwachte waarde bij.'] },
    D: { kop: 'Nog zoekend naar de beste inrichting', tekst: 'Eerst zorgen dat de basis klopt. Daarna kiezen we samen welke route bij je bedrijf past.',
      stap: ['Breng in kaart hoe een aanvraag nu een klant wordt.', 'Kies de kleinste inrichting die dat ondersteunt.', 'Bouw uit zodra het team het gebruikt.'] }
  };
  var PAIN = {
    lead: 'Je wilt geen aanvraag meer laten liggen. Dat vraagt om een vaste opvolgroute.',
    overzicht: 'Je wilt overzicht in je verkoop en omzet. Dat vraagt eerst om betrouwbare invoer.',
    handwerk: 'Je wilt minder handwerk. Dat lossen we op met automatisering rond Pipedrive.',
    gebruik: 'Je wilt dat je team het gebruikt. Dat bereik je met een inrichting die past bij hoe jullie werken.'
  };

  /* teksten uit Keystatic (Quick scan: uitslagteksten) gaan voor */
  var KS = window.FORTCRM_SCAN;
  if (KS) {
    var n3 = function (o) { return o ? [o.niet, o.deels, o.wel] : null; };
    if (KS.niveaus) LEVEL = n3(KS.niveaus);
    if (KS.vastleggen) PART['Vastleggen'] = n3(KS.vastleggen);
    if (KS.opvolgen) PART['Opvolgen'] = n3(KS.opvolgen);
    if (KS.delen) PART['Delen'] = n3(KS.delen);
    ['A', 'B', 'C', 'D'].forEach(function (k) {
      var t = KS['type' + k];
      if (t) TYPE[k] = { kop: t.kop, tekst: t.tekst, stap: [t.stap1, t.stap2, t.stap3].filter(Boolean) };
    });
    if (KS.wens) Object.keys(KS.wens).forEach(function (k) { if (KS.wens[k]) PAIN[k] = KS.wens[k]; });
  }

  /* ---------- quick scan ---------- */
  var root = document.getElementById('scan');
  if (root) {
    var ans = {}, i = 0, nm = '', ml = '';
    var body = root.querySelector('[data-body]');
    var prog = root.querySelector('[data-prog]');

    var drawProg = function () {
      var h = '';
      for (var k = 0; k < Q.length + 1; k++) {
        if (k) h += '<hr>';
        h += '<li class="' + (k < i ? 'done' : k === i ? 'now' : '') + '"></li>';
      }
      prog.innerHTML = h;
      prog.setAttribute('aria-label', i < Q.length ? 'Vraag ' + (i + 1) + ' van ' + Q.length : 'Laatste stap');
    };

    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

    var question = function () {
      var q = Q[i], h = '<div class="qcard"><p class="eyebrow">Vraag ' + (i + 1) + ' van ' + Q.length + '</p>' +
        '<h2 id="qt" tabindex="-1">' + q.title + '</h2><fieldset class="opts"><legend class="sr-only">' + q.title + '</legend>';
      q.opts.forEach(function (o, n) {
        h += '<label class="opt"><input type="radio" name="q" value="' + o[0] + '"' + (String(ans[q.id]) === String(o[0]) ? ' checked' : '') + '><span>' + o[1] + '</span></label>';
      });
      h += '</fieldset><div class="qnav">' + (i ? '<button type="button" class="btn line" data-back>Terug</button>' : '') +
        '<button type="button" class="btn" data-next disabled>' + (i === Q.length - 1 ? 'Naar de uitslag' : 'Volgende') + '</button></div></div>';
      body.innerHTML = h;
      var nx = body.querySelector('[data-next]');
      if (ans[q.id] !== undefined) nx.disabled = false;
      body.querySelectorAll('input[name=q]').forEach(function (r) {
        r.addEventListener('change', function () { ans[q.id] = r.value; nx.disabled = false; });
      });
      nx.addEventListener('click', function () { i++; step(); });
      var bk = body.querySelector('[data-back]');
      if (bk) bk.addEventListener('click', function () { i--; step(); });
      drawProg();
    };

    var gate = function () {
      body.innerHTML = '<div class="qcard"><p class="eyebrow">Laatste stap</p>' +
        '<h2 id="qt" tabindex="-1">Waar sturen we de uitslag naartoe?</h2>' +
        '<p class="lead">Je ziet de uitslag direct na dit scherm. Meer hebben we niet nodig.</p>' +
        '<form id="gate" novalidate style="display:grid;gap:14px">' +
        '<label class="fld">Voornaam<input name="naam" autocomplete="given-name" required></label>' +
        '<label class="fld">E-mailadres<input name="mail" type="email" autocomplete="email" required></label>' +
        '<label class="chk"><input type="checkbox" name="bel" id="bel"><span>Bel me liever. Ik laat mijn telefoonnummer achter.</span></label>' +
        '<label class="chk"><input type="checkbox" name="optin" id="opt-in"><span>Stuur me ook de FortCRM-inzichten over CRM en AI voor het MKB, maximaal één keer per maand. Opzeggen kan altijd.</span></label>' +
        '<label class="fld" id="telw" hidden>Telefoonnummer<input name="tel" type="tel" autocomplete="tel"></label>' +
        '<p class="msg" role="alert" id="gmsg"></p>' +
        '<div class="qnav"><button type="button" class="btn line" data-back>Terug</button><button class="btn" type="submit">Toon mijn uitslag</button></div>' +
        '<p class="micro">We gebruiken je gegevens alleen voor deze uitslag en om te reageren als je een gesprek wilt. <a href="#privacy">Privacy</a></p></form></div>';
      var f = body.querySelector('#gate');
      f.bel.addEventListener('change', function () { f.querySelector('#telw').hidden = !f.bel.checked; });
      body.querySelector('[data-back]').addEventListener('click', function () { i--; step(); });
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = f.querySelector('#gmsg');
        if (!f.naam.value.trim()) { msg.textContent = 'Vul je voornaam in.'; f.naam.focus(); return; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.mail.value.trim())) { msg.textContent = 'Dit e-mailadres lijkt niet te kloppen.'; f.mail.focus(); return; }
        if (f.bel.checked && !f.tel.value.trim()) { msg.textContent = 'Vul je telefoonnummer in, of haal het vinkje weg.'; f.tel.focus(); return; }
        nm = f.naam.value.trim();
        ml = f.mail.value.trim();
        if (CFG.formEndpoint) {
          send({ soort: 'quickscan', naam: nm, mail: f.mail.value.trim(), terugbellen: f.bel.checked,
            telefoon: f.bel.checked ? f.tel.value.trim() : '', antwoorden: ans, bron: 'quickscan' }).catch(function () {});
          if (f.optin.checked) send({ soort: 'nieuwsbrief', naam: nm, mail: ml, bron: 'quickscan' }).catch(function () {});
        }
        i++; step();
      });
      drawProg();
    };

    var result = function () {
      var parts = ['vast', 'volg', 'deel'].map(function (id, n) {
        var q = Q[n + 2], s = Number(ans[id]);
        return { naam: q.part, s: s };
      });
      var total = parts.reduce(function (a, p) { return a + p.s; }, 0);
      var low = parts.slice().sort(function (a, b) { return a.s - b.s; })[0];
      var t = TYPE[ans.type];
      var head = total >= 5 ? 'Je basis staat er al goed voor' : total >= 3 ? 'Je basis staat voor de helft' : 'Je basis heeft aandacht nodig';
      var h = '<div class="result"><div class="rh"><p class="eyebrow">Uitslag voor ' + esc(nm) + '</p><h2 id="qt" tabindex="-1">' + head + '</h2>' +
        '<p>' + t.kop + '. ' + t.tekst + '</p></div><div class="rb">';
      h += '<ul class="ind">';
      parts.forEach(function (p) {
        h += '<li><span class="nm">' + p.naam + '</span><span class="chip s' + p.s + '">' + LEVEL[p.s] + '</span><span class="tx">' + PART[p.naam][p.s] + '</span></li>';
      });
      h += '</ul><p class="focus">' + (total === 6 ? '<b>Je basis is op orde.</b> ' : '<b>Begin bij ' + low.naam.toLowerCase() + '.</b> ') + PAIN[ans.pain] + '</p>';
      if (ans.size === '1-4') {
        h += '<p class="note">Wij zijn vooral sterk voor bedrijven vanaf 5 medewerkers. Plan toch een gesprek, dan kijken we samen of het past.</p>';
      }
      h += '<div class="res-sub"><h3>Drie eerste stappen</h3><ol>' + t.stap.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>';
      h += '<div class="next"><div class="btnrow"><a class="btn" href="/#contact" data-plan>Plan een gesprek van 30 minuten</a><a class="btn line" href="/#pakketten">Bekijk de pakketten</a></div>' +
        '<p class="micro">Dit is een eerste indruk op basis van zes vragen, geen volledige analyse. In het gesprek kijken we naar jullie echte situatie.</p></div>';
      h += '</div></div>';
      body.innerHTML = h;
      prog.parentNode.hidden = true;
    };

    var step = function (first) {
      prog.parentNode.hidden = false;
      if (i < Q.length) question(); else if (i === Q.length) gate(); else result();
      var t = document.getElementById('qt');
      if (!first && t) t.focus({ preventScroll: true });
    };
    step(true);
  }

  /* ---------- contactformulier ---------- */
  var EN = CFG.lang === 'en';
  var T = EN ? {
    naam: 'Please enter your name.', mail: 'This email address does not look right.',
    open: 'Your email app opens with your message. Send it from there and we will reply within one working day.',
    ok: function (n) { return 'Thanks ' + n + '. We will reply within one working day.'; },
    fail: 'Sending failed. Email us at <a href="mailto:hallo@fortcrm.nl">hallo@fortcrm.nl</a>.', subj: 'Request a call', bron: 'How did you find us: '
  } : {
    naam: 'Vul je naam in.', mail: 'Dit e-mailadres lijkt niet te kloppen.',
    open: 'Je mailprogramma opent met je bericht. Verstuur het daar, dan reageren we binnen één werkdag.',
    ok: function (n) { return 'Bedankt ' + n + '. We reageren binnen één werkdag.'; },
    fail: 'Versturen lukte niet. Mail ons op <a href="mailto:hallo@fortcrm.nl">hallo@fortcrm.nl</a>.', subj: 'Gesprek aanvragen', bron: 'Hoe ken je ons: '
  };
  document.querySelectorAll('form[data-contact]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = f.querySelector('.msg'), el = f.elements;
      var naam = el.naam.value.trim(), mail = el.mail.value.trim();
      m.classList.remove('err');
      if (!naam) { m.textContent = T.naam; el.naam.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { m.textContent = T.mail; el.mail.focus(); return; }
      var data = { soort: 'contact', naam: naam, mail: mail, bron: el.bron ? el.bron.value : '', vraag: el.vraag.value.trim(), website: el.website ? el.website.value : '' };
      var btn = f.querySelector('button');
      var mailto = function () {
        var body = 'Naam: ' + naam + '\nE-mail: ' + mail + (data.bron ? '\n' + T.bron + data.bron : '') + '\n\n' + data.vraag;
        location.href = 'mailto:hallo@fortcrm.nl?subject=' + encodeURIComponent(T.subj) + '&body=' + encodeURIComponent(body);
        m.textContent = T.open;
      };
      if (!CFG.formEndpoint) { mailto(); return; }
      btn.disabled = true;
      send(data).then(function () {
        m.textContent = T.ok(naam);
      }).catch(function () {
        btn.disabled = false;
        m.classList.add('err');
        m.innerHTML = T.fail;
      });
    });
  });

  /* ---------- afspraakplanner (Pipedrive) ---------- */
  var sched = document.getElementById('sched');
  if (sched && CFG.scheduler) {
    var bg = document.getElementById('sched-bg'), frame = sched.querySelector('iframe');
    var open = function (e) {
      e.preventDefault();
      if (!frame.src) frame.src = CFG.scheduler;
      sched.hidden = bg.hidden = false;
      document.body.style.overflow = 'hidden';
      sched.querySelector('button').focus();
    };
    var close = function () { sched.hidden = bg.hidden = true; document.body.style.overflow = ''; };
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-plan]');
      if (a) open(e);
    });
    sched.querySelector('button').addEventListener('click', close);
    bg.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sched.hidden) close(); });
  }

  /* ---------- cookiebanner (alleen analytics, Consent Mode v2) ---------- */
  var cb = document.getElementById('cookie');
  if (cb) {
    var get = function () { try { return localStorage.getItem('fortcrm-consent'); } catch (e) { return null; } };
    var set = function (ok) {
      try { localStorage.setItem('fortcrm-consent', ok ? 'granted' : 'denied'); } catch (e) {}
      if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: ok ? 'granted' : 'denied' });
      cb.hidden = true;
    };
    if (!get()) cb.hidden = false;
    cb.querySelector('[data-yes]').addEventListener('click', function () { set(true); });
    cb.querySelector('[data-no]').addEventListener('click', function () { set(false); });
    document.querySelectorAll('[data-cookies]').forEach(function (b) { b.addEventListener('click', function () { cb.hidden = false; }); });
  }
})();

/* Thema-knop en mobiel menu, zoals de oude fortcrm.nl */
(function () {
  'use strict';
  var root = document.documentElement;
  document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dark = !root.classList.contains('dark');
      root.classList.toggle('dark', dark);
      try { localStorage.setItem('fortcrm-theme', dark ? 'dark' : 'light'); } catch (e) {}
    });
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    var t = null; try { t = localStorage.getItem('fortcrm-theme'); } catch (err) {}
    if (!t) root.classList.toggle('dark', e.matches);
  });

  var menu = document.getElementById('mobile-menu');
  var bg = document.getElementById('mobile-menu-backdrop');
  var toggle = document.getElementById('menu-toggle');
  if (menu && bg && toggle) {
    var open = function () { menu.classList.remove('translate-x-full'); bg.hidden = false; toggle.setAttribute('aria-expanded', 'true'); };
    var close = function () { menu.classList.add('translate-x-full'); bg.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', open);
    document.getElementById('menu-close').addEventListener('click', close);
    bg.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
})();

/* Link kopiëren onder blogartikelen */
document.querySelectorAll('[data-kopieer]').forEach(function (b) {
  b.addEventListener('click', function () {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(b.getAttribute('data-kopieer')).then(function () {
      var m = document.querySelector('[data-kopieer-melding]');
      if (!m) return;
      m.classList.remove('opacity-0');
      setTimeout(function () { m.classList.add('opacity-0'); }, 2000);
    }).catch(function () {});
  });
});

/* Secties rustig laten binnenkomen */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('zichtbaar'); }); return; }
  var io = new IntersectionObserver(function (items) {
    items.forEach(function (it) { if (it.isIntersecting) { it.target.classList.add('zichtbaar'); io.unobserve(it.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();
