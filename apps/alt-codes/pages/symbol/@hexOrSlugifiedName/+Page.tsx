import { useData } from 'vike-react/useData';
import { useState, useEffect } from 'react';
import type { SymbolData } from './+data.server';
import type { CharacterEntry } from '../../../src/unicode-data';
import {
  toSymbolSlug,
  codePointsKey,
  presentationBase,
  textPresentation,
  emojiPresentation,
  defaultPresentation,
} from '../../../src/unicode-data';
import { CharGlyph, presentationNote } from '../../../src/CharGlyph';
import { withBase } from '../../../src/utils';
import { SearchInput } from '../../../src/SearchInput';
import '../../../src/style.css';

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={`copy-btn${copied ? ' copy-btn--done' : ''}`}
      onClick={() => {
        void navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}

function MiniCard({ entry }: { entry: CharacterEntry }) {
  return (
    <a
      href={withBase(`/symbol/${toSymbolSlug(entry)}`)}
      className="char-card"
      title={[entry.name || entry.hex, presentationNote(entry.codePoints)].filter(Boolean).join(' · ')}
    >
      <CharGlyph char={entry.char} codePoints={entry.codePoints} />
      <span className="char-hex">{entry.hex}</span>
      {entry.name && <span className="char-name">{entry.name}</span>}
    </a>
  );
}

export type Presentation = 'text' | 'emoji';

/** Segmented control beneath the hero glyph, swapping it between the two standardized
 *  variation sequences. Each segment previews the variant it selects and names it, so the
 *  control reads as interactive and shows the difference rather than describing it.
 *
 *  There is deliberately no "default" segment. The unqualified form always renders as one of
 *  these two — whichever Emoji_Presentation says — so offering it as a third option just
 *  draws the same glyph twice. The native side is preselected instead, and flagged in the
 *  tooltip, so the page opens on the character's real appearance. */
function PresentationToggle({
  base,
  value,
  onChange,
}: {
  base: number;
  value: Presentation;
  onChange: (p: Presentation) => void;
}) {
  const native = defaultPresentation(base);
  const options: Array<{
    id: Presentation;
    label: string;
    hint: string;
    char: string;
    glyphClass: string;
  }> = [
    { id: 'text', label: 'Text', hint: 'U+FE0E', char: textPresentation(base), glyphClass: 'char-glyph-text' },
    { id: 'emoji', label: 'Emoji', hint: 'U+FE0F', char: emojiPresentation(base), glyphClass: 'char-glyph-emoji' },
  ];
  return (
    <div className="presentation-toggle" role="group" aria-label="Presentation">
      {options.map(({ id, label, hint, char, glyphClass }) => (
        <button
          key={id}
          type="button"
          className={`presentation-toggle-btn${
            value === id ? ' presentation-toggle-btn--active' : ''
          }`}
          title={`${label} presentation — ${hint}${
            id === native ? " — this character's default" : ''
          }`}
          onClick={() => onChange(id)}
          aria-pressed={value === id}
        >
          <span className={`presentation-toggle-glyph ${glyphClass}`}>{char}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

const SKIN_TONES: Array<{ modifier: number | null; label: string; swatch: string }> = [
  { modifier: null,    label: 'Default',      swatch: '🟡' },
  { modifier: 0x1F3FB, label: 'Light',        swatch: '🏻' },
  { modifier: 0x1F3FC, label: 'Medium-Light', swatch: '🏼' },
  { modifier: 0x1F3FD, label: 'Medium',       swatch: '🏽' },
  { modifier: 0x1F3FE, label: 'Medium-Dark',  swatch: '🏾' },
  { modifier: 0x1F3FF, label: 'Dark',         swatch: '🏿' },
];

const SKIN_MODIFIER_SET = new Set([0x1F3FB, 0x1F3FC, 0x1F3FD, 0x1F3FE, 0x1F3FF]);
const ZWJ_CP = 0x200D;

function applyOneSkinTone(codePoints: number[], modifier: number | null): string {
  const stripped = codePoints.filter(cp => !SKIN_MODIFIER_SET.has(cp));
  if (modifier === null) return String.fromCodePoint(...stripped);
  return String.fromCodePoint(stripped[0], modifier, ...stripped.slice(1));
}

function applyDualSkinTone(
  codePoints: number[],
  modifier1: number | null,
  modifier2: number | null,
): string {
  const components: number[][] = [];
  let current: number[] = [];
  for (const cp of codePoints) {
    if (cp === ZWJ_CP) { components.push(current); current = []; }
    else current.push(cp);
  }
  components.push(current);

  const withTones = components.map((comp, i) => {
    const stripped = comp.filter(cp => !SKIN_MODIFIER_SET.has(cp));
    const mod = i === 0 ? modifier1 : modifier2;
    if (mod === null || stripped.length === 0) return stripped;
    return [stripped[0], mod, ...stripped.slice(1)];
  });

  return withTones
    .map(cps => String.fromCodePoint(...cps))
    .join(String.fromCodePoint(ZWJ_CP));
}

function SkinTonePicker({
  entry,
  onVariantChange,
}: {
  entry: CharacterEntry;
  onVariantChange: (char: string) => void;
}) {
  const slots = entry.emoji?.skinToneSlots ?? 0;
  const [tone1, setTone1] = useState<number | null>(null);
  const [tone2, setTone2] = useState<number | null>(null);

  if (slots === 0) return null;

  const handleTone1 = (mod: number | null) => {
    setTone1(mod);
    if (slots === 1) {
      onVariantChange(applyOneSkinTone(entry.codePoints, mod));
    } else {
      onVariantChange(applyDualSkinTone(entry.codePoints, mod, tone2));
    }
  };

  const handleTone2 = (mod: number | null) => {
    setTone2(mod);
    onVariantChange(applyDualSkinTone(entry.codePoints, tone1, mod));
  };

  return (
    <div className="skin-tone-picker">
      <div className="skin-tone-row">
        {slots === 2 && <span className="skin-tone-label">Person 1</span>}
        {SKIN_TONES.map(({ modifier, label, swatch }) => (
          <button
            key={label}
            className={`skin-tone-swatch${tone1 === modifier ? ' skin-tone-swatch--active' : ''}`}
            title={label}
            onClick={() => handleTone1(modifier)}
            aria-pressed={tone1 === modifier}
          >
            {swatch}
          </button>
        ))}
      </div>
      {slots === 2 && (
        <div className="skin-tone-row">
          <span className="skin-tone-label">Person 2</span>
          {SKIN_TONES.map(({ modifier, label, swatch }) => (
            <button
              key={label}
              className={`skin-tone-swatch${tone2 === modifier ? ' skin-tone-swatch--active' : ''}`}
              title={label}
              onClick={() => handleTone2(modifier)}
              aria-pressed={tone2 === modifier}
            >
              {swatch}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const { entry, categoryName, encoding, blockNeighbors, relatedByName, relatedByTag } = useData<SymbolData>();
  const variantBase = presentationBase(entry.codePoints);
  // Start on the character's native presentation, so the hero opens looking like the bare
  // code point does rather than silently retyping it.
  const nativePresentation = variantBase === null ? 'text' : defaultPresentation(variantBase);
  const [presentation, setPresentation] = useState<Presentation>(nativePresentation);
  const [tonedChar, setTonedChar] = useState<string | null>(null);

  // Reset both pickers when navigating to a new symbol
  useEffect(() => {
    setPresentation(nativePresentation);
    setTonedChar(null);
  }, [entry.char, nativePresentation]);

  // Derived rather than stored, so the two pickers can't disagree about what's on screen.
  // A skin-toned sequence is inherently emoji presentation, so a tone wins outright — and
  // 22 characters (👍 ✊ ✋ …) are both variation bases and skin-tone bases, so this is a
  // real case, not a hypothetical. Picking a presentation clears the tone (see below).
  const displayChar =
    tonedChar ??
    (variantBase === null
      ? entry.char
      : presentation === 'text'
        ? textPresentation(variantBase)
        : emojiPresentation(variantBase));

  const unicodeDisplay = entry.codePoints
    .map(cp => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`)
    .join(' ');

  const decimalDisplay = entry.codePoints.join(' ');

  return (
    <div className="app-root symbol-page">
      <header className="app-header">
        <div className="header-inner">
          <a href={withBase('/')} className="header-brand" style={{ textDecoration: 'none' }}>
            <div className="brand-title">Glyph Index</div>
            <div className="brand-sub">Unicode &amp; Alt Code Reference</div>
          </a>
          <div className="header-search">
            <SearchInput />
          </div>
        </div>
      </header>

      <main className="symbol-main">
        <div className="symbol-content">

          {/* Breadcrumb */}
          <nav className="symbol-breadcrumb" aria-label="Breadcrumb">
            <a href={withBase('/')} className="breadcrumb-link">All Glyphs</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <a href={withBase(`/category/${entry.categoryId}`)} className="breadcrumb-link">{categoryName}</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span className="breadcrumb-current">{entry.name || entry.hex}</span>
          </nav>

          {/* Hero: [glyph + details] … [copy button] */}
          <section className="symbol-hero">
            <div className="symbol-hero-details">
              <div className="symbol-hero-glyph-col">
                {/* Keyed on the glyph so React remounts it and the swap animation replays. */}
                <div
                  key={displayChar}
                  className={`symbol-hero-glyph${
                    variantBase !== null && tonedChar === null ? ` char-glyph-${presentation}` : ''
                  }`}
                >
                  {displayChar}
                </div>
                {variantBase !== null && (
                  <PresentationToggle
                    base={variantBase}
                    value={presentation}
                    // Clearing the tone here, plus the key on SkinTonePicker below, keeps its
                    // swatches from claiming a tone that is no longer applied.
                    onChange={(p) => { setPresentation(p); setTonedChar(null); }}
                  />
                )}
              </div>
              <div className="symbol-hero-info">
                <h1 className="symbol-name">{entry.name || entry.hex}</h1>
                {entry.unicodeVersion && (
                  <a
                    className="symbol-version-link"
                    href={withBase(`/unicode/versions/${entry.unicodeVersion}`)}
                  >
                    Introduced in Unicode {entry.unicodeVersion}
                  </a>
                )}
                {entry.tags.length > 0 && (
                  <ul className="symbol-tag-list" aria-label="Tags">
                    {entry.tags.map(t => (
                      <li key={t} className="symbol-tag">{t}</li>
                    ))}
                  </ul>
                )}
                {entry.emoji !== null && entry.emoji.skinToneSlots > 0 && (
                  <SkinTonePicker
                    key={`${entry.char}-${presentation}`}
                    entry={entry}
                    onVariantChange={(char) => setTonedChar(char === entry.char ? null : char)}
                  />
                )}
              </div>
            </div>
            <CopyButton value={displayChar} label={`Copy "${displayChar}"`} />
          </section>

          {/* Encodings — 2 columns on md+ */}
          <section className="symbol-section">
            <h2 className="symbol-section-title">Encodings</h2>
            <div className="encoding-grid">
              <div className="enc-row">
                <span className="enc-label">Unicode</span>
                <code className="enc-value">{unicodeDisplay}</code>
                <CopyButton value={unicodeDisplay} label="Copy" />
              </div>
              <div className="enc-row">
                <span className="enc-label">Decimal</span>
                <code className="enc-value">{decimalDisplay}</code>
                <CopyButton value={decimalDisplay} label="Copy" />
              </div>
              <div className="enc-row">
                <span className="enc-label">UTF-8 bytes</span>
                <code className="enc-value">{encoding.utf8Hex}</code>
                <CopyButton value={encoding.utf8Hex} label="Copy" />
              </div>
              <div className="enc-row">
                <span className="enc-label">HTML numeric</span>
                <code className="enc-value">{encoding.htmlNumeric}</code>
                <CopyButton value={encoding.htmlNumeric} label="Copy" />
              </div>
              {encoding.htmlEntity && (
                <div className="enc-row">
                  <span className="enc-label">HTML entity</span>
                  <code className="enc-value">{encoding.htmlEntity}</code>
                  <CopyButton value={encoding.htmlEntity} label="Copy" />
                </div>
              )}
              <div className="enc-row">
                <span className="enc-label">CSS value</span>
                <code className="enc-value">{encoding.cssValue}</code>
                <CopyButton value={encoding.cssValue} label="Copy" />
              </div>
              <div className="enc-row">
                <span className="enc-label">JS escape</span>
                <code className="enc-value">{encoding.jsEscape}</code>
                <CopyButton value={encoding.jsEscape} label="Copy" />
              </div>
              {entry.altCode !== null && (
                <div className="enc-row">
                  <span className="enc-label">Alt code</span>
                  <code className="enc-value">Alt+{entry.altCode}</code>
                  <CopyButton value={`Alt+${entry.altCode}`} label="Copy" />
                </div>
              )}
              {entry.aliases.map(a => (
                <div key={a} className="enc-row">
                  <span className="enc-label">Shortcode</span>
                  <code className="enc-value">{a}</code>
                  <CopyButton value={a} label="Copy" />
                </div>
              ))}
            </div>
          </section>

          {/* Related characters */}
          {relatedByName.length > 0 && (
            <section className="symbol-section">
              <h2 className="symbol-section-title">Related characters</h2>
              <div className="mini-grid">
                {relatedByName.map((c) => <MiniCard key={codePointsKey(c.codePoints)} entry={c} />)}
              </div>
            </section>
          )}

          {/* Related by tag */}
          {relatedByTag.length > 0 && (
            <section className="symbol-section">
              <h2 className="symbol-section-title">Related by tag</h2>
              <div className="mini-grid">
                {relatedByTag.map((c) => <MiniCard key={codePointsKey(c.codePoints)} entry={c} />)}
              </div>
            </section>
          )}

          {/* Nearby in category */}
          {blockNeighbors.length > 0 && (
            <section className="symbol-section">
              <h2 className="symbol-section-title">
                Nearby in{' '}
                <a href={withBase(`/category/${entry.categoryId}`)} className="section-link">
                  {categoryName}
                </a>
              </h2>
              <div className="mini-grid">
                {blockNeighbors.map((c) => <MiniCard key={codePointsKey(c.codePoints)} entry={c} />)}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
