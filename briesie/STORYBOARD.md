# Storyboard website Briesie

De site heeft zelf een verhaallijn: je komt binnen, opent het boek, leest, en houdt er iets aan over dat je kunt kopen. Dit document legt per moment vast wat de bezoeker voelt, doet en ziet. Er wordt niets gebouwd dat hier niet in staat.

Dit is stap 1 van de bouw. Er is nog geen code. De keuzes hierin zijn gebaseerd op `PLAN.md` en op het onderzoek in `REFERENTIES.md`.

## De momenten

| # | Moment | Wat de bezoeker voelt | Wat de bezoeker doet | Wat er te zien is | Duur | Tikken tot een product |
|---|---|---|---|---|---|---|
| 0 | Laden | "Dit is er meteen." | Niets | Een stilstaand beeld van het dichte boek met Siem en het groene figuurtje ernaast. Menu en winkelwagen staan er al. | Binnen 2,5 s | 1 (knop in het menu) |
| 1 | Binnenkomen | Nieuwsgierig: dit is een echt boek. | Kijkt | De camera komt in één beweging tot rust voor het boek. Het stilstaande beeld gaat ongemerkt over in 3D. | 1,5 s, eenmalig | 1 |
| 2 | Uitnodiging | "Ik mag eraan komen." | Beweegt muis of telefoon, tikt | Het boek ademt licht en draait een paar graden mee. Eén korte regel: "Tik om het boek te openen". | Tot de tik | 1 |
| 3 | Openen | Verwachting, zoals bij een cadeau uitpakken | Tikt op het boek | Het boek draait naar je toe, de kaft klapt open over de rug, de camera zakt naar de eerste spread. Het betoverende stofje stuift op. De figuurtjes schuiven uit beeld, zodat het boek alle aandacht krijgt. | 1,2 s | 1 |
| 4 | Inhoudsopgave | Overzicht en keuze | Kiest een verhaal | Links: wat Briesie is, in twee zinnen, met de knop "Bestel het boek". Rechts: de verhaaltjes met een kleine tekening. | Zo lang als nodig | 1 |
| 5 | Naar het verhaal | Plezier: het boek doet wat een boek doet | Kijkt | De bladzijden bladeren zichtbaar door naar het gekozen verhaal. De link in de adresbalk verandert mee. | Maximaal 1,5 s | 1 |
| 6 | Lezen | Rust. Het boek staat het verhaal niet in de weg. | Bladert: slepen aan een hoek, swipen, pijlen of toetsenbord | Tekst en tekening zoals in het gedrukte boek. Op de telefoon één bladzijde tegelijk. Een dunne streep toont hoe ver je bent. | Per bladzijde 0,6 s om te slaan | 1 |
| 7 | Einde verhaal | "Dit wil ik thuis ook." | Kiest: verder lezen of kopen | Op de laatste bladzijde: het volgende verhaal, de knop "Bestel het boek" en de knuffel die bij dit verhaal hoort. | Zo lang als nodig | 1 |
| 8 | Shop onder het boek | Vertrouwen: een gewone, snelle winkel | Scrollt, tikt op een product | Het boek, de knuffels en de accessoires met echte foto's en prijzen. Geen 3D. | Zo lang als nodig | 1 |
| 9 | Productpagina | Zekerheid over wat je koopt | Legt in de winkelwagen | Foto's, prijs, levertijd, maat of leeftijd, en "In winkelwagen". Bij het boek een link "Blader erin" terug naar het 3D boek. | Zo lang als nodig | 0 |
| 10 | Winkelwagen en afrekenen | Geen verrassingen | Rekent af | Zijpaneel met de inhoud en de totaalprijs, daarna de checkout van Shopify met iDEAL. | Zo kort mogelijk | 0 |

## De openingsbeweging, beeld voor beeld

Dit is het belangrijkste moment van de site. Deze vijf standen worden met screenshots gecontroleerd.

| Tijd | Stand |
|---|---|
| 0,0 s | Boek dicht, licht schuin. De tik is binnen. Het boek zakt een fractie in, als aanloop. |
| 0,3 s | Het boek draait naar de kijker toe en komt recht te liggen. De kaft is een paar graden los van het boekblok. |
| 0,6 s | De kaft staat rechtop, haaks op het boek. De eerste bladzijde is zichtbaar. Dit is het snelste punt van de beweging. |
| 0,9 s | De kaft ligt bijna plat aan de linkerkant. De camera zakt en komt dichterbij. |
| 1,2 s | Boek open en in rust. De kaft veert één keer licht na. De inhoudsopgave is leesbaar. |

Eisen aan de beweging:
* Geen sprong tussen twee standen.
* De kaft snijdt nergens door de bladzijden of door de ondergrond.
* De schaduw onder het boek beweegt mee.
* De beweging start traag, versnelt en remt af. Nooit lineair.

## Het budget

| Wat | Grens | Waarom |
|---|---|---|
| Script van het 3D boek | Maximaal 350 KB gzip | Three.js zonder extra's plus GSAP past hierin |
| Alles wat laadt voor de eerste tik | Maximaal 1,5 MB | De gemeten referenties laden 4 tot 18 MB. Dat is te veel voor een winkel. |
| Eerste beeld (LCP) | Binnen 2,5 s op 4G | Grens van Google voor "goed" |
| Vloeiendheid | Minimaal 30 beelden per seconde op een goedkope Android | Daaronder voelt bladeren stroef |
| Bladzijden | Alleen de huidige en de volgende spread laden, elk maximaal 2048 pixels | Een heel boek tegelijk laden is niet nodig |
| Geluid | Geen | Scheelt megabytes en een verplichte startknop |

Overschrijdt een onderdeel het budget, dan wordt het onderdeel aangepast en niet het budget.

## Het tegenargument: wanneer zit het boek het verkopen in de weg?

1. **Wie komt om te kopen, wil niet eerst spelen.** Iemand die via een advertentie of Instagram binnenkomt, zoekt een product en een prijs.
   Oplossing: advertenties en productlinks gaan naar de productpagina, niet naar de homepage. Productpagina's laden geen 3D. Op de homepage staat "Bestel het boek" vanaf het eerste beeld in het menu.
2. **Een trage telefoon.** Hapert het boek, dan oogt de hele winkel onbetrouwbaar.
   Oplossing: het budget hierboven, een lichtere versie op zwakke toestellen en de leesmodus als uitweg.
3. **Het boek vult het hele eerste scherm.** De producten staan dan uit beeld.
   Oplossing: onder het boek is altijd een rand van de shop zichtbaar, zodat je ziet dat er meer is.
4. **Wie alles gratis kan lezen, koopt het boek niet.**
   Oplossing: op de site staan maar een paar verhalen. Zie het besluit hieronder.

Regel voor de hele site: vanaf elk moment sta je in maximaal twee tikken op een productpagina. De tabel hierboven haalt overal één tik.

## Besloten: een paar verhalen, niet het hele boek

De site laat een paar verhalen zien om aandacht te trekken. Het doel is het boek verkopen, niet het boek vervangen.

Wat dat betekent voor de site:
* De inhoudsopgave toont alle titels uit het boek, zodat je ziet hoeveel erin zit.
* De verhalen die op de site staan, kun je openen en helemaal lezen.
* De andere titels zijn zichtbaar maar niet te openen. Tik je erop, dan zie je "Dit verhaal staat in het boek" met de knop "Bestel het boek".
* Op de laatste bladzijde van een verhaal staat hoeveel verhalen er nog in het boek zitten.

Nog te kiezen: welke verhalen het worden. Kies de sterkste, niet de eerste. Eén verhaal dat mensen uitlezen verkoopt meer dan drie waar ze halverwege afhaken.

## Bijgewerkt op 16 november 2026

* Naast het boek staan nu de tekeningen van Siem en het groene figuurtje, niet de foto's van de knuffels. Die foto's zijn er nog niet.
* Tik je op een figuurtje, dan springt het op. De weg naar de winkel loopt via de knop in het menu.
* Bij het openen stuift het betoverende stofje op: een handvol gouden glinsteringen, één keer. Boven het dichte boek glinstert er één, als uitnodiging.

## Bijgewerkt na de aantekeningen van Helma

* **De verhalen in het boek zijn de verhalen van Helma**: Waar het begon, De wereld van Briesie en Eikeltje Siem. Elk verhaal is één spread.
* **De laatste rechterbladzijde ligt op het boekblok.** Zo zie je dat de rest van het boek er nog onder zit.
* **Bij het dichte boek staat "Laat je meenemen..."**, de regel van Helma.
* **De voortgangsstreep loopt nu over het hele boek**, niet per verhaal.
* **Er zijn geen gesloten verhalen meer.** Dat komt terug zodra er stukjes uit het kinderboek zijn.
