import { blogPosts } from '@new-personal-monorepo/blog-posts';
import { formatDateString } from '@new-personal-monorepo/date-utils';
export { render } from '../../renderer/_default.page.server';

export async function prerender() {
  const routes = Object.values(blogPosts.flat()).map(
    (post) => `/blog/${formatDateString(post.publishDate)}/${post.slug}`
  );
  return routes;
}
