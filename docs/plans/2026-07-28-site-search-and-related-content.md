# Site Search (Pagefind) + Related Content (sqlite-vec) — Design

Two build-time features for craigory.dev:

1. **Spotlight search** over blog posts, projects, and presentations — including
   in-presentation slide text — powered by Pagefind, opened with `cmd+k` or an
   in-UI button.
2. **Related materials** — a build-time embedding pass over the site's prose that
   fills a new "Related" section on blog posts, presentation cards, and project
   cards.

## The constraint that shapes everything

craigory.dev is a Vike site with `prerender: true`, deployed as static files to
GitHub Pages. There is no server at runtime. That splits the two features to
opposite ends of the build:

| | Consumes | Runs |
|---|---|---|
| Pagefind | the **built output** (`dist/apps/craigory-dev/client/**/*.html`) | **after** `vike build` |
| Related content | the **source prose** (mdx / md) | **before** `vike build`, because the result must be baked into prerendered HTML |

They cannot share a pipeline stage, and the related-content step cannot read the
built site.

## Part 1 — Pagefind search

### Why the Node API rather than the CLI

`ViewPresentation` loads `slides.md?raw` inside a `useEffect` and hands it to
remark.js in the browser. `+onBeforePrerenderStart` emits only the page shell, so
**no slide text exists in the prerendered HTML**. A plain `npx pagefind --site`
crawl would index none of the talks — precisely the content the request calls out.

So indexing runs through `pagefind`'s Node API, which lets us mix crawled pages
with synthetic ones:

```ts
const { index } = await createIndex();
await index.addDirectory({ path: clientDir, glob: '**/*.html' });
for (const p of presentations) {
  await index.addCustomRecord({
    url: `/presentations/view/${p.slug}`,
    content: stripRemarkSlides(slidesMarkdown),
    language: 'en',
    meta: { title: p.title, type: 'Presentation', presentedAt: p.presentedAt },
  });
}
await index.writeFiles({ outputPath: join(clientDir, 'pagefind') });
```

The presentation view page carries `data-pagefind-ignore="all"` so the crawl skips
the empty shell entirely and only the custom record represents that URL.

`stripRemarkSlides` drops remark's slide machinery — `---` / `--` separators,
`layout: true`, `name:`, `template:`, `class:`, `background-image:` property lines,
`.footnote[…]` macros, and raw HTML — keeping the prose.

### Double-indexing hazard

`PageShell.tsx` renders `children` **twice**: once in the desktop `<Content>`, once
inside `<MobileNav>`'s `.mobile-content`. Left alone, every page's body is indexed
twice and every excerpt is a duplicate. The mobile copy gets
`data-pagefind-ignore`.

Both nav trees (`.sidebar-nav` and `.mobile-drawer-nav`) also get
`data-pagefind-ignore` — otherwise the words "Blog", "Projects", "Tools" match
every page on the site.

### Projects

There are no per-project pages; `/projects` is a single page of cards. Rather than
re-fetching GitHub data to synthesize records, each `ProjectCard` gets an id'd
heading. Pagefind derives **sub-results** from headings with ids, so a search for
"qr generator" returns `/projects` with a sub-result anchored at
`/projects#qr-generator`. This also makes the cards linkable, which they aren't
today.

### Where it runs

Appended to the existing `craigory-dev:build` commands array, alongside the
`copy-local-projects.cjs` step that is already there. A separate Nx target would
write into `build`'s output directory and get clobbered on a cache restore.

### UI

A `SpotlightSearch` modal mounted in `PageShell`:

- `cmd+k` / `ctrl+k`, plus visible trigger buttons in the sidebar and mobile drawer.
- Debounced queries, results grouped by type, sub-result excerpts with `<mark>`.
- `↑`/`↓` to move, `Enter` to open, `Esc` to close, focus restored on close.
- `pagefind.js` is imported lazily at runtime from the site's base URL (not
  bundled — it does not exist until after the build). Respects
  `PUBLIC_ENV__BASE_URL` so PR previews under `/pr/<n>/` resolve correctly.
- In `vike dev` there is no index; the modal says so instead of throwing.

## Part 2 — Related content

### Runtime: `bun:sqlite`

Both runtimes were tested and both work with sqlite-vec:

- `node:sqlite` (Node 22.15) bundles an extension-capable SQLite and needs no
  Homebrew. Its one trap is that `vec0` rowids must be bound as **`BigInt`** —
  passing `1` fails with *"Only integers are allowed for primary key values"*,
  because node:sqlite binds JS numbers as REAL.
- `bun:sqlite` needs brain's workaround on macOS (Bun links Apple's SQLite, built
  with `SQLITE_OMIT_LOAD_EXTENSION`, so `Database.setCustomSQLite` has to point at
  a Homebrew `libsqlite3.dylib`) but binds rowids as plain numbers.

**Bun wins** despite the extra dance, because of what it does for the *corpus*
rather than the database — see below. `findExtensionCapableSqlite()` is ported
from brain and returns null off macOS, where Bun's bundled SQLite is fine.

### Corpus collection: why bun, and the trap that comes with it

Blog metadata lives in `post.ts` as a typed object that imports `./contents.mdx`;
neither can be plain-imported outside the Vite graph.

`bunfig.toml` already maps `.mdx` to the **`text` loader** for the open-graph image
script. That means `import mdx from './contents.mdx'` yields the raw markdown
string under bun, while the identical import yields a React component under Vite.
So metadata and prose come from one import — no TS-AST parsing, no globbing, and
no slug-to-folder mapping (3 of 16 posts have a slug that differs from their
directory).

**The trap:** bunfig is discovered relative to the *process working directory*.
Run bun from anywhere else and it silently falls back to the `file` loader, which
returns each post's **absolute path** instead of its contents. That is still a
`string`, so nothing throws, no type error fires, and the pipeline embeds file
paths as though they were blog prose. The only symptom was a log line reading
"1 chunk" instead of "13 chunks".

Two defences, because correctness that depends on a working directory needs both:

1. `readPostBody()` detects a path and reads the file, so the corpus is correct
   from any cwd. Both loaders now produce byte-identical hashes.
2. A length guard throws if a post yields under 200 characters, turning a silent
   data-quality failure into a build failure.

The Nx target also runs from the workspace root so the `text` loader is the normal
path rather than the fallback.

### Model

Same as brain, for consistency and because it is small and good:
`@huggingface/transformers` running `Xenova/bge-small-en-v1.5` — 384-dim,
mean-pooled, L2-normalized, pure-JS tokenizer over onnxruntime so it works on every
platform. bge is asymmetric, but this feature only ever compares *passages to
passages*, so the query instruction prefix is deliberately not used.

Chunking follows brain's `chunkText`: paragraph-boundary windows of ~1600 chars
with a 200-char overlap tail, hard-splitting oversized paragraphs (code blocks).

Prose comes from `contents.mdx` (imports/exports/JSX/code fences stripped) and
`slides.md` (via `stripRemarkSlides`, shared with the Pagefind step).

### Projects in the corpus

`collectProjects()` calls the site's own `loadAllProjects()`. Running before the
build does not matter, because that loader already memoises to disk
(`projects.ts:1297`):

- `tmp/github-projects-cache.json`
- `tmp/local-projects-cache.json`

Whichever caller runs first pays for the fetch; the other reads the file. A warm
cache makes **zero** GitHub requests — measured at 34 projects in 1.4s with the
token explicitly unset. A cold cache (a fresh CI checkout; `tmp/` is gitignored)
fetches exactly once and the build that follows reuses it. Total API cost is
unchanged from before this feature existed.

Failures are swallowed rather than fatal: the loader needs a token when the cache
is cold, and a missing Related strip on project cards is not worth failing a build
over.

> An earlier revision routed this through a snapshot written by
> `onCreateGlobalContext`, on the incorrect belief that `loadAllProjects()` had no
> disk cache. That paid a build of staleness — projects were absent from the
> related map on any cold machine — to solve a problem that did not exist. The
> snapshot, its `findWorkspaceRoot` helper, and its CI cache entry were removed.

Note the caches have **no TTL**: project data refreshes only when `tmp/` is
cleared. CI checks out fresh every run so production is current, but a long-lived
local checkout can be serving very old project data.

#### The regression this caused, and the real fix

Adding a second caller broke deployment links on `/tools` and `/projects`.

`getLocalProjects()` derives `deployment` from whether the project's build output
exists on disk (`projects.ts:1186`), and that verdict was being **written into the
cache**. Previously the only caller was `onCreateGlobalContext`, which runs inside
`vike build` — after every `^build` dependency, so `dist/apps/*` always existed.
`related-content:build` runs *during* the `^build` phase, in parallel with the
sibling app builds, and observed in a real build log running **before**
`alt-codes:build`. On a fresh CI checkout (`apps/*/dist` is gitignored) it saw no
build output, cached `deployment: undefined`, and — since the cache never
expires — every later build rendered a linkless page.

**The fix is the missing dependency edge.** This step reads project state that the
app builds produce, so it depends on those builds — that relationship was simply
never declared:

```json
"dependsOn": [{ "projects": ["apps/*", "!craigory-dev"], "target": "build" }]
```

`craigory-dev` is excluded because it depends on *this* target; including it would
be a cycle. The glob is negated rather than spelled out as a list so a new app is
covered automatically — and note the project name is `pr-digest-viewer` even
though the directory is `apps/pr-digest`, which a hardcoded list would get wrong.

Fixing the ordering is better than making the consumer defensive about one field.
It is the honest description of the dependency, and it holds for *any* build-state
-derived value the loader caches, not just `deployment`.

Verified on a real build: `json-viewer:build` at log line 99 and `alt-codes:build`
at 420, with `related-content:build` at **8835** — after all of them. The
regenerated cache carries 8/12 deployments (the 4 without are packages, which
genuinely have none), `/tools` links all five tools, and `/projects` renders 36
Live URL entries.

Remaining sharp edge: the ordering only applies through Nx. Running
`bun run libs/related-content/build/main.ts` by hand before the apps are built will
still write a cache with no deployments. Clear `tmp/*.json` if that happens.

### Storage and scoring

`node_modules/.cache/related-content/embeddings.db` (gitignored by virtue of
living under `node_modules`):

- `items` — id, type, slug, title, description, url, content hash
- `chunks` — item id, chunk index, text
- `vec_chunks` — `vec0(embedding float[384])`, rowid joined to `chunks.id`
- `vec_items` — `vec0(embedding float[384])`, one mean-of-chunks vector per item

Hash-gated the way brain's `reindexEmbeddings` is: an unchanged corpus re-embeds
nothing, and items that disappear are pruned.

Related sets come from KNN over `vec_items`, excluding self, top 4. Cross-type
matches are allowed and expected — that is the point of "across the site".

Three filters, each earned by reading the actual output:

- **Floor (cosine ≥ 0.70).** Below this the matches are "both are about
  software". An item with no neighbour above it renders no section at all.
- **Ceiling (cosine ≤ 0.97).** The same talk given at two conferences is two
  items with near-identical slides: `that-conf-wi-2024-spaghetti` scores **0.999**
  against `that-conf-tx-2024-compartmentalization`. Suggesting a talk as related
  to itself is noise.
- **Title dedup.** A re-delivered talk can fall *under* the ceiling when only one
  of the two has slides on file — `kcdc-2025` listed "From Spaghetti to S'mores"
  twice, at 0.861 and 0.857. Neighbours arrive sorted, so the first title wins.

The KNN over-fetches (`MAX_RELATED * 3 + 1`) because all three filters plus the
self-match remove rows before the top-N is taken.

Observed quality: tiki bar reviews cluster only with each other (0.78–0.87) and
never with technical content; `nx-configuration-history` pulls the Nx talks
(0.887–0.895).

### Output and consumption

The step writes `libs/related-content/src/generated/related.json`:

```json
{ "blog:superpowered-git-aliases": [ { "type": "presentation", "slug": "...", "title": "...", "url": "...", "score": 0.83 } ] }
```

The file is **gitignored**. To keep a fresh clone's dev server and typecheck
working without first running a 130MB model download, the lib reads it through
`import.meta.glob`, which yields an empty object for a missing file instead of
failing the build:

```ts
const mods = import.meta.glob('./generated/related.json', { eager: true });
```

`<RelatedContent id="blog:my-slug" />` renders nothing when the map is empty, so
the site degrades to exactly its current behaviour.

### Nx wiring

`libs/related-content` gets a `build` target that is **deliberately uncached**
(`"cache": false`).

That looks backwards, but the step's own sqlite DB is already a cache and a
correctly-grained one: it hashes each item's text and re-embeds only what moved,
taking 27s cold and **0.08s** warm.

An Nx cache layered on top would key off file globs, and one of this step's inputs
is invisible to them: project data comes from `tmp/*.json` (gitignored, so outside
Nx's file map) and ultimately from the GitHub API. Nx would see "nothing changed"
and restore a stale `related.json` whenever project data moved. Two caches with
different notions of "changed" is worse than one right one.

`craigory-dev:build` already declares `dependsOn: ["^build"]`, so importing the lib
is enough to order the step ahead of the build.

CI gets two `actions/cache` entries in both `pr.yml` and `deploy.yml`, split by
how often each changes:

- the ~130MB ONNX model, on a stable key, saved once;
- the embeddings DB, on a content key with `restore-keys` — a stale DB still lets
  every unchanged post skip re-embedding.

### Project card anchors

`/projects` already rendered `<h2 id={anchor}>` per card, so Pagefind sub-results
worked with no markup change. The anchor rule was non-obvious though — contributor
repos use `owner/name` with the slash swapped for a dash, and ids are **not**
slugified, so `QbCheck-Simulator` keeps its casing. It is now extracted into
`pages/projects/anchor.ts` and shared with the corpus, because a corpus that
lowercased those ids would emit links to anchors that do not exist.

## Verification

Measured against the built site, not asserted:

| Check | Result |
|---|---|
| Pages whose body is indexed twice | **19 → 0** (word counts halved exactly) |
| Redirect stubs in the index | 0 |
| Anchors on `/projects` | 39 |
| Filesystem paths stored as chunk text | 0 |
| Blog posts reduced to ≤1 chunk | 0 |
| Embed re-run with unchanged corpus | 0 embedded, 61 unchanged, 0.08s |
| Projects in the map on a cold first build | 22 keys (was 0 under the snapshot design) |
| GitHub requests during a warm embed run | 0 |

Browser run (`playwright`, webkit, against a short-lived static server):

- `cmd+k` opens; Escape closes; arrows move the selection.
- "monorepo adoption" returns 6 hits in Blog + Presentations groups, including
  **"Smooth Scaling, Happy Coding"** — text that exists only in `slides.md` and in
  no prerendered HTML, which is the whole reason for the custom records.
- Heading sub-results resolve ("The Final Result", "Nx's Angular Beginnings").
- "qr code generator" returns anchored `/projects/#nx-dotnet`,
  `/projects/#markdown-factory`.
- Zero page errors; 4 Related links server-rendered on the post.

One gotcha for anyone writing tests here: `MobileNav`'s drawer also carries
`role="dialog"` and is always in the DOM, so `[role="dialog"]` never counts zero.
Scope to `[role="dialog"][aria-label="Search the site"]`.
