// Renders the spike's cards to tmp/og-spike/ so they can be looked at.
//
//   pnpm --filter alt-codes og:spike
//
// The vitest suite proves the pipeline returns a PNG; this proves the PNG has the right thing
// in it. Keep both: a card that renders a blank specimen passes every assertion a test can
// cheaply make about a buffer.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { initResvg, initSatori, renderGlyphCard } from '../src/og/render.ts';

const require = createRequire(import.meta.url);
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'tmp', 'og-spike');

const CASES = [
  { codePoints: [0x0041], char: 'A', name: 'LATIN CAPITAL LETTER A', hex: 'U+0041', altCode: 65, categoryName: 'ASCII Symbols' },
  { codePoints: [0x00e9], char: 'é', name: 'LATIN SMALL LETTER E WITH ACUTE', hex: 'U+00E9', altCode: 130, categoryName: 'Latin Extended' },
  { codePoints: [0x4e2d], char: '中', name: 'CJK UNIFIED IDEOGRAPH-4E2D', hex: 'U+4E2D', altCode: null, categoryName: 'CJK & Scripts' },
  { codePoints: [0x0627], char: 'ا', name: 'ARABIC LETTER ALEF', hex: 'U+0627', altCode: null, categoryName: 'CJK & Scripts' },
  { codePoints: [0x1f600], char: '😀', name: 'GRINNING FACE', hex: 'U+1F600', altCode: null, categoryName: 'Smileys & Emotion' },
  { codePoints: [0x2554], char: '╔', name: 'BOX DRAWINGS DOUBLE DOWN AND RIGHT', hex: 'U+2554', altCode: 201, categoryName: 'Box Drawing' },
  { codePoints: [0x2665], char: '♥', name: 'BLACK HEART SUIT', hex: 'U+2665', altCode: 3, categoryName: 'Alt Codes 1–255' },
  { codePoints: [0x1cc00], char: '\u{1CC00}', name: 'OUTLINED LATIN CAPITAL LETTER A', hex: 'U+1CC00', altCode: null, categoryName: 'Misc Symbols' },
];

await initSatori(readFileSync(require.resolve('satori/yoga.wasm')));
await initResvg(readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm')));
mkdirSync(OUT_DIR, { recursive: true });

for (const input of CASES) {
  const started = Date.now();
  const { png, asset } = await renderGlyphCard(input);
  const file = join(OUT_DIR, `${input.codePoints.map((c) => c.toString(16)).join('-')}.png`);
  writeFileSync(file, png);
  const via = asset.kind === 'font' ? `font: ${asset.family}` : asset.kind;
  console.log(
    `${input.hex.padEnd(8)} ${String(png.byteLength).padStart(7)}B  ${String(Date.now() - started).padStart(5)}ms  ${via}`,
  );
}
console.log(`\nWrote ${CASES.length} cards to ${OUT_DIR}`);
