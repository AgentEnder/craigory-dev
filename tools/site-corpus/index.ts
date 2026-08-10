/**
 * The site's prose, collected once for both build-time content features:
 * the Pagefind search index and the related-content embedding pass.
 *
 * Runs under **bun**, which is what makes it short. `bunfig.toml` maps `.mdx` to
 * the `text` loader, so a post's `mdx` field — a React component inside the Vite
 * graph — arrives here as the raw markdown string. That means post metadata and
 * post prose come from the same import, with no globbing and no slug-to-folder
 * mapping (three posts have a slug that differs from their directory name).
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { blogPosts } from '../../libs/blog-posts/src/lib/posts';
import { getBlogUrl } from '../../libs/blog-posts/src/lib/utils/get-blog-url';
import { PRESENTATIONS } from '../../libs/presentations/src/lib/presentations';
import type { RepoData } from '../../apps/craigory-dev/pages/projects/types';
import {
  projectAnchorId,
  projectTitle,
} from '../../apps/craigory-dev/pages/projects/anchor';
import { loadAllProjects } from '../../apps/craigory-dev/src/data/projects';
import { stripMdx, stripRemarkSlides } from './strip';

export const WORKSPACE_ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
);

export type CorpusItemType = 'blog' | 'presentation' | 'project';

export interface CorpusItem {
  /** Stable identity across builds: `${type}:${slug}`. */
  id: string;
  type: CorpusItemType;
  slug: string;
  title: string;
  description: string;
  /** Site-relative, without any base-path prefix. */
  url: string;
  /** ISO date, when the item has a meaningful one. */
  date?: string;
  /** Prose used for embedding and/or indexing. */
  content: string;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Published blog posts. `blogPosts` already applies the site's own publish-date
 * filter, so scheduled posts stay out of both search and related content — even
 * though `slugMap` still prerenders a page for them.
 */
export function collectBlogPosts(): CorpusItem[] {
  return blogPosts.map((post) => {
    const body = stripMdx(readPostBody(post.mdx, post.slug));
    return {
      id: `blog:${post.slug}`,
      type: 'blog' as const,
      slug: post.slug,
      title: post.title,
      description: post.description,
      url: getBlogUrl(post),
      date: iso(post.publishDate),
      content: [post.title, post.description, body].join('\n\n'),
    };
  });
}

/**
 * A post's prose, however bun chose to load `contents.mdx`.
 *
 * `bunfig.toml` maps `.mdx` to the `text` loader, so normally this import is
 * already the raw markdown. But bunfig is discovered relative to the process's
 * working directory: run bun from anywhere else and it silently falls back to
 * the `file` loader, which returns the file's absolute PATH instead. That is
 * still a string, so nothing throws — the pipeline just embeds file paths as
 * though they were blog content. Handling both shapes makes the corpus correct
 * regardless of where the build is invoked from.
 */
function readPostBody(mdx: unknown, slug: string): string {
  const value = String(mdx);
  const body =
    value.includes('\n') || !existsSync(value)
      ? value
      : readFileSync(value, 'utf8');

  // Every post is far longer than this. A short body means the loader produced
  // something that is not prose, and embedding it would quietly poison the
  // similarity scores rather than fail.
  if (body.trim().length < 200) {
    throw new Error(
      `Blog post "${slug}" yielded ${
        body.trim().length
      } characters of content. ` +
        'Expected raw markdown from contents.mdx — check that bun resolved ' +
        'bunfig.toml (it must run with the workspace root as its cwd).'
    );
  }
  return body;
}

export interface CollectPresentationsOptions {
  /** See `StripSlidesOptions.includeSpeakerNotes`. */
  includeSpeakerNotes?: boolean;
}

/**
 * Talks, including the slide text. The decks live as markdown next to their
 * metadata and are only ever rendered client-side by remark, so reading them off
 * disk here is the only way their content reaches the build.
 */
export function collectPresentations(
  options: CollectPresentationsOptions = {}
): CorpusItem[] {
  const items: CorpusItem[] = [];

  for (const presentation of Object.values(PRESENTATIONS)) {
    const { slug, title, description, presentedAt, presentedOn, mdUrl } =
      presentation;

    let slides = '';
    if (mdUrl) {
      const path = join(
        WORKSPACE_ROOT,
        'libs/presentations/src/presentation-data',
        slug,
        `${mdUrl}.md`
      );
      if (existsSync(path)) {
        slides = stripRemarkSlides(readFileSync(path, 'utf8'), {
          includeSpeakerNotes: options.includeSpeakerNotes,
        });
      }
    }

    items.push({
      id: `presentation:${slug}`,
      type: 'presentation',
      slug,
      title,
      description,
      // Only decks with markdown get a prerendered viewer page; the rest are
      // reachable as an anchor on the presentations index.
      url: mdUrl ? `/presentations/view/${slug}` : `/presentations#${slug}`,
      date: iso(presentedOn),
      content: [title, presentedAt, description, slides].join('\n\n'),
    });
  }

  return items;
}

/**
 * Projects, via the same loader the site itself uses.
 *
 * Calling this before the vike build costs nothing extra: `loadAllProjects()`
 * already memoises to `tmp/github-projects-cache.json` and
 * `tmp/local-projects-cache.json`, so whichever caller runs first pays for the
 * fetch and the other reads the file. A warm cache makes zero GitHub requests;
 * a cold one (a fresh CI checkout — `tmp/` is gitignored) fetches exactly once
 * and the build that follows reuses it.
 *
 * A failure here is tolerated only when it is the one we chose to tolerate: no
 * token configured, which is the ordinary state of a local checkout with a cold
 * cache. A missing "Related" strip on project cards is not worth failing a
 * developer's build over.
 *
 * With a token configured — which is to say, in CI — the same failure is fatal.
 * Swallowing it there costs far more than a missing strip: `loadAllProjects()`
 * writes `tmp/github-projects-cache.json` only on success, so a caught error
 * silently leaves the cache cold, and the *next* consumer (the vike prerender)
 * re-runs the whole fetch against an API that has already started refusing us.
 * That is how a rate limit here surfaced as `projects is not iterable` on the
 * /projects page two tasks later, with this warning buried 200 lines up.
 */
export async function collectProjects(): Promise<CorpusItem[]> {
  // `||`, not `??`: an empty-string token is a misconfigured CI secret, not a
  // deliberately unauthenticated local build, and it must not buy the soft path.
  const hasToken = Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN);

  let projects: RepoData[];
  try {
    projects = await loadAllProjects();
  } catch (error) {
    if (hasToken) {
      throw new Error(
        `[site-corpus] could not load projects, and a GitHub token is configured — ` +
          `refusing to build a corpus that silently omits every project. ` +
          `Cause: ${error instanceof Error ? error.message : error}`,
        { cause: error }
      );
    }
    console.warn(
      '[site-corpus] could not load projects; continuing without them ' +
        '(no GitHub token configured):',
      error instanceof Error ? error.message : error
    );
    return [];
  }

  return projects.map((project) => {
    const title = projectTitle(project);
    const description = project.description ?? '';
    const technologies =
      'metadata' in project ? project.metadata.technologies ?? [] : [];

    return {
      id: `project:${project.repo}`,
      type: 'project' as const,
      slug: project.repo,
      title,
      description,
      url: `/projects#${projectAnchorId(project)}`,
      date: project.lastCommit ? project.lastCommit.slice(0, 10) : undefined,
      content: [
        title,
        description,
        technologies.join(', '),
        Object.keys(project.languages ?? {}).join(', '),
        // READMEs carry most of the signal about what a project actually does,
        // but they are also the noisiest input here (badges, install snippets),
        // so they are capped rather than embedded whole.
        project.readme ? stripMdx(project.readme).slice(0, 8000) : '',
      ]
        .filter(Boolean)
        .join('\n\n'),
    };
  });
}
