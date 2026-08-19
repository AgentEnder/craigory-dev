# JustListen — Spec

JustListen is "JustWatch, but for music": search for a song, see where you can
listen to it (YouTube / YouTube Music, Spotify, Apple Music), and import a
playlist from any supported platform to get listen links for every track plus
ways to open the playlist on the other platforms.

This document is the single source of truth for architecture, contracts, and
file ownership. All implementation must conform to it.

## Stack & hosting (cost-minimizing)

- **One Cloudflare Worker** serves everything: the JSON API (Hono) and the
  built SPA via the Workers static **assets** binding. Free tier friendly:
  100k requests/day, no separate Pages project, no Durable Objects, no D1.
- **Frontend**: React 19 + Vite SPA, `react-router-dom` v6, Tailwind CSS v4
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
wrangler.jsonc        # worker config: assets binding, KV bindings, vars
tsconfig.json         # references app + worker configs
tsconfig.app.json     # SPA (src/)
tsconfig.worker.json  # worker/ (types from wrangler/workers-types)
vite.config.ts        # react + tailwind plugins, build to dist/client
index.html
SPEC.md               # this file
README.md             # setup, secrets, deploy, cost notes
worker/
  index.ts            # Hono app: /api/* routes + assets fallback
  types.ts            # ALL shared domain types + provider interface
  cache.ts            # Cache API + KV helpers (two-tier cache)
  playlists.ts        # ephemeral playlist storage (KV)
  routes/
    search.ts         # GET /api/search
    song.ts           # GET /api/song/:provider/:id
    playlist.ts       # POST /api/playlists, GET /api/playlists/:id
  providers/
    index.ts          # provider registry
    spotify.ts
    apple.ts          # iTunes Search API (no auth)
    youtube.ts
    matching.ts       # ISRC + normalized-title cross-provider matching
    links.ts          # deep-link / search-link builders (pure functions)
worker/__tests__/     # vitest unit tests (pure logic only: matching, links,
                      # url parsing; no network)
src/
  main.tsx, App.tsx   # router + shell
  api.ts              # typed fetch client for /api/*
  components/         # SearchBox (autocomplete), TrackCard, ProviderBadge, …
  pages/
    HomePage.tsx      # hero + search
    SongPage.tsx      # /song/:provider/:id
    ImportPage.tsx    # /import — paste playlist URL
    PlaylistPage.tsx  # /playlist/:id — imported playlist view
  styles.css          # tailwind + design-system import
```

## Environment / bindings (wrangler.jsonc)

- `ASSETS` — static assets, directory `dist/client`,
  `not_found_handling: "single-page-application"`.
- KV: `CACHE`, `PLAYLISTS` (placeholder ids + README instructions;
  `wrangler dev` uses local simulations automatically).
- Secrets (via `wrangler secret put`, all OPTIONAL — app must degrade
  gracefully): `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`,
  `YOUTUBE_API_KEY`.
  - No Spotify creds → search falls back to iTunes; Spotify links become
    search links.
  - No YouTube key → YouTube links are `https://music.youtube.com/search?q=…`
    search links and YouTube playlist import is unavailable.
  - Apple/iTunes needs no credentials, so the app works with zero secrets.

## Shared types (`worker/types.ts`) — the contract

```ts
export type ProviderId = 'spotify' | 'apple' | 'youtube';

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

export interface SongDetail {
  track: Track;
  links: ProviderLink[];       // one per provider, always all 3 present
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
}

export interface PlaylistOpenLinks {
  provider: ProviderId;
  kind: 'exact' | 'search';
  url: string;
  label: string;               // e.g. "Open on Spotify", "Find on YouTube Music"
}

export interface Env {
  ASSETS: Fetcher;
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
  - Uses ONE metadata provider for autocomplete (Spotify if configured, else
    iTunes) — do not fan out to all providers per keystroke (cost/quota).
  - Cached with Cache API, TTL 3600s, key = normalized query. 400 on empty q.
- `GET /api/song/:provider/:id` → `SongDetail`
  - Fetch source track, then resolve the other two providers via
    `matching.ts` (ISRC first — iTunes supports `lookup?isrc=`; Spotify
    supports `search?q=isrc:<code>` — then normalized `artist title` search).
  - Per-provider resolution cached in KV: key `match:<isrc-or-normkey>:<provider>`,
    `expirationTtl` 30 days. Full response also Cache-API cached 24h.
- `POST /api/playlists` body `{ url: string }` → `{ id: string }`
  - Detects provider from URL (`parsePlaylistUrl` across registry), fetches
    tracks (cap at 100), resolves links for each track (reusing the KV match
    cache; resolve sequentially in small batches to stay under subrequest
    limits), stores `Playlist` in `PLAYLISTS` KV with 7-day TTL.
  - Supported: Spotify public playlists/albums, YouTube playlists (needs
    key), Apple Music public playlists via the iTunes/Apple embed lookup —
    if Apple playlist fetch proves infeasible without a MusicKit token,
    return a clear 422 explaining it and document in README.
- `GET /api/playlists/:id` → `Playlist & { open: PlaylistOpenLinks[] }`
  - `open` links: exact source-platform URL; for the other platforms a
    search link for the playlist title (true cross-platform playlist
    creation requires per-user OAuth — out of scope, documented in README).
  - 404 with friendly message when expired/unknown.

## Frontend behavior

- **HomePage**: hero, tagline, big `SearchBox` with debounced (250ms)
  autocomplete dropdown showing artwork, title, artist, album, release year;
  keyboard navigation (↑/↓/Enter/Esc); click → `/song/:provider/:id`. Link to
  `/import`.
- **SongPage**: artwork, title/artist/album/release date, prominent
  "Listen on" buttons for all three providers (distinguish exact match vs
  "Search on …" fallback styling), loading skeleton, error state.
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
(react 19.1.x, react-router-dom 6.30.x, tailwindcss ^4.1); dev deps include
`wrangler` (v4), `hono`, `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`,
`vitest`, `typescript`. Do NOT add dependencies beyond what SPEC requires.

## Cost guardrails (recap)

- Autocomplete: single upstream provider + Cache API (never KV).
- KV writes only for long-TTL match/track data and playlist imports.
- YouTube Data API used only when key present, only for detail-page
  resolution and playlist import (search costs 100 quota units — never used
  for autocomplete).
- Playlist import capped at 100 tracks; link resolution batched.
