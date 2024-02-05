import React from 'react';
import { PageContextProvider } from '@new-personal-monorepo/vike-utils';
import { PageContext } from '@new-personal-monorepo/vike-utils';
import './PageShell.scss';
import { Link } from './Link';
import { MinimumPageShell } from './MinimumPageShell';
import { pageCount } from '../pages/blog/config';

export function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <MinimumPageShell pageContext={pageContext}>
      <Layout>
        <Sidebar>
          <Link className="navitem" href="/">
            Home
          </Link>
          <Link className="navitem" href="/presentations">
            Speaking + Presentations
          </Link>
          <Link className="navitem" href={`/blog/${pageCount}`}>
            Blog
          </Link>
        </Sidebar>
        <Content>{children}</Content>
      </Layout>
    </MinimumPageShell>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      {children}
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.8em',
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        paddingBottom: 50,
        borderLeft: '2px solid #eee',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}
