// Tekent de bladzijden op een canvas. De kaft is de echte foto, de teksten
// komen uit content.js.
import { book, stories } from './content.js';

export const TEX_W = 1024;
export const TEX_H = Math.round(TEX_W * book.pageRatio);
const FONT = '"Nunito Variable", "Nunito", system-ui, sans-serif';

// Kleuren uit de kaft van het boek.
export const colors = {
  paper: '#fffef9',
  ink: '#17362b',
  soft: '#5f7468',
  line: '#d7e6c8',
  spine: '#0b7a4b',
  coverPaper: '#f8f8f2',
  endpaper: '#fff6cf',
  pink: '#d12c82',
  leaf: '#4f9a1f',
  // De spatjes op de kaft
  dots: ['#d12c82', '#2f9be0', '#4f9a1f', '#8a5cc7', '#f2c230', '#e8443a'],
};

let imgs = {};
export const setImages = (map) => (imgs = map || {});

function canvas(w = TEX_W, h = TEX_H) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

const rng = (seed) => {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
};

// Lichte korrel, zodat papier niet als een vlak kleurvlak oogt.
function grain(ctx, w, h, amount, seed = 1) {
  const rnd = rng(seed);
  ctx.save();
  for (let i = 0; i < (w * h) / 110; i++) {
    const v = rnd() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${rnd() * amount})`;
    ctx.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
  }
  ctx.restore();
}

// Gekleurde spatjes, zoals op de kaft. Dichter bij het midden van de wolk.
function confetti(ctx, cx, cy, spread, count, seed) {
  const rnd = rng(seed);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.pow(rnd(), 0.7) * spread;
    ctx.globalAlpha = 0.55 + rnd() * 0.4;
    ctx.fillStyle = colors.dots[Math.floor(rnd() * colors.dots.length)];
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 3 + rnd() * 7, 0, Math.PI * 2);
    ctx.fill();
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

function paperBase(seed, side, fill = colors.paper) {
  const c = canvas();
  const ctx = c.getContext('2d');
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  grain(ctx, TEX_W, TEX_H, 0.025, seed);
  // Schaduw in de rugvouw: links op een rechterbladzijde, rechts op een linker.
  const g = ctx.createLinearGradient(side === 'right' ? 0 : TEX_W, 0, side === 'right' ? 90 : TEX_W - 90, 0);
  g.addColorStop(0, 'rgba(40,40,20,0.14)');
  g.addColorStop(1, 'rgba(40,40,20,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  return { c, ctx };
}

function heart(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.bezierCurveTo(-22, -8, -12, -26, 0, -12);
  ctx.bezierCurveTo(12, -26, 22, -8, 0, 10);
  ctx.fillStyle = colors.dots[5];
  ctx.fill();
  ctx.restore();
}

// ---- Blokken op een bladzijde -------------------------------------------

const BODY = 50;
const LEAD = 76;

// Tekent of meet één blok. Geeft de nieuwe y terug.
function block(ctx, b, x, y, w, paint) {
  if (b.t === 'p') {
    ctx.font = `700 ${BODY}px ${FONT}`;
    ctx.fillStyle = colors.ink;
    ctx.textAlign = b.center ? 'center' : 'left';
    for (const l of wrap(ctx, b.text, w)) {
      if (paint) ctx.fillText(l, b.center ? x + w / 2 : x, y + BODY);
      y += LEAD;
    }
    ctx.textAlign = 'left';
    return y + 26;
  }
  if (b.t === 'tag') {
    ctx.font = `italic 800 ${BODY + 4}px ${FONT}`;
    ctx.fillStyle = colors.leaf;
    for (const l of wrap(ctx, b.text, w)) {
      if (paint) ctx.fillText(l, x, y + BODY);
      y += LEAD;
    }
    return y + 30;
  }
  if (b.t === 'big') {
    ctx.font = `900 68px ${FONT}`;
    ctx.fillStyle = colors.pink;
    ctx.textAlign = 'center';
    const lines = wrap(ctx, b.text, w);
    lines.forEach((l, i) => {
      if (!paint) return;
      const last = i === lines.length - 1;
      const tw = ctx.measureText(l).width;
      const cx = x + w / 2 - (b.heart && last ? 34 : 0);
      ctx.fillText(l, cx, y + 64 + i * 84);
      if (b.heart && last) heart(ctx, cx + tw / 2 + 44, y + 46 + i * 84, 1.5);
    });
    ctx.textAlign = 'left';
    return y + lines.length * 84 + 36;
  }
  if (b.t === 'note') {
    ctx.font = `italic 500 30px ${FONT}`;
    ctx.fillStyle = colors.soft;
    for (const l of wrap(ctx, b.text, w)) {
      if (paint) ctx.fillText(l, x, y + 30);
      y += 44;
    }
    return y + 30;
  }
  if (b.t === 'img') {
    const im = imgs[b.img];
    const h = b.h;
    if (paint) {
      if (im) {
        const iw = Math.min(w, h * (im.naturalWidth / im.naturalHeight));
        const ih = iw * (im.naturalHeight / im.naturalWidth);
        if (b.img === 'cover') {
          ctx.save();
          ctx.shadowColor = 'rgba(20,40,25,0.28)';
          ctx.shadowBlur = 26;
          ctx.shadowOffsetY = 10;
          ctx.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
          ctx.restore();
        } else ctx.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
      } else {
        ctx.save();
        ctx.setLineDash([14, 12]);
        ctx.lineWidth = 3;
        ctx.strokeStyle = colors.line;
        ctx.beginPath();
        ctx.roundRect(x + w * 0.15, y, w * 0.7, h, 28);
        ctx.stroke();
        ctx.restore();
      }
    }
    return y + h + 40;
  }
  return y;
}

function drawStoryPage(si, pi, side) {
  const s = stories[si];
  const blocks = s.pages[pi];
  const { c, ctx } = paperBase(20 + si * 2 + pi, side);
  const mx = side === 'right' ? 130 : 104;
  const w = TEX_W - 234;
  confetti(ctx, side === 'right' ? TEX_W - 150 : 150, pi === 0 ? TEX_H - 170 : 150, 150, 26, 5 + si * 2 + pi);

  // Titel op de eerste bladzijde, passend gemaakt op de breedte.
  let titleH = 0;
  let size = 82;
  if (pi === 0) {
    do {
      ctx.font = `900 ${size}px ${FONT}`;
      size -= 2;
    } while (ctx.measureText(s.title).width > w && size > 40);
    titleH = size + 70;
  }
  // Eerst meten, zodat de inhoud prettig op de bladzijde staat.
  let total = titleH;
  for (const b of blocks) total = block(ctx, b, mx, total, w, false);
  let y = Math.max(150, Math.min(250, (TEX_H - total) / 2 - 30));
  if (pi === 0) {
    ctx.font = `900 ${size + 2}px ${FONT}`;
    ctx.fillStyle = colors.pink;
    ctx.fillText(s.title, mx, y + size);
    y += titleH;
  }
  for (const b of blocks) y = block(ctx, b, mx, y, w, true);

  ctx.font = `600 26px ${FONT}`;
  ctx.fillStyle = colors.soft;
  ctx.textAlign = side === 'right' ? 'right' : 'left';
  ctx.fillText(String(2 + si * 2 + pi), side === 'right' ? TEX_W - 100 : 100, TEX_H - 70);
  return c;
}

// ---- Kaft ---------------------------------------------------------------

// De echte kaftfoto als die er is, anders een getekende placeholder.
export function drawCoverFront() {
  const c = canvas();
  const ctx = c.getContext('2d');
  if (imgs.cover) {
    ctx.drawImage(imgs.cover, 0, 0, TEX_W, TEX_H);
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
  ctx.font = `900 120px ${FONT}`;
  ctx.fillText(book.title, TEX_W * 0.57, 380);
  ctx.font = `700 50px ${FONT}`;
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

// Binnenkant voorkaft: de linkerbladzijde naast de inhoudsopgave.
export function drawInsideFront() {
  const { c, ctx } = paperBase(17, 'left', colors.endpaper);
  confetti(ctx, 190, 190, 170, 34, 3);
  confetti(ctx, TEX_W - 200, TEX_H - 210, 170, 30, 9);
  ctx.textAlign = 'center';
  ctx.fillStyle = colors.spine;
  ctx.font = `900 130px ${FONT}`;
  ctx.fillText(book.brand, TEX_W / 2, 470);
  ctx.fillStyle = colors.pink;
  ctx.font = `italic 800 44px ${FONT}`;
  wrap(ctx, book.brandLine, TEX_W - 320).forEach((l, i) => ctx.fillText(l, TEX_W / 2, 560 + i * 60));
  if (imgs.siem) {
    const h = 340;
    const w = h * (imgs.siem.naturalWidth / imgs.siem.naturalHeight);
    ctx.drawImage(imgs.siem, (TEX_W - w) / 2, 760, w, h);
  }
  ctx.fillStyle = colors.ink;
  ctx.font = `700 36px ${FONT}`;
  ctx.fillText(book.author, TEX_W / 2, 1210);
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
  confetti(ctx, TEX_W - 170, 170, 150, 28, 14);
  ctx.fillStyle = colors.pink;
  ctx.font = `900 84px ${FONT}`;
  ctx.fillText('Inhoud', 120, 250);
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 3;
  tocItems.length = 0;
  const rowH = 190;
  let y = 360;
  stories.forEach((s, n) => {
    ctx.beginPath();
    ctx.moveTo(120, y);
    ctx.lineTo(TEX_W - 100, y);
    ctx.stroke();
    ctx.fillStyle = colors.ink;
    ctx.font = `800 54px ${FONT}`;
    ctx.fillText(s.title, 120, y + 92);
    ctx.font = `700 32px ${FONT}`;
    ctx.fillStyle = colors.leaf;
    ctx.fillText('lees verder', 120, y + 142);
    ctx.textAlign = 'right';
    ctx.font = `600 36px ${FONT}`;
    ctx.fillStyle = colors.soft;
    ctx.fillText(String(2 + n * 2), TEX_W - 100, y + 92);
    ctx.textAlign = 'left';
    tocItems.push({ title: s.title, index: n, n, u0: 90 / TEX_W, u1: (TEX_W - 70) / TEX_W, v0: y / TEX_H, v1: (y + rowH) / TEX_H });
    y += rowH;
  });
  ctx.beginPath();
  ctx.moveTo(120, y);
  ctx.lineTo(TEX_W - 100, y);
  ctx.stroke();
  if (imgs.green) {
    const w = 330;
    const h = w * (imgs.green.naturalHeight / imgs.green.naturalWidth);
    ctx.drawImage(imgs.green, TEX_W - w - 110, y + 70, w, h);
  }
  return c;
}

// Vel k: de voorkant ligt rechts, de achterkant links na het omslaan.
// Vel 0 voor = inhoud. Vel k achter = verhaal k links. Vel k voor = verhaal k-1 rechts.
export function drawSheetSide(k, side) {
  if (side === 'recto') return k === 0 ? drawToc() : drawStoryPage(k - 1, 1, 'right');
  return drawStoryPage(k, 0, 'left');
}

// De laatste rechterbladzijde ligt boven op het boekblok.
export function drawBlockTop() {
  return drawStoryPage(stories.length - 1, 1, 'right');
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
