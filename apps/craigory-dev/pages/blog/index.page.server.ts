import { pages } from '@new-personal-monorepo/blog-posts';
export { render } from '../../renderer/_default.page.server';

export async function prerender() {
  return Object.values(pages).map((_, idx) => `/blog/${idx + 1}`);
}
