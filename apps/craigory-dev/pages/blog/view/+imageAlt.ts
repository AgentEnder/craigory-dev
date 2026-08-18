import { slugMap } from '@new-personal-monorepo/blog-posts';
import type { PageContext } from 'vike/types';

/**
 * A post shipping its own card describes that artwork itself; otherwise the
 * generated card is the title set on a themed background, so the title is the
 * honest description of it.
 */
export default (pageContext: PageContext) => {
  const post = slugMap[pageContext.routeParams?.slug];
  return post?.ogImage?.alt ?? post?.title;
};
