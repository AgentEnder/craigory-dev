import { differenceInDays } from 'date-fns';
import { RepoData } from '../types';

export type SortFactory = (
  projects: RepoData[]
) => (a: RepoData, b: RepoData) => number;

function totalDownloads(p: RepoData): number {
  return Object.values(p.publishedPackages ?? {}).reduce(
    (acc, { downloads }) => acc + downloads,
    0
  );
}

function lastCommitTime(p: RepoData): number {
  const raw = p.lastCommit;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export const sortByRelevance: SortFactory = (projects) => {
  const relevance = new Map<string, number>();
  for (const p of projects) {
    const stars = p.stars ?? 0;
    const downloads = totalDownloads(p);
    const daysSinceCommit = p.lastCommit
      ? Math.max(differenceInDays(new Date(), new Date(p.lastCommit)), 1)
      : Number.POSITIVE_INFINITY;
    relevance.set(p.repo, stars + downloads / 100 + 100 / daysSinceCommit);
  }
  return (a, b) => (relevance.get(b.repo) ?? 0) - (relevance.get(a.repo) ?? 0);
};

export const sortByStars: SortFactory = () => (a, b) =>
  (b.stars ?? 0) - (a.stars ?? 0);

export const sortByDownloads: SortFactory = () => (a, b) =>
  totalDownloads(b) - totalDownloads(a);

export const sortByLastCommit: SortFactory = () => (a, b) =>
  lastCommitTime(b) - lastCommitTime(a);

export const SORT_OPTIONS: {
  value: string;
  label: string;
  fn: SortFactory;
}[] = [
  { value: 'relevance', label: 'Relevance', fn: sortByRelevance },
  { value: 'stars', label: 'Stars', fn: sortByStars },
  { value: 'downloads', label: 'Downloads', fn: sortByDownloads },
  { value: 'last-commit', label: 'Last Commit', fn: sortByLastCommit },
];
