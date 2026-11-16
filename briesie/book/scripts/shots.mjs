// Maakt schermafbeeldingen van de belangrijkste standen, desktop en telefoon.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(process.env.PW_ROOT || '/opt/node22/lib/node_modules/');
const { chromium, devices } = require('playwright');

const base = process.env.BASE || 'http://localhost:4173/';
const out = process.env.OUT || 'shots';
const only = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const profiles = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { ...devices['iPhone 13'] },
};
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [name, prof] of Object.entries(profiles)) {
  if (only && only !== name) continue;
  const ctx = await browser.newContext(prof);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base + '?still', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__briesie?.ready, null, { timeout: 60000 });
  const shot = (tag) => page.screenshot({ path: `${out}/${name}-${tag}.png` });
  await page.evaluate(() => document.body.classList.remove('still'));
  await page.waitForTimeout(600);
  await shot('0-dicht');
  for (const t of [0, 0.3, 0.6, 0.9, 1.2]) {
    await page.evaluate((t) => window.__briesie.book.seekOpen(t), t);
    await page.waitForTimeout(150);
    await shot(`open-${String(t).replace('.', '')}`);
  }
  await page.goto(base + '#inhoud', { waitUntil: 'load' });
  await page.reload();
  await page.waitForFunction(() => window.__briesie?.ready, null, { timeout: 60000 });
  await page.waitForTimeout(500);
  await shot('1-inhoud');
  await page.goto(base + '#waar-het-begon', { waitUntil: 'load' });
  await page.reload();
  await page.waitForFunction(() => window.__briesie?.ready, null, { timeout: 60000 });
  await page.waitForTimeout(500);
  await shot('2-verhaal');
  await page.goto(base + '#eikeltje-siem', { waitUntil: 'load' });
  await page.reload();
  await page.waitForFunction(() => window.__briesie?.ready, null, { timeout: 60000 });
  await page.waitForTimeout(500);
  await shot('3-boek');
  await page.goto(base + '#een-eikeltje-dat-tot-leven-komt', { waitUntil: 'load' });
  await page.reload();
  await page.waitForFunction(() => window.__briesie?.ready, null, { timeout: 60000 });
  await page.waitForTimeout(500);
  await shot('4-eikeltje');
  await page.locator('#winkel').screenshot({ path: `${out}/${name}-5-winkel.png` });
  console.log(name, 'fouten:', errors.length ? errors : 'geen');
  await ctx.close();
}
await browser.close();
