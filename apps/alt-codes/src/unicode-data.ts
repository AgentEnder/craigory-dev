export interface EmojiMeta {
  group: string;           // "Smileys & Emotion"
  subgroup: string;        // "face-smiling"
  emojiVersion: string;    // "1.0"
  unicodeVersion: string;  // "6.1"
  skinToneSlots: number;   // 0 = none, 1 = single, 2 = dual
}

export interface CharacterEntry {
  codePoints: number[];       // [0x2190] for regular chars; multi for emoji sequences
  char: string;
  hex: string;                // "U+XXXX" — first codepoint, used for card display and slug prefix
  decimal: number;            // first codepoint decimal
  categoryId: string;
  altCode: number | null;
  name: string;
  aliases: string[];
  emoji: EmojiMeta | null;    // null for non-emoji
}

/** Slim version of CharacterEntry for the home page grid — strips emoji metadata
 *  and decimal (only needed on detail pages) to reduce the SSR payload. */
export interface GridEntry {
  codePoints: number[];
  char: string;
  hex: string;
  name: string;
  categoryId: string;
  altCode: number | null;
  aliases: string[];
}

export function toGridEntry(entry: CharacterEntry): GridEntry {
  return {
    codePoints: entry.codePoints,
    char: entry.char,
    hex: entry.hex,
    name: entry.name,
    categoryId: entry.categoryId,
    altCode: entry.altCode,
    aliases: entry.aliases,
  };
}

/** Returns the map key for a codepoints array.
 *  e.g. [0x1F468, 0x200D, 0x1F4BB] → "1f468_200d_1f4bb" */
export function codePointsKey(codePoints: number[]): string {
  return codePoints.map(cp => cp.toString(16).toLowerCase()).join('_');
}

/** Produces a URL-safe slug.
 *  Single codepoint:  "2190-leftwards-arrow"
 *  Multi codepoint:   "1f468_200d_1f4bb-man-technologist"
 *  Codepoints joined with _ to avoid ambiguity with 4-char hex name words (e.g. "face"). */
export function toSymbolSlug(entry: Pick<CharacterEntry, 'codePoints' | 'name'>): string {
  const hexPrefix = codePointsKey(entry.codePoints);
  if (!entry.name) return hexPrefix;
  const slug = entry.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${hexPrefix}-${slug}`;
}

/** Extracts codepoints from a slug.
 *  "2190-leftwards-arrow"              → [0x2190]
 *  "1f468_200d_1f4bb-man-technologist" → [0x1F468, 0x200D, 0x1F4BB]
 *  Strategy: take everything before the first "-", split on "_". */
export function parseSymbolSlug(param: string): number[] {
  const hexPrefix = param.split('-')[0];
  return hexPrefix.split('_').map(h => parseInt(h, 16));
}

export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: 'alt-codes', name: 'Alt Codes 1–255' },
  { id: 'ascii', name: 'ASCII Symbols' },
  { id: 'latin-ext', name: 'Latin Extended' },
  { id: 'currency', name: 'Currency' },
  { id: 'letterlike', name: 'Letterlike' },
  { id: 'number-forms', name: 'Number Forms' },
  { id: 'arrows', name: 'Arrows' },
  { id: 'math', name: 'Math Operators' },
  { id: 'technical', name: 'Technical' },
  { id: 'box', name: 'Box Drawing' },
  { id: 'blocks', name: 'Block Elements' },
  { id: 'geometric', name: 'Geometric Shapes' },
  { id: 'symbols', name: 'Misc Symbols' },
  { id: 'dingbats', name: 'Dingbats' },
  { id: 'smileys-emotion', name: 'Smileys & Emotion' },
  { id: 'people-body', name: 'People & Body' },
  { id: 'animals-nature', name: 'Animals & Nature' },
  { id: 'food-drink', name: 'Food & Drink' },
  { id: 'travel-places', name: 'Travel & Places' },
  { id: 'activities', name: 'Activities' },
  { id: 'objects', name: 'Objects' },
  { id: 'symbols-emoji', name: 'Symbols (Emoji)' },
  { id: 'flags', name: 'Flags' },
];

/** Categories included in the initial SSR payload for fast FCP/LCP.
 *  Remaining categories are lazy-loaded as JSON from /generated/{id}.json. */
export const HERO_CATEGORIES = new Set(['alt-codes', 'smileys-emotion', 'ascii']);

// CP437: [alt code, unicode code point]  (alt 32–126 map directly to ASCII)
export const CP437_SPECIAL: ReadonlyArray<readonly [number, number]> = [
  [1, 0x263a],   // ☺
  [2, 0x263b],   // ☻
  [3, 0x2665],   // ♥
  [4, 0x2666],   // ♦
  [5, 0x2663],   // ♣
  [6, 0x2660],   // ♠
  [7, 0x2022],   // •
  [8, 0x25d8],   // ◘
  [9, 0x25cb],   // ○
  [10, 0x25d9],  // ◙
  [11, 0x2642],  // ♂
  [12, 0x2640],  // ♀
  [13, 0x266a],  // ♪
  [14, 0x266b],  // ♫
  [15, 0x263c],  // ☼
  [16, 0x25ba],  // ►
  [17, 0x25c4],  // ◄
  [18, 0x2195],  // ↕
  [19, 0x203c],  // ‼
  [20, 0x00b6],  // ¶
  [21, 0x00a7],  // §
  [22, 0x25ac],  // ▬
  [23, 0x21a8],  // ↨
  [24, 0x2191],  // ↑
  [25, 0x2193],  // ↓
  [26, 0x2192],  // →
  [27, 0x2190],  // ←
  [28, 0x221f],  // ∟
  [29, 0x2194],  // ↔
  [30, 0x25b2],  // ▲
  [31, 0x25bc],  // ▼
  [127, 0x2302], // ⌂
  [128, 0x00c7], // Ç
  [129, 0x00fc], // ü
  [130, 0x00e9], // é
  [131, 0x00e2], // â
  [132, 0x00e4], // ä
  [133, 0x00e0], // à
  [134, 0x00e5], // å
  [135, 0x00e7], // ç
  [136, 0x00ea], // ê
  [137, 0x00eb], // ë
  [138, 0x00e8], // è
  [139, 0x00ef], // ï
  [140, 0x00ee], // î
  [141, 0x00ec], // ì
  [142, 0x00c4], // Ä
  [143, 0x00c5], // Å
  [144, 0x00c9], // É
  [145, 0x00e6], // æ
  [146, 0x00c6], // Æ
  [147, 0x00f4], // ô
  [148, 0x00f6], // ö
  [149, 0x00f2], // ò
  [150, 0x00fb], // û
  [151, 0x00f9], // ù
  [152, 0x00ff], // ÿ
  [153, 0x00d6], // Ö
  [154, 0x00dc], // Ü
  [155, 0x00a2], // ¢
  [156, 0x00a3], // £
  [157, 0x00a5], // ¥
  [158, 0x20a7], // ₧
  [159, 0x0192], // ƒ
  [160, 0x00e1], // á
  [161, 0x00ed], // í
  [162, 0x00f3], // ó
  [163, 0x00fa], // ú
  [164, 0x00f1], // ñ
  [165, 0x00d1], // Ñ
  [166, 0x00aa], // ª
  [167, 0x00ba], // º
  [168, 0x00bf], // ¿
  [169, 0x2310], // ⌐
  [170, 0x00ac], // ¬
  [171, 0x00bd], // ½
  [172, 0x00bc], // ¼
  [173, 0x00a1], // ¡
  [174, 0x00ab], // «
  [175, 0x00bb], // »
  [176, 0x2591], // ░
  [177, 0x2592], // ▒
  [178, 0x2593], // ▓
  [179, 0x2502], // │
  [180, 0x2524], // ┤
  [181, 0x2561], // ╡
  [182, 0x2562], // ╢
  [183, 0x2556], // ╖
  [184, 0x2555], // ╕
  [185, 0x2563], // ╣
  [186, 0x2551], // ║
  [187, 0x2557], // ╗
  [188, 0x255d], // ╝
  [189, 0x255c], // ╜
  [190, 0x255b], // ╛
  [191, 0x2510], // ┐
  [192, 0x2514], // └
  [193, 0x2534], // ┴
  [194, 0x252c], // ┬
  [195, 0x251c], // ├
  [196, 0x2500], // ─
  [197, 0x253c], // ┼
  [198, 0x255e], // ╞
  [199, 0x255f], // ╟
  [200, 0x255a], // ╚
  [201, 0x2554], // ╔
  [202, 0x2569], // ╩
  [203, 0x2566], // ╦
  [204, 0x2560], // ╠
  [205, 0x2550], // ═
  [206, 0x256c], // ╬
  [207, 0x2567], // ╧
  [208, 0x2568], // ╨
  [209, 0x2564], // ╤
  [210, 0x2565], // ╥
  [211, 0x2559], // ╙
  [212, 0x2558], // ╘
  [213, 0x2552], // ╒
  [214, 0x2553], // ╓
  [215, 0x256b], // ╫
  [216, 0x256a], // ╪
  [217, 0x2518], // ┘
  [218, 0x250c], // ┌
  [219, 0x2588], // █
  [220, 0x2584], // ▄
  [221, 0x258c], // ▌
  [222, 0x2590], // ▐
  [223, 0x2580], // ▀
  [224, 0x03b1], // α
  [225, 0x00df], // ß
  [226, 0x0393], // Γ
  [227, 0x03c0], // π
  [228, 0x03a3], // Σ
  [229, 0x03c3], // σ
  [230, 0x00b5], // µ
  [231, 0x03c4], // τ
  [232, 0x03a6], // Φ
  [233, 0x0398], // Θ
  [234, 0x03a9], // Ω
  [235, 0x03b4], // δ
  [236, 0x221e], // ∞
  [237, 0x03c6], // φ
  [238, 0x03b5], // ε
  [239, 0x2229], // ∩
  [240, 0x2261], // ≡
  [241, 0x00b1], // ±
  [242, 0x2265], // ≥
  [243, 0x2264], // ≤
  [244, 0x2320], // ⌠
  [245, 0x2321], // ⌡
  [246, 0x00f7], // ÷
  [247, 0x2248], // ≈
  [248, 0x00b0], // °
  [249, 0x2219], // ∙
  [250, 0x00b7], // ·
  [251, 0x221a], // √
  [252, 0x207f], // ⁿ
  [253, 0x00b2], // ²
  [254, 0x25a0], // ■
];

export interface EncodingInfo {
  utf8Bytes: number[];        // e.g. [0xE2, 0x86, 0x90]
  utf8Hex: string;            // e.g. "E2 86 90"
  htmlEntity: string | null;  // e.g. "&larr;" or null
  htmlNumeric: string;        // e.g. "&#8592;" or "&#x2190;"
  cssValue: string;           // e.g. "\\2190"
  jsEscape: string;           // e.g. "\\u2190" or "\\u{10FFFF}"
}

export interface UnicodeData {
  characters: CharacterEntry[];
  byCodePoints: Map<string, CharacterEntry>;
  byCategory: Map<string, CharacterEntry[]>;
}

declare global {
  namespace Vike {
    interface GlobalContext {
      unicodeData: UnicodeData;
    }
  }
}
