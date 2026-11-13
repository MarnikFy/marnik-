// PLACEHOLDER-inhoud. Alles hier wordt vervangen door de echte inhoud uit
// bestanden/ (drukbestand, verhaalteksten, productgegevens). Niets hiervan
// is echte tekst van Briesje.

export const book = {
  title: 'Briesje',
  // Verhouding van één bladzijde (breedte : hoogte). Volgt later het echte boek.
  pageRatio: 1.36,
  buyUrl: '#winkel',
  intro: [
    'Hier komen twee zinnen over wat Briesje is en voor wie het boek bedoeld is.',
    'Deze tekst is een placeholder en komt uit jouw bestanden.',
  ],
};

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
  plush: `Knuffel ${n}`,
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
