import { defineConfig } from 'vite';

// ARTIFACT=1 bouwt de deelbare testpagina: het lettertype gaat dan mee in de CSS.
export default defineConfig({
  base: './',
  build: { target: 'es2020', assetsInlineLimit: process.env.ARTIFACT ? 120000 : 0 },
});
