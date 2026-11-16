// Alle tekst hier is ECHT, tenzij er "placeholder" bij staat. De gegevens van
// het boek komen uit de bibliotheekcatalogus en van de kaft. De teksten van
// Helma komen letterlijk uit haar aantekeningen. Zie ../../INHOUD.md.

export const book = {
  brand: 'Briesie',
  brandLine: 'Van naaldfiguurtjes tot mijn eigen kinderboek',
  title: 'Eikeltje Siem',
  subtitle: 'en het betoverende stofje',
  fullTitle: 'Eikeltje Siem en het betoverende stofje',
  tagline: 'Zo klein, maar toch zo groot',
  author: 'Helma Buijs',
  ages: '6 tot 9 jaar',
  pages: 91,
  isbn: '9789464915594',
  publisher: 'Boekengilde',
  year: 2024,
  // Verhouding van één bladzijde (breedte : hoogte), afgeleid van de kaft.
  pageRatio: 1.42,
  buyUrl: '#winkel',
};

// De beelden staan in public/echt/ en niet in git. Ontbreken ze, dan tekent
// de site een placeholder.
export const images = {
  cover: './echt/kaft.webp',
  green: './echt/figuur-groen.webp',
  siem: './echt/siem.webp',
  dust: './echt/stofje.webp',
};
export const alts = {
  cover: 'De kaft van Eikeltje Siem en het betoverende stofje',
  green: 'Het mannetje uit het boek',
  siem: 'Eikeltje Siem',
  dust: 'Het betoverende stofje',
};

// Elk verhaal is één spread: een linker- en een rechterbladzijde.
// Soorten blokken: p (alinea), tag (regel in handschrift-stijl), big (grote
// regel), img (beeld), note (opmerking over wat nog ontbreekt).
export const stories = [
  {
    slug: 'waar-het-begon',
    title: 'Waar het begon',
    pages: [
      [
        { t: 'p', text: 'Soms begint iets kleins waar je zo enthousiast van wordt.' },
        { t: 'p', text: 'De naam Briesie is ontstaan door iets tot stand te laten komen. Briesie is Zuid-Afrikaans, daar heb ik in mijn kinderjaren gewoond en het betekent een klein briesje.' },
      ],
      [
        { t: 'img', img: 'dust', h: 300 },
        { t: 'p', text: 'Dit is het betoverende stofje uit het kinderboek wat met een zacht briesje een wereld tot leven komt.' },
        { t: 'p', text: 'Mijn naam is Helma Buijs. Ik ben het gezicht achter Briesie. Een plek waar creativiteit, kleur en klein handgemaakte details samenkomen.' },
      ],
    ],
  },
  {
    slug: 'de-wereld-van-briesie',
    title: 'De wereld van Briesie',
    pages: [
      [
        { t: 'p', text: 'Wat begon met liefde voor verhalen en illustraties, groeide uit tot iets tastbaars.' },
        { t: 'p', text: 'Ik ontdekte naaldvilten, zachte wol die langzaam verandert in kleine figuurtjes.' },
        { t: 'tag', text: 'Van naaldfiguurtjes tot mijn eigen kinderboek.' },
      ],
      [
        { t: 'img', img: 'green', h: 380 },
        // PLACEHOLDER: deze alinea stond op de oude site en is nog niet aangeleverd.
        { t: 'note', text: 'Hier komt de alinea van Helma die begint met "Want" en eindigt op "detail".' },
        { t: 'big', text: 'Welkom in mijn wereld', heart: true },
      ],
    ],
  },
  {
    slug: 'eikeltje-siem',
    title: 'Eikeltje Siem',
    pages: [
      [
        { t: 'tag', text: 'Zo klein, maar toch zo groot' },
        { t: 'p', text: 'Eikeltje Siem en het betoverende stofje is het kinderboek van Helma Buijs.' },
        { t: 'p', text: 'Voor kinderen van 6 tot 9 jaar. Gebonden, 91 bladzijden.' },
        { t: 'img', img: 'siem', h: 330 },
      ],
      [
        { t: 'img', img: 'cover', h: 640 },
        { t: 'big', text: 'Laat je meenemen...' },
        { t: 'p', text: 'Het hele verhaal staat in het boek.', center: true },
      ],
    ],
  },
];

export const SHEETS = stories.length; // de laatste rechterbladzijde ligt op het boekblok

// Spread s = aantal omgeslagen vellen. Spread 0 is de inhoudsopgave.
export const storyStartSpread = (i) => i + 1;
export const storyOfSpread = (s) => (s >= 1 && s <= stories.length ? s - 1 : -1);
