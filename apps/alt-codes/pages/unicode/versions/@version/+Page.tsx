import { useData } from 'vike-react/useData';
import type { VersionData } from './+data.server';
import { withBase } from '../../../../src/utils';
import { SearchInput } from '../../../../src/SearchInput';
import '../../../../src/style.css';

export default function Page() {
  const { version, total, categories } = useData<VersionData>();

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
          <div className="header-count">{total.toLocaleString()} glyphs</div>
        </div>
      </header>

      <div className="category-bar">
        <div className="category-inner no-scrollbar" style={{ padding: '4px 0', flexDirection: 'column', gap: '4px' }}>
          <nav className="symbol-breadcrumb" aria-label="Breadcrumb">
            <a href={withBase('/')} className="breadcrumb-link">All Glyphs</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <a href={withBase('/unicode/versions')} className="breadcrumb-link">Version history</a>
            <span className="breadcrumb-sep" aria-hidden="true">›</span>
            <span className="breadcrumb-current">Unicode {version}</span>
          </nav>
          <h1 style={{ margin: 0, fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 700 }}>
            Added in Unicode {version}
          </h1>
        </div>
      </div>

      <main className="app-main" style={{ overflow: 'auto', padding: '16px' }}>
        <p style={{ margin: '0 0 16px', color: 'var(--color-text-dim)', fontSize: '13px' }}>
          {total.toLocaleString()} glyph{total === 1 ? '' : 's'} introduced in this version,
          across {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}. Pick one to browse.
        </p>
        <div className="version-list">
          {categories.map((c) => (
            <a
              key={c.id}
              href={withBase(`/unicode/versions/${version}/${c.id}`)}
              className="version-row"
            >
              <span className="version-row-num">{c.name}</span>
              <span className="version-row-count">{c.count.toLocaleString()}</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
