import { BlogPost, BlogTag } from '../../../blog-post';
import mdx from './contents.mdx';

export const traderSamsGrogGrotto: BlogPost = {
  mdx,
  publishDate: new Date(2025, 7, 18),
  slug: 'trader-sams-grog-grotto',
  title: 'Trader Sam’s Grog Grotto',
  description: `A short review of our trip to Trader Sam’s Grog Grotto, a tiki bar located in Disney’s Polynesian Village Resort.`,
  tags: ['non-technical', 'tiki', 'review'] as BlogTag[],
};
