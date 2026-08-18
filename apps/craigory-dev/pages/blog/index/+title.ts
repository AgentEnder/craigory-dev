import type { PageContext } from 'vike/types';

/**
 * Paginated, so the title has to name which page it is. Without it every page
 * of the index shares one title, which reads as duplicate content to a search
 * engine. The social card is deliberately shared even so — see `+image.ts`.
 */
export default (pageContext: PageContext) => {
  const pageNumber = Number(pageContext.routeParams?.pageNumber ?? '1');
  return pageNumber > 1 ? `Blog, page ${pageNumber}` : 'Blog';
};
