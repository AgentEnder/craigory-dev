import React from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import '../../renderer/PageShell.scss';
import './legal.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const pathname = pageContext.urlPathname;

  return (
    <React.StrictMode>
      <div className="legal-container">
        <div className="legal-card">
          {children}

          <nav className="legal-nav" aria-label="Legal pages">
            <a
              href="/privacy"
              aria-current={pathname === '/privacy' ? 'page' : undefined}
            >
              Privacy Policy
            </a>
            <a
              href="/data-deletion"
              aria-current={
                pathname === '/data-deletion' ? 'page' : undefined
              }
            >
              Data Deletion
            </a>
          </nav>

          <div className="legal-footer">
            <a href="/" className="back-link">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Return to craigory.dev
            </a>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}
