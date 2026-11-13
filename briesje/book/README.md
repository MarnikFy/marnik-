# Het 3D boek (prototype)

Los prototype van het boek uit `../STORYBOARD.md`. Alle inhoud is placeholder: de kaft, de bladzijden, de knuffels en de winkel. De echte inhoud komt uit `../bestanden/`.

## Draaien

```
npm install
npm run dev        # ontwikkelen, op http://localhost:5173
npm run build      # bouwt naar dist/
npm run preview    # toont dist/ op http://localhost:4173
npm run poster     # maakt het stilstaande beeld opnieuw (preview moet draaien)
npm run verify     # loopt de hele route en toetst het budget (preview moet draaien)
```

## Wat waar staat

| Bestand | Wat |
|---|---|
| `src/content.js` | De placeholder-inhoud: titels, teksten, aantal vellen |
| `src/pages.js` | Tekent de placeholder-bladzijden. Vervalt grotendeels zodra de bladzijden uit het drukbestand komen. |
| `src/book3d.js` | Het boek: kaft met twee scharnieren, buigende bladzijden, camera en bewegingen |
| `src/main.js` | Besturing: tikken, slepen, toetsenbord, adresbalk, leesmodus |
| `scripts/verify.mjs` | De automatische controle |

## Besturing

* Tik op het boek, of Enter op de knop: openen
* Tik op een verhaal in de inhoudsopgave: erheen bladeren
* Slepen, swipen, de pijlen op het scherm of de pijltjestoetsen: bladeren
* Escape of "Boek dicht": sluiten
* "Leesmodus": de verhalen als gewone tekst

## Bekende beperkingen

* Getest in een cloudbrowser zonder grafische kaart. Vloeiendheid op een echte telefoon is nog niet gemeten.
* Het stilstaande beeld is gemaakt op twee schermformaten. Op andere formaten sluit het niet exact aan op het 3D beeld. De overvloeier vangt dat op.
* Meekantelen met de telefoon zit er nog niet in.
* Het boek heeft nu 7 vellen. Bij een dikker boek moeten de vellen buiten beeld samengevoegd worden tot een blok.
