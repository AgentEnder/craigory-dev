import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const paradiseLost: BlogPost = {
  mdx,
  publishDate: new Date(2025, 11, 30),
  slug: 'paradise-lost',
  title: 'Paradise Lost',
  description: `A short review of our trip to Paradise Lost, a tiki bar located in the East Village, NYC.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
