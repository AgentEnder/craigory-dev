import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const tikiTikiBangBang: BlogPost = {
  mdx,
  publishDate: new Date(2026, 6, 13),
  slug: 'tiki-tiki-bang-bang',
  title: 'Tiki Tiki Bang Bang',
  description: `A short review of our trip to Tiki Tiki Bang Bang, a tiki bar located in Cincinnati, OH.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
