import type { PageContext } from 'vike/types';
import { absoluteSiteUrl } from './site-url';
import { cardPath } from './card-path';

/**
 * Every page gets the card that `tools/open-graph` wrote beside it. Pages that
 * carry their own artwork — a blog post with an `ogImage` — override this with
 * their own `+image.ts`.
 */
export default (pageContext: PageContext) =>
  absoluteSiteUrl(cardPath(pageContext.urlOriginal));
