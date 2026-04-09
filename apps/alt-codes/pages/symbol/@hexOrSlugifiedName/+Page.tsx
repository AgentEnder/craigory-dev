import { useData } from 'vike-react/useData';
import { useState } from 'react';
import type { SymbolData } from './+data.server';
import type { CharacterEntry } from '../../../src/unicode-data';
import { toSymbolSlug } from '../../../src/unicode-data';
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
  const { entry, encoding, blockNeighbors, relatedByName } = useData<SymbolData>();

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
        {/* Hero glyph */}
        <section className="symbol-hero">
          <div className="symbol-hero-glyph">{entry.char}</div>
          <div className="symbol-hero-info">
            <h1 className="symbol-name">{entry.name || entry.hex}</h1>
            {entry.aliases.length > 0 && (
              <div className="symbol-aliases">
                {entry.aliases.join(' · ')}
              </div>
            )}
            <CopyButton value={entry.char} label={`Copy "${entry.char}"`} />
          </div>
        </section>

        {/* Technical details table */}
        <section className="symbol-section">
          <h2 className="symbol-section-title">Encodings</h2>
          <table className="encoding-table">
            <tbody>
              <tr>
                <td className="enc-label">Unicode</td>
                <td className="enc-value"><code>{entry.hex}</code></td>
                <td><CopyButton value={entry.hex} label="Copy" /></td>
              </tr>
              <tr>
                <td className="enc-label">Decimal</td>
                <td className="enc-value"><code>{entry.decimal}</code></td>
                <td><CopyButton value={String(entry.decimal)} label="Copy" /></td>
              </tr>
              <tr>
                <td className="enc-label">UTF-8 bytes</td>
                <td className="enc-value"><code>{encoding.utf8Hex}</code></td>
                <td><CopyButton value={encoding.utf8Hex} label="Copy" /></td>
              </tr>
              {encoding.htmlEntity && (
                <tr>
                  <td className="enc-label">HTML entity</td>
                  <td className="enc-value"><code>{encoding.htmlEntity}</code></td>
                  <td><CopyButton value={encoding.htmlEntity} label="Copy" /></td>
                </tr>
              )}
              <tr>
                <td className="enc-label">HTML numeric</td>
                <td className="enc-value"><code>{encoding.htmlNumeric}</code></td>
                <td><CopyButton value={encoding.htmlNumeric} label="Copy" /></td>
              </tr>
              <tr>
                <td className="enc-label">CSS value</td>
                <td className="enc-value"><code>{encoding.cssValue}</code></td>
                <td><CopyButton value={encoding.cssValue} label="Copy" /></td>
              </tr>
              <tr>
                <td className="enc-label">JS escape</td>
                <td className="enc-value"><code>{encoding.jsEscape}</code></td>
                <td><CopyButton value={encoding.jsEscape} label="Copy" /></td>
              </tr>
              {entry.altCode !== null && (
                <tr>
                  <td className="enc-label">Alt code</td>
                  <td className="enc-value"><code>Alt+{entry.altCode}</code></td>
                  <td><CopyButton value={`Alt+${entry.altCode}`} label="Copy" /></td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Block neighbors */}
        {blockNeighbors.length > 0 && (
          <section className="symbol-section">
            <h2 className="symbol-section-title">
              Nearby in <a href={withBase(`/category/${entry.categoryId}`)} className="section-link">{entry.categoryId}</a>
            </h2>
            <div className="mini-grid">
              {blockNeighbors.map((c) => <MiniCard key={c.codePoint} entry={c} />)}
            </div>
          </section>
        )}

        {/* Related by name */}
        {relatedByName.length > 0 && (
          <section className="symbol-section">
            <h2 className="symbol-section-title">Related characters</h2>
            <div className="mini-grid">
              {relatedByName.map((c) => <MiniCard key={c.codePoint} entry={c} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
