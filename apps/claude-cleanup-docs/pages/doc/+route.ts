import type { PageContext } from 'vike/types';

import { DOC_SLUGS } from '../../src/docs-index';

// Match any known multi-segment doc slug (e.g. /cli/monitor/start). Using a
// function route lets us bind the entire remainder into routeParams.slug,
// which Vike's static string routes can't do.
export default function match(pageContext: PageContext) {
  const url = pageContext.urlPathname.replace(/^\/+|\/+$/g, '');
  if (!url || !DOC_SLUGS.has(url)) return false;
  return { routeParams: { slug: url } };
}
