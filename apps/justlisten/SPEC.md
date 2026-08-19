# JustListen — Spec

JustListen is "JustWatch, but for music": search for a song, see where you can
listen to it (YouTube / YouTube Music, Spotify, Apple Music, Deezer), and
import a playlist from any supported platform to get listen links for every
track plus ways to open the playlist on the other platforms.

This document is the single source of truth for architecture, contracts, and
file ownership. All implementation must conform to it.

## Stack & hosting (cost-minimizing)

- **One Cloudflare Worker** serves everything: the JSON API (Hono) and
  server-rendered pages (Vike). Free tier friendly: 100k requests/day, no
  separate Pages project, no Durable Objects, no D1.
- **Frontend**: Vike (`vike-react`) with SSR on Cloudflare via
  `@cloudflare/vite-plugin`, React 19, Tailwind CSS v4
  (via `@tailwindcss/vite`), reusing
  `@new-personal-monorepo/small-app-design-system` (exports: `AppHeader`,
  `Card`, `ErrorBoundary`, `ErrorPill`, `PageShell`, `Tabs`/`Tab`,
  `TextInput`, `TextArea`, `cx`; styles at
  `@new-personal-monorepo/small-app-design-system/styles.css`).
- **Storage**: two KV namespaces:
  - `CACHE` — long-lived per-song/per-provider resolution data.
  - `PLAYLISTS` — ephemeral imported playlists, `expirationTtl` 7 days.
- **Cache API** (`caches.default`) for high-volume, short-TTL responses
  (autocomplete). Cache API is free/unlimited (per-PoP); KV free tier allows
  only ~1k writes/day, so high-churn data must NOT go to KV.

## Directory layout (`apps/justlisten/`)

```
package.json          # all deps declared here up-front; nx targets
wrangler.jsonc        # worker config: main=vike:server-entry, assets, KV
tsconfig.json         # one project: src + pages + worker + +server.ts
vite.config.ts        # cloudflare() BEFORE vike(); react + tailwind
+server.ts            # Worker entry: Hono /api/* + vike() SSR catch-all
SPEC.md               # this file
README.md             # setup, secrets, deploy, cost notes
pages/                # Vike filesystem routing
  +config.ts          # extends vike-react; default title/description
  +Layout.tsx         # ErrorBoundary + PageShell + styles import
  index/+Page.tsx           # /            hero + autocomplete
  search/+Page.tsx          # /search?q=…  full cross-catalog results
  import/+Page.tsx          # /import      paste playlist URL
  song/@provider/@id/
    +data.ts          # SSR: loadSongDetail() in-process (no HTTP hop)
    +title.ts         # runtime title (functions can't live in +config)
    +Page.tsx
  playlist/@id/
    +data.ts          # SSR: loadPlaylistView() in-process
    +title.ts
    +Page.tsx
  _error/+Page.tsx    # 404 / 500, rendering the abort reason
worker/
  types.ts            # ALL shared domain types + provider interface
  cache.ts            # Cache API + KV helpers (two-tier cache)
  playlists.ts        # ephemeral playlist storage (KV) + loadPlaylistView
  song.ts             # loadSongDetail: track + cross-provider links
  export.ts           # playlist CSV serialization (pure)
  page-env.ts         # universal middleware: Worker bindings → pageContext
  workers-globals.d.ts # caches.default, absent from the DOM lib
  routes/
    search.ts         # GET /api/search, GET /api/search/all
    playlist.ts       # POST /api/playlists, GET /api/playlists/:id/export.csv
  providers/
    index.ts          # provider registry
    spotify.ts
    apple.ts          # iTunes Search API (no auth)
    youtube.ts
    deezer.ts         # Deezer public API (no auth) — lead search catalog
    matching.ts       # ISRC + normalized-title cross-provider matching
    aggregate.ts      # cross-catalog search merging (pure functions)
    links.ts          # deep-link / search-link builders + Deezer embed
                      # resolution (pure functions)
worker/__tests__/     # vitest unit tests (pure logic only: matching, links,
                      # url parsing; no network)
src/
  api.ts              # typed fetch client — only the interactive calls
  components/         # SearchBox (autocomplete), PlaylistView, ProviderBadge, …
  styles.css          # tailwind + design-system import
```

## Environment / bindings (wrangler.jsonc)

- `main: "vike:server-entry"` — Vike wraps `+server.ts` as the Worker entry.
  `@cloudflare/vite-plugin` generates the deployed config into
  `dist/server/wrangler.json` at build time.
- `assets.directory: "./dist/client"` with
  `run_worker_first: ["/api/*"]` — Workers Assets intercepts before the Worker
  and only answers GET/HEAD, so without this the playlist POST returns 405.
- KV: `CACHE`, `PLAYLISTS` (placeholder ids + README instructions;
  `wrangler dev` uses local simulations automatically).
- Secrets (all OPTIONAL — app must degrade gracefully): `SPOTIFY_CLIENT_ID`,
  `SPOTIFY_CLIENT_SECRET`, `YOUTUBE_API_KEY`. They live in 1Password
  (`Dev Secrets` → `justlisten-production`); `.env.example` holds
  `secret://op/...` references that `secreq run` materializes, and
  `tools/secrets.mjs` pushes them via `wrangler secret bulk`.
  - No Spotify creds → Spotify is skipped as a search catalog and Spotify
    links become search links.
  - No YouTube key → YouTube links are `https://music.youtube.com/search?q=…`
    search links. Playlist import still works via the public page scrape.
  - Deezer and Apple/iTunes need no credentials, so the app works with zero
    secrets — including full search, since Deezer leads the catalog order.

## Shared types (`worker/types.ts`) — the contract

```ts
export type ProviderId = 'spotify' | 'apple' | 'youtube' | 'deezer';

/** Runtime constants, exported from types.ts so the SPA can import them
 *  without pulling in provider implementations. */
export const PROVIDER_IDS: readonly ProviderId[];        // canonical order
export const SEARCH_CATALOG_IDS: readonly ProviderId[];  // deezer, spotify, apple

export interface ProviderLink {
  provider: ProviderId;
  kind: 'exact' | 'search';   // exact = resolved item; search = query deep-link
  url: string;
}

export interface Track {
  provider: ProviderId;        // provider that sourced this metadata
  id: string;                  // provider-native id
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;        // ISO date or year
  artworkUrl?: string;
  durationMs?: number;
  isrc?: string;
}

export interface SearchResult extends Track {}   // autocomplete rows

/** One recording on the full search page, merged across catalogs. */
export interface AggregatedSearchResult {
  track: SearchResult;                              // richest merged record
  sources: { provider: ProviderId; id: string }[];  // catalogs listing it
}

export interface SearchCatalogStatus {
  provider: ProviderId;
  available: boolean;   // false = credentials not configured
  ok: boolean;          // false = queried but errored
  count: number;        // rows contributed before merging
}

export interface AggregatedSearch {
  query: string;
  results: AggregatedSearchResult[];
  catalogs: SearchCatalogStatus[];
}

export interface SongDetail {
  track: Track;
  links: ProviderLink[];       // one per PROVIDER_IDS entry, always all present
}

export interface Playlist {
  id: string;                  // random url-safe id (crypto)
  title: string;
  sourceProvider: ProviderId;
  sourceUrl: string;
  createdAt: string;           // ISO
  tracks: PlaylistTrack[];
}

export interface PlaylistTrack {
  track: Track;
  links: ProviderLink[];
  resolved?: boolean;          // has had a live cross-provider lookup
}

export interface ResolvedMatch {
  link: ProviderLink;
  matched?: Track;             // the matched track, when kind === 'exact'
}

export interface PlaylistOpenLinks {
  provider: ProviderId;
  kind: 'exact' | 'search';
  url: string;
  label: string;               // e.g. "Open on Spotify", "Find on YouTube Music"
}

export interface Env {
  CACHE: KVNamespace;
  PLAYLISTS: KVNamespace;
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  YOUTUBE_API_KEY?: string;
}

export interface MusicProvider {
  id: ProviderId;
  available(env: Env): boolean;
  search(env: Env, q: string, limit: number): Promise<SearchResult[]>;
  getTrack(env: Env, id: string): Promise<Track | null>;
  /** Resolve this provider's link for a track sourced elsewhere. */
  resolve(env: Env, track: Track): Promise<ProviderLink>;
  /** Parse a playlist URL owned by this provider; null if not theirs. */
  parsePlaylistUrl(url: string): { playlistId: string } | null;
  getPlaylist(env: Env, playlistId: string): Promise<{ title: string; tracks: Track[] } | null>;
}
```

Error convention: API errors are `{ error: string }` with proper HTTP status.
Provider failures during aggregation must never 500 the whole response —
degrade to `kind: 'search'` links.

## API endpoints

- `GET /api/search?q=<text>&limit=8` → `SearchResult[]`
  - Uses ONE metadata provider for autocomplete — the first available entry
    of `SEARCH_CATALOG_IDS` (Deezer, then Spotify, then iTunes). Do not fan
    out to all providers per keystroke (cost/quota).
  - Deezer leads because it is keyless (autocomplete works in a zero-secret
    deploy), indexes independent releases the other catalogs miss, and
    returns an ISRC on every row — which the song page then resolves from
    exactly. iTunes search rows carry no ISRC, so before Deezer the
    ISRC-first path in `matching.ts` was unreachable from a searched track.
  - Cached with Cache API, TTL 3600s, key = catalog + limit + normalized
    query. 400 on empty q.
- `GET /api/search/all?q=<text>&limit=25` → `AggregatedSearch`
  - Backs the dedicated `/search` page. Unlike autocomplete this IS a
    fan-out: every available `SEARCH_CATALOG_IDS` entry is queried
    concurrently, and one catalog failing or being unconfigured must not deny
    the user the others' results (`catalogs[]` reports each outcome).
  - Merged by `providers/aggregate.ts`: rows join when their ISRCs match, or
    when their `normKey` matches AND durations agree within
    `DURATION_BONUS_WINDOW_MS`. The duration guard is required —
    `normalizeTitle` strips "(Live …)" / "- 2013 Remaster" as noise, so
    distinct takes of one song share a normalized key and would otherwise
    collapse into a single row.
  - Ordering is by first appearance, so the lead catalog's relevance ranking
    survives; rows are NOT re-sorted by how many catalogs carry them.
  - Never queries the YouTube Data API. Cached with Cache API, TTL 6h.
- `POST /api/playlists` body `{ url: string }` → `{ id: string }`
  - Detects provider from URL (`parsePlaylistUrl` across registry), fetches
    tracks (cap at 100), resolves links for each track (reusing the KV match
    cache; resolve sequentially in small batches to stay under subrequest
    limits), stores `Playlist` in `PLAYLISTS` KV with 7-day TTL.
  - Supported: Spotify public playlists/albums, YouTube playlists, Deezer
    public playlists/albums, Apple Music public
    playlists via the iTunes/Apple embed lookup —
    if Apple playlist fetch proves infeasible without a MusicKit token,
    return a clear 422 explaining it and document in README.
- `POST /api/playlists/:id/resolve` body `{ from: number }` →
  `{ tracks, from, done }`
  - Finishes cross-provider links for the next 8 rows and writes them back to
    KV. Exists because resolution cannot fit in one invocation: Workers Free
    allows 50 subrequests per invocation, while KV draws on a *separate* 1,000
    internal-services budget. Import resolves 20 live + 20 cache-only; the
    playlist page walks the rest from the browser, each call a fresh
    invocation with a fresh budget.
  - Rows carry `resolved: true` once live-resolved, so a track that matches
    nowhere is not retried on every page view.
- `GET /api/playlists/:id/export.csv` → `text/csv` attachment
  - Columns: Title, Artist, Album, ISRC, Release Date, then one per
    `PROVIDER_IDS` entry (Spotify, Apple Music, YouTube, Deezer). Per-platform cells carry a URL only for `kind: 'exact'` links —
    a search link is a query, not a track. Pure string building in
    `worker/export.ts`; no network, KV, or subrequests. Exists because no
    platform accepts a file as a write path (Apple's native import matches
    only your local library), so the CSV is the handoff to transfer services
    that do hold per-user credentials. 404 when expired/unknown.

### Page data (SSR, not endpoints)

Song and playlist pages load in their `+data.ts` hooks, which call the worker
modules in-process — the Worker already holds the bindings, so routing through
this app's own HTTP API would only spend a subrequest. `GET /api/song/…` and
`GET /api/playlists/:id` were removed along with the client-side fetching they
existed for.

- `worker/song.ts` → `loadSongDetail(env, provider, id)`
  - Fetches the source track, then resolves the other providers via
    `matching.ts` (ISRC first — iTunes supports `lookup?isrc=`; Spotify
    supports `search?q=isrc:<code>` — then normalized `artist title` search).
  - Per-provider resolution cached in KV: key
    `match:<isrc-or-normkey>:<provider>`, `expirationTtl` 30 days. The
    assembled detail is Cache-API cached 24h. Returns null for a miss, which
    the hook turns into `render(404, …)`; provider failures degrade to
    `kind: 'search'` links rather than failing the page.
- Cross-provider resolution returns `ResolvedMatch`, not just a link. The
  matched track is cached alongside it, and the importer and song loader copy
  its `artworkUrl`, `isrc`, and `album` onto their own row — a Spotify embed
  scrape carries none of those, so without this an imported playlist shows no
  cover art at all.
- `worker/playlists.ts` → `loadPlaylistView(env, id)`
  - The stored playlist plus `open` links: exact source-platform URL; for the
    other platforms a search link for the playlist title (true cross-platform
    playlist creation requires per-user OAuth — out of scope, documented in
    README). A miss aborts with the friendly expiry message.

## Frontend behavior

- **HomePage**: hero, tagline, big `SearchBox` with debounced (250ms)
  autocomplete dropdown showing artwork, title, artist, album, release year;
  keyboard navigation (↑/↓/Enter/Esc); click → `/song/:provider/:id`. Link to
  `/import`.
- **SearchBox**: the dropdown always ends with a "Search every platform for
  …" row (including on the empty state — autocomplete queries one catalog, so
  an empty dropdown is precisely when the wider search is worth offering).
  Enter opens the highlighted row, or `/search?q=…` when nothing is
  highlighted.
- **SearchPage** (`/search?q=…`): full cross-catalog results. Per row:
  artwork, title, artist, album · year · duration, and provider badges naming
  every catalog that lists the recording — that availability comes free from
  the server-side dedupe, with no per-provider resolution. Footer names the
  catalogs searched, any skipped for missing credentials, and any that
  errored, plus a note that YouTube Music links resolve on the song page.
- **SongPage**: artwork, title/artist/album/release date, prominent
  "Listen on" buttons for every provider (exact matches styled apart from
  "Search on …" fallbacks — the button labels carry that distinction, so no
  explanatory caption), then the Deezer player. Server-rendered, so there is
  no loading skeleton; a miss aborts to the error page.
- **ImportPage**: paste URL, submit → POST, redirect to `/playlist/:id`.
  Explain supported URL shapes + ephemerality (7 days).
- **PlaylistPage**: title, source badge, "Open on …" buttons, per-track rows
  (artwork, title, artist + three provider link icons), copyable share URL,
  expiry note. Handle 404/expired gracefully.
- Provider branding: simple colored text/badge components (green Spotify,
  red YouTube, rose Apple) — no trademarked logo assets.

## Nx / repo integration

`package.json` name `justlisten`, `"private": true`, `"type": "module"`,
scripts: `dev` (`wrangler dev` after an initial client build — simplest:
`vite build && wrangler dev`), `build` (`vite build`), `typecheck`
(`tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.worker.json`),
`test` (`vitest run`), `deploy` (`vite build && wrangler deploy`). Add nx
target config making `build` depend on `typecheck` (mirror qr-generator).
Dependencies pinned to versions compatible with the workspace catalog
(react 19.1.x, vike + vike-react from the workspace catalog, tailwindcss
^4.1); dev deps include
`wrangler` (v4), `hono`, `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`,
`vitest`, `typescript`. Do NOT add dependencies beyond what SPEC requires.

## Keyless playlist import (scraping)

Spotify and YouTube playlist import each have two tiers: the credentialed API
when a key exists, and a public-page scrape when it does not. Verified
end-to-end with zero credentials on 2026-08-19 — both imported, and the
Spotify tracks still resolved Apple and Deezer links off title/artist/duration.

- **Spotify** — `open.spotify.com/embed/{kind}/{id}`, parse
  `<script id="__NEXT_DATA__">` → `props.pageProps.state.data.entity`. Gives
  `name` plus a `trackList` of up to **100** (the importer's own cap) with
  title, `subtitle` (artist), `uri` → track id, and duration. No ISRC and no
  album, so those tracks match on normalized title/artist/duration rather than
  exactly — which is why the API is still preferred when credentials exist. A
  private or missing playlist renders with `data: null`, so a miss is
  detectable rather than silently empty.
- **YouTube** — `youtube.com/playlist?list={id}`, parse `var ytInitialData`.
  YouTube migrated playlist rows from `playlistVideoRenderer` to
  **`lockupViewModel`**; against today's HTML the old selector finds 0 rows and
  the new one finds 100. This tier matters more than Spotify's, because
  `playlistItems.list` costs 50 quota units of a 10,000/day budget and the
  public page costs none.
- **Dead ends, so nobody re-explores them.** The embed blob also carries an
  anonymous bearer token at `props.pageProps.state.settings.session.accessToken`;
  `api.spotify.com` answers it with `429 QUOTA_EXCEEDED` immediately, so it
  restores neither ISRC nor pagination. And none of this can move to the
  browser: neither page sends `access-control-allow-origin` (YouTube adds
  `x-frame-options: SAMEORIGIN`), so a client-side fetch cannot read the
  response. Of the keyless providers only iTunes is browser-readable
  (`access-control-allow-origin: *`); Deezer sends allow-headers/methods/
  credentials but *no* allow-origin, so it too must be called server-side.
- **Unverified in production**: local `wrangler dev` runs on the developer's
  own IP. Worker egress comes from Cloudflare ranges, which YouTube may treat
  differently. Both tiers fail closed to the credentialed path, so a block
  degrades import rather than breaking it.

## Deezer widget embed

Deezer is the only supported platform whose player embeds with no account, API
key, or SDK, so it is what lets a page actually play rather than only link out.

- `deezerEmbedFromUrl` / `deezerEmbedFromLinks` in `providers/links.ts` pull
  the embeddable resource out of an **exact** Deezer link (a search link is a
  query, not a resource), tolerating the locale segment on shared URLs.
- **Song page** shows a track player below the "Listen on" links whenever a
  Deezer match exists — including for a song reached via Apple, Spotify, or
  YouTube, since cross-provider matching resolves the Deezer link. The links
  are what the page is for; the player is a bonus, so it sits last and carries
  no caption.
- **Playlist page** shows a playlist/album player only when the playlist was
  imported *from* Deezer.
- `https://widget.deezer.com/widget/light/{type}/{id}?tracklist=&radius=true`,
  `allow="encrypted-media; clipboard-write"`, `loading="lazy"`. Theme is
  `light`, not `auto`: the design system has no dark theme, so `auto` would
  follow the OS and leave a dark player on a white page.
- Costs nothing: a third-party iframe, no API call, no subrequest, no key.

## Cost guardrails (recap)

- Autocomplete: single upstream provider + Cache API (never KV).
- Full search (`/api/search/all`): fan-out is bounded to the keyless/cheap
  catalogs and cached 6h — it is user-initiated, never per-keystroke. The 6h
  TTL also shields Deezer's ~50-request/5s per-IP limit, which Workers hit
  from shared per-PoP egress addresses.
- KV writes only for long-TTL match/track data and playlist imports.
- YouTube Data API used only when key present, only for detail-page
  resolution and playlist import (search costs 100 quota units — never used
  for autocomplete).
- Playlist import capped at 100 tracks; link resolution batched.
