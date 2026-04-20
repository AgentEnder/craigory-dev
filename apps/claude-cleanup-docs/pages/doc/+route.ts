import type { PageContext } from 'vike/types';

// Matches any non-root URL — the +data.server loader decides whether the
// slug is actually a known page (and throws a 404 if not). We can't import
// the slug list from docs.server.ts here because +route runs in both
// server and client bundles; a static pattern keeps the client payload
// tiny and avoids pulling the unified pipeline into the browser.
export default function match(pageContext: PageContext) {
  const url = pageContext.urlPathname.replace(/^\/+|\/+$/g, '');
  if (!url) return false;
  return { routeParams: { slug: url } };
}
