// Tekent de bladzijden op een canvas. De kaft is de echte foto. De binnenkant
// is nog PLACEHOLDER: in de echte site komen de bladzijden uit het drukbestand.
import { book, stories, locked, SHEETS } from './content.js';

export const TEX_W = 1024;
export const TEX_H = Math.round(TEX_W * book.pageRatio);
const FONT = '"Nunito Variable", "Nunito", system-ui, sans-serif';

// Kleuren uit de kaft van het boek.
export const colors = {
  paper: '#fdfcf7',
  ink: '#17362b',
  soft: '#5f7468',
  line: '#cfdcc2',
  spine: '#0b6b46',
  coverPaper: '#f6f5ee',
  endpaper: '#eef3e4',
  pink: '#c2327a',
  leaf: '#5d8f2c',
};

function canvas(w = TEX_W, h = TEX_H) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

// Lichte korrel, zodat papier niet als een vlak kleurvlak oogt.
function grain(ctx, w, h, amount, seed = 1) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  ctx.save();
  for (let i = 0; i < (w * h) / 90; i++) {
    const v = rnd() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${rnd() * amount})`;
    ctx.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
  }
  ctx.restore();
}

function wrap(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

function paragraph(ctx, text, x, y, maxW, lh) {
  for (const l of wrap(ctx, text, maxW)) {
    ctx.fillText(l, x, y);
    y += lh;
  }
  return y;
}

function paperBase(seed, side, fill = colors.paper) {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  grain(ctx, TEX_W, TEX_H, 0.03, seed);
  // Schaduw in de rugvouw: links op een rechterbladzijde, rechts op een linker.
  const g = ctx.createLinearGradient(side === 'right' ? 0 : TEX_W, 0, side === 'right' ? 90 : TEX_W - 90, 0);
  g.addColorStop(0, 'rgba(30,50,30,0.15)');
  g.addColorStop(1, 'rgba(30,50,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  return { c, ctx };
}

function placeholderTag(ctx, label = 'placeholder') {
  ctx.save();
  ctx.font = `600 20px ${FONT}`;
  ctx.fillStyle = colors.soft;
  ctx.textAlign = 'center';
  ctx.fillText(label, TEX_W / 2, TEX_H - 44);
  ctx.restore();
}

function artBox(ctx, x, y, w, h) {
  ctx.save();
  ctx.setLineDash([14, 12]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = colors.line;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 28);
  ctx.stroke();
  ctx.font = `600 26px ${FONT}`;
  ctx.fillStyle = colors.soft;
  ctx.textAlign = 'center';
  ctx.fillText('tekening uit het boek (placeholder)', x + w / 2, y + h / 2 + 8);
  ctx.restore();
}

// ---- Kaft ---------------------------------------------------------------

// De echte kaftfoto als die er is, anders een getekende placeholder.
export function drawCoverFront(img) {
  const c = canvas();
  const ctx = c.getContext('2d');
  if (img) {
    ctx.drawImage(img, 0, 0, TEX_W, TEX_H);
    return c;
  }
  ctx.fillStyle = colors.coverPaper;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.fillStyle = colors.spine;
  ctx.fillRect(0, 0, TEX_W * 0.14, TEX_H);
  ctx.textAlign = 'center';
  ctx.fillStyle = colors.leaf;
  ctx.font = `600 40px ${FONT}`;
  ctx.fillText(book.author, TEX_W * 0.57, 150);
  ctx.fillStyle = colors.pink;
  ctx.font = `800 120px ${FONT}`;
  ctx.fillText(book.title, TEX_W * 0.57, 380);
  ctx.font = `600 50px ${FONT}`;
  ctx.fillText(book.subtitle, TEX_W * 0.57, 460);
  ctx.font = `600 26px ${FONT}`;
  ctx.fillStyle = colors.soft;
  ctx.fillText('kaft van het echte boek (placeholder)', TEX_W * 0.57, TEX_H * 0.7);
  return c;
}

export function drawCoverBack() {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = colors.coverPaper;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.fillStyle = colors.spine;
  ctx.fillRect(TEX_W * 0.86, 0, TEX_W * 0.14, TEX_H);
  grain(ctx, TEX_W, TEX_H, 0.03, 11);
  return c;
}

// Binnenkant voorkaft: linkerbladzijde van de inhoudsopgave.
export function drawInsideFront() {
  const { c, ctx } = paperBase(17, 'left', colors.endpaper);
  ctx.fillStyle = colors.pink;
  ctx.font = `800 60px ${FONT}`;
  ctx.fillText(book.title, 110, 300);
  ctx.font = `600 40px ${FONT}`;
  ctx.fillText(book.subtitle, 110, 356);
  ctx.fillStyle = colors.ink;
  ctx.font = `500 36px ${FONT}`;
  let y = 470;
  for (const p of [
    `Geschreven door ${book.author}.`,
    `Voor kinderen van ${book.ages}.`,
    `${book.pages} bladzijden.`,
  ]) y = paragraph(ctx, p, 110, y, TEX_W - 240, 54) + 10;
  ctx.fillStyle = colors.leaf;
  ctx.font = `italic 600 40px ${FONT}`;
  ctx.fillText(book.tagline, 110, y + 70);
  ctx.fillStyle = colors.soft;
  ctx.font = `500 28px ${FONT}`;
  paragraph(ctx, 'Hier komt een stukje van Helma zelf over het boek. Die tekst is nog niet aangeleverd.', 110, y + 190, TEX_W - 260, 42);
  return c;
}

export function drawInsideBack() {
  return paperBase(19, 'right', colors.endpaper).c;
}

// ---- Inhoudsopgave ------------------------------------------------------

// Raakvlakken van de regels, in uv-coördinaten (0..1, oorsprong linksboven).
export const tocItems = [];

export function drawToc() {
  const { c, ctx } = paperBase(3, 'right');
  ctx.fillStyle = colors.ink;
  ctx.font = `800 76px ${FONT}`;
  ctx.fillText('Inhoud', 120, 230);
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 2;
  tocItems.length = 0;
  const all = [
    ...stories.map((s, i) => ({ title: s.title, open: true, index: i })),
    ...locked.map((l) => ({ title: l.title, open: false, index: -1 })),
  ];
  const rowH = 134;
  let y = 330;
  all.forEach((it, n) => {
    ctx.beginPath();
    ctx.moveTo(120, y);
    ctx.lineTo(TEX_W - 100, y);
    ctx.stroke();
    ctx.fillStyle = it.open ? colors.ink : colors.soft;
    ctx.font = `${it.open ? 700 : 500} 46px ${FONT}`;
    ctx.fillText(it.title, 120, y + 72);
    ctx.font = `600 28px ${FONT}`;
    ctx.fillStyle = it.open ? colors.pink : colors.soft;
    ctx.fillText(it.open ? 'lees dit verhaal' : 'staat in het boek', 120, y + 110);
    ctx.textAlign = 'right';
    ctx.font = `500 34px ${FONT}`;
    ctx.fillStyle = colors.soft;
    ctx.fillText(it.open ? String(2 + it.index * 4) : '', TEX_W - 100, y + 72);
    ctx.textAlign = 'left';
    tocItems.push({ ...it, n, u0: 90 / TEX_W, u1: (TEX_W - 70) / TEX_W, v0: y / TEX_H, v1: (y + rowH) / TEX_H });
    y += rowH;
  });
  ctx.beginPath();
  ctx.moveTo(120, y);
  ctx.lineTo(TEX_W - 100, y);
  ctx.stroke();
  placeholderTag(ctx, 'de titels van de verhalen volgen nog');
  return c;
}

// ---- Verhaalbladzijden --------------------------------------------------

function drawStoryPage(si, pi, side) {
  const s = stories[si];
  const p = s.pages[pi];
  const { c, ctx } = paperBase(20 + si * 4 + pi, side);
  const mx = side === 'right' ? 130 : 100;
  const w = TEX_W - 230;
  let y = 170;
  if (pi === 0) {
    ctx.fillStyle = colors.pink;
    ctx.font = `800 72px ${FONT}`;
    ctx.fillText(s.title, mx, y + 40);
    y += 110;
  }
  if (p.art) {
    artBox(ctx, mx, y, w, 380);
    y += 440;
  }
  ctx.fillStyle = colors.ink;
  ctx.font = `600 46px ${FONT}`;
  y += 44;
  for (const t of p.art ? p.text.slice(0, 2) : p.text) y = paragraph(ctx, t, mx, y, w, 70) + 30;
  ctx.font = `500 26px ${FONT}`;
  ctx.fillStyle = colors.soft;
  ctx.textAlign = side === 'right' ? 'right' : 'left';
  ctx.fillText(String(2 + si * 4 + pi), side === 'right' ? TEX_W - 100 : 100, TEX_H - 70);
  return c;
}

function drawEnd() {
  const { c, ctx } = paperBase(90, 'left');
  ctx.fillStyle = colors.pink;
  ctx.textAlign = 'center';
  ctx.font = `800 64px ${FONT}`;
  ctx.fillText('Verder lezen?', TEX_W / 2, TEX_H * 0.36);
  ctx.fillStyle = colors.ink;
  ctx.font = `500 38px ${FONT}`;
  const lines = wrap(ctx, `Het hele verhaal van ${book.title} staat in het boek.`, TEX_W - 300);
  lines.forEach((l, i) => ctx.fillText(l, TEX_W / 2, TEX_H * 0.36 + 90 + i * 58));
  return c;
}

// Geeft het canvas voor een kant van een vel. Zie content.js voor de indeling.
export function drawSheetSide(k, side) {
  if (side === 'recto') {
    if (k === 0) return drawToc();
    const g = 2 * k - 1;
    return drawStoryPage(Math.floor(g / 4), g % 4, 'right');
  }
  if (k === SHEETS - 1) return drawEnd();
  const g = 2 * k;
  return drawStoryPage(Math.floor(g / 4), g % 4, 'left');
}

export function drawBlank(side) {
  return paperBase(1, side).c;
}

// Zachte schaduw onder een figuurtje.
export function drawBlob() {
  const c = canvas(128, 128);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, 'rgba(20,40,25,0.34)');
  g.addColorStop(1, 'rgba(20,40,25,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return c;
}

// Placeholder voor een figuurtje als het echte beeld ontbreekt.
export function drawFigure(label, tint) {
  const c = canvas(384, 384);
  const ctx = c.getContext('2d');
  ctx.fillStyle = tint;
  ctx.beginPath();
  ctx.ellipse(192, 200, 150, 160, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(23,54,43,0.8)';
  ctx.textAlign = 'center';
  ctx.font = `700 34px ${FONT}`;
  ctx.fillText(label, 192, 196);
  ctx.font = `500 24px ${FONT}`;
  ctx.fillText('(placeholder)', 192, 232);
  return c;
}
