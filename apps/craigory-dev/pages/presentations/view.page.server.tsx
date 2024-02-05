import { PRESENTATIONS } from '@new-personal-monorepo/presentations';
import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';

import { MinimumPageShell } from '../../renderer/MinimumPageShell';

import type { PageContextServer } from '@new-personal-monorepo/vike-utils';
// See https://vike.dev/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'routeParams'];

export async function prerender() {
  return Object.values(PRESENTATIONS).filter((pg) => pg.mdUrl).map(
    (pg) => `/presentations/view/${pg.slug}`
  );
}

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  // This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
  if (!Page)
    throw new Error('My render() hook expects pageContext.Page to be defined');
  const pageHtml = ReactDOMServer.renderToString(
    <MinimumPageShell pageContext={pageContext}>
      <Page {...pageProps}></Page>
    </MinimumPageShell>
  );

  // See https://vike.dev/head
  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || 'Craigory Coppola';
  const desc =
    (documentProps && documentProps.description) ||
    'App using Vite + vike';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/obsidian.min.css">
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    },
  };
}
