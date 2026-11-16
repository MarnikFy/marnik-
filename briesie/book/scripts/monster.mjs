// Maakt het groene monster vrijstaand en zet hem rechtop.
// Bron: de tekening op blauwe achtergrond in ../bestanden-lokaal/monster-blauw.jpg.
import sharp from 'sharp';

const src = '../bestanden-lokaal/monster-blauw.jpg';
const angle = Number(process.argv[2] ?? 60); // graden met de klok mee
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
const bg = px(5 * W + 5);
const dist = (i) => { const [r, g, b] = px(i); return Math.hypot(r - bg[0], g - bg[1], b - bg[2]); };

// De achtergrond is alles wat vanaf de rand bereikbaar is en dicht bij het blauw ligt.
// Zo blijft de lichtblauwe broek staan: die zit binnen de zwarte lijnen.
const isBg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
while (stack.length) {
  const i = stack.pop();
  if (isBg[i] || dist(i) > 42) continue;
  isBg[i] = 1;
  const x = i % W;
  if (x > 0) stack.push(i - 1);
  if (x < W - 1) stack.push(i + 1);
  if (i >= W) stack.push(i - W);
  if (i < W * (H - 1)) stack.push(i + W);
}
// Rond de stofwolkjes zit een lichte waas van blauw en wit. Die hoort bij de
// achtergrond: alles wat vanaf de achtergrond bereikbaar is en blauwig of bijna wit is.
{
  const hazy = (i) => { const [r, g, b] = px(i); return (b - r > 55 && b > 150) || Math.min(r, g, b) > 190; };
  const st = [];
  for (let i = 0; i < W * H; i++) if (isBg[i]) st.push(i);
  const seen = new Uint8Array(W * H);
  while (st.length) {
    const i = st.pop();
    if (seen[i]) continue;
    seen[i] = 1;
    if (!isBg[i]) { if (!hazy(i)) continue; isBg[i] = 1; }
    const x = i % W;
    if (x > 0) st.push(i - 1);
    if (x < W - 1) st.push(i + 1);
    if (i >= W) st.push(i - W);
    if (i < W * (H - 1)) st.push(i + W);
  }
}
// Losse spikkels ver van het figuurtje weghalen.
{
  const label = new Int32Array(W * H).fill(-1);
  const comps = [];
  for (let i0 = 0; i0 < W * H; i0++) {
    if (isBg[i0] || label[i0] >= 0) continue;
    const id = comps.length;
    const c = { n: 0, x0: W, x1: 0, y0: H, y1: 0 };
    const st = [i0];
    while (st.length) {
      const i = st.pop();
      if (isBg[i] || label[i] >= 0) continue;
      label[i] = id;
      const x = i % W, y = (i - x) / W;
      c.n++; c.x0 = Math.min(c.x0, x); c.x1 = Math.max(c.x1, x); c.y0 = Math.min(c.y0, y); c.y1 = Math.max(c.y1, y);
      if (x > 0) st.push(i - 1);
      if (x < W - 1) st.push(i + 1);
      if (y > 0) st.push(i - W);
      if (y < H - 1) st.push(i + W);
    }
    comps.push(c);
  }
  const main = comps.reduce((a, b) => (b.n > a.n ? b : a));
  const m = 70;
  const keep = comps.map((c) => c === main || (c.n >= 6 && c.x1 > main.x0 - m && c.x0 < main.x1 + m && c.y1 > main.y0 - m && c.y0 < main.y1 + m));
  for (let i = 0; i < W * H; i++) if (!isBg[i] && !keep[label[i]]) isBg[i] = 1;
}
// Blauwe spikkels die in de stofwolkjes zijn achtergebleven.
for (let i = 0; i < W * H; i++) if (!isBg[i] && dist(i) < 38) isBg[i] = 1;
// Rand zacht maken en het blauw uit de randpixels halen.
const near = new Uint8Array(W * H);
for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) {
  const i = y * W + x;
  if (isBg[i]) continue;
  for (let dy = -2; dy <= 2 && !near[i]; dy++) for (let dx = -2; dx <= 2; dx++) if (isBg[i + dy * W + dx]) { near[i] = 1; break; }
}
for (let i = 0; i < W * H; i++) {
  if (isBg[i]) { data[i * 4 + 3] = 0; continue; }
  if (!near[i]) continue;
  const a = Math.min(1, Math.max(0, (dist(i) - 30) / 70));
  data[i * 4 + 3] = Math.round(255 * a);
  if (a > 0.05) for (let c = 0; c < 3; c++) data[i * 4 + c] = Math.max(0, Math.min(255, Math.round((data[i * 4 + c] - bg[c] * (1 - a)) / a)));
}
const out = await sharp(data, { raw: info }).rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).trim().png().toFile('../bestanden-lokaal/figuur-groen.png');
console.log('figuur-groen.png', out.width, 'x', out.height, 'achtergrond', bg.join(','));
