import { useData } from 'vike-react/useData';
import { useEffect, useState } from 'react';
import type { VersionCategoryData } from './+data.server';
import { SymbolGrid } from '../../../../../src/SymbolGrid';
import { toSymbolSlug, type GridEntry } from '../../../../../src/unicode-data';
import { withBase } from '../../../../../src/utils';
import { SearchInput } from '../../../../../src/SearchInput';
import '../../../../../src/style.css';

export default function Page() {
  const { version, categoryId, name, count } = useData<VersionCategoryData>();
  const [entries, setEntries] = useState<GridEntry[] | null>(null);

  // The slice is fetched client-side (see +data.server.ts) so the prerendered HTML
  // stays small even when this leaf holds 11k+ glyphs.
  useEffect(() => {
    let cancelled = false;
    fetch(withBase(`/generated/versions/${version}/${categoryId}.json`))
      .then((r) => r.json())
      .then((data: GridEntry[]) => { if (!cancelled) setEntries(data); })
      .catch(() => { if (!cancelled) setEntries([]); });
    return () => { cancelled = true; };
  }, [version, categoryId]);

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <a href={withBase('/')} className="header-brand" style={{ textDecoration: 'none' }}>
            <div className="brand-title">Glyph Index</div>
            <div className="brand-sub">Unicode &amp; Alt Code Reference</div>
          </a>
          <div className="header-search">
            <SearchInput />
          </div>
          <div className="header-count">{count.toLocaleString()} glyphs</div>
        </div>
      </header>

      <div className="category-bar">
        <div className="category-inner no-scrollbar" style={{ padding: '4px 0', flexDirection: 'column', gap: '4px' }}>
          <nav className="symbol-breadcrumb" aria-label="Breadcrumb">
            <a href={withBase('/')} className="breadcrumb-link">All Glyphs</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <a href={withBase('/unicode/versions')} className="breadcrumb-link">Version history</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <a href={withBase(`/unicode/versions/${version}`)} className="breadcrumb-link">Unicode {version}</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span className="breadcrumb-current">{name}</span>
          </nav>
          <h1 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 700 }}>
            {name} added in Unicode {version}
          </h1>
        </div>
      </div>

      <main className="app-main">
        {entries === null ? (
          <div className="empty-state"><p className="empty-title">Loading {count.toLocaleString()} glyphs…</p></div>
        ) : (
          <SymbolGrid
            characters={entries}
            // CJK & Scripts glyphs aren't prerendered — link to the client-only /glyph
            // viewer (with the slice coordinates) instead of the absent /symbol page.
            hrefFor={
              categoryId === 'cjk-scripts'
                ? (e) => withBase(`/glyph/${toSymbolSlug(e)}?v=${version}&cat=${categoryId}`)
                : undefined
            }
          />
        )}
      </main>
    </div>
  );
}
