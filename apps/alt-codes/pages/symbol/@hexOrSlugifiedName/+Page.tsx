import { useData } from 'vike-react/useData';
import { useState } from 'react';
import type { SymbolData } from './+data.server';
import type { CharacterEntry } from '../../../src/unicode-data';
import { toSymbolSlug, codePointsKey } from '../../../src/unicode-data';
import { withBase } from '../../../src/utils';
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
      title={entry.name || entry.hex}
    >
      <span className="char-glyph">{entry.char}</span>
      <span className="char-hex">{entry.hex}</span>
      {entry.name && <span className="char-name">{entry.name}</span>}
    </a>
  );
}

export default function Page() {
  const { entry, categoryName, encoding, blockNeighbors, relatedByName } = useData<SymbolData>();

  return (
    <div className="app-root symbol-page">
      <header className="app-header">
        <div className="header-inner">
          <a href={withBase('/')} className="header-brand" style={{ textDecoration: 'none' }}>
            <div className="brand-title">Glyph Index</div>
            <div className="brand-sub">Unicode &amp; Alt Code Reference</div>
          </a>
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

          {/* Hero: glyph beside name + aliases + copy */}
          <section className="symbol-hero">
            <div className="symbol-hero-glyph">{entry.char}</div>
            <div className="symbol-hero-info">
              <h1 className="symbol-name">{entry.name || entry.hex}</h1>
              {entry.aliases.length > 0 && (
                <ul className="symbol-alias-list" aria-label="Also known as">
                  {entry.aliases.map(a => (
                    <li key={a} className="symbol-alias-tag">{a}</li>
                  ))}
                </ul>
              )}
              <CopyButton value={entry.char} label={`Copy "${entry.char}"`} />
            </div>
          </section>

          {/* Encodings — 2 columns on md+ */}
          <section className="symbol-section">
            <h2 className="symbol-section-title">Encodings</h2>
            <div className="encoding-grid">
              <div className="enc-row">
                <span className="enc-label">Unicode</span>
                <code className="enc-value">{entry.hex}</code>
                <CopyButton value={entry.hex} label="Copy" />
              </div>
              <div className="enc-row">
                <span className="enc-label">Decimal</span>
                <code className="enc-value">{entry.decimal}</code>
                <CopyButton value={String(entry.decimal)} label="Copy" />
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
