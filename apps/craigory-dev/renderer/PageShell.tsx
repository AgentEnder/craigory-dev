import React from 'react';
import './PageShell.scss';
import { Link } from './Link';
import { Toaster } from '../src/shared-components/toaster';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
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
          <Link className="navitem" href={`/blog/1`}>
            Blog
          </Link>
        </Sidebar>
        <Content>{children}</Content>
      </Layout>
      <Toaster></Toaster>
    </React.StrictMode>
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
