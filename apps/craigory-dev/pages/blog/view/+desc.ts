import { slugMap } from '@new-personal-monorepo/blog-posts';
import { PageContext } from 'vike/types';

export default (pageContext: PageContext) => {
  const blogPost = slugMap[pageContext.routeParams?.slug];

  console.log('Returning', blogPost.description);

  return blogPost.description;
};
