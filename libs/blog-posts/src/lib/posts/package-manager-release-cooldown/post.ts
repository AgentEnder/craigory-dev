import { BlogPost, BlogTag } from '../../blog-post';
import mdx from './contents.mdx';

export const packageManagerReleaseCooldown: BlogPost = {
  mdx,
  publishDate: new Date(2026, 4, 29),
  slug: 'package-manager-release-cooldown',
  title: 'Locking down dependency installs across npm, pnpm, yarn, and bun',
  description: `A reference for configuring a minimum release age (or "cooldown") in npm, pnpm, Yarn, and Bun. Covers the setting name, unit, and minimum supported version for each tool, the per-project and user-wide forms, and the configurations under which the cooldown is silently bypassed — plus the complementary lockdown settings: disabling or allow-listing install-time lifecycle scripts, and pnpm's provenance trust policy.`,
  tags: ['technical', 'tooling', 'devops', 'javascript'] as BlogTag[],
};
