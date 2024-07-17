import { pages } from '@new-personal-monorepo/blog-posts';

export async function onBeforePrerenderStart() {
  return Object.values(pages).map((_, idx) => `/blog/${idx + 1}`);
}
