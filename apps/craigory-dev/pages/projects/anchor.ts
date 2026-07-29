import type { RepoData } from './types';

/**
 * Identity of a project card on `/projects`.
 *
 * There are no per-project pages — `/projects` is one page of cards — so this id
 * is what makes an individual project addressable. Pagefind derives anchored
 * sub-results from id'd headings, which is how a search for "qr generator"
 * resolves to `/projects#qr-generator` instead of just "somewhere on Projects",
 * and the build-time related-content corpus links to the same anchors.
 *
 * Deliberately NOT slugified. The ids are whatever the repo is actually called,
 * so `QbCheck-Simulator` keeps its casing; lowercasing here would quietly break
 * every existing `#anchor` link into the page.
 */
export function isContributorProject(project: RepoData): boolean {
  return project.type === 'github' && project.role === 'contributor';
}

/** Repos owned by someone else are disambiguated by owner: `nrwl/nx` -> `nrwl-nx`. */
export function projectAnchorId(project: RepoData): string {
  return isContributorProject(project)
    ? (project as Extract<RepoData, { type: 'github' }>).data.full_name.replace(
        '/',
        '-'
      )
    : project.repo;
}

export function projectTitle(project: RepoData): string {
  return isContributorProject(project)
    ? (project as Extract<RepoData, { type: 'github' }>).data.full_name
    : project.repo;
}
