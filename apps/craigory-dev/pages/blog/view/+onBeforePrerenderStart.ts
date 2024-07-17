import { blogPosts } from '@new-personal-monorepo/blog-posts';
import { formatDateString } from '@new-personal-monorepo/date-utils';

export async function onBeforePrerenderStart() {
  const routes = Object.values(blogPosts.flat()).map(
    (post) => `/blog/${formatDateString(post.publishDate)}/${post.slug}`
  );
  return routes;
}
