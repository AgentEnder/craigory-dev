import { githubPagesPreviewEnv } from './github-pages-preview-env/post';
import { githubUnlistedRepos } from './github-unlisted-repos/post';
import { multifunctionExampleFiles } from './multifunctional-example-files/post';
import { nxConfigurationHistory } from './nx-configuration-history/post';
import { superpoweredGitAliases } from './superpowered-git-aliases/post';
import { pineappleParlor } from './tiki/pineapple-parlor/post';
import { infernoRoom } from './tiki/inferno-room/post';
import { traderSamsGrogGrotto } from './tiki/trader-sams-grog-grotto/post';
import { tikiChick } from './tiki/tiki-chick/post';
import { kaonaRoom } from './tiki/kaona-room/post';
import { rumBarrelWest } from './tiki/rum-barrel/post';
import { konTiki } from './tiki/kon-tiki/post';
import { sunkenHarborClub } from './tiki/sunken-harbor-club/post';
import { paradiseLost } from './tiki/paradise-lost/post';

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
  multifunctionExampleFiles,
  githubUnlistedRepos,
  pineappleParlor,
  infernoRoom,
  traderSamsGrogGrotto,
  tikiChick,
  kaonaRoom,
  rumBarrelWest,
  konTiki,
  paradiseLost,
  sunkenHarborClub,
];

export const blogPosts = ALL_BLOG_POSTS.filter(
  (p) => import.meta.env.DEV || p.publishDate.getTime() < Date.now()
).sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

export const slugMap = Object.fromEntries(
  ALL_BLOG_POSTS.map((p) => [p.slug, p])
);

export const pages = partition(blogPosts, 10);
