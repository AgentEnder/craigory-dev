import { presentationBase, textPresentation, emojiPresentation } from './unicode-data';

/**
 * A card's glyph.
 *
 * For the ~371 code points Unicode defines standardized variation sequences for, this
 * renders BOTH presentations side by side: text (U+FE0E, monochrome, drawn from the text
 * font) and emoji (U+FE0F, color, drawn from the emoji font). Those two are genuinely
 * different characters on screen — ♥ vs ♥️ — and a bare, unqualified code point leaves
 * the choice to platform font fallback, so the same card renders differently per OS.
 * Qualifying explicitly is what makes the table mean the same thing everywhere.
 *
 * Every other character renders the single glyph it already had.
 */
export function CharGlyph({ char, codePoints }: { char: string; codePoints: number[] }) {
  const base = presentationBase(codePoints);
  if (base === null) return <span className="char-glyph">{char}</span>;
  return (
    <span className="char-glyph char-glyph--dual">
      <span className="char-glyph-text">{textPresentation(base)}</span>
      <span className="char-glyph-emoji">{emojiPresentation(base)}</span>
    </span>
  );
}

/**
 * Tooltip fragment explaining a dual glyph, or null when the card shows one glyph.
 * The glyph spans themselves are `pointer-events: none`, so this has to ride along in
 * the card's own `title` rather than sitting on the variants.
 */
export function presentationNote(codePoints: number[]): string | null {
  return presentationBase(codePoints) === null ? null : 'text + emoji presentation';
}
