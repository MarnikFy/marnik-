# Referentieonderzoek: 3D met een verhaallijn

Onderzocht op 13 november 2026. Elke site is geopend in een echte browser (Chromium via Playwright), op een desktopformaat (1440 bij 900) en op een telefoonformaat (iPhone 13). De cijfers komen uit het netwerkverkeer van de site zelf, niet uit artikelen.

## Wat je over deze metingen moet weten

* **Gewicht is betrouwbaar.** Het aantal megabytes is gemeten aan het echte netwerkverkeer.
* **Snelheid is niet betrouwbaar.** De browser draaide in de cloud zonder grafische kaart. Laadtijden en vloeiendheid zeggen daardoor niets over een echte telefoon. Die staan er daarom niet in.
* **Twee sites kon ik niet openen.** Cartier weigerde de verbinding (toegang geweigerd) en DeepSee Commerce was vanuit deze omgeving niet bereikbaar. Wat over die twee bekend is, komt uit artikelen en telt dus niet als meting.
* **Bij Atmos ben ik niet voorbij het startscherm gekomen.** De klik op de startknop kwam niet aan. De opbouw van het verhaal heb ik afgeleid uit de tekst op de pagina.

## De sites

| Site | Wat het is | Techniek | Gewicht desktop | Gewicht telefoon | Startknop | Tekst als echte tekst | Verkoopt iets |
|---|---|---|---|---|---|---|---|
| [Atmos](https://atmos.leeroy.ca) | Een vlucht door de wolken met korte verhalen over de luchtvaart | Three.js (versie 141), script 0,66 MB | 3,75 MB, waarvan 2,3 MB muziek | 3,75 MB | Ja, "Explore" | Deels (664 tekens) | Nee |
| [The Boat](https://www.sbs.com.au/theboat/) | Getekend verhaal in zes hoofdstukken dat je scrollend leest | Three.js voor regen en beweging, tekst en tekeningen eroverheen | 4,9 MB bij start, 11,8 MB na één hoofdstuk | 5,2 MB bij start | Ja, "Click to start" | Ja, alle verhaaltekst | Nee |
| [Sleep Well Creative](https://sleep-well-creatives.com/) | Gids over slapen in zes delen | Three.js (180) in Webflow, veel video | 43 MB, waarvan 40 MB video | 35 MB | Ja, "Enter Site" | Ja (ruim 6.000 tekens) | Nee |
| [Oryzo](https://oryzo.ai/) | Productpagina voor een verzonnen onderzetter, als grap van studio Lusion | Three.js (178, aangepast), zes canvassen | 5,8 MB | 9,9 MB | Nee | Ja (6.500 tekens) | Nee, het product bestaat niet |
| [Messenger](https://messenger.abeto.co/) | Je bezorgt post op een kleine planeet | Three.js (180), script 0,5 MB | 5,6 MB, waarvan 2,3 MB muziek | 3,4 MB, met lichtere muziek | Niet gezien | Nee, nul tekens | Nee |
| [Bruno Simon](https://bruno-simon.com) | Portfolio als autospelletje | Three.js (187), script 1,1 MB plus een physics-engine van 1,5 MB | 7,2 MB | 5,1 MB | Niet gezien | Nee, alleen knoppen | Nee |
| Cartier Watches and Wonders | Zes 3D ruimtes, één per horloge | Volgens een artikel Three.js, GSAP en Lenis | Niet gemeten | Niet gemeten | Onbekend | Onbekend | Toont producten, koopt niet af |
| DeepSee Commerce | Site van een webshopbureau, je zakt scrollend door water | Volgens een artikel Three.js en GSAP | Niet gemeten | Niet gemeten | Onbekend | Onbekend | Onbekend |

## Hoe ze hun verhaal opbouwen

* **Atmos.** Eén doorlopende beweging: je scrollt en vliegt. Onderweg kom je korte verhalen tegen met elk een eigen titel. Het verhaal is de route.
* **The Boat.** Zes hoofdstukken, genummerd in een smalle balk aan de rechterkant. Je scrollt omlaag door tekeningen en tekst. Regen, mist en het deinen van het beeld versterken het verhaal, maar de tekst blijft gewoon tekst. Je kunt geluid uitzetten en het verhaal vanzelf laten scrollen.
* **Sleep Well Creative.** Zes genummerde delen, met een teller in beeld. Elk deel heeft een eigen getekende scène.
* **Oryzo.** Het product ligt vanaf het eerste beeld midden in het scherm, met de naam er groot boven. Het menu staat altijd rechtsboven. Scrollen vertelt stap voor stap wat het product kan.
* **Messenger en Bruno Simon.** Geen verhaal dat je leest, maar een wereld waarin je rondloopt of rijdt.

## Wat dit betekent voor Briesie

1. **Een bewuste start is normaal.** De drie echte verhaalsites laten je eerst ergens op tikken. Bij ons is dat het boek zelf. Dat is sterker dan een knop, want de handeling betekent iets.
2. **Deze sites zijn te zwaar voor een winkel.** Ze laden 3,4 tot 43 MB. Het zit vooral in muziek en video. Wij gebruiken geen van beide en houden 1,5 MB aan tot de eerste tik.
3. **Tekst moet echte tekst blijven.** The Boat, Oryzo en Sleep Well hebben leesbare tekst op de pagina. Messenger en Bruno Simon hebben er nul, en zijn daardoor onvindbaar in Google. Onze verhalen staan dus altijd ook als gewone tekst op de pagina.
4. **Hoofdstukken horen zichtbaar te zijn.** The Boat en Sleep Well tonen allebei waar je bent en hoeveel er nog komt. Bij ons doen de inhoudsopgave en de voortgangsstreep dat.
5. **De telefoon krijgt eigen bestanden.** The Boat heeft aparte kleinere tekeningen. Messenger laadt lichtere muziek en minder modellen. Wij maken de bladzijden dus in twee maten.
6. **Het product in het midden werkt.** Oryzo is het dichtst bij ons idee: één voorwerp als held van het eerste scherm, met het menu altijd bereikbaar.
7. **Niemand combineert dit met een winkelwagen.** Ik heb geen enkele gemeten site gevonden die een 3D verhaal en een werkende winkel samenbrengt. Wij hebben dus geen voorbeeld om na te doen. Daarom zijn de terugvaloptie, de regel van twee tikken en de test met echte ouders geen extraatjes maar noodzaak.

## Open broncode voor het boek

Licenties zijn nagekeken in het npm-register. De repository van Wawa Sensei is op GitHub bekeken.

| Project | Licentie | Bruikbaar | Toelichting |
|---|---|---|---|
| three.js (0.187) | MIT | Ja | De basis |
| GSAP (3.15) | Eigen gratis licentie | Ja | Volgens de licentie gratis te gebruiken. De voorwaarden lees ik na voordat we live gaan. |
| Boekdemo van Wawa Sensei (`r3f-animated-book-slider-final`) | Geen licentie | Niet kopiëren | Zonder licentie mag de code niet overgenomen worden. De techniek (bladzijden met botten laten buigen) is algemeen en staat ook in de documentatie van three.js. |
| `@objectifthunes/three-book` (0.8.1) | Niet vrijgegeven | Nee | Staat in het register als "UNLICENSED" en heeft 5 downloads per week |
| `quick_flipbook` (1.1.3) | BSD 2-Clause | Mag, maar oud | Laatste versie uit februari 2024, leunt op een extra bibliotheek |
| `turngl` (0.2.0) | MIT | Als leesvoer | Pdf-bladerboek op three.js, nog jong |
| `page-flip` (2.0.7) | MIT | Nee | Plat, niet 3D, en sinds 2021 niet bijgewerkt |
| `hic-pageflip` (1.0.5) | MIT | Nee | Werkt alleen in Chrome met een experimentele instelling aan |

**Besluit:** we bouwen het boek zelf op three.js. Geen van de kant-en-klare boeken is tegelijk vrij te gebruiken, onderhouden en geschikt voor een echt boek met harde kaft. `turngl` en `quick_flipbook` lees ik door om van te leren.

## Shopify thema: nog niet beslist

Bronnen spreken elkaar tegen over de vraag of Horizon het nieuwe standaardthema is en of je het vrij mag aanpassen. Dawn wordt volgens één bron nog steeds bijgewerkt. Ik kon dit niet bij Shopify zelf nalopen, omdat GitHub buiten jouw eigen repo in deze omgeving is afgesloten. Dit beslis ik zodra de Shopify-koppeling werkt en ik de thema's in een echte winkel kan zien.

## Bronnen

* [Atmos](https://atmos.leeroy.ca), [The Boat](https://www.sbs.com.au/theboat/), [Sleep Well Creative](https://sleep-well-creatives.com/), [Oryzo](https://oryzo.ai/), [Messenger](https://messenger.abeto.co/), [Bruno Simon](https://bruno-simon.com): zelf gemeten
* [8 Best Three.js Websites of 2026](https://www.utsubo.com/blog/best-threejs-websites-2026): adressen van de sites, en de beschrijving van Cartier
* [DeepSee Commerce case study](https://www.hontran.dev/blog/deepsee-commerce-3d-ecommerce-website-case-study)
* [Wawa Sensei boekdemo](https://github.com/wass08/r3f-animated-book-slider-final)
* [hic-pageflip](https://www.wearedevelopers.com/magazine/769-a-3d-flipbook-component-built-with-the-html-in-canvas-api)
* [Horizon en Dawn](https://community.shopify.dev/t/horizon-and-what-happens-to-dawn/15861)
