import { githubPagesPreviewEnv } from './github-pages-preview-env/post';
import { nxConfigurationHistory } from './nx-configuration-history/post';

function partition<T extends unknown[]>(arr: T, size: number): T[] {
  const result: T[] = [];
  const inProgress = [...arr];
  while (inProgress.length) {
    result.push(inProgress.splice(0, Math.min(size, inProgress.length)) as T);
  }
  return result;
}

export const blogPosts = [nxConfigurationHistory, githubPagesPreviewEnv]
  //   .filter((p) => p.publishDate.getTime() < Date.now())
  .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

export const slugMap = Object.fromEntries(blogPosts.map((p) => [p.slug, p]));

export const pages = partition(blogPosts, 10);
