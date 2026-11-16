// Maakt het stilstaande beeld dat er staat voordat het 3D boek geladen is.
// Draai eerst `npm run build` en `npm run preview`.
import { createRequire } from 'module';
import sharp from 'sharp';
const require = createRequire(process.env.PW_ROOT || '/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const base = process.env.BASE || 'http://localhost:4173/';
const sizes = { wide: { width: 1440, height: 900 }, tall: { width: 390, height: 780 } };
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [name, viewport] of Object.entries(sizes)) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(base + '?still', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__briesie?.ready, null, { timeout: 60000 });
  await page.evaluate(() => window.__briesie.book.renderNow());
  await page.waitForTimeout(500);
  const png = await page.locator('#boek').screenshot();
  const info = await sharp(png).webp({ quality: 72 }).toFile(`public/poster-${name}.webp`);
  console.log(`poster-${name}.webp`, info.width, 'x', info.height, Math.round(info.size / 1024), 'KB');
  await ctx.close();
}
await browser.close();
