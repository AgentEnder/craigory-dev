import type { PageContext } from 'vike/types';
import { resolveSetting } from './settings';

/**
 * Alt text for the social card. The generated card is the page's title set on a
 * themed background, so the title describes it accurately. Pages whose card is
 * something else — a deck's first slide, a post's own artwork — override this.
 *
 * Lives in its own file rather than inline in `+config.ts` because vike
 * serializes config values and cannot carry a function through: see
 * https://vike.dev/error/runtime-in-config
 */
export default (pageContext: PageContext) =>
  resolveSetting(pageContext.config.title, pageContext);
