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
import { FontSourceUnavailableError, fetchGoogleFontSubset, loadGlyphFont } from './font-source';

/**
 * Maintained fork of Twitter's emoji set; the upstream repo is archived.
 *
 * PINNED ON PURPOSE. These SVGs are embedded verbatim into published cards, and jsDelivr
 * documents `@latest` as unsuitable for production — an upstream retag would silently change
 * or break every emoji card already referenced from the web. Bump this deliberately, the same
 * way the card path is versioned.
 */
const TWEMOJI_VERSION = '17.0.3';
const TWEMOJI_BASE = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@${TWEMOJI_VERSION}/assets/svg`;

/**
 * Monochrome fallback when the Twemoji CDN is unreachable.
 *
 * Noto Color Emoji is not an option: it ignores `&text=` and returns all 6 MB of itself, and
 * Satori cannot render colour bitmap glyphs anyway. Noto Emoji subsets correctly — 1,476 bytes
 * for U+1F600 — so a CDN outage costs colour, not the glyph. It is kept out of the Common
 * candidate list so it can never preempt Twemoji on the happy path.
 */
const MONO_EMOJI_FAMILY = 'Noto Emoji';

/** The app's own display and mono faces, so a card matches the page it links to. */
const UI_FAMILY = 'Playfair Display';
const MONO_FAMILY = 'Space Mono';

/** A compiled module in a Worker, raw bytes under Node — both engines accept both. */
export type WasmInput = WebAssembly.Module | ArrayBuffer | Uint8Array;

let resvgReady: Promise<void> | undefined;
let satoriReady: Promise<void> | undefined;

/**
 * Run `start` once per isolate, but **forget a failure** so the next request can retry.
 *
 * Caching the promise is what stops a warm isolate re-initialising on every request. Caching a
 * REJECTED promise would wedge the isolate permanently: every later request would re-throw the
 * original error with no way back, and a Worker isolate serves many requests.
 */
function initOnce(
  read: () => Promise<void> | undefined,
  write: (p: Promise<void> | undefined) => void,
  start: () => Promise<void>,
): Promise<void> {
  const existing = read();
  if (existing) return existing;

  const pending = start().catch((err: unknown) => {
    // resvg throws this when the module is already live — a success, not a failure.
    if (err instanceof Error && err.message.includes('Already initialized')) return;
    write(undefined);
    throw err;
  });
  write(pending);
  return pending;
}

/** Initialise resvg's wasm once per isolate. */
export function initResvg(wasm: WasmInput): Promise<void> {
  return initOnce(
    () => resvgReady,
    (p) => (resvgReady = p),
    () => initWasm(wasm as WebAssembly.Module),
  );
}

/** Initialise Satori's yoga layout engine once per isolate. Pass satori's own `yoga.wasm`. */
export function initSatori(wasm: WasmInput): Promise<void> {
  return initOnce(
    () => satoriReady,
    (p) => (satoriReady = p),
    () => initSatoriWasm(wasm as WebAssembly.Module),
  );
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
 * Fetch a Twemoji SVG as a data URL. Null means "not an emoji"; a thrown
 * `FontSourceUnavailableError` means the CDN could not be reached.
 *
 * The 404 doubles as the emoji test: the CDN has nothing for anything that is not an emoji, so
 * no separate "is this code point an emoji" predicate is needed. U+2192 → and U+4E2D 中 both
 * 404. Anything other than 404 is a fault, and must not be read as "not an emoji" — that would
 * put a permanent no-glyph card in a year-long cache because jsDelivr had a bad minute.
 */
export async function loadTwemoji(codePoints: number[]): Promise<string | null> {
  const res = await fetch(`${TWEMOJI_BASE}/${twemojiFilename(codePoints)}.svg`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new FontSourceUnavailableError(
      `Twemoji CDN returned HTTP ${res.status}`,
      res.status,
    );
  }
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

  try {
    const dataUrl = await loadTwemoji(codePoints);
    if (dataUrl) return { kind: 'image', dataUrl };
  } catch (err) {
    if (!(err instanceof FontSourceUnavailableError)) throw err;
    // The CDN is down, not the emoji missing. Degrade to the monochrome face rather than
    // failing the card or — worse — claiming no glyph exists. If that is unavailable too, the
    // error propagates and the request fails, which is the correct outcome: better a retryable
    // 5xx than a wrong card cached as immutable for a year.
    const mono = await fetchGoogleFontSubset(MONO_EMOJI_FAMILY, String.fromCodePoint(...codePoints));
    if (mono) return { kind: 'font', family: MONO_EMOJI_FAMILY, data: mono };
    throw err;
  }

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
