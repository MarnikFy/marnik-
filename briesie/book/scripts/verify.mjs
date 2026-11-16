// Controle van het prototype. Draai eerst `npm run build` en `npm run preview`.
// Loopt de route uit het storyboard op desktop en telefoon en toetst het budget.
import { createRequire } from 'module';
import fs from 'fs';
import zlib from 'zlib';
const require = createRequire(process.env.PW_ROOT || '/opt/node22/lib/node_modules/');
const { chromium, devices } = require('playwright');

const base = process.env.BASE || 'http://localhost:4173/';
const out = 'shots';
fs.mkdirSync(out, { recursive: true });
const rows = [];
const check = (where, what, ok, detail = '') => rows.push({ where, what, ok: !!ok, detail: String(detail) });

// 1. Budget van het script
{
  const dir = 'dist/assets';
  let total = 0;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) total += zlib.gzipSync(fs.readFileSync(`${dir}/${f}`)).length;
  check('build', 'script maximaal 350 KB gzip', total <= 350 * 1024, `${(total / 1024).toFixed(0)} KB`);
}

const profiles = {
  desktop: { viewport: { width: 1440, height: 900 } },
  telefoon: { ...devices['iPhone 13'] },
};
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const st = (page) => page.evaluate(() => window.__briesie.book.state());
const until = (page, fn, arg) => page.waitForFunction(fn, arg, { timeout: 30000 });
const ready = (page) => until(page, () => window.__briesie?.ready);
const at = (page, spread, side) =>
  until(page, ([s, d]) => { const x = window.__briesie.book.state(); return x.mode === 'open' && x.spread === s && (d == null || x.side === d); }, [spread, side ?? null]);

for (const [name, prof] of Object.entries(profiles)) {
  const mobile = name === 'telefoon';
  const ctx = await browser.newContext(prof);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  let bytes = 0;
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  cdp.on('Network.loadingFinished', (e) => (bytes += e.encodedDataLength));
  const shot = (tag) => page.screenshot({ path: `${out}/v-${name}-${tag}.png` });
  try {
    await page.goto(base, { waitUntil: 'load' });
    await ready(page);
    await page.waitForTimeout(2200); // de camera komt tot rust
    check(name, 'alles voor de eerste tik maximaal 1,5 MB', bytes <= 1.5 * 1048576, `${(bytes / 1048576).toFixed(2)} MB`);
    const html = await page.evaluate(() => ({
      text: document.getElementById('lezen').innerText.length,
      buy: !!document.querySelector('.bar a[href="#winkel"].btn'),
      poster: document.getElementById('poster').naturalWidth,
    }));
    check(name, 'verhaaltekst staat als gewone tekst in de pagina', html.text > 300, `${html.text} tekens`);
    check(name, 'koopknop staat in het menu', html.buy);
    check(name, 'stilstaand beeld is geladen', html.poster > 0, `${html.poster} px breed`);
    await shot('1-dicht');

    // Openen door op het boek te tikken
    const box = await page.locator('#stage').boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.42);
    await at(page, 0);
    check(name, 'tik op het boek opent de inhoudsopgave', true);
    check(name, 'adres is #inhoud', (await page.evaluate(() => location.hash)) === '#inhoud');
    await page.waitForTimeout(300);
    await shot('2-inhoud');

    // Het eerste verhaal kiezen
    let p = await page.evaluate(() => window.__briesie.tocPoint(0));
    const t0 = Date.now();
    await page.mouse.click(p.x, p.y);
    await at(page, 1);
    check(name, 'tik op een verhaal bladert naar dat verhaal', true, `${Date.now() - t0} ms in deze testbrowser`);
    check(name, 'adres is #waar-het-begon', (await page.evaluate(() => location.hash)) === '#waar-het-begon');
    await page.waitForTimeout(300);
    await shot('3-verhaal');

    // Bladeren: knop, toetsenbord en slepen
    if (mobile) {
      await page.click('#next');
      await at(page, 1, 1);
      check(name, 'knop volgende: naar de rechterbladzijde', true);
      await shot('3b-rechts');
    } else {
      await page.keyboard.press('ArrowRight');
      await at(page, 2);
      check(name, 'pijltjestoets slaat een bladzijde om', true);
    }
    const cx = box.x + box.width * (mobile ? 0.8 : 0.7);
    const cy = box.y + box.height * 0.5;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx - box.width * (mobile ? 0.4 : 0.2), cy, { steps: 8 });
    await page.waitForTimeout(250);
    await shot('4-halverwege-omslaan');
    await page.mouse.move(cx - box.width * (mobile ? 0.6 : 0.32), cy, { steps: 6 });
    await page.mouse.up();
    await at(page, mobile ? 2 : 3, mobile ? 0 : null);
    check(name, 'slepen aan de bladzijde slaat hem om', true);
    if (mobile) { await page.click('#next'); await at(page, 2, 1); check(name, 'knop volgende werkt', true); }
    else check(name, 'aan het einde van het boek kan volgende niet meer', await page.evaluate(() => document.getElementById('next').disabled));

    // Einde van een verhaal
    await page.waitForTimeout(200);
    const end = await page.evaluate(() => ({ shown: !document.getElementById('end').hidden, next: document.getElementById('nextStory').hidden ? '' : document.getElementById('nextStory').getAttribute('aria-label'), buy: !!document.querySelector('#end a[href="#winkel"]') }));
    check(name, 'einde verhaal toont de koopknop', end.shown && end.buy, end.next || 'laatste verhaal');
    await shot('5-einde-verhaal');
    const here = await st(page);
    const hereHash = await page.evaluate(() => location.hash);

    // Kopen: één tik naar de winkel, en terug
    await page.click('.bar a.btn');
    await page.waitForTimeout(900);
    const shop = await page.evaluate(() => ({ hash: location.hash, top: document.getElementById('winkel').getBoundingClientRect().top }));
    check(name, 'vanuit het verhaal in één tik bij de winkel', shop.hash === '#winkel' && shop.top < 200, `winkel op ${Math.round(shop.top)} px`);
    await page.goBack();
    await page.waitForTimeout(700);
    const back = await st(page);
    check(name, 'terugknop van de browser brengt je terug in het verhaal', back.mode === 'open' && back.spread === here.spread && (await page.evaluate(() => location.hash)) === hereHash);

    // Direct binnenkomen op een verhaal
    await page.goto(base + '#de-wereld-van-briesie', { waitUntil: 'load' });
    await page.reload();
    await ready(page);
    const direct = await st(page);
    check(name, 'directe link opent het boek op dat verhaal', direct.mode === 'open' && direct.spread === 2);

    // Dichtdoen
    await page.evaluate(() => window.scrollTo(0, 0));
    if (mobile) await page.click('#close');
    else await page.keyboard.press('Escape');
    await until(page, () => window.__briesie.book.state().mode === 'closed');
    check(name, mobile ? 'knop Boek dicht sluit het boek' : 'Escape sluit het boek', (await page.evaluate(() => location.hash)) === '');

    // Alleen toetsenbord
    if (!mobile) {
      await page.focus('#open');
      await page.keyboard.press('Enter');
      await at(page, 0);
      check(name, 'Enter op de knop opent het boek', true);
      await page.focus('#keys a:nth-child(2)');
      const vis = await page.evaluate(() => getComputedStyle(document.getElementById('keys')).opacity === '1');
      await page.keyboard.press('Enter');
      await at(page, 1);
      check(name, 'verhalen zijn met Tab en Enter te kiezen', vis);
    }

    // Leesmodus
    await page.click('#mode');
    const tm = await page.evaluate(() => ({ on: document.body.classList.contains('textmode'), h: document.getElementById('lezen').getBoundingClientRect().height }));
    check(name, 'leesmodus toont de verhalen als gewone tekst', tm.on && tm.h > 400, `${Math.round(tm.h)} px hoog`);
    await shot('6-leesmodus');
    check(name, 'geen fouten in de console', errors.length === 0, errors.slice(0, 2).join(' | '));
  } catch (e) {
    check(name, 'route afgebroken', false, String(e).split('\n')[0].slice(0, 140));
    await shot('fout').catch(() => {});
  }
  await ctx.close();
}

// Beweging verminderen
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'load' });
  await ready(page);
  // Zonder beweging staat het boek direct open, in dezelfde stap als de tik.
  const mode = await page.evaluate(() => { window.__briesie.book.open(); return window.__briesie.book.state().mode; });
  check('beweging verminderen', 'boek staat direct open, zonder draaiende beweging', mode === 'open', mode);
  await ctx.close();
}

// Zonder WebGL
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : orig.call(this, t, ...a); };
  });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => ({ on: document.body.classList.contains('textmode'), h: document.getElementById('lezen').getBoundingClientRect().height }));
  check('zonder WebGL', 'verhalen staan er als gewone tekst', r.on && r.h > 400);
  await ctx.close();
}

await browser.close();
const bad = rows.filter((r) => !r.ok);
for (const r of rows) console.log(`${r.ok ? 'OK  ' : 'FOUT'} | ${r.where} | ${r.what}${r.detail ? ' | ' + r.detail : ''}`);
console.log(`\n${rows.length - bad.length} van ${rows.length} geslaagd`);
fs.writeFileSync(`${out}/verify.json`, JSON.stringify(rows, null, 1));
process.exit(bad.length ? 1 : 0);
