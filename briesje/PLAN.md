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
| Verhalen | Bestaan alleen als tekst |
| Oude site en bestanden | Staan lokaal, moeten nog geüpload worden |

## Waarom de vorige site "AI" oogde, en wat we anders doen

De oude site heb ik nog niet gezien, dus dit is nog geen analyse daarvan. Dit zijn de bekende oorzaken van die uitstraling, en die sluiten we vooraf uit:

* **Generiek stramien.** Een grote kop met een kleurverloop, drie kaartjes met icoontjes, overal dezelfde fade-in. Wij bouwen de pagina rond één sterk idee: het boek. Alles daaromheen is rustig.
* **AI-plaatjes.** Personages die per plaatje anders uitzien, te glad en te glanzend. Hoe we met beeld omgaan staat hieronder bij de belangrijkste beslissing.
* **Standaard typografie.** Overal hetzelfde schreefloze lettertype. Wij kiezen een letter die bij een kinderboek past en zetten de tekst met zorg, zoals in een echt boek.
* **Holle teksten.** Zinnen als "Ontdek de magische wereld van". Teksten komen uit jullie bestanden of van jullie zelf, en anders staat er niets.
* **Verzonnen inhoud.** De bouwer verzint niets. Ontbreekt er iets, dan wordt het gevraagd.

Tegen fouten: elke fase eindigt met een controle door jou, voordat de volgende begint. Er komt ook een vaste testlijst (zie fase 6).

## De belangrijkste beslissing: beeld

De verhalen zijn alleen tekst. Maar het 3D boek heeft een kaft nodig, de bladzijden hebben beeld nodig en de poppetjes moeten ergens op gebaseerd zijn. Dit bepaalt meer dan wat ook of de site echt of "AI" oogt.

| Optie | Voordeel | Nadeel |
|---|---|---|
| **A. Illustrator inhuren** | Uniek, consistent, past bij een echt boek. Dezelfde tekeningen dienen voor boek, site en knuffels. | Kost geld en een paar weken tijd |
| **B. Knuffels fotograferen als personages** | Echt en tastbaar, nul AI-uitstraling, en je laat meteen het product zien dat je verkoopt | Kan alleen als de knuffels al bestaan. Voor de kaft is alsnog ontwerp nodig. |
| **C. AI-beeld met strakke stijlgids** | Snel en goedkoop | Grote kans op precies de uitstraling die je niet wilt. Personages blijven lastig consistent. Bij commercieel gebruik is het auteursrecht op AI-beeld onzeker. |

**Advies:** B als de knuffels al bestaan, aangevuld met een illustrator voor de kaft en een paar sfeerbeelden. Bestaan ze nog niet, dan A. De knuffels moeten dan toch ontworpen worden, en daar dient dezelfde illustrator voor. C alleen voor tijdelijke placeholders tijdens de bouw.

Tot dit beslist is, bouwen we met duidelijk herkenbare placeholders. Het boek zelf (vorm, beweging, bladeren) staat los van het beeld en kan dus al gebouwd worden.

## De ervaring

### Homepage
1. **Laden.** Er staat direct een stilstaand beeld van het dichte boek. Zodra het 3D-deel geladen is, neemt dat het naadloos over. Geen laadbalk, geen leeg scherm.
2. **Eerste indruk.** De camera beweegt eenmalig in ongeveer 1,5 seconde naar het boek toe en komt tot rust. Bij een volgend bezoek slaan we dit over.
3. **Rust.** Het boek ligt licht schuin, met een zachte, bijna ademende beweging. Het draait een paar graden mee met de muis, of op de telefoon met het kantelen. Nooit druk.
4. **Openen.** Na een tik draait het boek naar je toe, gaat de kaft open over de rug (ongeveer 1,2 seconde) en zoomt de camera in op de eerste spread.
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
* Paginabeeld wordt in de browser op canvas getekend: tekst gezet in het gekozen lettertype, plus illustratie, op hoge resolutie. Tekst die in Shopify wordt aangepast, staat dus meteen goed in het boek.
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

**Repository:** een nieuwe, privé repository `briesje`, met de mappen `theme/` voor het Shopify thema en `book/` voor de broncode van het 3D boek. Deze repo (`marnik-`) is openbaar en bevat een oud ander project, dus die gebruiken we alleen voor dit plan.

## Fasering

Elke fase eindigt met jouw akkoord.

| Fase | Wat | Resultaat |
|---|---|---|
| 0. Voorbereiding | Bestanden uploaden, beeldkeuze maken, Shopify winkel aanmaken, privé repo | Alles klaar om te beginnen |
| 1. Analyse | Oude site en bestanden doorlopen | `INHOUD.md` (alle inhoud met bron) en `ANALYSE-OUDE-SITE.md` (wat bewaren we, wat was er fout) |
| 2. Stijlrichting | Drie korte stijlvoorstellen voor boek en homepage: letter, kleur, materiaal | Jij kiest er één |
| 3. Prototype boek | Het 3D boek los, met placeholders: binnenkomst, openen, inhoudsopgave, bladeren, mobiel | Een link die je op je eigen telefoon test. Pas verder als het goed voelt. |
| 4. Shopify thema | Shop, productpagina's, winkelwagen, informatie- en juridische pagina's | Werkende winkel met testproducten |
| 5. Samenvoegen | Boek in het thema, verhalen uit metaobjecten, knoppen naar producten | Complete site op een testomgeving |
| 6. Test en livegang | Vaste testlijst: iPhone, goedkope Android, desktop, snelheid, een testbestelling, alle teksten nagelopen, domein gekoppeld | Live |

Fase 3 komt bewust vroeg. Het boek is het spannendste en risicovolste deel. Voelt het niet goed, dan weten we dat voordat er een hele shop omheen staat.

## Wat ik van jou nodig heb

1. **Bestanden uploaden.** De oude site (code of screenshots van elke pagina), alle verhalen, productinformatie (namen, prijzen, foto's) en, als die er zijn, logo en huisstijl en een tekst over jullie. Waar je ze neerzet staat in `bestanden/README.md`.
2. **Beeldkeuze.** A, B of C hierboven. En: bestaan de knuffels al, echt of als ontwerp?
3. **Shopify.** Een winkel aanmaken (proefperiode is genoeg) en de Shopify-koppeling in claude.ai opnieuw verbinden. Die vraagt nu om opnieuw inloggen, en zonder die koppeling kan ik niet in je winkel.
4. **Privé repository.** Mag ik een privé repo `briesje` aanmaken, of doe je dat liever zelf?
5. **Domeinnaam.** Hebben jullie er al een?
6. **Bedrijfsgegevens.** KvK, btw-nummer en retouradres, voor de verplichte pagina's.

## Risico's

* **Beeld.** Zonder goede tekeningen of foto's gaat de site alsnog "AI" ogen, hoe goed het boek ook beweegt. Dit is het grootste risico.
* **Oudere telefoons.** 3D kan daar haperen. Oplossing: stilstaand beeld eerst, een lichtere versie op zwakke toestellen, en testen op een goedkope Android.
* **Lezen op de telefoon.** Tekst in 3D is op een klein scherm minder scherp dan gewone tekst. Daarom één pagina tegelijk, de tekst groot genoeg gezet, en de leesmodus als uitweg.
* **Knuffels voor kinderen.** Speelgoed dat je in de EU verkoopt moet een CE-markering hebben en getest zijn volgens de speelgoednormen (EN 71). Vraag de leverancier om de testrapporten voordat je gaat verkopen.
* **Scope.** Een 3D boek en een webshop zijn eigenlijk twee projecten. Daarom de fasering, en niet alles tegelijk.
* **Openbare repo.** Zet geen wachtwoorden, API-sleutels of `.env`-bestanden uit de oude site in deze repo.

## Open vragen

* Beeldkeuze A, B of C, en bestaan de knuffels al?
* Welke accessoires precies?
* Is het boek al gedrukt, of wordt dat nog gemaakt? Dat bepaalt of de kaft op de site een echt ontwerp moet volgen.
* Voor welke leeftijd zijn de verhalen?
* Wie zitten er achter Briesje, en wat mag daarover op de site?
