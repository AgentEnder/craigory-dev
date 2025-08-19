import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const pineappleParlor: BlogPost = {
  mdx,
  publishDate: new Date(2025, 7, 18),
  slug: 'pineapple-parlor',
  title: 'Pineapple Parlor',
  description: `A short review of our trip to the Pineapple Parlor, a hidden tiki gem in Galveston.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
