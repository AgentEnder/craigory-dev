import { slugMap } from '@new-personal-monorepo/blog-posts';
import type { PageContext } from 'vike/types';

export default (pageContext: PageContext) => {
  const blogPost = slugMap[pageContext.routeParams?.slug];
  return blogPost.description;
};
