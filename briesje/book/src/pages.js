// Tekent de PLACEHOLDER-bladzijden op een canvas. In de echte site komen de
// bladzijden als afbeelding uit het drukbestand en vervalt dit bestand grotendeels.
import { book, stories, locked, SHEETS } from './content.js';

export const TEX_W = 1024;
export const TEX_H = Math.round(TEX_W * book.pageRatio);
const FONT = '"Fraunces Variable", "Iowan Old Style", Georgia, serif';

export const colors = {
  paper: '#fbf6ea',
  ink: '#2b2622',
  soft: '#857a6c',
  line: '#d9cdb8',
  cover: '#2f5d62',
  coverInk: '#f6ecd8',
  endpaper: '#e9dcc3',
  accent: '#b4532a',
};

function canvas(w = TEX_W, h = TEX_H) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

// Lichte korrel, zodat papier en linnen niet als een vlak kleurvlak ogen.
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

function paperBase(seed, side) {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = colors.paper;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  grain(ctx, TEX_W, TEX_H, 0.035, seed);
  // Schaduw in de rugvouw: links op een rechterbladzijde, rechts op een linker.
  const g = ctx.createLinearGradient(side === 'right' ? 0 : TEX_W, 0, side === 'right' ? 90 : TEX_W - 90, 0);
  g.addColorStop(0, 'rgba(60,40,20,0.16)');
  g.addColorStop(1, 'rgba(60,40,20,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  return { c, ctx };
}

function placeholderTag(ctx, label = 'placeholder') {
  ctx.save();
  ctx.font = `500 20px ${FONT}`;
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
  ctx.font = `500 26px ${FONT}`;
  ctx.fillStyle = colors.soft;
  ctx.textAlign = 'center';
  ctx.fillText('tekening (placeholder)', x + w / 2, y + h / 2 + 8);
  ctx.restore();
}

// ---- Kaft ---------------------------------------------------------------

export function drawCoverFront() {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = colors.cover;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  grain(ctx, TEX_W, TEX_H, 0.07, 7);
  ctx.strokeStyle = 'rgba(246,236,216,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(56, 56, TEX_W - 112, TEX_H - 112);
  ctx.fillStyle = colors.coverInk;
  ctx.textAlign = 'center';
  ctx.font = `600 150px ${FONT}`;
  ctx.fillText(book.title, TEX_W / 2, TEX_H * 0.36);
  ctx.font = `400 34px ${FONT}`;
  ctx.fillStyle = 'rgba(246,236,216,0.8)';
  ctx.fillText('verhaaltjes', TEX_W / 2, TEX_H * 0.36 + 70);
  ctx.setLineDash([14, 12]);
  ctx.strokeStyle = 'rgba(246,236,216,0.45)';
  ctx.beginPath();
  ctx.roundRect(TEX_W / 2 - 230, TEX_H * 0.5, 460, 420, 30);
  ctx.stroke();
  ctx.font = `500 26px ${FONT}`;
  ctx.fillStyle = 'rgba(246,236,216,0.7)';
  ctx.fillText('kaft van het echte boek', TEX_W / 2, TEX_H * 0.5 + 200);
  ctx.fillText('(placeholder)', TEX_W / 2, TEX_H * 0.5 + 240);
  return c;
}

export function drawCoverBack() {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = colors.cover;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  grain(ctx, TEX_W, TEX_H, 0.07, 11);
  return c;
}

export function drawSpine(w, h) {
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  ctx.fillStyle = colors.cover;
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 0.07, 13);
  return c;
}

// Binnenkant voorkaft: linkerbladzijde van de inhoudsopgave.
export function drawInsideFront() {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = colors.endpaper;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  grain(ctx, TEX_W, TEX_H, 0.04, 17);
  ctx.fillStyle = colors.ink;
  ctx.font = `600 64px ${FONT}`;
  ctx.fillText('Over ' + book.title, 110, 330);
  ctx.font = `400 36px ${FONT}`;
  let y = 420;
  for (const p of book.intro) y = paragraph(ctx, p, 110, y, TEX_W - 240, 56) + 28;
  placeholderTag(ctx);
  return c;
}

export function drawInsideBack() {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = colors.endpaper;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  grain(ctx, TEX_W, TEX_H, 0.04, 19);
  return c;
}

// ---- Inhoudsopgave ------------------------------------------------------

// Raakvlakken van de regels, in uv-coördinaten (0..1, oorsprong linksboven).
export const tocItems = [];

export function drawToc() {
  const { c, ctx } = paperBase(3, 'right');
  ctx.fillStyle = colors.ink;
  ctx.font = `600 78px ${FONT}`;
  ctx.fillText('Inhoud', 120, 230);
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 2;
  tocItems.length = 0;
  const all = [
    ...stories.map((s, i) => ({ title: s.title, open: true, index: i })),
    ...locked.map((l) => ({ title: l.title, open: false, index: -1 })),
  ];
  const rowH = 132;
  let y = 330;
  all.forEach((it, n) => {
    ctx.beginPath();
    ctx.moveTo(120, y);
    ctx.lineTo(TEX_W - 100, y);
    ctx.stroke();
    ctx.fillStyle = it.open ? colors.ink : colors.soft;
    ctx.font = `${it.open ? 600 : 400} 46px ${FONT}`;
    ctx.fillText(it.title, 120, y + 72);
    ctx.font = `400 28px ${FONT}`;
    ctx.fillStyle = it.open ? colors.accent : colors.soft;
    ctx.fillText(it.open ? 'lees dit verhaal' : 'staat in het boek', 120, y + 110);
    ctx.textAlign = 'right';
    ctx.font = `400 34px ${FONT}`;
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
  placeholderTag(ctx);
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
    ctx.fillStyle = colors.ink;
    ctx.font = `600 72px ${FONT}`;
    ctx.fillText(s.title, mx, y + 40);
    y += 110;
  }
  if (p.art) {
    artBox(ctx, mx, y, w, 380);
    y += 440;
  }
  ctx.fillStyle = colors.ink;
  ctx.font = `400 46px ${FONT}`;
  y += 44;
  for (const t of p.art ? p.text.slice(0, 2) : p.text) y = paragraph(ctx, t, mx, y, w, 70) + 30;
  ctx.font = `400 26px ${FONT}`;
  ctx.fillStyle = colors.soft;
  ctx.textAlign = side === 'right' ? 'right' : 'left';
  ctx.fillText(String(2 + si * 4 + pi), side === 'right' ? TEX_W - 100 : 100, TEX_H - 70);
  return c;
}

function drawEnd() {
  const { c, ctx } = paperBase(90, 'left');
  ctx.fillStyle = colors.ink;
  ctx.textAlign = 'center';
  ctx.font = `600 64px ${FONT}`;
  ctx.fillText('Verder lezen?', TEX_W / 2, TEX_H * 0.36);
  ctx.font = `400 38px ${FONT}`;
  const lines = wrap(ctx, `In het boek staan nog ${locked.length} verhalen.`, TEX_W - 300);
  lines.forEach((l, i) => ctx.fillText(l, TEX_W / 2, TEX_H * 0.36 + 90 + i * 58));
  placeholderTag(ctx);
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

export function drawPlush(label, tint) {
  const c = canvas(384, 512);
  const ctx = c.getContext('2d');
  ctx.fillStyle = tint;
  ctx.beginPath();
  ctx.ellipse(192, 300, 150, 190, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(192, 130, 105, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(105, 55, 42, 0, Math.PI * 2);
  ctx.arc(279, 55, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(43,38,34,0.75)';
  ctx.textAlign = 'center';
  ctx.font = `600 34px ${FONT}`;
  ctx.fillText(label, 192, 300);
  ctx.font = `400 24px ${FONT}`;
  ctx.fillText('foto van de knuffel', 192, 340);
  ctx.fillText('(placeholder)', 192, 372);
  return c;
}
