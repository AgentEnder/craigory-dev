import type { ReactNode } from 'react';
import { usePageContext } from 'vike-react/usePageContext';

import { DOC_INDEX } from '../src/docs-index';
import '../src/styles.css';

export default function Layout({ children }: { children: ReactNode }) {
  const pageContext = usePageContext();
  const currentPath = pageContext.urlPathname.replace(/\/$/, '') || '/';

  const sections = new Map<string, typeof DOC_INDEX>();
  for (const entry of DOC_INDEX) {
    if (!sections.has(entry.section)) sections.set(entry.section, []);
    sections.get(entry.section)!.push(entry);
  }

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        <a className="docs-brand" href="/">
          claude-cleanup
        </a>
        <nav>
          {Array.from(sections.entries()).map(([section, entries]) => (
            <div key={section} className="docs-nav-section">
              <h3 className="docs-nav-heading">{section}</h3>
              <ul>
                {entries.map((entry) => {
                  const href = entry.path === '/' ? '/' : entry.path;
                  const normalized = href.replace(/\/$/, '') || '/';
                  const active = normalized === currentPath;
                  return (
                    <li key={entry.slug}>
                      <a
                        href={href}
                        className={active ? 'docs-nav-link docs-nav-link--active' : 'docs-nav-link'}
                      >
                        {entry.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <footer className="docs-sidebar-footer">
          <a
            href="https://github.com/AgentEnder/craigory-dev/tree/main/packages/claude-cleanup"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.npmjs.com/package/claude-cleanup"
            target="_blank"
            rel="noreferrer"
          >
            npm ↗
          </a>
        </footer>
      </aside>
      <main className="docs-main">{children}</main>
    </div>
  );
}
