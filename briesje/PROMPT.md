# Bouwprompt: website Briesje

Kopieer alles onder de streep naar Claude Code (of een andere AI-bouwer), in een map waar `bestanden/` naast deze prompt staat.

---

## Opdracht

Je bouwt de website van Briesje. Het hart van de site is een 3D boek. Bezoekers zien het boek dicht, openen het, kiezen een verhaaltje en lezen dat door te bladeren. De personages (poppetjes) uit de verhalen lopen door de hele site heen en maken het levendig.

Alle inhoud komt uit de map `bestanden/`. Dat geldt voor verhalen, namen, personages, beelden, huisstijl en teksten over Briesje. Je verzint zelf niets. Ontbreekt iets, dan vraag je het na.

## Stap 0: eerst lezen, dan pas bouwen

1. Bekijk welke skills beschikbaar zijn (`.claude/skills/` en je eigen lijst) en gebruik wat past. In elk geval iets voor frontend en design, en voor het uitlezen van pdf, docx of pptx als die in `bestanden/` staan.
2. Lees en bekijk elk bestand in `bestanden/`, ook de afbeeldingen.
3. Schrijf `INHOUD.md` met per onderdeel wat je gevonden hebt en uit welk bestand het komt:
   * Wat Briesje is, voor wie het is (leeftijd, ouders, scholen) en welke toon erbij hoort
   * Huisstijl: logo, kleuren, lettertypen, beeldstijl
   * Alle verhalen: titel, korte samenvatting, volgorde, personages, bijbehorende beelden
   * Alle personages: naam, uiterlijk, karakter, in welke verhalen, welke beeldbestanden
   * Overige pagina's die de bestanden rechtvaardigen, zoals over, contact of bestellen
4. Zet alles wat ontbreekt of tegenstrijdig is onder het kopje `ONTBREEKT` in INHOUD.md. Stel die vragen aan mij en wacht op antwoord voordat je begint met bouwen.

## De ervaring, stap voor stap

1. **Binnenkomst.** Het boek ligt dicht midden in beeld, licht schuin, en zweeft zachtjes. Bij muisbeweging (desktop) of kanteling van de telefoon draait het een paar graden mee. Kaft, titel en logo komen uit de bestanden. Een van de personages staat naast het boek en maakt duidelijk dat je het kunt openen.
2. **Openen.** Klik, tik, Enter of spatie opent het boek. De kaft draait open over de rug (ongeveer 1,2 seconde, rustige easing), het boek schuift naar het midden en zoomt iets in. Op dat moment komen personages als in een pop-upboek omhoog uit de pagina's.
3. **Inhoudsopgave.** Links een korte introductie van Briesje, rechts de verhaaltjes, elk met een klein plaatje. Staan er meer verhalen in de bestanden dan op een pagina passen, dan loopt de inhoudsopgave door over meerdere bladzijden.
4. **Verhaal kiezen.** Bij een klik bladeren de pagina's snel door naar het gekozen verhaal. De URL verandert naar `/verhalen/<slug>`, zodat een verhaal te delen is en de terugknop van de browser werkt. Wie direct op zo'n link binnenkomt, ziet het boek al open op dat verhaal.
5. **Lezen.** Per spread tekst en illustratie. Bladeren kan met pijlen op het scherm, swipen, en de pijltjestoetsen. Een subtiele voortgangsindicator laat zien waar je bent. Op de laatste pagina: volgend verhaal, terug naar de inhoud, of het boek dichtdoen.
6. **Mobiel.** In portretstand toont het boek één pagina tegelijk, in landschap en op desktop een volle spread.

## Personages (poppetjes)

* Elk personage uit de bestanden wordt één herbruikbaar component met naam, beelden, kleur en een korte beschrijving uit de bestanden.
* **Gids.** Het hoofdpersonage (volgens de bestanden) begeleidt de bezoeker op de homepage en in de inhoudsopgave. Tekstballonnen alleen met tekst uit de bestanden of met neutrale bedieningstekst zoals "Tik om het boek te openen".
* **In de verhalen.** Op elke spread staan de personages die daar voorkomen. Ze hebben een rustige idle-animatie (ademen, knipperen, licht wiegen) en reageren op hover of tik met een kleine beweging.
* **Wie is wie.** Een pagina `/personages` met kaartjes. Tik op een kaartje en het draait om naar de beschrijving en de verhalen waarin dit personage voorkomt.
* **Animatie.** Zijn de illustraties in losse lagen aangeleverd (hoofd, armen, ogen), animeer die lagen apart. Zo niet, animeer het hele figuur (op en neer, kantelen, squash and stretch). Verander nooit de tekenstijl en verzin geen nieuwe personages.
* Maximaal twee of drie bewegende personages tegelijk in beeld. Het verhaal blijft de hoofdzaak.

## Techniek

* **Framework:** Astro met TypeScript. De site bestaat vooral uit tekst en beelden, en Astro levert snelle statische pagina's met content collections voor verhalen en personages. Het boek is een los interactief eiland.
* **3D boek:** CSS 3D transforms met GSAP voor de timing. Zo blijft alle verhaaltekst echte HTML: leesbaar, toegankelijk, vindbaar in Google en licht op oudere telefoons.
  * Scène met `perspective` rond 1800px, boek met `transform-style: preserve-3d`
  * Elk blad heeft een voor- en achterkant met `backface-visibility: hidden` en draait om `transform-origin: left center` van 0 naar -180 graden
  * Dikte via een rugelement en een gestapelde paginarand, diepte via een schaduw onder het boek
  * Een verloop over het draaiende blad dat meeschuift met de hoek, zodat het blad licht en schaduw vangt
  * Beelden van de volgende spread vooraf laden
* **Overgangen tussen pagina's:** View Transitions van Astro, zodat boek en personages naadloos meegaan van home naar verhaal.
* **Geen Three.js**, tenzij ik daar expliciet om vraag. Mocht dat zo zijn: alleen het boekobject in WebGL, de verhaaltekst blijft HTML eroverheen.

### Contentmodel

```
src/content/verhalen/<slug>.md
---
titel:
samenvatting:
volgorde:
personages: [slug, slug]
kaft: ./beelden/<bestand>
---
Tekst van pagina 1
<!-- pagina -->
Tekst van pagina 2
```

```
src/content/personages/<slug>.json
{ "naam": "", "beschrijving": "", "kleur": "", "afbeelding": "", "lagen": {} }
```

Neem verhaalteksten letterlijk over. Alleen opmaak mag je aanpassen. Zie je typfouten, zet ze in een lijst in INHOUD.md in plaats van ze stilletjes te verbeteren.

### Pagina's

* `/` het boek, dicht
* `/verhalen/<slug>` het boek, open op dat verhaal
* `/personages` wie is wie
* Overige pagina's alleen als de bestanden er inhoud voor geven
* Een 404 in dezelfde stijl, bijvoorbeeld met een personage dat een lege pagina vasthoudt

## Design

* Huisstijl uit de bestanden. Staat er geen huisstijl in, haal dan een palet van vier tot zes kleuren uit de illustraties en leg dat in INHOUD.md ter goedkeuring voor.
* Leesbaar om voor te lezen: bodytekst minimaal 18px, regelafstand rond 1,6, maximaal zo'n 60 tekens per regel.
* Warm en tastbaar: een subtiele papiertextuur, zachte schaduwen, echt boekgevoel. Geen generieke template-uitstraling, geen paarse verlopen, geen stockfoto's, geen emoji als decoratie.
* Contrast minimaal WCAG AA.

## Kwaliteitseisen

* Werkt in Safari op iOS, Chrome op Android en de gangbare desktopbrowsers.
* Lighthouse op mobiel: performance minimaal 90, toegankelijkheid minimaal 95.
* Volledig met toetsenbord te bedienen: Enter of spatie opent, pijltjes bladeren, Escape sluit. Focus is altijd zichtbaar.
* Met `prefers-reduced-motion` geen draaiende bladen maar een rustige crossfade.
* Een screenreader leest gewoon de verhaaltekst voor. Afbeeldingen hebben alt-teksten.
* Beelden als WebP of AVIF, in de juiste maten, lazy geladen buiten het eerste scherm.
* Geen tracking of cookies tenzij ik erom vraag. Geluid staat standaard uit.

## Werkwijze en oplevering

1. INHOUD.md plus vragen. Wacht op antwoord.
2. Projectopzet en contentmodel gevuld met de echte inhoud.
3. Het 3D boek met openen, inhoudsopgave, bladeren en routing.
4. De personages.
5. Afwerking: toegankelijkheid, performance, mobiel.
6. Controle: `npm run build` zonder fouten, en met Playwright screenshots van het dichte boek, het open boek, een verhaalspread en de mobiele weergave. Bekijk die screenshots zelf kritisch en los op wat niet klopt.

Commit na elke stap. Schrijf een README met: lokaal draaien, een verhaal toevoegen, een personage toevoegen en publiceren op Vercel of Netlify.

## Harde regels

* Verzin geen verhalen, namen, citaten, prijzen of contactgegevens.
* Verander geen verhaaltekst.
* Gebruik alleen beelden uit `bestanden/`. Ontbreken er beelden, meld het en zet een neutrale placeholder die duidelijk als placeholder herkenbaar is.
* Twijfel je over iets dat de inhoud of uitstraling bepaalt, vraag het.
