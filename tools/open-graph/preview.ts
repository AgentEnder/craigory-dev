/**
 * Builds a contact sheet of every social card the site ships, so a change to
 * `card.ts` can be judged by looking at it rather than by opening a dozen files
 * under `dist/`.
 *
 * It reads the *shipped* `index.html` of each page rather than globbing for
 * `og.png`, which means the sheet shows what a crawler would actually see: a
 * post with its own `ogImage` shows that artwork, and a page whose card failed
 * to generate shows up as a broken tile instead of quietly going missing.
 *
 * Pages are found by sweeping the build output for anything that declares an
 * og:image of ours. That output also holds every sibling app copied in by
 * `copy-local-projects.cjs` — about 4,000 pages, nearly all alt-codes — so the
 * declaration is the filter; roughly 30 pages survive it.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

import { localApps } from './apps';
import {
  cardOutputPath,
  declaresGeneratedCard,
  escapeHtml,
  findPageFiles,
  readMeta,
} from './page-meta';

const WORKSPACE_ROOT = join(__dirname, '../..');
const CLIENT_DIR = join(WORKSPACE_ROOT, 'dist/apps/craigory-dev/client');
const APP_DIRS = new Set(
  localApps(WORKSPACE_ROOT, readdirSync(join(WORKSPACE_ROOT, 'apps'))).map(
    (app) => app.dir
  )
);
const OUTPUT_PATH = join(__dirname, '../../dist/apps/craigory-dev/og-preview.html');

interface Preview {
  url: string;
  group: string;
  title?: string;
  description?: string;
  /** Path to the card, relative to the sheet. */
  image?: string;
  imageAlt?: string;
  /** Populated when the declared card is missing; rendered as a warning tile. */
  problem?: string;
}

/** Where a page sorts in the sheet, from the URL it was prerendered to. */
function groupOf(url: string): string {
  if (url.startsWith('/blog/') && url.split('/').length > 3) return 'Blog posts';
  if (url.startsWith('/presentations/view/')) return 'Presentations';
  if (APP_DIRS.has(url.split('/')[1])) return 'Tools and apps';
  return 'Site pages';
}

function collect(pagePath: string): Preview | undefined {
  const html = readFileSync(pagePath, 'utf-8');
  const image = readMeta(html, 'og:image');
  // Sibling apps copied into the build have their own pages and no cards of
  // ours; a page declaring neither kind of og:image has nothing to preview.
  if (!image) return undefined;
  const isOurs = declaresGeneratedCard(image);
  const isCustomArtwork = image.includes('/assets/');
  if (!isOurs && !isCustomArtwork) return undefined;

  const dir = dirname(pagePath);
  const url = '/' + relative(CLIENT_DIR, dir).split(sep).join('/');
  const preview: Preview = {
    url: url === '/.' ? '/' : url,
    group: groupOf(url),
    title: readMeta(html, 'og:title'),
    description: readMeta(html, 'og:description'),
    imageAlt: readMeta(html, 'og:image:alt'),
  };

  // The declared URL locates the file, not the page's directory: the blog
  // index's pagination all point at the one `/blog/og.png`, and resolving from
  // the directory would report each of those pages as missing its card.
  const cardPath = cardOutputPath(CLIENT_DIR, image);
  if (!existsSync(cardPath) || !statSync(cardPath).isFile()) {
    preview.problem = `Declares ${image} — not generated`;
    return preview;
  }
  preview.image = relative(dirname(OUTPUT_PATH), cardPath).split(sep).join('/');
  return preview;
}

const previews = findPageFiles(CLIENT_DIR)
  .map(collect)
  .filter((p): p is Preview => p !== undefined)
  .sort((a, b) => a.group.localeCompare(b.group) || a.url.localeCompare(b.url));

const groups = [...new Set(previews.map((p) => p.group))];
const problems = previews.filter((p) => p.problem);

const sheet = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Social card preview — craigory.dev</title>
<style>
  body {
    margin: 0;
    padding: 2.5rem;
    background: #14161c;
    color: #f2f3f5;
    font: 15px/1.5 ui-sans-serif, system-ui, sans-serif;
  }
  h1 { font-size: 1.5rem; margin: 0 0 0.25rem; }
  h2 {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8b93a7;
    margin: 3rem 0 1rem;
    border-bottom: 1px solid #2a2f3a;
    padding-bottom: 0.5rem;
  }
  .summary { color: #8b93a7; margin: 0 0 1rem; }
  .warning { color: #ffb4a2; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(520px, 1fr));
    gap: 2rem;
  }
  figure { margin: 0; }
  /* The checkerboard shows through any card that renders with transparency,
     which is otherwise invisible against a dark page. */
  figure img {
    width: 100%;
    display: block;
    border-radius: 8px;
    border: 1px solid #2a2f3a;
    background:
      repeating-conic-gradient(#20242e 0% 25%, #171a21 0% 50%) 50% / 24px 24px;
  }
  figcaption { margin-top: 0.75rem; }
  .url { font-family: ui-monospace, monospace; font-size: 13px; color: #7cc4ff; }
  .title { font-weight: 600; margin-top: 0.25rem; }
  .desc, .alt { color: #8b93a7; font-size: 13px; margin-top: 0.25rem; }
  .missing {
    display: grid;
    place-items: center;
    aspect-ratio: 1.91 / 1;
    border: 1px dashed #7a3b3b;
    border-radius: 8px;
    color: #ffb4a2;
    text-align: center;
    padding: 1rem;
  }
</style>
</head>
<body>
<h1>Social card preview</h1>
<p class="summary">
  ${previews.length} pages${
    problems.length
      ? ` · <span class="warning">${problems.length} with problems</span>`
      : ' · no problems'
  }.
  Each tile is the real <code>og:image</code> declared by that page's built HTML.
</p>
${groups
  .map(
    (group) => `<h2>${escapeHtml(group)}</h2>
<div class="grid">
${previews
  .filter((p) => p.group === group)
  .map(
    (p) => `  <figure>
    ${
      p.image
        ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.imageAlt ?? '')}">`
        : `<div class="missing">${escapeHtml(p.problem ?? 'Missing')}</div>`
    }
    <figcaption>
      <div class="url">${escapeHtml(p.url)}</div>
      <div class="title">${escapeHtml(p.title ?? '(no og:title)')}</div>
      <div class="desc">${escapeHtml(p.description ?? '(no og:description)')}</div>
      <div class="alt">alt: ${escapeHtml(p.imageAlt ?? '(none)')}</div>
    </figcaption>
  </figure>`
  )
  .join('\n')}
</div>`
  )
  .join('\n')}
</body>
</html>`;

writeFileSync(OUTPUT_PATH, sheet);
console.log(`Wrote ${previews.length} previews to ${OUTPUT_PATH}`);
for (const problem of problems) {
  console.warn(`  ! ${problem.url}: ${problem.problem}`);
}
