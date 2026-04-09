# Web Dev Tools Showcase Page

## Overview

Add a dedicated `/tools` page to showcase web-based development tools. These are live, interactive apps that deserve a curated presentation separate from the general `/projects` repo listing.

## Decisions

- **Separate page** at `/tools` with its own nav entry
- **Simple card grid** — name, description, tech tags, launch link
- **Data hoisted to global context** via `+onCreateGlobalContext.server.ts` so both `/projects` and `/tools` share the same data pipeline
- **`category: "tool"` field** in `project-metadata.json` identifies local tools
- **Hardcoded identifier list** for external tools — just repo ID + optional deployment URL override, matched against projects already in global context

## Data Architecture

### Global Context

`pages/+onCreateGlobalContext.server.ts` runs the existing data pipeline once and stores `projects: RepoData[]` on `globalContext`.

The data fetching logic (GitHub repos, npm packages, local projects, caching) is extracted from `pages/projects/+data.ts` into `src/data/projects.ts` as a shared module.

### Per-Page Data Hooks

- `pages/projects/+data.ts` — reads `globalContext.projects`, returns all (existing behavior)
- `pages/tools/+data.ts` — filters `globalContext.projects` for:
  1. Local projects with `category === 'tool'` in metadata
  2. Projects whose `repo` matches a hardcoded external tool identifier
  - Combines both sets

### External Tools List

Lives as a constant in `pages/tools/+data.ts`:

```ts
const EXTERNAL_TOOLS: { repo: string; deployment?: string }[] = [
  // { repo: 'some-repo-name', deployment: 'https://...' },
];
```

These reference projects already present in the global context GitHub data. The `deployment` field optionally overrides the URL.

## UI Design

### Navigation

"Tools" link added between "Projects" and "Speaking + Presentations" in both desktop sidebar and mobile drawer.

### Page Layout

- Heading: "Web Dev Tools" or similar
- Responsive CSS grid: 2 columns desktop, 1 column mobile (600px breakpoint)
- Each card displays:
  - Tool name
  - Description (1-2 lines)
  - Technology tags (small pills)
  - Prominent "Launch" link to deployment URL

### Styling

SCSS following existing site patterns. Simple cards with subtle borders, consistent color palette. No repo stats (stars, downloads, language bars) — this is a curated showcase, not a repo listing.

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `src/data/projects.ts` | Extracted shared data pipeline |
| `pages/+onCreateGlobalContext.server.ts` | Populates `globalContext.projects` |
| `pages/tools/+Page.tsx` | Card grid UI |
| `pages/tools/+data.ts` | Filters tools from global context |
| `pages/tools/+config.ts` | Page metadata |
| `pages/tools/styles.scss` | Card grid + card styles |

### Modified Files

| File | Change |
|------|--------|
| `pages/projects/+data.ts` | Thin wrapper over `globalContext.projects` |
| `renderer/PageShell.tsx` | Add "Tools" nav link |
| `renderer/MobileNav.tsx` | Add "Tools" nav link |
| `apps/qr-generator/project-metadata.json` | Add `"category": "tool"` |
| `apps/json-viewer/project-metadata.json` | Add `"category": "tool"` |
| `apps/pr-digest/project-metadata.json` | Add `"category": "tool"` |
| `apps/gh-graphql/project-metadata.json` | Add `"category": "tool"` (create file) |
| Vike type declarations | Extend `Vike.GlobalContext` with `projects` |

## Tools to Showcase

### Local (via `category: "tool"` in metadata)

- QR Code Generator (`/qr-generator/`)
- GitHub GraphQL Playground (`/gh-graphql/`)
- JSON Viewer (`/json-viewer/`)
- PR Digest (`/pr-digest/`)

### External (via hardcoded identifiers)

None initially — list is ready for future additions.
