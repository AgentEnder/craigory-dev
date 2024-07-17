import React from 'react';
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
          <Link className="navitem" href="/projects">
            Projects
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
  return <div className="layout">{children}</div>;
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return <div className="sidebar">{children}</div>;
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="content">{children}</div>;
}
