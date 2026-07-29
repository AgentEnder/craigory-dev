import React from 'react';
import './PageShell.scss';
import { Link } from './Link';
import { Toaster } from '../src/shared-components/toaster';
import { MobileNav } from './MobileNav';
import {
  SpotlightProvider,
  SpotlightTrigger,
} from '../src/shared-components/spotlight-search';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      {/* Wraps both layouts so the mobile drawer's trigger shares the dialog
          and the cmd+k handler with the desktop sidebar's. */}
      <SpotlightProvider>
        {/* Desktop layout */}
        <Layout>
          <Sidebar>
            {/* Nav text repeats on every page; indexing it makes "Blog" and
              "Projects" match the whole site. */}
            <div className="sidebar-nav" data-pagefind-ignore>
              <SpotlightTrigger />
              <Link className="navitem" href="/">
                Home
              </Link>
              <Link className="navitem" href="/projects">
                Projects
              </Link>
              <Link className="navitem" href="/tools">
                Tools
              </Link>
              <Link className="navitem" href="/presentations">
                Speaking + Presentations
              </Link>
              <Link className="navitem" href={`/blog/1`}>
                Blog
              </Link>
            </div>
            <div className="sidebar-footer" data-pagefind-ignore>
              <Link className="footer-link" href="/privacy">
                Privacy Policy
              </Link>
            </div>
          </Sidebar>
          <Content>{children}</Content>
        </Layout>

        {/*
        Mobile layout. This renders the SAME `children` a second time — the two
        layouts are swapped by media query, not by branching — so it is marked
        ignored for Pagefind. Without it every page's body is indexed twice and
        every excerpt comes back duplicated.
      */}
        <MobileNav>{children}</MobileNav>

        <Toaster />
      </SpotlightProvider>
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
