// Maakt van dist/index.html een pagina zonder eigen html-, head- en body-tags,
// zoals de deelbare testpagina die verwacht.
import fs from 'fs';
let h = fs.readFileSync('dist/index.html', 'utf8');
const head = h.slice(h.indexOf('<head>') + 6, h.indexOf('</head>'));
const body = h.slice(h.indexOf('<body>') + 6, h.indexOf('</body>'));
const keep = head
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !/charset|name="viewport"/.test(l));
// De testpagina houdt haar eigen korte naam.
const ti = keep.findIndex((l) => l.startsWith('<title>'));
if (ti >= 0) keep[ti] = '<title>Briesie 3D boek</title>';
fs.writeFileSync('dist/artifact.html', keep.join('\n') + '\n' + body.trim() + '\n');
const files = {};
for (const f of fs.readdirSync('dist/assets')) files[`assets/${f}`] = `dist/assets/${f}`;
for (const f of ['poster-wide.webp', 'poster-tall.webp']) if (fs.existsSync(`dist/${f}`)) files[f] = `dist/${f}`;
// De andere pagina's gaan mee als losse bestanden.
for (const f of fs.readdirSync('dist').filter((f) => f.endsWith('.html') && !['index.html', 'artifact.html'].includes(f))) {
  fs.writeFileSync(`dist/${f}`, fs.readFileSync(`dist/${f}`, 'utf8').replace(/ crossorigin/g, ''));
  files[f] = `dist/${f}`;
}
if (fs.existsSync('dist/echt')) for (const f of fs.readdirSync('dist/echt')) files[`echt/${f}`] = `dist/echt/${f}`;
fs.writeFileSync('dist/artifact-files.json', JSON.stringify(files, null, 1));
console.log(keep.length, 'regels in de kop,', Object.keys(files).length, 'bestanden');
