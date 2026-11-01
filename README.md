# Die Tastonettis – Website

Statische Website (HTML/CSS/JS, kein Build-Schritt). Einfach den gesamten Ordner auf den Webserver hochladen.

## Seiten
| Datei | Inhalt |
|---|---|
| `index.html` | Startseite mit Musikvideo „Viva La Vida“ (Lebe das Leben) |
| `orchester.html` | Über das Orchester, Videos, Termine |
| `alben.html` | Alle Alben: „Klavier to go“ (mit 360°-Ansicht) und „Takt 26“ |
| `verein.html` | Vorstand, Mitgliedschaft, Highlights, Ehrenmitglieder, Sponsoren, Spenden |
| `buchung.html` | Buchungsinfos, Technik, Referenzen |
| `kontakt.html` | Kontakt per E-Mail (tastonettis@gmail.com) |
| `impressum.html`, `datenschutz.html` | Rechtstexte (1:1 aus den e-recht24-Dokumenten, Stand Datenschutz: Hosting bei netcup, YouTube im erweiterten Datenschutzmodus) |

## Design
- Helles und dunkles Design, wechselt automatisch je nach Systemeinstellung (`prefers-color-scheme`).
- Akzentfarbe `#ed1c24` (Logofarbe), definiert in `assets/css/style.css` (`--brand`).
- Keine externen Schriftarten, Skripte oder Tracker.

## YouTube (DSGVO)
Videos werden per 2-Klick-Lösung eingebunden: Vor dem Klick auf „Abspielen“ wird **keine** Verbindung zu YouTube/Google
aufgebaut (Vorschaubilder liegen lokal unter `assets/img/video/`). Erst nach Zustimmung wird der Player über
`youtube-nocookie.com` geladen. Besucher können die Zustimmung optional merken lassen und im Footer widerrufen.

Ein Video einbinden: Element mit `class="video-embed" data-youtube="VIDEO-ID"` (siehe `index.html`) und
Vorschaubild unter `assets/img/video/VIDEO-ID.jpg` ablegen.

## Caching / Versionsnummern
CSS und JavaScript werden mit einer Versionsnummer eingebunden (`style.css?v=…`, `main.js?v=…`).
Wer `assets/css/style.css` oder `assets/js/main.js` ändert, muss diese Nummer in **allen** HTML-Dateien
anpassen (beliebiger neuer Wert). Sonst zeigen manche Browser (z. B. Firefox) weiter die alte Datei aus dem Cache.
Die `.htaccess` sorgt auf Apache-Servern dafür, dass HTML-Seiten immer frisch geladen werden.

## Electronic Press Kit (EPK)
`epk.html` ist das Pressepaket für Veranstalter, Presse und Radio. Die Seite ist **nicht in der Navigation verlinkt**
und per `noindex` von Suchmaschinen ausgeschlossen – einfach den Link weitergeben: `https://tastonettis.de/epk.html`.
Downloads (Logos, Pressefotos, Pressetexte, Komplettpaket als ZIP) liegen unter `assets/epk/`.
