// Isomorphic: shared routing table used by both server-side doc loading and
// client-side nav rendering. Must NOT import Node built-ins — the layout
// component imports this file during client hydration.

export interface DocSource {
  slug: string;
  file: string;
  section: string;
  order: number;
  titleOverride?: string;
}

export interface DocIndexEntry {
  slug: string;
  path: string;
  title: string;
  section: string;
}

// Explicit table keeps routing deterministic — README is at the package root
// while the rest lives under docs/ (and docs/cli/ is cli-forge-generated, so
// its layout is already fixed).
export const DOC_SOURCES: DocSource[] = [
  { slug: '', file: 'README.md', section: 'Overview', order: 0, titleOverride: 'claude-cleanup' },
  { slug: 'monitor', file: 'docs/monitor.md', section: 'Guides', order: 1, titleOverride: 'Monitor daemon' },
  { slug: 'cli', file: 'docs/cli/index.md', section: 'CLI reference', order: 10, titleOverride: 'claude-cleanup' },
  { slug: 'cli/monitor', file: 'docs/cli/monitor/index.md', section: 'CLI reference', order: 11, titleOverride: 'monitor' },
  { slug: 'cli/monitor/start', file: 'docs/cli/monitor/start.md', section: 'CLI reference', order: 12, titleOverride: 'start' },
  { slug: 'cli/monitor/stop', file: 'docs/cli/monitor/stop.md', section: 'CLI reference', order: 13, titleOverride: 'stop' },
  { slug: 'cli/monitor/status', file: 'docs/cli/monitor/status.md', section: 'CLI reference', order: 14, titleOverride: 'status' },
  { slug: 'cli/monitor/reset', file: 'docs/cli/monitor/reset.md', section: 'CLI reference', order: 15, titleOverride: 'reset' },
];

export const DOC_INDEX: DocIndexEntry[] = DOC_SOURCES.map((s) => ({
  slug: s.slug,
  path: '/' + s.slug,
  title: s.titleOverride ?? s.file,
  section: s.section,
}));

export const DOC_SLUGS: Set<string> = new Set(DOC_SOURCES.map((s) => s.slug));
