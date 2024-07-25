import { BlogPost } from '../../blog-post';
import mdx from './contents.mdx';

export const githubPagesPreviewEnv: BlogPost = {
  mdx,
  publishDate: new Date(2024, 6, 23),
  slug: 'gh-pages-preview-env',
  title: 'Setting up a GitHub Pages Preview Environment',
  description: `Many services such as Vercel and Netlify offer preview environments for pull requests, but GitHub Pages does not. This post will walk you through how to set up a GitHub Pages preview environment for your pull requests.`,
};
