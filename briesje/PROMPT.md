# Bouwprompt: website Briesje

Plak de tekst onder de streep in een nieuwe Claude Code sessie op de repository van Briesje. Vervang `[FASE]` door de fase uit PLAN.md waar je aan wilt werken.

---

Je werkt aan de website van Briesje: een Shopify webshop met een 3D boek als hero. De bezoeker opent het boek, kiest een verhaal uit de inhoudsopgave en leest het door te bladeren.

**Werk alleen aan fase [FASE] uit `briesje/PLAN.md`.**

## Voordat je begint

1. Lees `briesje/PLAN.md` helemaal. Dat is leidend. Wijk er niet van af zonder het eerst te vragen.
2. Lees `INHOUD.md` en `ANALYSE-OUDE-SITE.md` als ze al bestaan.
3. Bekijk welke skills beschikbaar zijn en gebruik wat past. Denk aan frontend en design, en aan pdf, docx en xlsx voor het uitlezen van bronbestanden.
4. Geef in een paar regels aan wat je in deze fase gaat opleveren en hoe je het gaat controleren. Begin daarna.

## Harde regels

* **Verzin niets.** Geen verhalen, namen, citaten, prijzen, productgegevens, bedrijfsgegevens of reviews. Ontbreekt iets, zet het op een lijst en vraag het.
* **Verhaalteksten letterlijk overnemen.** Typfouten apart melden in plaats van ze stilletjes te verbeteren.
* **Geen AI-beeld in het eindresultaat.** Alleen als placeholder, en dan zichtbaar gemarkeerd.
* **Geen marketingclichés.** Geen "magische wereld", "ontdek", "unieke ervaring" en dergelijke. Korte, gewone zinnen.
* **Geen generiek stramien.** Geen kop met kleurverloop, geen drie kaartjes met icoontjes, geen fade-in op alles. Beweging alleen waar die iets betekent: bij het boek.
* **Geen sleutels in de repo.** Geen wachtwoorden, API-sleutels of `.env`-bestanden.

## Kwaliteit

* Werkt op iPhone (Safari), Android (Chrome) en desktop. Test mobiel altijd in portretstand.
* Lighthouse op mobiel: performance minimaal 85 op de homepage met het boek en minimaal 90 op andere pagina's, toegankelijkheid minimaal 95.
* Het boek is volledig met het toetsenbord te bedienen: Enter of spatie opent, pijltjes bladeren, Escape sluit. Focus is altijd zichtbaar.
* Met `prefers-reduced-motion` en zonder WebGL is alles bereikbaar via de leesmodus.
* Verhaaltekst staat altijd ook als gewone HTML op de pagina.

## Afronden van de fase

1. Controleer je eigen werk. Draai de build en maak met Playwright screenshots van elke belangrijke staat, desktop en mobiel. Bekijk die screenshots kritisch en herstel wat niet klopt, voordat je iets oplevert.
2. Lever op met:
   * wat er gedaan is
   * wat nog niet werkt of onzeker is
   * de vragen die openstaan
3. Commit met duidelijke berichten en push.
4. Begin niet aan de volgende fase zonder mijn akkoord.
