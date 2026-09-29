# Briesje

Shopify webshop met een 3D boek als hero. De bezoeker opent het boek, kiest een verhaal uit de inhoudsopgave en leest het door te bladeren. Verkocht worden het boek, knuffels en accessoires.

## Altijd eerst

1. Lees `PLAN.md` helemaal. Dat is leidend. Wijk er niet van af zonder het eerst te vragen.
2. Lees `INHOUD.md` en `ANALYSE-OUDE-SITE.md` als ze bestaan.
3. Werk alleen aan de fase die gevraagd wordt. Is er geen fase genoemd, vraag welke.
4. Gebruik de skills die passen: frontend en design, en pdf, docx en xlsx voor het uitlezen van `bestanden/`.
5. Geef in een paar regels aan wat je gaat opleveren en hoe je het controleert. Begin daarna.

## Harde regels

* **Verzin niets.** Geen verhalen, namen, citaten, prijzen, productgegevens, bedrijfsgegevens of reviews. Ontbreekt iets, zet het op een lijst en vraag het.
* **Verhaalteksten letterlijk overnemen.** Typfouten apart melden in plaats van ze stilletjes te verbeteren.
* **Het 3D boek volgt het echte boek.** Kaft, rug en bladspiegel zoals het gedrukte product.
* **Geen AI-beeld in het eindresultaat.** Alleen als placeholder, en dan zichtbaar gemarkeerd.
* **Geen marketingclichés.** Geen "magische wereld", "ontdek", "unieke ervaring" en dergelijke. Korte, gewone zinnen.
* **Geen generiek stramien.** Geen kop met kleurverloop, geen drie kaartjes met icoontjes, geen fade-in op alles. Beweging alleen waar die iets betekent: bij het boek en de knuffels.
* **Geen sleutels in de repo.** Geen wachtwoorden, API-sleutels of `.env`-bestanden.

## Kwaliteit

* Werkt op iPhone (Safari), Android (Chrome) en desktop. Test mobiel altijd in portretstand.
* Lighthouse op mobiel: performance minimaal 85 op pagina's met het boek en minimaal 90 op andere pagina's, toegankelijkheid minimaal 95.
* Het boek is volledig met het toetsenbord te bedienen: Enter of spatie opent, pijltjes bladeren, Escape sluit. Focus is altijd zichtbaar.
* Met `prefers-reduced-motion` en zonder WebGL is alles bereikbaar via de leesmodus.
* Verhaaltekst staat altijd ook als gewone HTML op de pagina.

## Afronden van een fase

1. Controleer je eigen werk. Draai de build en maak met Playwright screenshots van elke belangrijke staat, desktop en mobiel. Bekijk die kritisch en herstel wat niet klopt, voordat je iets oplevert.
2. Lever op met:
   * wat er gedaan is
   * wat nog niet werkt of onzeker is
   * de vragen die openstaan
3. Commit met duidelijke berichten en push.
4. Begin niet aan de volgende fase zonder akkoord.
