import { PRESENTATIONS } from '@new-personal-monorepo/presentations';
import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';

import { MinimumPageShell } from '../../../renderer/MinimumPageShell';

import type { PageContextServer } from '@new-personal-monorepo/vike-utils';

export async function onRenderHtml(pageContext: PageContextServer) {
  const { Page, config } = pageContext;
  // This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
  if (!Page)
    throw new Error('My render() hook expects pageContext.Page to be defined');
  const pageHtml = ReactDOMServer.renderToString(
    <MinimumPageShell pageContext={pageContext}>
      <Page title={(config as any).title}></Page>
    </MinimumPageShell>
  );

  // See https://vike.dev/head
  const title = (pageContext.config as any).title || 'Craigory Coppola';
  const desc = (pageContext.config as any).desc || 'App using Vite + vike';

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
