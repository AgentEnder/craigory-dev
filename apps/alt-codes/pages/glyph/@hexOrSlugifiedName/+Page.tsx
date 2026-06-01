import { usePageContext } from 'vike-react/usePageContext';
import { useState, useEffect } from 'react';
import {
  parseSymbolSlug,
  toSymbolSlug,
  codePointsKey,
  categoryName,
  type GridEntry,
} from '../../../src/unicode-data';
import { getEncodingInfo } from '../../../src/encoding';
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

/** Fallback name from the slug when the data slice isn't available (e.g. a cold deep
 *  link with no ?v=): "3d000-seal-character-3d000" → "SEAL CHARACTER 3D000". */
function deslugifyName(slug: string): string {
  const dash = slug.indexOf('-');
  if (dash === -1) return '';
  return slug.slice(dash + 1).replace(/-/g, ' ').toUpperCase();
}

export default function Page() {
  const pageContext = usePageContext();
  const slug = (pageContext.routeParams as { hexOrSlugifiedName: string }).hexOrSlugifiedName;

  // Everything below the fold is a pure function of the URL's code points.
  const codePoints = parseSymbolSlug(slug);
  const char = codePoints.map((cp) => String.fromCodePoint(cp)).join('');
  const encoding = getEncodingInfo(codePoints);
  const unicodeDisplay = codePoints
    .map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`)
    .join(' ');
  const decimalDisplay = codePoints.join(' ');

  // Name / version / neighbors come from the version-category slice (?v=&cat=).
  const [entry, setEntry] = useState<GridEntry | null>(null);
  const [neighbors, setNeighbors] = useState<GridEntry[]>([]);
  const [version, setVersion] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>('cjk-scripts');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    const cat = params.get('cat') ?? 'cjk-scripts';
    setVersion(v);
    setCategoryId(cat);
    if (!v) return;

    let cancelled = false;
    const key = codePointsKey(codePoints);
    fetch(withBase(`/generated/versions/${v}/${cat}.json`))
      .then((r) => r.json())
      .then((arr: GridEntry[]) => {
        if (cancelled) return;
        const idx = arr.findIndex((e) => codePointsKey(e.codePoints) === key);
        if (idx < 0) return;
        setEntry(arr[idx]);
        const start = Math.max(0, idx - 8);
        const end = Math.min(arr.length, idx + 9);
        setNeighbors(arr.slice(start, end).filter((e) => codePointsKey(e.codePoints) !== key));
      })
      .catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const name = entry?.name || deslugifyName(slug);
  const displayVersion = entry?.unicodeVersion ?? version;
  const catName = categoryName(categoryId);
  const neighborHref = (e: GridEntry) =>
    withBase(`/glyph/${toSymbolSlug(e)}?v=${version ?? ''}&cat=${categoryId}`);

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
          <nav className="symbol-breadcrumb" aria-label="Breadcrumb">
            <a href={withBase('/')} className="breadcrumb-link">All Glyphs</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <a href={withBase('/unicode/versions')} className="breadcrumb-link">Version history</a>
            {version && (
              <>
                <span className="breadcrumb-sep" aria-hidden="true">›</span>
                <a href={withBase(`/unicode/versions/${version}/${categoryId}`)} className="breadcrumb-link">
                  Unicode {version} · {catName}
                </a>
              </>
            )}
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span className="breadcrumb-current">{name || unicodeDisplay}</span>
          </nav>

          <section className="symbol-hero">
            <div className="symbol-hero-details">
              <div className="symbol-hero-glyph">{char}</div>
              <div className="symbol-hero-info">
                <h1 className="symbol-name">{name || unicodeDisplay}</h1>
                {displayVersion && (
                  <a
                    className="symbol-version-link"
                    href={withBase(`/unicode/versions/${displayVersion}`)}
                  >
                    Introduced in Unicode {displayVersion}
                  </a>
                )}
              </div>
            </div>
            <CopyButton value={char} label={`Copy "${char}"`} />
          </section>

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
            </div>
          </section>

          {neighbors.length > 0 && (
            <section className="symbol-section">
              <h2 className="symbol-section-title">
                Nearby in{' '}
                {version ? (
                  <a href={withBase(`/unicode/versions/${version}/${categoryId}`)} className="section-link">
                    {catName}
                  </a>
                ) : (
                  catName
                )}
              </h2>
              <div className="mini-grid">
                {neighbors.map((e) => (
                  <a
                    key={codePointsKey(e.codePoints)}
                    href={neighborHref(e)}
                    className="char-card"
                    title={e.name || e.hex}
                  >
                    <span className="char-glyph">{e.char}</span>
                    <span className="char-hex">{e.hex}</span>
                    {e.name && <span className="char-name">{e.name}</span>}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
