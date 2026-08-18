/**
 * Glyph card → PNG, via Satori (JSX → SVG) and resvg (SVG → PNG).
 *
 * Satori is called DIRECTLY rather than through `workers-og` / `@cf-wasm/og`. Those wrappers
 * take `@vercel/og`'s options, which have no `loadAdditionalAsset`; `workers-og` hard-codes its
 * own emoji-only `loadDynamicAsset` in that slot. Per-code-point font supply is the entire
 * problem this app has, so the slot cannot be someone else's.
 *
 * Both wasm modules are injected rather than loaded, which is what keeps this the same code on
 * Node and on workerd. `satori/standalone` is the bring-your-own-yoga build — the default
 * `satori` entry reaches for `WebAssembly.instantiateStreaming` on a URL at runtime, which a
 * Worker cannot serve. (`workers-og` imports `satori/wasm`; that export does not exist in
 * satori 0.29, where it is `./standalone`.) The caller supplies both blobs: a compiled
 * `WebAssembly.Module` from a Worker's wasm import, raw bytes off disk under Node.
 */

import { Resvg, initWasm } from '@resvg/resvg-wasm';
import satori, { init as initSatoriWasm } from 'satori/standalone';

import {
  CARD_GLYPH_FONT,
  CARD_HEIGHT,
  CARD_MONO_FONT,
  CARD_UI_FONT,
  CARD_WIDTH,
  GlyphCard,
  type GlyphCardContent,
  cardChromeText,
} from './card';
import { fetchGoogleFontSubset, loadGlyphFont } from './font-source';

/** Maintained fork of Twitter's emoji set; the upstream repo is archived. */
const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg';

/** The app's own display and mono faces, so a card matches the page it links to. */
const UI_FAMILY = 'Playfair Display';
const MONO_FAMILY = 'Space Mono';

/** A compiled module in a Worker, raw bytes under Node — both engines accept both. */
export type WasmInput = WebAssembly.Module | ArrayBuffer | Uint8Array;

let resvgReady: Promise<void> | undefined;
let satoriReady: Promise<void> | undefined;

/**
 * Initialise resvg's wasm once per isolate.
 *
 * Re-initialising throws "Already initialized"; caching the promise is also what stops a warm
 * isolate paying for this on every request.
 */
export function initResvg(wasm: WasmInput): Promise<void> {
  resvgReady ??= initWasm(wasm as WebAssembly.Module).catch((err: unknown) => {
    if (err instanceof Error && err.message.includes('Already initialized')) return;
    throw err;
  });
  return resvgReady;
}

/** Initialise Satori's yoga layout engine once per isolate. Pass satori's own `yoga.wasm`. */
export function initSatori(wasm: WasmInput): Promise<void> {
  satoriReady ??= initSatoriWasm(wasm as WebAssembly.Module);
  return satoriReady;
}

/**
 * The Twemoji filename for a code point sequence.
 *
 * U+FE0F is dropped unless the sequence is a ZWJ sequence, which is Twemoji's own rule — verified
 * against the CDN 2026-08-18: `[2764, FE0F] → 2764.svg`, `[1F468, 200D, 1F4BB]` keeps both.
 */
export function twemojiFilename(codePoints: number[]): string {
  const isZwjSequence = codePoints.includes(0x200d);
  return codePoints
    .filter((cp) => isZwjSequence || cp !== 0xfe0f)
    .map((cp) => cp.toString(16))
    .join('-');
}

/**
 * Fetch a Twemoji SVG as a data URL, or null when there is no such emoji.
 *
 * Doubles as the emoji test: the CDN 404s for anything that is not an emoji, so no separate
 * "is this a code point emoji" predicate is needed. U+2192 → and U+4E2D 中 both 404.
 */
export async function loadTwemoji(codePoints: number[]): Promise<string | null> {
  const res = await fetch(`${TWEMOJI_BASE}/${twemojiFilename(codePoints)}.svg`);
  if (!res.ok) return null;
  const svg = await res.text();
  // Satori accepts a data URL here and embeds it as an <image>; resvg then rasterises the
  // nested SVG. base64 rather than percent-encoding because the SVGs contain '#' freely.
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/** How the display character will be drawn. */
export type GlyphAsset =
  | { kind: 'font'; family: string; data: ArrayBuffer }
  | { kind: 'image'; dataUrl: string }
  | { kind: 'none' };

/**
 * Decide what can actually draw this character — a real font, a Twemoji SVG, or nothing.
 *
 * Font first, Twemoji second, and the order is load-bearing rather than arbitrary. This is an
 * alt-code and Unicode reference: U+2665 ♥ is CP437 alt-3 and should render as the monochrome
 * typographic heart the DOS code page meant, not as Twitter's red emoji — and it does, because
 * Noto Sans Symbols 2 covers it and wins the race. Genuine emoji like U+1F600 are in no Noto
 * family this app fetches, so they fall through to Twemoji on their own. Which is also why
 * `Noto Emoji` is deliberately NOT in the Common candidate list: adding it would preempt
 * Twemoji and turn every emoji card monochrome.
 */
export async function resolveGlyphAsset(codePoints: number[]): Promise<GlyphAsset> {
  const font = await loadGlyphFont(codePoints[0]);
  if (font) return { kind: 'font', family: font.family, data: font.data };

  const dataUrl = await loadTwemoji(codePoints);
  if (dataUrl) return { kind: 'image', dataUrl };

  return { kind: 'none' };
}

export interface GlyphCardInput {
  codePoints: number[];
  char: string;
  name: string;
  hex: string;
  altCode: number | null;
  categoryName: string;
}

/** Render one glyph card to SVG. Split out from the PNG step so tests can read the markup. */
export async function renderGlyphCardSvg(input: GlyphCardInput): Promise<{
  svg: string;
  asset: GlyphAsset;
}> {
  const asset = await resolveGlyphAsset(input.codePoints);
  const content: GlyphCardContent = { ...input, hasGlyph: asset.kind !== 'none' };

  // The card's own lettering is subset to exactly the characters it draws, which is what keeps
  // three font fetches down to a few kilobytes rather than three whole families.
  const chrome = cardChromeText(content);
  const [uiData, monoData] = await Promise.all([
    fetchGoogleFontSubset(UI_FAMILY, chrome),
    fetchGoogleFontSubset(MONO_FAMILY, chrome),
  ]);
  if (!uiData || !monoData) {
    throw new Error(`Could not load card chrome fonts (${UI_FAMILY} / ${MONO_FAMILY})`);
  }

  const fonts = [
    { name: CARD_UI_FONT, data: uiData, weight: 400 as const, style: 'normal' as const },
    { name: CARD_MONO_FONT, data: monoData, weight: 400 as const, style: 'normal' as const },
  ];
  if (asset.kind === 'font') {
    fonts.push({
      name: CARD_GLYPH_FONT,
      data: asset.data,
      weight: 400 as const,
      style: 'normal' as const,
    });
  }

  // Satori's `ReactNode` comes from its own bundled React types, which do not structurally
  // match this app's React 19 `ReactElement`. The runtime shape is the same element object.
  const element = GlyphCard(content) as Parameters<typeof satori>[0];
  const svg = await satori(element, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts,
    // Satori swaps a grapheme for this image before it ever consults a font, which is how the
    // colour-emoji path composes with the text path instead of competing with it.
    graphemeImages: asset.kind === 'image' ? { [input.char]: asset.dataUrl } : undefined,
  });

  return { svg, asset };
}

/** Render one glyph card to PNG. `initSatori` and `initResvg` must have been called first. */
export async function renderGlyphCard(input: GlyphCardInput): Promise<{
  png: Uint8Array;
  asset: GlyphAsset;
}> {
  const { svg, asset } = await renderGlyphCardSvg(input);
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: CARD_WIDTH } });
  return { png: resvg.render().asPng(), asset };
}
