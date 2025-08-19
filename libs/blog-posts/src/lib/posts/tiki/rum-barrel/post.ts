import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const rumBarrelWest: BlogPost = {
  mdx,
  publishDate: new Date(2025, 7, 18),
  slug: 'rum-barrel-west',
  title: 'Rum Barrel West',
  description: `A short review of our trip to Rum Barrel West, a rum bar located in Amsterdam.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
