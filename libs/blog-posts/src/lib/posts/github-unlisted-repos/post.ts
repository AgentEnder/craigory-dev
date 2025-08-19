import { BlogPost, BlogTag } from '../../blog-post';
import mdx from './contents.mdx';

export const githubUnlistedRepos: BlogPost = {
  mdx,
  publishDate: new Date(2024, 8, 11),
  slug: 'gh-unlisted-repos',
  title: 'Unlisted GitHub Repositories',
  description: `There are times where you may want to have a publicly accessible repository on GitHub, but you don't want it to show up on your profile. Many video hosting services like YouTube have support for this, but GitHub does not. This post explores an alternative strategy.`,
  tags: ['technical', 'github', 'tutorial'] as BlogTag[],
};
