import { BlogPost, BlogTag } from '../../blog-post';
import mdx from './contents.mdx';

export const packageManagerReleaseCooldown: BlogPost = {
  mdx,
  publishDate: new Date(2026, 4, 29),
  slug: 'package-manager-release-cooldown',
  title: 'Configuring minimum release age across npm, pnpm, yarn, and bun',
  description: `Setting a minimum release age ("cooldown") on dependencies is a cheap, high-leverage defense against supply-chain attacks. All four major Node.js package managers now support it — each with a different name, a different unit, and a few surprising caveats.`,
  tags: ['technical', 'tooling', 'devops', 'javascript'] as BlogTag[],
};
