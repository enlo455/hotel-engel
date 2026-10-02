/* Hotel Engel Hamburg — site search.
   Answers keywords and whole questions ("Wann gibt es Frühstück?") from a small,
   hand-written index and links to the exact place on the site. */
(() => {
  const PHONE = '+49 40 554 26 0';

  // url: target page + anchor. k: keywords (German + common English), matched by prefix.
  const INDEX = [
    { t: 'Frühstück', s: 'Hotelinfos', url: 'hotel.html#info-fruehstueck', a: 'Täglich von 06:30 bis 10:30 Uhr im Wintergarten, 18 € pro Person.', k: 'frühstück frühstücken buffet morgens wintergarten breakfast morning essen' },
    { t: 'Abreise & Check-out', s: 'Hotelinfos', url: 'hotel.html#info-abreise', a: 'Sie dürfen gern bis 12:00 Uhr auf dem Zimmer bleiben.', k: 'abreise checkout check-out auschecken auszug verlassen spät late departure' },
    { t: 'Anreise & Rezeption', s: 'Hotelinfos', url: 'hotel.html#info-rezeption', a: 'Die Rezeption ist rund um die Uhr besetzt, Sie können also jederzeit anreisen.', k: 'rezeption empfang anreise checkin check-in einchecken ankunft nacht spät 24 reception arrival' },
    { t: 'Parken', s: 'Hotelinfos', url: 'hotel.html#info-parken', a: '50 Parkplätze direkt am Hotel, 8 € pro Tag.', k: 'parken parkplatz parkplätze auto garage tiefgarage stellplatz parking car' },
    { t: 'W-LAN', s: 'Hotelinfos', url: 'hotel.html#info-wlan', a: 'Kostenfrei im Netzwerk „WLAN by LAN1“, ohne Zugangscode.', k: 'wlan w-lan wifi wi-fi internet passwort netzwerk' },
    { t: 'Restaurant Papillon', s: 'Genuss', url: 'genuss.html#papillon', a: 'Montag bis Samstag 17:30 bis 21:30 Uhr, sonntags geschlossen.', k: 'restaurant papillon abendessen dinner essen küche speisen zirbelstube abends' },
    { t: 'Bistro-Bar', s: 'Genuss', url: 'genuss.html#bar', a: 'Täglich von 14:00 bis 01:00 Uhr, direkt neben der Rezeption.', k: 'bar bistro getränke drinks wein bier cocktail kaffee trinken lounge' },
    { t: 'Garten-Terrasse', s: 'Genuss', url: 'genuss.html#garten', a: 'Unser grüner Innenhof, im Sommer bis 22:00 Uhr geöffnet.', k: 'garten terrasse draußen innenhof outdoor garden sommer schach' },
    { t: 'Sauna', s: 'Hotelinfos', url: 'hotel.html#info-sauna', a: 'Nutzung für 15 € bei 30 Minuten Aufheizzeit.', k: 'sauna wellness spa entspannen schwitzen' },
    { t: 'Fitness', s: 'Hotelinfos', url: 'hotel.html#info-fitness', a: 'Sondertarif von 12 € bei Fitness First, 500 m entfernt.', k: 'fitness sport gym training fitnessstudio workout' },
    { t: 'Haustiere', s: 'Hotelinfos', url: 'hotel.html#info-haustiere', a: 'Haustiere sind aus hygienischen Gründen nicht im Frühstücksraum gestattet. Fragen Sie uns gern vorab.', k: 'haustier haustiere hund hunde katze tier tiere pet pets dog' },
    { t: 'Kinder', s: 'Hotelinfos', url: 'hotel.html#info-kinder', a: 'Kinder unter 6 Jahren übernachten kostenfrei im Bett der Eltern. Zustellbett im Komfort Zimmer möglich.', k: 'kind kinder baby familie zustellbett kinderbett children kids family' },
    { t: 'Zahlungsarten', s: 'Hotelinfos', url: 'hotel.html#info-zahlung', a: 'Bargeld, EC-Karte, Visa, Mastercard, Maestro, American Express, JCB und Diners.', k: 'zahlung zahlen bezahlen kreditkarte karte ec visa mastercard amex american express bar bargeld payment' },
    { t: 'Safe', s: 'Hotelinfos', url: 'hotel.html#info-safe', a: 'Jedes Zimmer hat einen Safe. Die Anleitung finden Sie in der Tür.', k: 'safe tresor wertsachen' },
    { t: 'Wäscheservice', s: 'Hotelinfos', url: 'hotel.html#info-waesche', a: 'Wäschebeutel im Schrank, Abgabe bis 08:00 Uhr an der Rezeption.', k: 'wäsche wäscheservice reinigung waschen laundry' },
    { t: 'Hamburg Card', s: 'Hotelinfos', url: 'hotel.html#info-hamburgcard', a: 'An der Rezeption erhältlich, mit Vergünstigungen in der ganzen Stadt.', k: 'hamburg card hamburgcard rabatt ermäßigung nahverkehr ticket' },
    { t: 'Zimmer im Vergleich', s: 'Zimmer', url: 'zimmer.html#vergleich', a: 'Fünf Kategorien von Economy (ca. 11 m²) bis Suite (über 32 m²).', k: 'zimmer vergleich kategorien größe ausstattung room rooms übersicht' },
    { t: 'Economy Zimmer', s: 'Zimmer', url: 'zimmer.html#economy', a: 'Ca. 11 m² für eine Person, mit Schreibtisch. Ideal für Geschäftsreisen.', k: 'economy einzelzimmer einzel single günstig geschäftlich geschäftsreise' },
    { t: 'Standard Zimmer', s: 'Zimmer', url: 'zimmer.html#standard', a: 'Für eine oder zwei Personen, Bett 160 oder 180 cm.', k: 'standard doppelzimmer zwei personen double' },
    { t: 'Klassik Zimmer', s: 'Zimmer', url: 'zimmer.html#klassik', a: 'Das Doppelzimmer mit 180-cm-Bett und Sitzecke, fast alle ruhig gelegen.', k: 'klassik doppelzimmer ruhig paar double' },
    { t: 'Komfort Zimmer', s: 'Zimmer', url: 'zimmer.html#komfort', a: 'Ca. 25 m² zum Garten, Kaffee- und Teestation, Zustellbett möglich.', k: 'komfort groß garten ruhig kaffee tee zustellbett drei personen' },
    { t: 'Suite', s: 'Zimmer', url: 'zimmer.html#suite', a: 'Über 32 m² mit Wohnbereich, Schlafcouch und Lavazza-Espressomaschine.', k: 'suite zimmer familie groß größte größtes espresso wohnbereich schlafcouch' },
    { t: 'Zimmer buchen', s: 'Buchen', action: 'book', a: 'Direkt bei uns buchen und 5 % sparen.', k: 'buchen buchung reservieren reservierung preis preise kosten verfügbarkeit frei book booking price rate' },
    { t: 'Flughafen', s: 'Lage', url: 'lage.html#anreise', a: '8 km entfernt, rund 15 Minuten Fahrzeit.', k: 'flughafen airport fliegen flug fuhlsbüttel' },
    { t: 'Messe & CCH', s: 'Lage', url: 'lage.html#anreise', a: 'Rund 15 Minuten, mit der U-Bahn ohne Umsteigen.', k: 'messe cch kongress congress fair' },
    { t: 'Hauptbahnhof & Innenstadt', s: 'Lage', url: 'lage.html#anreise', a: 'Hauptbahnhof 8 km, Jungfernstieg rund 20 Minuten mit der U-Bahn.', k: 'hauptbahnhof bahnhof zug bahn innenstadt city zentrum jungfernstieg dammtor altona ubahn u-bahn öffentlich' },
    { t: 'Adresse & Anfahrt', s: 'Lage', url: 'lage.html#anreise', a: 'Niendorfer Str. 55–59, 22529 Hamburg-Lokstedt.', k: 'adresse anfahrt route lage wo karte map maps address lokstedt' },
    { t: 'Hagenbecks Tierpark', s: 'Lage', url: 'lage.html#freizeit', a: 'Nur 2 km vom Hotel entfernt.', k: 'hagenbeck tierpark zoo' },
    { t: 'Freizeit in Hamburg', s: 'Lage', url: 'lage.html#freizeit', a: 'Sehenswürdigkeiten, Musicals, Shopping und Parks.', k: 'freizeit sehenswürdigkeiten musical musicals shopping einkaufen parks ausflug tipps' },
    { t: 'Tagungen & Feiern', s: 'Das Hotel', url: 'hotel.html#tagung-h', a: 'Vier Tagungsräume mit Tageslicht, Feiern für bis zu 100 Gäste.', k: 'tagung tagungen meeting konferenz seminar feier feiern hochzeit geburtstag event veranstaltung' },
    { t: 'Kontakt', s: 'Kontakt', url: 'tel:+4940554260', a: `Telefon ${PHONE}, mail@hotel-engel-hamburg.de`, k: 'kontakt telefon anrufen email mail erreichen contact phone' },
    { t: 'Geschichte des Hotels', s: 'Das Hotel', url: 'hotel.html#historie-h', a: 'Seit 1960 an der Niendorfer Straße, von 16 auf 96 Zimmer gewachsen.', k: 'geschichte historie history 1960 familie engel' },
  ];

  const STOP = new Set('wie wann wo was welche welcher welches gibt es ist sind der die das den dem des ein eine einen einem kann koennen ich man hat haben habe im in am an zum zur fuer mit bis um uhr hotel engel bei bitte ihr ihre sie wir auch noch und oder mal mich mir gern gerne the is are do does you have a an what when where how can i there my to of for'.split(' '));
  const norm = s => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ');
  const toks = s => norm(s).split(/\s+/).filter(w => w.length > 1 && !STOP.has(w));
  INDEX.forEach(e => { e._k = toks(e.k + ' ' + e.t); e._txt = norm(e.t + ' ' + e.a); });

  function search(q) {
    const qt = toks(q);
    if (!qt.length) return [];
    return INDEX.map(e => {
      let score = 0;
      qt.forEach(w => {
        let best = 0;
        e._k.forEach(k => {
          if (k === w) best = Math.max(best, 4);
          else if (w.length >= 3 && k.startsWith(w)) best = Math.max(best, 3);
          else if (k.length >= 4 && w.startsWith(k)) best = Math.max(best, 3); // "fruehstuecksbuffet" → "fruehstueck"
          else if (w.length >= 4 && k.includes(w)) best = Math.max(best, 2);
        });
        if (!best && w.length >= 4 && e._txt.includes(w)) best = 1;
        score += best;
      });
      return { e, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score)
      .filter((r, _, all) => r.score >= all[0].score * 0.6).slice(0, 6).map(r => r.e);
  }

  const dlg = document.getElementById('search');
  if (!dlg) return;
  const input = dlg.querySelector('input');
  const list = dlg.querySelector('.search-results');
  const SUGGEST = ['Wann gibt es Frühstück?', 'Parken', 'Wie weit ist der Flughafen?', 'Sind Hunde erlaubt?', 'Suite', 'Check-out'];
  let results = [], sel = 0;

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const render = () => {
    const q = input.value.trim();
    if (!q) {
      list.innerHTML = `<p class="search-hint">Häufige Fragen</p><div class="search-chips">${SUGGEST.map(s => `<button type="button" class="chip">${esc(s)}</button>`).join('')}</div>`;
      return;
    }
    results = search(q);
    sel = 0;
    if (!results.length) {
      list.innerHTML = `<div class="search-empty"><p>Dazu haben wir leider keine Antwort auf der Website gefunden.</p><p>Unsere Rezeption hilft Ihnen rund um die Uhr: <a href="tel:+4940554260">${PHONE}</a></p></div>`;
      return;
    }
    list.innerHTML = results.map((e, i) => `<a class="result${i === 0 ? ' is-sel' : ''}" href="${e.url || '#buchen'}" ${e.action ? 'data-action="' + e.action + '"' : ''} role="option" aria-selected="${i === 0}">
      <span class="r-sec">${esc(e.s)}</span><span class="r-title">${esc(e.t)}</span><span class="r-ans">${esc(e.a)}</span></a>`).join('');
  };
  const mark = () => [...list.querySelectorAll('.result')].forEach((r, i) => { r.classList.toggle('is-sel', i === sel); r.setAttribute('aria-selected', String(i === sel)); if (i === sel) r.scrollIntoView({ block: 'nearest' }); });

  const open = () => { dlg.showModal(); input.value = ''; render(); setTimeout(() => input.focus(), 30); };
  const go = (a) => {
    if (!a) return;
    if (a.dataset.action === 'book') { dlg.close(); document.querySelector('[data-open-booking]')?.click(); return; }
    dlg.close();
    // Same page anchor: let main.js open the matching A–Z entry
    (window.engelNavigate || (h => { location.href = h; }))(a.getAttribute('href'));
    if (a.pathname === location.pathname) window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  document.querySelectorAll('[data-open-search]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(); }));
  dlg.querySelector('.search-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  input.addEventListener('input', render);
  input.addEventListener('keydown', e => {
    const n = results.length;
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); sel = (sel + 1) % n; mark(); }
    if (e.key === 'ArrowUp' && n) { e.preventDefault(); sel = (sel - 1 + n) % n; mark(); }
    if (e.key === 'Enter') { e.preventDefault(); go(list.querySelectorAll('.result')[sel]); }
  });
  list.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (chip) { input.value = chip.textContent; render(); input.focus(); return; }
    const r = e.target.closest('.result');
    if (r) { e.preventDefault(); go(r); }
  });
  // "/" or Cmd/Ctrl+K opens search
  document.addEventListener('keydown', e => {
    if (dlg.open || e.target.closest('input, textarea, select')) return;
    if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); open(); }
  });
})();
