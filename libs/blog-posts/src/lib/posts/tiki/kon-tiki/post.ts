import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const konTiki: BlogPost = {
  mdx,
  publishDate: new Date(2025, 7, 18),
  slug: 'kon-tiki',
  title: 'Kon Tiki',
  description: `A short review of our trip to Kon Tiki, a tiki bar located in Kansas City.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
