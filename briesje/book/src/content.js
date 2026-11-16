// Wat hier echt is en wat placeholder, staat erbij. De echte gegevens komen
// uit de bibliotheekcatalogus en van de kaft, zie ../../INHOUD.md.

// ECHT: gegevens van het boek.
export const book = {
  brand: 'Briesje',
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

// ECHT: de beelden. Ze staan in public/echt/ en niet in git. Ontbreken ze,
// dan tekent de site een placeholder.
export const images = {
  cover: './echt/kaft.webp',
  green: './echt/figuur-groen.webp',
  siem: './echt/siem.webp',
  dust: './echt/stofje.webp',
};

// PLACEHOLDER: de tekst in het boek. De echte verhalen zijn nog niet aangeleverd.
const para = (n, page) => [
  `Hier komt de tekst van bladzijde ${page} van verhaal ${n}. Deze tekst is een placeholder en wordt vervangen door de echte tekst uit het boek.`,
  'Deze alinea laat zien hoe een bladzijde met tekst eruitziet: de lettergrootte, de regelafstand en de marges rond de tekst.',
  'Zo kun je beoordelen of het prettig voorleest, ook op een telefoon.',
];

// Verhalen die op de site te lezen zijn. Elk verhaal beslaat hier vier
// bladzijden (twee spreads). Het echte aantal volgt uit het boek.
export const stories = [1, 2, 3].map((n) => ({
  slug: `verhaal-${n}`,
  title: `Verhaal ${n}`,
  pages: [1, 2, 3, 4].map((p) => ({ art: p % 2 === 1, text: para(n, p) })),
}));

// Titels die wel in het boek staan maar niet op de site.
export const locked = [4, 5, 6].map((n) => ({ title: `Verhaal ${n}` }));

export const PAGES_PER_STORY = 4;
export const SHEETS = 1 + (stories.length * PAGES_PER_STORY) / 2; // 7 vellen

// Spread s = aantal omgeslagen vellen. Spread 0 is de inhoudsopgave.
export const storyStartSpread = (i) => 1 + i * (PAGES_PER_STORY / 2);
export const storyOfSpread = (s) => {
  if (s < 1 || s > stories.length * 2) return -1;
  return Math.floor((s - 1) / 2);
};
