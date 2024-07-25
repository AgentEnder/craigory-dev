import { githubPagesPreviewEnv } from './github-pages-preview-env/post';
import { nxConfigurationHistory } from './nx-configuration-history/post';
import { superpoweredGitAliases } from './superpowered-git-aliases/post';

function partition<T extends unknown[]>(arr: T, size: number): T[] {
  const result: T[] = [];
  const inProgress = [...arr];
  while (inProgress.length) {
    result.push(inProgress.splice(0, Math.min(size, inProgress.length)) as T);
  }
  return result;
}

const ALL_BLOG_POSTS = [
  nxConfigurationHistory,
  githubPagesPreviewEnv,
  superpoweredGitAliases,
];

export const blogPosts = ALL_BLOG_POSTS.filter(
  (p) => import.meta.env.DEV || p.publishDate.getTime() < Date.now()
).sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

export const slugMap = Object.fromEntries(
  ALL_BLOG_POSTS.map((p) => [p.slug, p])
);

export const pages = partition(blogPosts, 10);
