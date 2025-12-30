import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const sunkenHarborClub: BlogPost = {
  mdx,
  publishDate: new Date(2025, 11, 30),
  slug: 'sunken-harbor-club',
  title: 'Sunken Harbor Club',
  description: `A short review of our trip to Sunken Harbor Club, a tiki bar located in Brooklyn, NY.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
