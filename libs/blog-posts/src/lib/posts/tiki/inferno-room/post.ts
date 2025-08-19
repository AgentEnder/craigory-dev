import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const infernoRoom: BlogPost = {
  mdx,
  publishDate: new Date(2025, 7, 18),
  slug: 'inferno-room',
  title: 'The Inferno Room',
  description: `A short review of our trip to the Inferno Room, a tiki bar near downtown Indianapolis.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
