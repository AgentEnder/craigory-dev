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

          {/*
            Mobile chrome — a fixed header and drawer, so it takes no part in
            the flex row and is hidden by media query above 900px.
          */}
          <MobileNav />

          {/*
            Rendered ONCE, for both layouts. This used to appear twice, inside
            the desktop `.layout` and again inside `MobileNav`, swapped by media
            query — which put every `id` in the page into the document twice.
            `getElementById` and `:target` both take the FIRST match, so an
            anchor like /presentations#kcdc-2025-monorepo-nx could resolve to
            the copy that was `display: none`. The presentations index relies on
            exactly that lookup to mark a card active.

            It also means the body is no longer indexed twice by Pagefind, which
            is what the `data-pagefind-ignore` on the mobile container was for.
          */}
          <Content>{children}</Content>
        </Layout>

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
