/**
 * Social metadata for the sibling apps that ship under craigory.dev/<app>.
 *
 * These are ordinary Vite apps, not vike pages, so nothing in the site's
 * renderer ever sees them — `copy-local-projects.cjs` just drops their built
 * output into the client directory. Left alone they ship a bare `<title>` and
 * nothing else, so sharing a link to the QR generator or Glyph Index produced a
 * naked URL.
 *
 * The tags are written here, into the aggregated output, rather than into each
 * app's own `index.html`. An app's source has no business knowing it is
 * published under craigory.dev, and hardcoding that would break the preview
 * deploys that serve the whole site under a path prefix. `project-metadata.json`
 * stays the single source of truth for an app's name and blurb, which is where
 * the /tools and /projects pages already read it from.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface LocalApp {
  /** Directory under `apps/`, which is also its path segment on the site. */
  dir: string;
  name: string;
  description: string;
}

interface ProjectMetadata {
  name?: string;
  description?: string;
}

/**
 * Apps that get copied into the site, derived the same way
 * `copy-local-projects.cjs` decides what to copy: the presence of
 * `project-metadata.json` is what marks a sibling app as published here.
 */
export function localApps(workspaceRoot: string, appDirs: string[]): LocalApp[] {
  const apps: LocalApp[] = [];
  for (const dir of appDirs) {
    if (dir === 'craigory-dev' || dir.endsWith('-e2e')) continue;
    const metadataPath = join(workspaceRoot, 'apps', dir, 'project-metadata.json');
    if (!existsSync(metadataPath)) continue;

    const metadata = JSON.parse(
      readFileSync(metadataPath, 'utf-8')
    ) as ProjectMetadata;
    // Both feed a card and a description tag that a person will read, and a
    // guessed fallback would be worse than being told to write one.
    if (!metadata.name || !metadata.description) {
      throw new Error(
        `apps/${dir}/project-metadata.json needs both "name" and "description" to build its social card.`
      );
    }
    apps.push({ dir, name: metadata.name, description: metadata.description });
  }
  return apps;
}

/**
 * Rewrites the head of an app's built page to carry the given tags.
 *
 * Existing copies of each tag are removed first, so re-running against a
 * directory that was already processed replaces the tags instead of stacking a
 * second set of them.
 */
export function withSocialMeta(
  html: string,
  tags: { name?: string; property?: string; content: string }[]
): string {
  let result = html;
  for (const tag of tags) {
    const key = tag.name ?? tag.property;
    result = result.replace(
      new RegExp(`\\s*<meta[^>]*(?:name|property)="${key}"[^>]*>`, 'gi'),
      ''
    );
  }
  const rendered = tags
    .map((tag) => {
      const attribute = tag.name ? `name="${tag.name}"` : `property="${tag.property}"`;
      return `    <meta ${attribute} content="${escapeAttribute(tag.content)}" />`;
    })
    .join('\n');

  if (!result.includes('</head>')) {
    throw new Error('App page has no </head> to insert social metadata into.');
  }
  return result.replace('</head>', `${rendered}\n  </head>`);
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
