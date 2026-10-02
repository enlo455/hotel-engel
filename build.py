"""Builds the static pages from shared partials: python3 build.py"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"

PHONE = "+49 40 554 26 0"
PHONE_HREF = "tel:+4940554260"
MAIL = "mail@hotel-engel-hamburg.de"
OLD = "https://www.hotel-engel-hamburg.de"

NAV = [
    ("zimmer.html", "Zimmer"),
    ("genuss.html", "Genuss"),
    ("hotel.html", "Das Hotel"),
    ("lage.html", "Lage & Hamburg"),
    ("http://www.restaurant-papillon.de/tagungen/", "Tagungen"),
]

WING = """<svg class="wing" viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
<path d="M2 36C14 34 30 24 38 4"/><path d="M8 36C20 33 34 25 46 10"/><path d="M14 36C26 33 40 27 54 16"/><path d="M20 36C32 34 46 30 62 23"/></svg>"""

BOOKING_FORM = """<form class="booking-form" data-booking novalidate>
  <button type="button" class="booking-field" data-cal="arrival" aria-expanded="false">
    <span class="label">Anreise</span><span class="value is-empty" data-out="arrival">Datum wählen</span>
  </button>
  <button type="button" class="booking-field" data-cal="departure" aria-expanded="false">
    <span class="label">Abreise</span><span class="value is-empty" data-out="departure">Datum wählen</span>
  </button>
  <label class="booking-field">
    <span class="label">Gäste</span><span class="value" data-out="guests">2 Erwachsene</span>
    <select name="guests" id="guests-{id}" aria-label="Anzahl Gäste">
      <option value="1">1 Erwachsener</option>
      <option value="2" selected>2 Erwachsene</option>
      <option value="3">3 Erwachsene</option>
      <option value="2+1">2 Erwachsene, 1 Kind</option>
    </select>
  </label>
  <div class="booking-submit"><button class="btn btn-brass" type="submit">Verfügbarkeit prüfen</button></div>
  <div class="cal" role="dialog" aria-label="Reisedaten wählen">
    <div class="cal-head"><p>Wählen Sie Ihren Anreisetag</p>
      <div class="cal-nav"><button type="button" data-cal-prev aria-label="Vorheriger Monat">←</button><button type="button" data-cal-next aria-label="Nächster Monat">→</button></div>
    </div>
    <div class="cal-months"></div>
    <div class="cal-foot"><span data-nights></span><button type="button" data-cal-reset>Daten zurücksetzen</button></div>
  </div>
</form>"""


def booking_form(id_):
    return BOOKING_FORM.replace("{id}", id_)


def header(current):
    cur = ' aria-current="page"'
    links = "".join(f'<a href="{h}"{cur if h == current else ""}>{t}</a>' for h, t in NAV)
    return f"""<a class="sr-only" href="#main">Zum Inhalt springen</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="index.html" aria-label="Hotel Engel Hamburg – Startseite"><span class="name">Engel</span><span class="sub">Hotel · Hamburg</span></a>
    <nav class="nav" aria-label="Hauptnavigation">{links}</nav>
    <div class="header-actions">
      <button type="button" class="search-btn" data-open-search aria-label="Suchen"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg><span class="search-label">Suchen</span></button>
      <a class="header-phone" href="{PHONE_HREF}">{PHONE}</a>
      <a class="btn btn-brass" href="#buchen" data-open-booking>Buchen</a>
      <button class="menu-toggle" aria-label="Menü öffnen" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="menu-panel" aria-label="Menü">
  <div class="top"><a class="brand" href="index.html"><span class="name">Engel</span><span class="sub">Hotel · Hamburg</span></a><button class="menu-close" aria-label="Menü schließen">×</button></div>
  <nav><a href="index.html">Willkommen</a>{links}</nav>
  <div class="contact"><a href="{PHONE_HREF}">{PHONE}</a><a href="mailto:{MAIL}">{MAIL}</a><span>Niendorfer Str. 55–59 · 22529 Hamburg</span></div>
</div>"""


def footer():
    return f"""<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="index.html"><span class="name">Engel</span><span class="sub">Hotel · Hamburg · seit 1960</span></a>
        <p>Privat geführtes Hotel in Hamburg-Lokstedt. Die Rezeption ist rund um die Uhr für Sie da.</p>
      </div>
      <div><h4>Kontakt</h4><ul>
        <li><a href="{PHONE_HREF}">{PHONE}</a></li>
        <li><a href="mailto:{MAIL}">{MAIL}</a></li>
        <li>Fax +49 40 554 26 500</li>
      </ul></div>
      <div><h4>Adresse</h4><ul>
        <li>Niendorfer Str. 55–59</li><li>22529 Hamburg</li>
        <li><a href="https://maps.google.com/?q=Hotel+Engel+Niendorfer+Str.+55+22529+Hamburg" target="_blank" rel="noopener">Route planen ↗</a></li>
      </ul></div>
      <div><h4>Entdecken</h4><ul>
        <li><a href="zimmer.html">Zimmer &amp; Suite</a></li>
        <li><a href="genuss.html">Frühstück &amp; Restaurant</a></li>
        <li><a href="hotel.html#infos">Hotelinformationen A–Z</a></li>
        <li><a href="http://www.restaurant-papillon.de/tagungen/">Tagungen &amp; Feiern</a></li>
        <li><a href="https://de-de.facebook.com/hotelengel.hamburg/" target="_blank" rel="noopener">Facebook ↗</a></li>
      </ul></div>
    </div>
    <div class="footer-legal">
      <span>© 2026 Hotel Engel · Schlichting Hotel GmbH</span>
      <nav aria-label="Rechtliches"><a href="{OLD}/impressum/">Impressum</a><a href="{OLD}/datenschutz/">Datenschutz</a><a href="{OLD}/agb/">AGB</a><a href="{OLD}/hotel/partnerhotels/">Partnerhotels</a></nav>
    </div>
  </div>
</footer>
<div class="mobile-book">
  <p><b>Direkt buchen</b>5 % unter allen Portalen</p>
  <a class="btn btn-brass" href="#buchen" data-open-booking>Verfügbarkeit</a>
</div>
<dialog class="search-dialog" id="search" aria-label="Suche">
  <div class="search-box">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>
    <label class="sr-only" for="search-input">Suchbegriff oder Frage</label>
    <input id="search-input" type="search" autocomplete="off" placeholder="Stichwort oder Frage, z. B. „Wann gibt es Frühstück?“">
    <button type="button" class="search-close" aria-label="Suche schließen">×</button>
  </div>
  <div class="search-results" role="listbox" aria-label="Ergebnisse"></div>
</dialog>
<dialog class="book-dialog" id="book-dialog" aria-label="Zimmer buchen">
  <div class="dlg-inner">
    <div class="dlg-top"><div class="stack" style="gap:.5rem"><span class="eyebrow">Online buchen</span><h2 style="font-size:var(--step-2)">Ihr Aufenthalt in <em>Hamburg</em></h2><p class="lead" style="font-size:1rem" data-room-note>Direkt beim Hotel buchen und 5 % sparen.</p></div>
      <button class="dlg-close" aria-label="Schließen">×</button></div>
    {booking_form("dlg")}
    <p class="dlg-contact">Lieber persönlich? Unsere Rezeption ist rund um die Uhr erreichbar: <a href="{PHONE_HREF}">{PHONE}</a></p>
  </div>
</dialog>"""


def page(title, desc, current, body):
    return f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Hotel Engel 1a · {title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#1e3329">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400;1,6..96,600&family=Hanken+Grotesk:wght@400;500;600&display=swap">
<link rel="stylesheet" href="assets/styles.css">
<script>try{{if(sessionStorage.getItem("pt")){{sessionStorage.removeItem("pt");document.documentElement.classList.add("pt-enter","pt-came")}}}}catch(e){{}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Hotel","name":"Hotel Engel Hamburg","address":{{"@type":"PostalAddress","streetAddress":"Niendorfer Str. 55-59","postalCode":"22529","addressLocality":"Hamburg","addressCountry":"DE"}},"telephone":"+49 40 554260","email":"{MAIL}","numberOfRooms":96,"checkoutTime":"12:00","url":"{OLD}/"}}</script>
</head>
<body>
<div class="curtain" aria-hidden="true"><span class="curtain-mark">Engel</span></div>
<div class="progress" aria-hidden="true"></div>
{header(current)}
<main id="main">
{body}
</main>
{footer()}
<script src="assets/main.js" defer></script>
<script src="assets/search.js" defer></script>
<script src="assets/motion.js" defer></script>
</body>
</html>
"""


PAGES = {
    "index.html": ("Hotel Engel Hamburg · Privat geführt seit 1960", "Privat geführtes Hotel in Hamburg-Lokstedt, 15 Minuten vom Flughafen. 96 Zimmer, Garten-Terrasse, Restaurant Papillon. Direkt buchen und 5 % sparen."),
    "zimmer.html": ("Zimmer & Suite · Hotel Engel Hamburg", "Fünf Zimmerkategorien von Economy bis Suite – ruhig gelegen in Hamburg-Lokstedt."),
    "genuss.html": ("Frühstück, Restaurant & Bar · Hotel Engel Hamburg", "Frühstück im Wintergarten, Restaurant Papillon, Bistro-Bar und Garten-Terrasse."),
    "hotel.html": ("Das Hotel · Hotel Engel Hamburg", "Philosophie, Geschichte seit 1960 und alle Hotelinformationen von A bis Z."),
    "lage.html": ("Lage & Hamburg · Hotel Engel Hamburg", "Ruhig zwischen Metropole und Natur: 8 km zum Flughafen, 2 km zu Hagenbecks Tierpark."),
}

for name, (title, desc) in PAGES.items():
    body = (SRC / name).read_text(encoding="utf-8")
    body = body.replace("{{BOOKING}}", booking_form(name.split(".")[0])).replace("{{WING}}", WING).replace("{{PHONE}}", f'<a href="{PHONE_HREF}" style="color:inherit">{PHONE}</a>')
    (ROOT / name).write_text(page(title, desc, name, body), encoding="utf-8")
    print("built", name)
