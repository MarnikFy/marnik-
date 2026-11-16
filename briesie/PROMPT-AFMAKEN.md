# Prompt: de website van Briesie afmaken

Plak de tekst onder de streep in Claude Code, in de repo met de map `briesie/`.

---

Maak de website van Briesie helemaal af, van de eerste indruk tot en met het afrekenen en de footer. Het moet op een telefoon net zo goed werken als op een computer. Het prototype in `briesie/book/` is het vertrekpunt: het 3D boek blijft de opening van de site.

## Voor wie

Moeders met kinderen van ongeveer 6 tot 9 jaar, en mensen die een cadeau zoeken voor zo'n kind. Ze kijken meestal op hun telefoon, vaak met één hand en met weinig tijd. Ze willen binnen een paar tellen weten: wat is dit, voor welke leeftijd, wat kost het, en wanneer heb ik het in huis.

## Begin bij wat er echt is

1. Lees `PLAN.md`, `INHOUD.md`, `ANALYSE-OUDE-SITE.md`, `SEO.md` en `STORYBOARD.md`. Die zijn leidend.
2. Gebruik alleen tekst, prijzen, foto's en gegevens uit `INHOUD.md` en `bestanden-lokaal/`. De teksten van Helma neem je letterlijk over.
3. Ontbreekt iets, zet het op een lijst en vraag het. Verzin geen reviews, geen aantallen klanten, geen keurmerken en geen bedrijfsgegevens.

## Wat er moet komen

**De homepage, van boven naar beneden**
1. Het 3D boek met Siem en het groene monster, de titel, de leeftijd en "Laat je meenemen...".
2. Direct daaronder, zonder scrollen zichtbaar op een telefoon: de prijs van het boek en de knop "Bestel het boek".
3. Waar het boek over gaat: de omschrijving met Kiki de kraai en Pippa het roodborstje.
4. Voor wie het is en wat je krijgt: leeftijd, aantal bladzijden, gebonden.
5. Helma en Briesie: "Waar het begon", met een foto van haar zodra die er is.
6. De winkel: het boek, het wensbuisje, het gevilte eikeltje en het cadeaupakket. Het cadeaupakket krijgt de meeste ruimte.
7. Reacties van lezers, alleen als het echte zijn. Zijn ze er niet, dan komt dit blok er niet.
8. Veelgestelde vragen: leeftijd, verzendkosten, levertijd, cadeauverpakking, persoonlijk kaartje, ruilen.
9. De footer.

**Per product een eigen pagina**
* Foto's, naam, prijs, korte omschrijving, levertijd, verzendkosten en "In winkelwagen".
* Bij het boek een knop "Blader erin" die het 3D boek opent.
* Bij handwerk de zin dat geen twee stuks precies hetzelfde zijn.
* Onderaan wat er goed bij past, bijvoorbeeld het cadeaupakket.

**Winkelwagen en afrekenen**
* Winkelwagen als paneel dat van opzij inschuift, op de telefoon van onderaf.
* Altijd zichtbaar: subtotaal, verzendkosten en hoeveel er nog bij moet voor gratis verzending.
* Keuzes uit de oude site: gratis cadeauverpakking en een persoonlijk kaartje.
* Afrekenen gaat via Shopify. De site bouwt de winkelwagen zelf op en stuurt hem door naar de kassa van Shopify. De productnummers van Shopify staan in één bestand, zodat ze later in te vullen zijn.
* Zolang die nummers er niet zijn, staat er duidelijk "Bestellen kan binnenkort" en gaat er niets stuk.

**Vaste pagina's**
* Algemene voorwaarden, privacy, herroeping en retour, verzending en levering, contact.
* Vul ze alleen met echte bedrijfsgegevens. Staan die er niet, laat dan zien wat ontbreekt in plaats van iets in te vullen.

**De footer**
* Naam en de regel van Helma, het mailadres, links naar de vaste pagina's, de betaalmanieren zodra die vaststaan, en het KvK-nummer zodra dat er is.
* Links naar sociale media alleen als ze naar een echte eigen pagina gaan.

## Hoe het moet voelen

* Vrolijk en fel, in de kleuren van de kaft: roze, groen, geel, blauw, met de gekleurde spatjes. Dat vroeg Helma.
* Het boek, Siem en het monster zijn het beeld. Geen stockfoto's, geen emoji als icoon, geen blokjes met icoontjes, geen drie stappen met cijfers.
* Korte, gewone zinnen in de stem van Helma. Geen "magische wereld" of "unieke ervaring".
* Eén beweging die ertoe doet: het boek dat opengaat met het stofje. De rest staat stil.
* Knoppen van minimaal 44 pixels hoog, tekst van minimaal 16 pixels, alles met één duim te bedienen.

## Werkwijze

Pas toe wat bij deze site past uit de verzameling "everything-claude-code" en uit je eigen skills:
* **Eerst zoeken, dan bouwen**: kijk wat er al staat in `book/` voor je iets nieuws schrijft.
* **Ontwerp**: werk de opmaak eerst uit als kleuren, letters en maten, en bouw daarna alles daaruit op.
* **Testen van begin tot eind** met Playwright, op telefoonformaat en op desktop.
* **Controleren na elke stap**: bouwen, testen, schermafbeeldingen bekijken, herstellen, en dan pas door.
* **Code-review en veiligheidscontrole** aan het einde, op het formulier en het doorsturen naar de kassa.

Volgorde, met na elke stap een korte oplevering:
1. Opbouw van de pagina's en de vormgeving van één productpagina en de homepage onder het boek.
2. De andere productpagina's, de winkelwagen en het doorsturen naar de kassa.
3. De vaste pagina's en de footer.
4. Vindbaarheid: paginatitels, beschrijvingen, productgegevens voor Google, een sitemap.
5. Afwerking en de controles hieronder.

## Bewijs dat het klopt

* **De hele route werkt**, getest op een iPhone-formaat en op desktop: binnenkomen, boek openen, een verhaal lezen, naar het boek in de winkel, in de winkelwagen, cadeauverpakking kiezen, naar de kassa. Geslaagd als elke stap groen is.
* **Vanaf elk scherm sta je in maximaal twee tikken bij een product.**
* **Snel**: alles voor de eerste tik blijft onder 1,5 MB, het script van het boek onder 350 KB.
* **Toegankelijk**: met het toetsenbord te bedienen, contrast in orde, de verhalen ook als gewone tekst.
* **Tekst klopt**: een script vergelijkt de teksten van Helma op de site met de bron. Geslaagd bij nul verschillen.
* **Geen dode links** en geen lege plekken met "invullen".
* **Echte mensen**: ik laat vijf moeders de site op hun eigen telefoon proberen, zonder uitleg. Geslaagd als minstens vier zonder hulp het boek in de winkelwagen leggen. Jij levert de link en drie opdrachten.

Lever per stap op: wat af is, wat niet werkt of onzeker is, en welke vragen openstaan. Zet niets live zonder mijn akkoord.
