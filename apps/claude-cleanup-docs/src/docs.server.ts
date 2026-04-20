// Reads the claude-cleanup package's markdown files and renders each to
// HTML. Server-only (file system + unified pipeline) — the routing table is
// kept in ./docs-index.ts so the client bundle doesn't need to pull this in.
import { readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import { unified } from 'unified';

import { DOC_SOURCES, withBase } from './docs-index';

// `process.cwd()` is the app directory during `vike dev`, `vike build`, and
// prerender. Can't use `import.meta.url` — after bundling this file lives
// under dist/server/chunks/... which breaks relative paths back to packages/.
const packageRoot = resolve(process.cwd(), '..', '..', 'packages', 'claude-cleanup');

export interface DocPage {
  slug: string;
  path: string;
  title: string;
  html: string;
  section: string;
  order: number;
}

function buildProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    })
    .use(rehypeHighlight, { detect: true })
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: { className: 'heading-link', ariaLabel: 'Link to section' },
      content: { type: 'text', value: '#' },
      test: (el) => el.tagName !== 'h1',
    })
    .use(rehypeStringify);
}

function extractTitle(markdown: string, fallback: string): string {
  const match = markdown.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1] : fallback;
}

// Rewrite relative links between source files (`./docs/monitor.md`,
// `./cli/start.md`) to the matching in-site route. Runs on raw markdown so
// rehype plugins don't need to know the filesystem layout.
function rewriteRelativeLinks(
  markdown: string,
  fileRelPath: string,
  fileToSlug: Map<string, string>,
): string {
  const sourceDir = dirname(fileRelPath);
  return markdown.replace(/\]\(([^)]+)\)/g, (full, target: string) => {
    if (/^[a-z]+:\/\//i.test(target) || target.startsWith('#')) return full;
    const [pathPart, hash = ''] = target.split('#');
    const resolved = relative(packageRoot, join(packageRoot, sourceDir, pathPart));
    const slug = fileToSlug.get(resolved);
    if (slug === undefined) return full;
    const url = withBase('/' + slug) + (hash ? '#' + hash : '');
    return `](${url})`;
  });
}

let cached: DocPage[] | null = null;

export function loadDocs(): DocPage[] {
  if (cached) return cached;
  const processor = buildProcessor();
  const fileToSlug = new Map(DOC_SOURCES.map((s) => [s.file, s.slug]));
  const pages: DocPage[] = [];

  for (const src of DOC_SOURCES) {
    const abs = join(packageRoot, src.file);
    try {
      statSync(abs);
    } catch {
      console.warn(`[claude-cleanup-docs] missing markdown source: ${src.file}`);
      continue;
    }
    const raw = readFileSync(abs, 'utf-8');
    const rewritten = rewriteRelativeLinks(raw, src.file, fileToSlug);
    const html = String(processor.processSync(rewritten));
    pages.push({
      slug: src.slug,
      path: '/' + src.slug,
      title: src.titleOverride ?? extractTitle(raw, src.file),
      html,
      section: src.section,
      order: src.order,
    });
  }

  cached = pages.sort((a, b) => a.order - b.order);
  return cached;
}

export function getPageBySlug(slug: string): DocPage | undefined {
  return loadDocs().find((p) => p.slug === slug);
}
