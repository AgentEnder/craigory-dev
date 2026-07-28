import { defineConfig } from 'vitest/config';

// Deliberately separate from vite.config.ts. The suite covers pure code-point logic, so it
// needs none of the vike / react / tailwind pipeline — and keeping it out avoids checking
// this app's Vite 8 (rolldown) plugin types against the Vite 7 types vitest bundles.
export default defineConfig({
  test: {
    reporters: ['default'],
    environment: 'node',
    include: ['{src,pages}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
