/**
 * Where the glyph on a social card comes from.
 *
 * Satori has NO system font fallback: it draws only what is present in the font buffers it is
 * handed. A browser would have fallen back automatically; Satori will not. Since this app is a
 * reference for arbitrary Unicode, supplying the right font per code point is the whole problem,
 * and it is solved here in three steps:
 *
 *   1. `scriptForCodePoint`      — decide the code point's Unicode Script, offline, from the
 *                                  generated range table.
 *   2. `fontFamiliesForCodePoint`— turn that script into an ordered list of Google Fonts Noto
 *                                  families to try.
 *   3. `loadGlyphFont`           — fetch each candidate's single-glyph subset and keep the first
 *                                  that ACTUALLY contains the code point.
 *
 * Step 3 cannot be skipped. The Google Fonts CSS API is not a coverage oracle: asked for Arabic
 * U+0627 from `Noto Sans SC` it answers `unicode-range: U+627` and serves a ~1.6 KB font with no
 * such glyph in it. Believing the CSS would put tofu on the card, which is the one outcome the
 * design forbids. Only the font binary's cmap tells the truth.
 */

import { scriptRanges } from '../generated/script-ranges';

/**
 * A pre-woff2 user agent. Load-bearing: Google picks the font format from the UA, and Satori's
 * opentype fork reads TTF/OTF/WOFF but NOT WOFF2. Send anything modern and every subset comes
 * back as woff2 and fails to parse.
 */
export const GOOGLE_FONT_LEGACY_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Version/5.1 Safari/534.30';

/** Scripts with no ranges of their own — the answer for anything unassigned. */
const UNKNOWN_SCRIPT = 'Unknown';

/** Binary-search the sorted script ranges. Mirrors `versionForCodePoint` in the loader. */
export function scriptForCodePoint(cp: number): string {
  let lo = 0;
  let hi = scriptRanges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [start, end, script] = scriptRanges[mid];
    if (cp < start) hi = mid - 1;
    else if (cp > end) lo = mid + 1;
    else return script;
  }
  return UNKNOWN_SCRIPT;
}

/**
 * Script=Common and Script=Inherited candidates, in the order worth trying.
 *
 * This is the list that matters most here: arrows, box drawing, block elements, geometric
 * shapes, dingbats, math operators and the emoji code points are all Common, which means most
 * of this app's catalogue resolves through here rather than through a named script. No single
 * Noto family spans them, so the list is walked until one actually has the glyph.
 */
const COMMON_FAMILIES = [
  'Noto Sans',
  'Noto Sans Symbols',
  'Noto Sans Symbols 2',
  'Noto Sans Math',
  'Noto Music',
  // Last, and deliberately so. Noto Sans Mono is the only Google Fonts family carrying Box
  // Drawing (U+2500–257F) and Block Elements (U+2580–259F) — measured 2026-08-18, and it is
  // not a gap in Google's hosted cut: the upstream Noto Sans Symbols 2 release binary has
  // 0/128 of Box Drawing too, so self-hosting it would not have helped. Those two blocks are
  // whole categories here and cover CP437 alt-176 through alt-223, so without this entry a
  // large slice of the flagship alt-codes table would render as "no glyph available".
  // It sits at the end because it is monospace: everything above should win first.
  'Noto Sans Mono',
];

/**
 * Scripts whose Noto family is not `Noto Sans <script name>`.
 *
 * Everything absent from this table goes through the naming convention below, which is what
 * lets the ~150 scripts nobody thought about still resolve.
 */
const FAMILY_OVERRIDES: Record<string, string[]> = {
  // Covered by the base family rather than a script-specific one.
  Latin: ['Noto Sans'],
  Greek: ['Noto Sans'],
  Cyrillic: ['Noto Sans'],
  // The CJK families are per-region cuts of one typeface. Simplified first: it is the widest
  // Han coverage of the four, and a card is a display context where a regional variant is a
  // far better outcome than no glyph.
  Han: ['Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR'],
  Hiragana: ['Noto Sans JP'],
  Katakana: ['Noto Sans JP'],
  Bopomofo: ['Noto Sans TC'],
  Hangul: ['Noto Sans KR'],
  // Google ships one Meroitic family covering both scripts.
  Meroitic_Cursive: ['Noto Sans Meroitic'],
  Meroitic_Hieroglyphs: ['Noto Sans Meroitic'],
  // Intercapped family names the convention would get wrong.
  Nko: ['Noto Sans NKo'],
  SignWriting: ['Noto Sans SignWriting'],
};

/** `Canadian_Aboriginal` → `Noto Sans Canadian Aboriginal`. */
function conventionalFamily(script: string): string {
  return `Noto Sans ${script.replace(/_/g, ' ')}`;
}

/**
 * Google Fonts families to try for a code point, best first. Empty means nothing is worth
 * fetching — the caller should go straight to the no-glyph card.
 */
export function fontFamiliesForCodePoint(cp: number): string[] {
  const script = scriptForCodePoint(cp);
  if (script === UNKNOWN_SCRIPT) return [];
  if (script === 'Common' || script === 'Inherited') return [...COMMON_FAMILIES];
  return FAMILY_OVERRIDES[script] ?? [conventionalFamily(script)];
}

/**
 * The CSS endpoint for a single-character subset. `&text=` is what keeps this cheap: the reply
 * for one CJK glyph is ~1.4 KB rather than the multi-megabyte whole family.
 */
export function googleFontCssUrl(family: string, text: string): string {
  const params = new URLSearchParams({ family, text });
  // URLSearchParams encodes spaces as '+', which is exactly the form the API documents.
  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}

/**
 * Pull the font URL out of a Google Fonts CSS reply, or null when there is nothing usable.
 *
 * Null covers two real cases: an unknown family, for which Google serves an HTML error page
 * rather than a 404, and a woff2 reply, which means the legacy UA did not take effect and the
 * bytes would fail to parse.
 */
export function parseGoogleFontCss(css: string): string | null {
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(woff|truetype|opentype)'\)/);
  return match ? match[1] : null;
}

export interface LoadedFont {
  family: string;
  data: ArrayBuffer;
}

const legacyUaHeaders = { 'User-Agent': GOOGLE_FONT_LEGACY_UA };

/**
 * The font provider could not be reached or misbehaved — as distinct from it answering
 * clearly that a family does not cover a code point.
 *
 * The distinction is the whole point of this class. A card that says NO GLYPH AVAILABLE is
 * served `immutable` for a year, so writing one because Google happened to return a 503 would
 * cache a lie for a very long time. Callers must let this propagate and fail the request.
 */
export class FontSourceUnavailableError extends Error {
  // A plain field rather than a constructor parameter property: the app builds with
  // `erasableSyntaxOnly`, which rejects the shorthand.
  status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'FontSourceUnavailableError';
    this.status = status;
  }
}

/**
 * The only statuses that mean "asked and answered: no such glyph here".
 *
 * Measured 2026-08-18 against gstatic: a subset it cannot build returns `400 text/html`.
 * 404 is included because a missing resource is equally a definite no. Everything else —
 * 429, 5xx, a proxy error — is a fault, not an answer.
 */
const NON_COVERAGE_STATUSES = new Set([400, 404]);

/** True when the response is a definite "no". Throws when it is a fault rather than an answer. */
function isDefiniteMiss(res: Response, what: string): boolean {
  if (res.ok) return false;
  if (NON_COVERAGE_STATUSES.has(res.status)) return true;
  throw new FontSourceUnavailableError(`${what} failed with HTTP ${res.status}`, res.status);
}

/**
 * Fetch the subset of `family` covering exactly `text`. Null means the family definitively does
 * not cover it; a `FontSourceUnavailableError` means we could not find out.
 *
 * The null case is decided at the BINARY fetch, not the CSS: gstatic answers `400 text/html`
 * for a subset it cannot build, while the CSS layer above it happily echoes a `unicode-range`
 * for a family with no such glyph. Measured 2026-08-18 — asking `Noto Sans SC` for U+0627
 * yields CSS claiming `unicode-range: U+627` and a 400 on the font.
 *
 * Only 400/404 become null. A 429 or 5xx throws, because the caller turns null into a
 * permanent "no glyph available" card.
 */
export async function fetchGoogleFontSubset(
  family: string,
  text: string,
): Promise<ArrayBuffer | null> {
  const cssRes = await fetch(googleFontCssUrl(family, text), { headers: legacyUaHeaders });
  if (isDefiniteMiss(cssRes, `Google Fonts CSS for ${family}`)) return null;

  // An unknown family is served as an HTML error page with a 200, so a missing @font-face is
  // also a definite no rather than a fault.
  const fontUrl = parseGoogleFontCss(await cssRes.text());
  if (!fontUrl) return null;

  const fontRes = await fetch(fontUrl, { headers: legacyUaHeaders });
  if (isDefiniteMiss(fontRes, `Google Fonts subset for ${family}`)) return null;

  // A 2xx that is not a font means something rewrote the response — a captive portal or a
  // proxy. Treating that as "no glyph" would bake it into a year-long cache entry.
  const contentType = fontRes.headers.get('content-type') ?? '';
  if (!contentType.includes('font')) {
    throw new FontSourceUnavailableError(
      `Google Fonts subset for ${family} returned ${fontRes.status} as '${contentType}', not a font`,
      fontRes.status,
    );
  }

  return fontRes.arrayBuffer();
}

/**
 * The first Noto family that actually renders `char`, or null when none does.
 *
 * Walking the candidate list matters most for Script=Common, where this app spends most of its
 * time: U+2318 ⌘ is in Noto Sans Symbols 2, U+2211 ∑ is in Noto Sans Math, U+2192 → is in
 * Noto Sans Symbols, and no one family has all three.
 */
export async function loadGlyphFont(cp: number): Promise<LoadedFont | null> {
  const char = String.fromCodePoint(cp);
  for (const family of fontFamiliesForCodePoint(cp)) {
    const data = await fetchGoogleFontSubset(family, char);
    if (data) return { family, data };
  }
  return null;
}
