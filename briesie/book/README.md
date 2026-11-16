# Het 3D boek (prototype)

Los prototype van het boek uit `../STORYBOARD.md`. De kaft, de figuurtjes, het stofje en de gegevens van het boek zijn echt. De tekst in het boek en de producten in de winkel zijn nog placeholder. Zie `../INHOUD.md`.

## Draaien

```
npm install
npm run assets     # zet de echte beelden uit ../bestanden-lokaal/ om naar public/echt/
npm run dev        # ontwikkelen, op http://localhost:5173
npm run build      # bouwt naar dist/
npm run preview    # toont dist/ op http://localhost:4173
npm run poster     # maakt het stilstaande beeld opnieuw (preview moet draaien)
npm run verify     # loopt de hele route en toetst het budget (preview moet draaien)
```

## Wat waar staat

| Bestand | Wat |
|---|---|
| `src/content.js` | De gegevens van het boek (echt) en de tekst van de verhalen (placeholder) |
| `src/pages.js` | Zet de kaftfoto op de kaft en tekent de placeholder-bladzijden. Vervalt grotendeels zodra de bladzijden uit het drukbestand komen. |
| `scripts/assets.mjs` | Maakt lichte webversies van de echte beelden |
| `src/book3d.js` | Het boek: kaft met twee scharnieren, buigende bladzijden, camera en bewegingen |
| `src/main.js` | Besturing: tikken, slepen, toetsenbord, adresbalk, leesmodus |
| `scripts/verify.mjs` | De automatische controle |

## Besturing

* Tik op het boek, of Enter op de knop: openen
* Tik op een figuurtje: het springt op
* Tik op een verhaal in de inhoudsopgave: erheen bladeren
* Slepen, swipen, de pijlen op het scherm of de pijltjestoetsen: bladeren
* Escape of "Boek dicht": sluiten
* "Leesmodus": de verhalen als gewone tekst

## Bekende beperkingen

* Getest in een cloudbrowser zonder grafische kaart. Vloeiendheid op een echte telefoon is nog niet gemeten.
* Het stilstaande beeld is gemaakt op twee schermformaten. Op andere formaten sluit het niet exact aan op het 3D beeld. De overvloeier vangt dat op.
* Meekantelen met de telefoon zit er nog niet in.
* Het boek heeft nu 7 vellen. Bij een dikker boek moeten de vellen buiten beeld samengevoegd worden tot een blok.

## Deelbare testpagina

```
ARTIFACT=1 npm run build && node scripts/artifact.mjs
```

Dit maakt `dist/artifact.html` met het lettertype in de CSS. Adressen zijn in het prototype `#inhoud` en `#verhaal-1`. In de echte site worden dat gewone adressen per verhaal.

## De echte beelden

De beelden van Helma staan in `../bestanden-lokaal/` en de webversies in `public/echt/`. Beide mappen staan niet in git. Na een verse kloon ontbreken ze, en dan toont het boek placeholders. De originelen staan in de uploads bij Higgsfield.
