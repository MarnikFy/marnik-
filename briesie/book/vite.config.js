import { defineConfig } from 'vite';
import fs from 'fs';

// Kop en voet staan één keer in src/partials/ en komen in elke pagina.
const partials = () => ({
  name: 'partials',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replace(/<!--@(\w+)-->/g, (m, n) => fs.readFileSync(`src/partials/${n}.html`, 'utf8')),
  },
});

// ARTIFACT=1 bouwt de deelbare testpagina: het lettertype gaat dan mee in de CSS.
export default defineConfig({
  base: './',
  plugins: [partials()],
  build: {
    target: 'es2020',
    assetsInlineLimit: process.env.ARTIFACT ? 120000 : 0,
    rollupOptions: { input: { index: 'index.html', boek: 'boek.html' } },
  },
});
