import type { EncodingInfo } from './unicode-data';

// Named HTML entities (subset of commonly needed ones)
const HTML_ENTITIES: Record<number, string> = {
  0x00a0: '&nbsp;', 0x00a9: '&copy;', 0x00ae: '&reg;', 0x2122: '&trade;',
  0x2190: '&larr;', 0x2191: '&uarr;', 0x2192: '&rarr;', 0x2193: '&darr;',
  0x2194: '&harr;', 0x21d0: '&lArr;', 0x21d2: '&rArr;', 0x21d4: '&hArr;',
  0x2200: '&forall;', 0x2202: '&part;', 0x2203: '&exist;', 0x2205: '&empty;',
  0x2207: '&nabla;', 0x2208: '&isin;', 0x2209: '&notin;', 0x220b: '&ni;',
  0x220f: '&prod;', 0x2211: '&sum;', 0x2212: '&minus;', 0x2217: '&lowast;',
  0x221a: '&radic;', 0x221d: '&prop;', 0x221e: '&infin;', 0x2220: '&ang;',
  0x2227: '&and;', 0x2228: '&or;', 0x2229: '&cap;', 0x222a: '&cup;',
  0x222b: '&int;', 0x2234: '&there4;', 0x223c: '&sim;', 0x2245: '&cong;',
  0x2248: '&asymp;', 0x2260: '&ne;', 0x2261: '&equiv;', 0x2264: '&le;',
  0x2265: '&ge;', 0x2282: '&sub;', 0x2283: '&sup;', 0x2284: '&nsub;',
  0x2286: '&sube;', 0x2287: '&supe;', 0x2295: '&oplus;', 0x2297: '&otimes;',
  0x22a5: '&perp;', 0x22c5: '&sdot;', 0x2308: '&lceil;', 0x2309: '&rceil;',
  0x230a: '&lfloor;', 0x230b: '&rfloor;', 0x2329: '&lang;', 0x232a: '&rang;',
  0x25ca: '&loz;', 0x2660: '&spades;', 0x2663: '&clubs;', 0x2665: '&hearts;',
  0x2666: '&diams;',
};

/** Compute UTF-8 / HTML / CSS / JS encodings for a code point sequence.
 *  Pure — uses only TextEncoder + string math, so it runs in the browser too. */
export function getEncodingInfo(codePoints: number[]): EncodingInfo {
  const char = codePoints.map(cp => String.fromCodePoint(cp)).join('');

  // UTF-8 encoding of the full sequence
  const encoder = new TextEncoder();
  const bytes = Array.from(encoder.encode(char));
  const utf8Hex = bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

  // HTML entity (single codepoint only)
  const htmlEntity = codePoints.length === 1 ? (HTML_ENTITIES[codePoints[0]] ?? null) : null;

  // HTML numeric: each codepoint as &#N; or &#xN;
  const htmlNumeric = codePoints
    .map(cp => cp <= 0xffff ? `&#${cp};` : `&#x${cp.toString(16).toUpperCase()};`)
    .join('');

  // CSS: backslash-hex per codepoint
  const cssValue = codePoints
    .map(cp => `\\${cp.toString(16).toUpperCase()}`)
    .join('');

  // JS escape per codepoint
  const jsEscape = codePoints
    .map(cp => cp <= 0xffff
      ? `\\u${cp.toString(16).toUpperCase().padStart(4, '0')}`
      : `\\u{${cp.toString(16).toUpperCase()}}`)
    .join('');

  return { utf8Bytes: bytes, utf8Hex, htmlEntity, htmlNumeric, cssValue, jsEscape };
}
