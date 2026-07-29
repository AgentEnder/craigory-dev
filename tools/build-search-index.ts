/**
 * Builds the Pagefind search index into the vike output, after `vike build`.
 *
 * Two things force the Node API here instead of the `pagefind` CLI:
 *
 * 1. **Slide decks are not in the HTML.** `ViewPresentation` fetches `slides.md`
 *    and hands it to remark in the browser, so the prerendered viewer page is an
 *    empty shell. A crawl alone would index none of the talks. Their prose is
 *    injected as custom records instead.
 * 2. **The output is mostly not this site.** `copy-local-projects.cjs` copies
 *    every sibling app's build into the client directory — alt-codes alone is
 *    ~3,965 pages. Crawling the directory wholesale would bury blog posts under
 *    thousands of generated pages from other apps.
 */

import * as pagefind from 'pagefind';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { collectPresentations, WORKSPACE_ROOT } from './site-corpus';

const CLIENT_DIR = join(
  WORKSPACE_ROOT,
  'dist',
  'apps',
  'craigory-dev',
  'client'
);

/** Build artifacts and non-content directories that are never search results. */
const IGNORED_DIRS = new Set(['assets', '.vite', 'pagefind']);
const IGNORED_FILES = new Set(['404.html']);

/**
 * Sibling apps whose builds get copied in beside this site's pages. Derived the
 * same way `copy-local-projects.cjs` decides what to copy, so adding an app does
 * not silently flood the index.
 */
function copiedAppDirectories(): Set<string> {
  const appsDir = join(WORKSPACE_ROOT, 'apps');
  return new Set(
    readdirSync(appsDir).filter(
      (dir) =>
        dir !== 'craigory-dev' &&
        existsSync(join(appsDir, dir, 'project-metadata.json'))
    )
  );
}

/** Viewer pages for decks — shells whose content arrives as custom records. */
function presentationViewPaths(): Set<string> {
  return new Set(
    collectPresentations()
      .filter((p) => p.url.startsWith('/presentations/view/'))
      .map((p) => join('presentations', 'view', p.slug, 'index.html'))
  );
}

function isRedirectStub(absolutePath: string): boolean {
  return /<meta[^>]+http-equiv=["']?refresh/i.test(
    readFileSync(absolutePath, 'utf8')
  );
}

function findSitePages(): string[] {
  const excludedTopLevel = copiedAppDirectories();
  const presentationShells = presentationViewPaths();
  const pages: string[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const absolute = join(dir, entry);
      const relativePath = relative(CLIENT_DIR, absolute);
      const [topLevel] = relativePath.split(sep);

      if (statSync(absolute).isDirectory()) {
        if (IGNORED_DIRS.has(entry) || excludedTopLevel.has(topLevel)) continue;
        walk(absolute);
        continue;
      }

      if (!entry.endsWith('.html')) continue;
      if (IGNORED_FILES.has(entry)) continue;
      if (presentationShells.has(relativePath)) continue;
      // Vike emits a meta-refresh stub for every entry in `config.redirects`.
      // They carry no content and would surface as "Redirect /qr-generator".
      if (isRedirectStub(join(CLIENT_DIR, relativePath))) continue;
      pages.push(relativePath);
    }
  };

  walk(CLIENT_DIR);
  return pages.sort();
}

async function main() {
  if (!existsSync(CLIENT_DIR)) {
    throw new Error(
      `No build output at ${CLIENT_DIR}. Run \`nx build craigory-dev\` first.`
    );
  }

  // forceLanguage keeps everything in one index. Pagefind otherwise shards by
  // detected language, and a page that lands in a different shard is simply
  // unfindable from the default one.
  const { index } = await pagefind.createIndex({ forceLanguage: 'en' });
  if (!index) throw new Error('Pagefind failed to create an index');

  const pages = findSitePages();
  for (const page of pages) {
    await index.addHTMLFile({
      sourcePath: page,
      content: readFileSync(join(CLIENT_DIR, page), 'utf8'),
    });
  }

  // Speaker notes stay out: an excerpt quoting text that appears nowhere on the
  // page would be a bug, not a feature.
  const presentations = collectPresentations().filter((p) =>
    p.url.startsWith('/presentations/view/')
  );
  for (const presentation of presentations) {
    await index.addCustomRecord({
      url: presentation.url,
      content: presentation.content,
      language: 'en',
      // Crawled pages get their title from the HTML; a custom record has no
      // HTML, so it must carry one. Result grouping is derived from the URL in
      // the UI rather than a Pagefind filter, so that crawled and synthetic
      // records are classified by the same rule.
      meta: { title: presentation.title },
    });
  }

  const { outputPath } = await index.writeFiles({
    outputPath: join(CLIENT_DIR, 'pagefind'),
  });
  await pagefind.close();

  console.log(
    `[search-index] ${pages.length} pages + ${
      presentations.length
    } presentation records -> ${relative(WORKSPACE_ROOT, outputPath)}`
  );
}

main().catch((error) => {
  console.error('[search-index] failed:', error);
  process.exit(1);
});
