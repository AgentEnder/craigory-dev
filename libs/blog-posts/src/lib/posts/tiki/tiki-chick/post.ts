import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const tikiChick: BlogPost = {
  mdx,
  publishDate: new Date(2025, 7, 18),
  slug: 'tiki-chick',
  title: 'Tiki Chick',
  description: `Tiki Chick was the first tiki bar I really went to, and the laid back environment made an excellent environment to catch up with colleagues that I seldom see in person.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
