/**
 * The social card layout, as Satori JSX.
 *
 * Glyph-forward on purpose: the character at display size is the subject, and the name, code
 * point, alt code and category are its caption. That is why this app generates its own card
 * rather than borrowing craigory.dev's blog-headline template.
 *
 * Satori implements a SUBSET of CSS — flexbox only, no grid, no `-webkit-line-clamp`, and every
 * element with more than one child needs an explicit `display: 'flex'`. The layout below stays
 * inside that subset deliberately; it is the reason the shared template was not worth reusing.
 */

import type { ReactElement } from 'react';

/** Palette lifted from src/style.css so a card cannot drift from the page it represents. */
const INK = '#100f08';
const SURFACE = '#1b1914';
const BORDER = '#2c2820';
const TEXT = '#cfc9b5';
const MUTED = '#7a7060';
const AMBER = '#c08028';
/** Only used by the no-coverage state, so "we could not draw this" never reads as decoration. */
const ALERT = '#8a6020';

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

export interface GlyphCardContent {
  /** The character itself. Rendered at display size — unless `hasGlyph` is false. */
  char: string;
  /** e.g. "LEFTWARDS ARROW". */
  name: string;
  /** e.g. "U+2190". */
  hex: string;
  /** The CP437 alt code, when the character has one. */
  altCode: number | null;
  /** e.g. "Arrows". */
  categoryName: string;
  /**
   * Whether a font covering `char` was actually found. False swaps the specimen for an explicit
   * no-glyph state: the card still names the character and states its code point, and never
   * shows a blank box or a tofu rectangle. See font-source.ts for how this is decided.
   */
  hasGlyph: boolean;
}

/** Font family names the renderer must supply. Satori resolves these by name, nothing else. */
export const CARD_UI_FONT = 'Card UI';
export const CARD_MONO_FONT = 'Card Mono';
export const CARD_GLYPH_FONT = 'Card Glyph';

function Specimen({ char, hex, hasGlyph }: Pick<GlyphCardContent, 'char' | 'hex' | 'hasGlyph'>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 380,
        height: 380,
        borderRadius: 28,
        background: SURFACE,
        border: `2px solid ${hasGlyph ? BORDER : ALERT}`,
      }}
    >
      {hasGlyph ? (
        // Satori measures the glyph with the font supplied under CARD_GLYPH_FONT. A tall CJK
        // or emoji glyph and a short Latin one both center on the box rather than the baseline.
        <div style={{ fontFamily: CARD_GLYPH_FONT, fontSize: 240, color: TEXT, lineHeight: 1.2 }}>
          {char}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: CARD_MONO_FONT, fontSize: 64, color: ALERT }}>{hex}</div>
          <div
            style={{
              fontFamily: CARD_UI_FONT,
              fontSize: 22,
              color: MUTED,
              marginTop: 20,
              letterSpacing: 2,
            }}
          >
            NO GLYPH AVAILABLE
          </div>
        </div>
      )}
    </div>
  );
}

export function GlyphCard(content: GlyphCardContent): ReactElement {
  const { char, name, hex, altCode, categoryName, hasGlyph } = content;
  return (
    <div
      style={{
        display: 'flex',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        background: INK,
        padding: 64,
        alignItems: 'center',
      }}
    >
      <Specimen char={char} hex={hex} hasGlyph={hasGlyph} />

      {/* Explicit height, because Satori's flex column will not stretch to the parent on its
          own and `marginTop: auto` needs somewhere to push against. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: CARD_HEIGHT - 128,
          marginLeft: 64,
          width: 644,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: CARD_UI_FONT,
              fontSize: 20,
              color: AMBER,
              letterSpacing: 3,
            }}
          >
            {categoryName.toUpperCase()}
          </div>

          {/* No line clamp in Satori. The name is bounded by the longest real Unicode names
              (~85 chars), so the size is chosen to fit those rather than to be truncated. */}
          <div
            style={{
              fontFamily: CARD_UI_FONT,
              fontSize: name.length > 44 ? 40 : 56,
              color: TEXT,
              marginTop: 16,
              lineHeight: 1.15,
            }}
          >
            {name}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
            <div style={{ fontFamily: CARD_MONO_FONT, fontSize: 34, color: AMBER }}>{hex}</div>
            {altCode !== null && (
              <div
                style={{
                  display: 'flex',
                  fontFamily: CARD_MONO_FONT,
                  fontSize: 26,
                  color: MUTED,
                  marginLeft: 28,
                  paddingLeft: 28,
                  borderLeft: `2px solid ${BORDER}`,
                }}
              >
                {`Alt + ${altCode}`}
              </div>
            )}
          </div>
        </div>

        <div style={{ fontFamily: CARD_UI_FONT, fontSize: 22, color: MUTED }}>Glyph Index</div>
      </div>
    </div>
  );
}

/** Every character the card draws in UI/mono type, used to request an exact font subset. */
export function cardChromeText(content: GlyphCardContent): string {
  const parts = [
    content.name,
    content.hex,
    content.categoryName.toUpperCase(),
    'NO GLYPH AVAILABLE',
    'Glyph Index',
    content.altCode !== null ? `Alt + ${content.altCode}` : '',
  ];
  return [...new Set(parts.join('').split(''))].join('');
}
