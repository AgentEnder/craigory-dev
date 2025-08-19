import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const kaonaRoom: BlogPost = {
  mdx,
  publishDate: new Date(2025, 7, 18),
  slug: 'kaona-room',
  title: 'Kaona Room',
  description: `A truly puzzling visit that leads to a non-review, but a good time nonetheless.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
