import { BlogPost, BlogTag } from '../../blog-post';
import mdx from './contents.mdx';

export const bsCvesAndMaintainerBurnout: BlogPost = {
  mdx,
  publishDate: new Date(2026, 8, 15),
  slug: 'bs-cves-and-maintainer-burnout',
  title: 'BS CVEs and Maintainer Burnout',
  description: `An advisory scored for someone else's threat model fails your build, and the only party who can say whether it matters is a maintainer with an afternoon to spend. Worked examples from Nx where the answer was no, the three ways of saying so that accomplish nothing, and why curl ended a seven-year bug bounty in January 2026.`,
  tags: ['technical', 'tooling', 'devops', 'nx'] as BlogTag[],
};
