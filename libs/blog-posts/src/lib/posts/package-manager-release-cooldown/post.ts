import { BlogPost, BlogTag } from '../../blog-post';
import mdx from './contents.mdx';

export const packageManagerReleaseCooldown: BlogPost = {
  mdx,
  publishDate: new Date(2026, 4, 29),
  slug: 'package-manager-release-cooldown',
  title: 'Configuring minimum release age across npm, pnpm, yarn, and bun',
  description: `A one-day cooldown on new dependency versions catches most of what supply-chain attackers ship, and every major Node.js package manager now supports it — but each chose its own name for the setting, its own unit of time, and its own set of ways the gate can quietly do nothing.`,
  tags: ['technical', 'tooling', 'devops', 'javascript'] as BlogTag[],
};
