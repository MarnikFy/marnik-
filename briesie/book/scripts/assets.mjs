// Maakt van de echte beelden in ../bestanden-lokaal/ lichte webversies in
// public/echt/. Beide mappen staan niet in git: de beelden zijn van Helma Buijs
// en deze repo is openbaar. Zonder deze beelden valt de site terug op placeholders.
import fs from 'fs';
import sharp from 'sharp';

const src = '../bestanden-lokaal';
const out = 'public/echt';
fs.mkdirSync(out, { recursive: true });
const has = (f) => fs.existsSync(`${src}/${f}`);
const report = async (name, p) => {
  const info = await p.toFile(`${out}/${name}`);
  console.log(name, `${info.width}x${info.height}`, Math.round(info.size / 1024) + ' KB');
};

if (has('kaft-foto.jpg')) {
  // De foto is wat donker en koel. Wit papier wordt weer wit, de rest schuift mee.
  // Uitsnede: net binnen de rand van het boek.
  const m = await sharp(`${src}/kaft-foto.jpg`).metadata();
  const box = { left: 12, top: 8, width: m.width - 26, height: m.height - 16 };
  await report(
    'kaft.webp',
    sharp(`${src}/kaft-foto.jpg`).extract(box).linear([1.24, 1.21, 1.17], [0, 0, 0]).resize({ width: 1024 }).webp({ quality: 82 }),
  );
}
for (const [file, name, size] of [
  ['figuur-groen.png', 'figuur-groen.webp', 560],
  ['siem.png', 'siem.webp', 560],
]) {
  if (!has(file)) continue;
  await report(name, sharp(`${src}/${file}`).trim().resize({ width: size, height: size, fit: 'inside' }).webp({ quality: 84, alphaQuality: 90 }));
}

// Het stofje heeft een donkergrijze waas om de glinstering. Op een lichte
// pagina oogt die als rook. De waas gaat eruit, de gouden glinstering blijft.
if (has('stofje.png')) {
  const { data, info } = await sharp(`${src}/stofje.png`).trim().resize({ width: 320, height: 320, fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.max(data[i], data[i + 1], data[i + 2]) / 255;
    const keep = Math.min(1, Math.max(0, (lum - 0.62) / 0.3));
    data[i + 3] = Math.round(data[i + 3] * keep);
  }
  await report('stofje.webp', sharp(data, { raw: info }).webp({ quality: 72, alphaQuality: 80 }));
}

// Productfoto's van de wensbuisjes, uit de oude site.
for (const n of [1, 2, 3, 4]) {
  if (!has(`wensbuisje-${n}.webp`)) continue;
  await report(`wensbuisje-${n}.webp`, sharp(`${src}/wensbuisje-${n}.webp`).resize({ width: 420 }).webp({ quality: 78 }));
}
