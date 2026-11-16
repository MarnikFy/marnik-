// Schermafbeeldingen van de hele pagina's, desktop en telefoon.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(process.env.PW_ROOT || '/opt/node22/lib/node_modules/');
const { chromium, devices } = require('playwright');
const base = process.env.BASE || 'http://localhost:4173/';
fs.mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [name, prof] of Object.entries({ desktop: { viewport: { width: 1280, height: 800 } }, mobile: { ...devices['iPhone 13'], deviceScaleFactor: 2 } })) {
  const ctx = await browser.newContext(prof);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  for (const [tag, url] of [['home', ''], ['boek', 'boek.html']]) {
    await page.goto(base + url, { waitUntil: 'load' });
    if (tag === 'home') await page.waitForFunction(() => window.__briesie?.ready, null, { timeout: 60000 });
    await page.evaluate(async () => { for (const i of document.images) { i.loading = 'eager'; } await Promise.all([...document.images].map((i) => i.complete || new Promise((r) => { i.onload = i.onerror = r; }))); });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `shots/p-${name}-${tag}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(name, tag, 'zijwaarts scrollen:', overflow, 'px', '| fouten:', errors.length ? errors.slice(0, 2) : 'geen');
  }
  await ctx.close();
}
await browser.close();
