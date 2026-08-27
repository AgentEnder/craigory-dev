import type { PageContext } from 'vike/types';

/**
 * Titled from the query string rather than a `document.title` effect, so the
 * server-rendered HTML carries the right title on first paint.
 */
export default function title(pageContext: PageContext): string {
  const query = (pageContext.urlParsed.search.q ?? '').trim();
  return query ? `${query} · JustListen` : 'Search · JustListen';
}
