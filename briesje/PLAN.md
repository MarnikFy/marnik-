# Plan website Briesje

Dit document is leidend voor de bouw. Wat hier staat is afgesproken. Wat onder "Open vragen" staat, is nog niet beslist en wordt niet door de bouwer ingevuld.

## Vastgelegde keuzes

| Onderwerp | Keuze |
|---|---|
| Hero | Het boek zelf, in 3D. Geen filmpje van het verhaal. |
| Openen | Bezoeker klikt of tikt. Het boek gaat pas open als iemand dat wil. |
| Na openen | Inhoudsopgave met de verhaaltjes |
| Lezen | In het 3D boek, pagina's buigen om bij het bladeren |
| Doel | Verkopen: het boek, knuffels en accessoires |
| Webshop | Shopify, nieuwe winkel |
| Producten | Bestaan al: het boek, de knuffels en de accessoires |
| Verhalen | Tekst met een paar tekeningen per verhaal, in het gedrukte boek |
| Oude site en bestanden | Staan lokaal, moeten nog geüpload worden |
| Repository | Privé repo `briesje`, los van andere projecten |

## Waarom de vorige site "AI" oogde, en wat we anders doen

De oude site heb ik nog niet gezien, dus dit is nog geen analyse daarvan. Dit zijn de bekende oorzaken van die uitstraling, en die sluiten we vooraf uit:

* **Generiek stramien.** Een grote kop met een kleurverloop, drie kaartjes met icoontjes, overal dezelfde fade-in. Wij bouwen de pagina rond één sterk idee: het boek. Alles daaromheen is rustig.
* **AI-plaatjes.** Personages die per plaatje anders uitzien, te glad en te glanzend. Wij gebruiken de echte producten als beeld, zie "Beeld" hieronder.
* **Standaard typografie.** Overal hetzelfde schreefloze lettertype. Wij kiezen een letter die bij een kinderboek past en zetten de tekst met zorg, zoals in een echt boek.
* **Holle teksten.** Zinnen als "Ontdek de magische wereld van". Teksten komen uit jullie bestanden of van jullie zelf, en anders staat er niets.
* **Verzonnen inhoud.** De bouwer verzint niets. Ontbreekt er iets, dan wordt het gevraagd.

Tegen fouten: elke fase eindigt met een controle door jou, voordat de volgende begint. Er komt ook een vaste testlijst (zie fase 6).

## Beeld: het echte product is het beeld

Alle producten bestaan al. Dat lost het grootste risico op, want we hoeven geen beeld te verzinnen. We laten zien wat je verkoopt.

* **Het 3D boek is een kopie van het echte boek.** Dezelfde kaft, rug en achterkant, gemaakt van een drukbestand of een goede scan. Wie op de site het boek openslaat, ziet het boek dat thuis op de mat valt. Dat verkoopt beter dan welke illustratie ook.
* **De knuffels zijn de poppetjes.** Vrijstaand gefotografeerd (zonder achtergrond), vanuit een paar hoeken. Ze staan naast het boek in de hero en komen tevoorschijn als het boek opengaat. Tik op een knuffel en je gaat naar de productpagina.
* **Accessoires** krijgen gewone, goede productfoto's in de shop.
* **Geen AI-beeld**, behalve tijdelijk als placeholder tijdens de bouw, en dan duidelijk gemarkeerd.

Waar het nog van afhangt:
1. **Hebben we een drukbestand of scan van de kaft?** Zonder die krijgt het 3D boek geen echte kaft. Een foto met de telefoon is te weinig: dan zie je glans en vertekening.
2. **Zijn er goede vrijstaande foto's van de knuffels?** Anders moeten die gemaakt worden. Dat kan met een lichtbak of een wit laken bij daglicht, maar een productfotograaf is een halve dag werk en het verschil zie je.
3. **Tekeningen in het boek.** Bevestigd: er staan tekeningen in. De bladzijden in het 3D boek worden dus opgebouwd uit dezelfde tekst en tekeningen als in het gedrukte boek. Nodig zijn de originele tekeningen op hoge resolutie, of het drukbestand. Foto's of scans van gedrukte pagina's zijn te zacht en vertekend om als bladzijde te dienen.

De tekeningen bepalen ook de sfeer van de site: kleuren en lettertype leiden we af uit de tekeningen en de kaft, we verzinnen ze niet los daarvan.

Het boek zelf (vorm, beweging, bladeren) staat los van het beeld en kan dus al gebouwd worden.

## De ervaring

### Homepage
1. **Laden.** Er staat direct een stilstaand beeld van het dichte boek, met de knuffels ernaast. Zodra het 3D-deel geladen is, neemt dat het naadloos over. Geen laadbalk, geen leeg scherm.
2. **Eerste indruk.** De camera beweegt eenmalig in ongeveer 1,5 seconde naar het boek toe en komt tot rust. Bij een volgend bezoek slaan we dit over.
3. **Rust.** Het boek ligt licht schuin, met een zachte, bijna ademende beweging. Het draait een paar graden mee met de muis, of op de telefoon met het kantelen. Nooit druk.
4. **Openen.** Na een tik draait het boek naar je toe, gaat de kaft open over de rug (ongeveer 1,2 seconde) en zoomt de camera in op de eerste spread. De knuffels schuiven mee naar de rand van het beeld en blijven zichtbaar.
5. **Inhoudsopgave.** Links een korte introductie en een knop om het boek te kopen. Rechts de verhaaltjes.
6. **Verhaal kiezen.** Het boek bladert zichtbaar een paar pagina's door naar het verhaal. Het bladeren duurt nooit langer dan 1,5 seconde, hoe ver het verhaal ook achterin staat. Het verhaal heeft een eigen link.
7. **Lezen.** Bladeren gaat door een hoek te pakken en te slepen, door te swipen, met pijlen op het scherm of met het toetsenbord. Op een telefoon in portretstand staat de camera op één pagina tegelijk.
8. **Einde van een verhaal.** Er verschijnt een link naar het volgende verhaal, een knop om het boek te kopen, en de knuffel van het personage uit dit verhaal.
9. **Onder het boek.** Wie naar beneden scrollt, komt bij een gewone, snelle shop: het boek, de knuffels, de accessoires en iets over Briesje.

Menu en winkelwagen zijn altijd zichtbaar. Niemand komt vast te zitten in het 3D boek.

### Webshop
* **Pagina's:** home, collectie (alles, knuffels, accessoires), productpagina, winkelwagen als zijpaneel, en checkout via Shopify.
* **Informatiepagina's:** over Briesje, contact, veelgestelde vragen, verzenden en retour.
* **Verplicht voor een Nederlandse webshop:** algemene voorwaarden, privacybeleid, retourbeleid en bedrijfsgegevens (naam, adres, KvK, btw-nummer). Templates mogen een startpunt zijn, maar worden aangepast aan jullie situatie.
* **Productfoto's:** echte foto's van de producten, geen AI-beeld.

## Techniek

**Platform: een eigen Shopify thema.** We bouwen op een officieel gratis thema en passen dat stevig aan. Geen losse website die aan Shopify gekoppeld wordt. Waarom:
* Minder code betekent minder kans op fouten
* Jullie beheren producten en verhalen zelf in Shopify
* Geen tweede hosting nodig
* Betalen, btw, verzending en voorraad zijn meteen goed geregeld

**Verhalen als Shopify metaobjecten.** Elk verhaal is een item met titel, volgorde, tekst per pagina, personages en beelden. Een nieuw verhaal toevoegen kan zo zonder ontwikkelaar. Het boek wordt uit deze gegevens opgebouwd.

**Het 3D boek: Three.js met GSAP**, als één los script dat alleen laadt op de homepage en de verhaalpagina's.
* Kaft en rug als echt 3D-object, met stof- of linnentextuur en een reliëftitel
* Bladzijden die buigen via een SkinnedMesh met botten
* Bladzijden komen bij voorkeur rechtstreeks uit het drukbestand, als afbeelding per pagina (maximaal 2048 pixels breed). Dan is de bladzijde in het 3D boek identiek aan die in het gedrukte boek. Is er geen drukbestand, dan zetten we tekst en losse tekeningen zelf op een canvas, met het lettertype van het boek.
* De verhaaltekst staat daarnaast altijd als gewone HTML, onzichtbaar voor het oog maar leesbaar voor Google en schermlezers.
* Warm licht, zachte schaduw, een subtiele papiertextuur

**Snelheid:**
* Stilstaand beeld eerst, 3D daarna
* Textures maximaal 2048 pixels
* Pixel ratio maximaal 2
* De animatie pauzeert als het boek uit beeld is

**Terugvaloptie:** zonder WebGL, met "beweging verminderen" aan, of via een knop "leesmodus" staat hetzelfde verhaal als gewone tekst op de pagina. Die tekst staat er altijd in de HTML, zodat Google en schermlezers hem ook kunnen lezen.

**Bouwen in twee sporen:**
* Eerst het boek los, met Vite en een testpagina. Zo kan het snel en zonder Shopify worden bijgestuurd en met Playwright getest.
* Daarna het thema, en dan pas samenvoegen.

**Repository:** privé repo `briesje`. In de hoofdmap staan dit plan, `CLAUDE.md` en `bestanden/`. Later komen daar `theme/` voor het Shopify thema en `book/` voor de broncode van het 3D boek bij.

## Fasering

Elke fase eindigt met jouw akkoord.

| Fase | Wat | Resultaat |
|---|---|---|
| 0. Voorbereiding | Privé repo, bestanden uploaden, kaftbestand en knuffelfoto's regelen, Shopify winkel aanmaken | Alles klaar om te beginnen |
| 1. Analyse | Oude site en bestanden doorlopen | `INHOUD.md` (alle inhoud met bron) en `ANALYSE-OUDE-SITE.md` (wat bewaren we, wat was er fout) |
| 2. Stijlrichting | Drie korte stijlvoorstellen voor boek en homepage: letter, kleur, materiaal, afgeleid van de tekeningen en de kaft. Inclusief de test met knuffelfoto's naast een getekende pagina. | Jij kiest er één |
| 3. Prototype boek | Het 3D boek los, met placeholders: binnenkomst, openen, inhoudsopgave, bladeren, mobiel | Een link die je op je eigen telefoon test. Pas verder als het goed voelt. |
| 4. Shopify thema | Shop, productpagina's, winkelwagen, informatie- en juridische pagina's | Werkende winkel met testproducten |
| 5. Samenvoegen | Boek in het thema, verhalen uit metaobjecten, knoppen naar producten | Complete site op een testomgeving |
| 6. Test en livegang | Vaste testlijst: iPhone, goedkope Android, desktop, snelheid, een testbestelling, alle teksten nagelopen, domein gekoppeld | Live |

Fase 3 komt bewust vroeg. Het boek is het spannendste en risicovolste deel. Voelt het niet goed, dan weten we dat voordat er een hele shop omheen staat.

## Wat ik van jou nodig heb

1. **Privé repository.** Maak op github.com een lege, privé repo `briesje` aan en geef de Claude GitHub App toegang. De stappen staan in `README.md`.
2. **Bestanden uploaden.** De oude site (code of screenshots van elke pagina), alle verhalen, productinformatie (namen, prijzen, foto's) en, als die er zijn, logo en huisstijl en een tekst over jullie. Waar je ze neerzet staat in `bestanden/README.md`.
3. **Kaft en foto's.** Het drukbestand of een scan van de kaft, en vrijstaande foto's van de knuffels. Zie "Beeld" hierboven.
4. **Shopify.** Een winkel aanmaken (proefperiode is genoeg) en de Shopify-koppeling in claude.ai verbinden.
5. **Domeinnaam.** Hebben jullie er al een?
6. **Bedrijfsgegevens.** KvK, btw-nummer en retouradres, voor de verplichte pagina's.

## Risico's

* **Beeldkwaliteit.** De producten bestaan, maar slechte foto's of een onscherpe kaft doen alsnog de hele site teniet. Liever een halve dag fotograferen dan een week bouwen op slecht materiaal.
* **Oudere telefoons.** 3D kan daar haperen. Oplossing: stilstaand beeld eerst, een lichtere versie op zwakke toestellen, en testen op een goedkope Android.
* **Lezen op de telefoon.** Tekst in 3D is op een klein scherm minder scherp dan gewone tekst. Daarom één pagina tegelijk, de tekst groot genoeg gezet, en de leesmodus als uitweg.
* **Knuffels voor kinderen.** Speelgoed dat je in de EU verkoopt moet een CE-markering hebben en getest zijn volgens de speelgoednormen (EN 71). Vraag de leverancier om de testrapporten voordat je gaat verkopen.
* **Scope.** Een 3D boek en een webshop zijn eigenlijk twee projecten. Daarom de fasering, en niet alles tegelijk.
* **Rechten op de tekeningen.** Heeft iemand anders de tekeningen gemaakt, dan moet er afgesproken zijn dat ze ook op de site en op producten mogen. Dat is niet vanzelfsprekend: een illustrator kan een boek-licentie hebben gegeven zonder toestemming voor web of merchandise. Vraag dit na voordat we bouwen.
* **Foto's naast tekeningen.** Echte foto's van knuffels tussen getekende bladzijden kan mooi zijn, maar ook botsen. In fase 2 testen we dat met een paar echte foto's naast een getekende pagina, voordat we het zo vastleggen.
* **Sleutels in de repo.** Zet ook in een privé repo geen wachtwoorden, API-sleutels of `.env`-bestanden uit de oude site.

## Open vragen

* Is er een drukbestand of scan van de kaft?
* Zijn er vrijstaande foto's van de knuffels?
* Wie heeft de tekeningen gemaakt, en zijn ze ook voor web en producten vrij te gebruiken?
* Zijn de originele tekeningen bewaard op hoge resolutie?
* Welke accessoires precies?
* Voor welke leeftijd zijn de verhalen?
* Wie zitten er achter Briesje, en wat mag daarover op de site?
