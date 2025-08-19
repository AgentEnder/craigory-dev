import { BlogPost, BlogTag } from '../../blog-post';
import mdx from './contents.mdx';

export const superpoweredGitAliases: BlogPost = {
  mdx,
  publishDate: new Date(2024, 6, 30),
  slug: 'superpowered-git-aliases',
  title: 'Superpowered Git Aliases with Scripting',
  description: `Git aliases are a powerful tool for improving your workflow. In this post, I'll show you how to take them to the next level by using scripting to create aliases that contain control flow and more.`,
  tags: ['technical', 'git', 'tooling', 'tutorial'] as BlogTag[]
};
