import { useData } from 'vike-react/useData';
import type { VersionsIndexData } from './+data.server';
import { withBase } from '../../../src/utils';
import { SearchInput } from '../../../src/SearchInput';
import '../../../src/style.css';

export default function Page() {
  const { versions, latest } = useData<VersionsIndexData>();
  const totalGlyphs = versions.reduce((sum, v) => sum + v.total, 0);

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
          <div className="header-count">{versions.length} versions</div>
        </div>
      </header>

      <div className="category-bar">
        <div className="category-inner no-scrollbar" style={{ padding: '4px 0', flexDirection: 'column', gap: '4px' }}>
          <nav className="symbol-breadcrumb" aria-label="Breadcrumb">
            <a href={withBase('/')} className="breadcrumb-link">All Glyphs</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span className="breadcrumb-current">Version history</span>
          </nav>
          <h1 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 700 }}>
            Unicode version history
          </h1>
        </div>
      </div>

      <main className="app-main" style={{ overflow: 'auto', padding: '16px' }}>
        <p style={{ margin: '0 0 16px', color: 'var(--color-text-dim)', fontSize: '13px' }}>
          {totalGlyphs.toLocaleString()} glyphs in this index, grouped by the Unicode version
          that introduced them — newest first. Unicode {latest} is the current working draft.
        </p>
        <div className="version-list">
          {versions.map((v) => (
            <a
              key={v.version}
              href={withBase(`/unicode/versions/${v.version}`)}
              className="version-row"
            >
              <span className="version-row-num">Unicode {v.version}</span>
              <span className="version-row-cats">
                {v.categories.slice(0, 4).map((c) => `${c.name} ${c.count.toLocaleString()}`).join(' · ')}
                {v.categories.length > 4 ? ' · …' : ''}
              </span>
              <span className="version-row-count">{v.total.toLocaleString()}</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
