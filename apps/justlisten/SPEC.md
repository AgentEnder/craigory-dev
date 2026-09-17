# JustListen — Spec

JustListen is "JustWatch, but for music": search for a song, see where you can
listen to it (YouTube / YouTube Music, Spotify, Apple Music, Deezer, Bandcamp,
Last.fm, Pandora), and import a playlist from any supported platform to get
listen links for every track plus ways to open the playlist on the other
platforms.

The seven are not seven of a kind, and the differences are load-bearing:
**Spotify, Apple Music, YouTube Music and Deezer** are licensed catalogs that
can be searched and resolved against. **Bandcamp** is artist-uploaded, so it
carries a long tail none of the four index — and almost none of what they do.
**Last.fm** is not a streaming service at all; it is the scrobble ledger the
others report into, so it knows a recording whether or not anyone licenses it.
**Pandora** publishes no public API of any kind, so it is link-only: it can be
pasted, and it can be learned from a paste (see `seedSourceMatch`), but it can
never be searched.

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
    playlist.ts       # POST /api/playlists (any pasted music link),
                      # GET /api/playlists/:id/export.csv
  providers/
    index.ts          # provider registry
    spotify.ts
    apple.ts          # iTunes Search API (no auth)
    youtube.ts
    deezer.ts         # Deezer public API (no auth) — lead search catalog
    bandcamp.ts       # keyless search endpoint + public-page scrape
    lastfm.ts         # ws.audioscrobbler.com (needs LASTFM_API_KEY)
    pandora.ts        # link-only: no API exists; pure URL <-> track naming
    matching.ts       # ISRC + normalized-title cross-provider matching
    aggregate.ts      # cross-catalog search merging (pure functions)
    links.ts          # deep-link / search-link builders + Deezer embed
                      # resolution (pure functions)
                      # (UI: src/components/DeezerPlayer.tsx holds the one
                      #  player shared by the playlist and search pages)
  musicbrainz/
    index.ts          # keyless ISRC → streaming-URL oracle (see below)
    parse.ts          # url-rels → ProviderLink[] (pure)
  reccobeats/
    index.ts          # ReccoBeats client: audio features, ISRC backfill,
                      # recommendations. NOT a provider — see below.
    parse.ts          # ReccoBeats response mapping (pure functions)
worker/__tests__/     # vitest unit tests (pure logic only: matching, links,
                      # url parsing; no network)
src/
  api.ts              # typed fetch client — only the interactive calls
  components/         # SearchBox (autocomplete), PlaylistView, ProviderBadge, …
  styles.css          # tailwind + design-system import
```

## MusicBrainz — the keyless fallback oracle

**The problem.** In a zero-credential deployment five of the seven providers
cannot produce an exact link *by construction*: Spotify, YouTube and Last.fm
each return a search link the moment `available(env)` is false, Pandora has no
API at all, and Bandcamp's 0.8 threshold means it rarely claims a mainstream
recording. That leaves Apple and Deezer — and on a page reached from a Deezer
search, Deezer's link is built from the id with no network at all. The result a
user actually sees is one real link and six search boxes, which reads as the app
not working.

**Why MusicBrainz and not another search.** Every other resolution path searches
a platform and then has to decide whether the result is the same recording —
the fuzzy scoring in `matching.ts`. MusicBrainz is looked up **by ISRC**, so
identity is asserted by the recording code rather than guessed, and its URL
relationships are exactly the cross-platform mapping the other providers are
being asked to infer. No key, no scoring, no threshold.

**How a URL becomes a link.** `musicbrainz/parse.ts` runs each relationship URL
through the registry's own `parseTrackUrl` implementations rather than adding a
second set of patterns — so a MusicBrainz link and a pasted link are understood
identically, including Apple's `?i=` album URLs, Deezer's locale prefix and
Bandcamp's custom domains. Providers are tried in `PROVIDER_IDS` order and the
first claim wins, which is what stops Bandcamp's host-permissive parser taking a
URL belonging to a host-locked provider. A URL nothing claims (Tidal, Amazon,
SoundCloud, Wikipedia) is dropped, as is any relationship marked `ended: true` —
a delisted URL looks exact and goes nowhere, which is worse than a search link.

**Only the gaps.** `song.ts` calls the oracle solely for providers that already
came back `kind: 'search'`, and only when the track carries an ISRC. A provider
that resolved on its own keeps its own answer: that one arrived with the matched
track's artwork and album, which a bare URL relationship does not carry.
Whatever the oracle does supply is written into the match cache via
`seedResolvedLink`, so playlist rows and later views of the same recording get
it without a second lookup.

**Coverage is uneven and that is expected.** The relationships are
editor-contributed: good on well-known releases, thin on the long tail, and
better for free streaming (YouTube) than for the subscription services. It is a
supplement, never a replacement.

**Rate limit.** ~1 request/second per IP, and a descriptive User-Agent naming
the application and a contact is *required* — this is the opposite of the
browser-impersonating UA `scrape/fetch-page.ts` sends, and must not be replaced
with one. Volume is tiny in practice: one request per recording per 30 days,
behind the KV cache and the song page's 24h memo. A 503 (how MusicBrainz reports
throttling) caches nothing, so a momentary burst cannot suppress the oracle for
a month; a 404 caches an empty result for 7 days.

## ReccoBeats — a metadata source, not a provider

[ReccoBeats](https://reccobeats.com) supplies three things the seven providers
cannot, and is deliberately **not** a `ProviderId`.

**Why not a provider.** `MusicProvider` answers "where can I listen to this".
ReccoBeats has no player and no human-facing track page, so a "Listen on
ReccoBeats" button would go nowhere, a `PROVIDER_IDS` entry would put a
permanently-empty column in the CSV export, and `SEARCH_CATALOG_IDS` membership
would offer rows nobody can play. It sits beside the registry in
`worker/reccobeats/` and enriches what the registry produces.

**What it supplies.**

1. **Audio features** — tempo, key, mode, loudness, and seven 0–1 measures, on
   Spotify's own field names and scales. Spotify deprecated `/v1/audio-features`
   on 2024-11-27 with no replacement, which is largely why ReccoBeats exists.
   The values are ReccoBeats' estimates, not Spotify's originals, and there is
   no `time_signature` — ReccoBeats does not return one.
2. **An ISRC for a Spotify track id.** The quieter win, and the reason this is
   wired in *before* resolution rather than after. The keyless Spotify path
   (the embed scrape) produces tracks carrying no ISRC, which this document
   already names as why those fall back to fuzzy title/artist/duration matching
   everywhere. An ISRC in hand before `resolveTrackOnProvider` runs turns six
   fuzzy lookups into exact identity matches.
3. **Recommendations** — "more like this", rendered as rows linking to this
   app's own `/song/spotify/:id`.

**Lookup key is always a Spotify track id** (or a ReccoBeats UUID). That reads
like a Spotify-only restriction and is not: the song page has already resolved
a Spotify link for every track it renders, so a Deezer- or Bandcamp-sourced
recording reaches ReccoBeats through the Spotify id in its own resolved links
(`spotifyIdFor` in `song.ts`). The asymmetry that remains is about *timing*, and
it is inherent: only a Spotify-sourced track has its id early enough for the
ISRC to improve its own page's matching. Everything else is enriched after
resolution, which still fills the 30-day KV entry for the next render.

**Cost.** Two requests for the bundle (track lookup, then audio features) plus
one for recommendations, all inside the song page's 24h Cache-API memo. The
bundle is additionally cached in KV under `recco:<spotifyId>` — one entry
holding UUID, ISRC and features together, because all three are immutable facts
about a recording and all three are wanted at once. Keying on the *Spotify* id
rather than the page's own provider/id collapses the seven `/song/:provider/:id`
URLs that reach one recording into a single KV entry, so the second platform's
page costs a KV read instead of two more HTTP calls. Misses are cached too (7
days, shorter than a hit's 30 — ReccoBeats' catalog grows), but only durable
misses: a 404 is cached, a 429 or an outage is not, or a five-minute rate limit
would suppress features for a week.

**Recommendations are not KV-cached.** They are a model's answer rather than a
fact about the recording, so they are allowed to move, and KV's ~1k-writes/day
budget has a much stronger claimant in the match cache.

**Rate limits and failure.** No credentials; free; rate-limited with limits
ReccoBeats does not publish, answering 429 with `Retry-After`. That header is
deliberately not honoured — a Worker cannot wait inside a user's request, and a
song page that hangs to be polite about somebody else's quota is a worse page.
Every function returns null rather than throwing and every caller treats null as
"no enrichment", so a ReccoBeats outage renders the song page exactly as it
looked before any of this existed.

**UNVERIFIED AGAINST THE LIVE API.** Unlike every other upstream here, no call
in `reccobeats/` has been executed against the real service: the network policy
on the machine this was built on returns 403 for `reccobeats.com` and
`api.reccobeats.com` alike. Endpoint paths and field names come from ReccoBeats'
published docs and other public consumers. Two consequences are baked into the
code rather than left as a warning: `listRows` accepts the list envelope in any
of its plausible shapes (bare array, or rows under `content` / `data` /
`tracks`) rather than betting on one and failing closed, and every field is
range-checked at the boundary so a misread field is dropped instead of rendering
as `NaN`. **First live deploy should confirm the shapes** and then this
defensiveness can be narrowed to what the service actually sends.

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
  `SPOTIFY_CLIENT_SECRET`, `YOUTUBE_API_KEY`, `LASTFM_API_KEY`, plus
  `TRACE_TOKEN` (not a provider credential — it gates the debug trace endpoint).
  They live in 1Password
  (`Dev Secrets` → `justlisten-production`); `.env.example` holds
  `secret://op/...` references that `secreq run` materializes, and
  `tools/secrets.mjs` pushes them via `wrangler secret bulk`.
  - No Spotify creds → Spotify is skipped as a search catalog and Spotify
    links become search links.
  - No YouTube key → YouTube links are `https://music.youtube.com/search?q=…`
    search links. Playlist import still works via the public page scrape.
  - No Last.fm key → Last.fm is skipped as a search catalog and its links
    become search links. It has no keyless tier at all: every
    `ws.audioscrobbler.com` method requires `api_key`.
  - Deezer, Apple/iTunes and Bandcamp need no credentials, so the app works
    with zero secrets — including full search, since Deezer leads the catalog
    order.
  - Pandora needs no credentials and cannot use any: there is no public API to
    authenticate against.

## Shared types (`worker/types.ts`) — the contract

```ts
export type ProviderId =
  | 'spotify' | 'apple' | 'youtube' | 'deezer'
  | 'bandcamp' | 'lastfm' | 'pandora';

/** Runtime constants, exported from types.ts so the SPA can import them
 *  without pulling in provider implementations. */
export const PROVIDER_IDS: readonly ProviderId[];        // canonical order
// deezer, spotify, apple, bandcamp, lastfm — YouTube is excluded (search.list
// costs 100 quota units) and Pandora is excluded (no search API exists).
export const SEARCH_CATALOG_IDS: readonly ProviderId[];

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
  audioFeatures?: AudioFeatures;  // ReccoBeats; absent when unknown
  similar?: Track[];              // ReccoBeats recommendations, as spotify tracks
}

/** ReccoBeats audio features — Spotify's names and scales, no time_signature.
 *  Every field optional: the response shape is unverified (see above). */
export interface AudioFeatures {
  tempo?: number;              // BPM
  key?: number;                // pitch class 0=C..11=B; absent when undetected
  mode?: number;               // 1 major, 0 minor
  loudness?: number;           // full-scale dB, negative
  acousticness?: number; danceability?: number; energy?: number;
  instrumentalness?: number; liveness?: number; speechiness?: number;
  valence?: number;            // all 0–1
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
  LASTFM_API_KEY?: string;
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
  /** Parse a single-track URL owned by this provider; null if not theirs. */
  parseTrackUrl(url: string): { trackId: string } | null;
  getPlaylist(env: Env, playlistId: string): Promise<{ title: string; tracks: Track[] } | null>;
}
```

### Track ids

Four providers name a track with an opaque token that drops into
`/song/:provider/:id` unchanged. Three name it with a *tuple*, which
`providers/links.ts` packs into one path segment (that route matches a single
segment) and unpacks again:

| Provider | `Track.id` | Example |
|---|---|---|
| bandcamp | `<host>:<slug>` | `radiohead.bandcamp.com:airbag` |
| lastfm | `<artist>~<title>` | `Queen~Bohemian+Rhapsody` (URL-encoded) |
| pandora | `<artist>:<album>:<track>` slugs | `queen:a-night-at-the-opera:bohemian-rhapsody` |

Each part is URL-encoded and the separator is then percent-escaped explicitly,
because `encodeURIComponent` leaves `~` alone — without that, an artist named
"~" would re-split the id in the wrong place and produce a confident link to
the wrong song. `parseBandcampTrackId` additionally rejects a host that is not
`[a-z0-9.-]+`: the host is interpolated into the URL, so a decoded `/` or `@`
would point an "exact" link at another origin. An id that will not parse
degrades to a `kind: 'search'` link rather than building a broken "exact" one.

Bandcamp carries the host rather than assuming `<artist>.bandcamp.com` because
Bandcamp serves paying artists on their own domains, where the page — and the
`data-tralbum` blob the parser reads — is byte-for-byte the same.

Error convention: API errors are `{ error: string }` with proper HTTP status.
Provider failures during aggregation must never 500 the whole response —
degrade to `kind: 'search'` links.

## API endpoints

- `GET /api/search?q=<text>&limit=8` → `SearchResult[]`
  - Uses ONE metadata provider for autocomplete — the first available entry
    of `SEARCH_CATALOG_IDS` (Deezer, then Spotify, iTunes, Bandcamp, Last.fm).
    Do not fan out to all providers per keystroke (cost/quota). In practice
    this is always Deezer, since it is keyless.
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
  - Bandcamp and Last.fm rows carry no ISRC and no duration, so they can only
    ever join a group on the normalized key — the duration guard abstains
    rather than blocking (see `durationsCompatible`). They also score low on
    `metadataRichness`, so they contribute *availability* to a row without
    becoming the row's representative and dragging its artwork or album down.
  - Merged by `providers/aggregate.ts`: rows join when their ISRCs match, or
    when their `normKey` matches AND durations agree within
    `DURATION_BONUS_WINDOW_MS`. The duration guard is required —
    `normalizeTitle` strips "(Live …)" / "- 2013 Remaster" as noise, so
    distinct takes of one song share a normalized key and would otherwise
    collapse into a single row.
  - Ordering is by first appearance, so the lead catalog's relevance ranking
    survives; rows are NOT re-sorted by how many catalogs carry them.
  - Never queries the YouTube Data API. Cached with Cache API, TTL 6h.
- `POST /api/playlists` body `{ url: string }` → `PastedLinkResult`
  - The endpoint behind the search box's paste affordance, so it answers for
    any music link. People paste one song as often as a collection — a
    `youtube.com/watch?v=…` link is what a desktop browser hands you — so it
    reports *what the link was* and the client routes on `kind`.
  - **Playlist** (`parsePlaylistUrl` across the registry): fetches tracks
    (cap at 100), resolves links for each track (reusing the KV match cache;
    resolve sequentially in small batches to stay under subrequest limits),
    stores `Playlist` in `PLAYLISTS` KV with 7-day TTL →
    **201** `{ kind: 'playlist', id }`.
  - **Single track** (`parseTrackUrl`, tried *second* so a watch URL carrying
    `list=` still imports its playlist) → **200**
    `{ kind: 'song', provider, id }`. Pure parsing: no fetch, no KV write,
    nothing created — hence 200, not 201 — and `/song/:provider/:id` owns the
    lookup and its own 404.
  - Supported collections: Spotify public playlists/albums, YouTube playlists,
    Deezer public playlists/albums, Apple Music public
    playlists via the iTunes/Apple embed lookup, and Bandcamp albums —
    if Apple playlist fetch proves infeasible without a MusicKit token,
    return a clear 422 explaining it and document in README.
    Last.fm and Pandora have **no** importable collections and their
    `parsePlaylistUrl` always returns null: Last.fm's playlist API was retired
    and what remains is a personal feed behind a session; a Pandora station is
    an algorithm rather than a track list, and `pandora.com/playlist/PL:…`
    needs a signed-in session to enumerate. Returning null routes those to the
    422 that names what *is* supported, rather than to a "could not import"
    that implies it might work next time.
  - Supported tracks: `open.spotify.com/track/…`, Apple `…/song/…` and album
    URLs carrying `?i=`, `youtube.com/watch?v=…` / `youtu.be/…` /
    `music.youtube.com/watch?v=…`, `deezer.com/track/…`, any `…/track/<slug>`
    Bandcamp page, `last.fm/music/<artist>/_/<track>`, and
    `pandora.com/artist/<artist>/<album>/<track>` (with or without the
    trailing `TR…` share token, which is dropped so two links to one track
    produce one id).
  - **Bandcamp's parsers are host-permissive**, matching `/track/<slug>` and
    `/album/<slug>` on *any* host, because custom domains are a real Bandcamp
    deployment and only the host distinguishes them. That is safe because
    every earlier provider's parser is host-locked and the registry is tried
    in `PROVIDER_IDS` order, so Bandcamp can never claim a link that belongs
    to one of them; a `/track/…` URL on some unrelated host parses, then fails
    to yield a `data-tralbum` blob, and the song page 404s.
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

- `GET /api/song/:provider/:id/trace?token=…` → per-provider resolution report
  - Debug only, and **absent unless `TRACE_TOKEN` is set** — it 404s exactly as
    an unregistered path does, so its presence is not discoverable by probing.
  - Answers "why is this a search link?", which currently has five
    indistinguishable causes: no credentials, no such recording, a 403 from a
    shared-IP rate limit, a below-threshold score, or a request shape that was
    never verified live. Reports each provider's outcome plus its raw events,
    and the `musicbrainz` / `reccobeats` layers separately.
  - **Bypasses the 24h song memo**, necessarily: a trace of a cache hit records
    nothing, because none of the instrumented code runs. That is also why it is
    gated — an uncached fan-out across every upstream, on demand, is how a
    Worker's shared egress IP gets throttled by iTunes and MusicBrainz.
  - Instrumentation is `worker/trace.ts`, an `AsyncLocalStorage` collector, so
    it costs one property read per call when off and `MusicProvider.resolve`
    never grew a debug parameter. Chokepoints: `pickBestMatch` (every provider
    scores through it), `resolveTrackOnProvider` (availability + match cache),
    and each provider's HTTP helper.
  - `summarize()` ranks causes most-upstream-first, which is load-bearing: a
    403 explains a zero-candidate result, so reporting "no candidates" there
    would send someone to fix the scorer for a rate-limit problem. `skipped` is
    only conclusive when the scope did nothing else — YouTube reports no
    credentials and *still* resolves via its keyless page scrape.

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
  - **Reads try every key the track can be filed under** (`matchKeysForTrack`):
    ISRC first, then the normalized key. Sources disagree about identity —
    Deezer and the Spotify Web API carry an ISRC, the keyless paths (YouTube
    oEmbed, Spotify embed) carry none — so reading only the preferred key
    would hide entries left by a keyless source from an ISRC-carrying one.
- **`seedSourceMatch` records the source provider's own id.** Resolution
  otherwise only caches links it went out and found, throwing away the most
  reliable datum in the request: the id a human just handed us. Seeding it
  means a later view of the same recording, sourced from another catalog, gets
  an exact link to a platform we may hold no credentials for — paste one
  Spotify link and every later visitor gets that Spotify track rather than a
  search box. It is also the only affordable way to learn YouTube video ids,
  whose `search.list` costs 100 of a 10,000-unit daily quota.
  - Filed under the **normalized** key even when an ISRC exists, because the
    readers who need it are keyless-sourced tracks that look nowhere else;
    ISRC-carrying readers still find it via the dual read above. One write,
    both readers.
  - **Writes are net-new only.** Seeding reads the key first and skips the
    write when an exact link is already on file. Reads come from a pool ten
    times larger and ten times cheaper per operation than writes (Workers
    Paid: 10M vs 1M/month included, $0.50 vs $5.00 per million), so trading
    one for the other is the right direction on either tier. First writer
    wins: an existing exact link is left alone rather than replaced by an
    equally valid alternative id (a single vs its album release), which would
    churn a write on every visit.
  - Called from `loadSongDetail` (behind the 24h Cache-API memo, so it cannot
    churn writes), from live playlist-import rows only — the cache-only pass
    exists to spend nothing — and from the aggregate search producer.
- **`seedAggregateMatches` keeps what a cross-catalog search worked out.**
  `mergeCatalogResults` already decides which rows are the same recording and
  reports each catalog's native id for it (`sources`), without spending a
  single `resolve()` call. That is the match cache's own mapping, and it used
  to be discarded when the 6h search cache expired. Every source is filed
  under the *representative's* key, since the group merged on the claim that
  its members are one recording and the representative is its richest
  description.
  - Runs inside the `cacheJson` producer, so once per distinct query per 6h —
    not per search. Measured: one 25-row search for "bohemian rhapsody" with
    two catalogs configured wrote 33 keys; re-running it wrote 0.
  - Autocomplete (`GET /api/search`) is deliberately excluded: it queries one
    catalog, so it learns no cross-provider mapping, and it fires far more
    often.
  - Skipped when the track has no id, or an artist that normalizes to empty:
    `norm:~<title>` would collide across every artist with that song title.
- **Two providers resolve unlike the rest.**
  - **Bandcamp raises its match threshold to 0.8** (default 0.6). The licensed
    catalogs mostly carry the same recording under near-identical metadata;
    Bandcamp mostly does not carry the mainstream recording at all, and what
    it does carry under that title is a cover, a bedroom remix, or an
    unrelated song, filed under whatever artist string the uploader chose. At
    0.6 those clear the bar and the row gets a confident link to the wrong
    song — the one failure mode this app cannot degrade out of, since a wrong
    "exact" link is indistinguishable from a right one.
  - **Pandora never resolves at all.** Its `resolve` returns a search link
    without a request, because there is nothing to request. The *only* way an
    exact Pandora link is ever produced for a track sourced elsewhere is the
    KV match cache, which `resolveTrackOnProvider` consults before calling any
    provider — so Pandora is the clearest case in the registry for
    `seedSourceMatch`: one person's paste is the whole supply.
  - Last.fm resolves with `track.getInfo` (its identity *is* artist + title)
    before falling back to `track.search`. `autocorrect=1` is on, so the
    answer is verified against the normalized source artist and title before
    it is trusted — autocorrect can walk far enough to name a different act.
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
  explanatory caption), the Deezer player, then the two optional ReccoBeats
  sections.
  - **Audio features** splits by job rather than rendering ten identical bars:
    tempo, key and loudness are single values on unrelated scales (BPM, a pitch
    name, dB) and are **stat tiles**; the seven 0–1 measures share one scale and
    are **bars**, which is what bars are for. One hue across all of them — there
    is one series, so a second hue would encode nothing — and that hue is
    **ink, not the accent**, because the accent is reserved for playback and
    audio features are not playback. The unfilled track is a lighter step of the
    same neutral ramp. A 0% bar renders **empty**, never a minimum-width stub: a
    sliver of ink beside the number "0%" contradicts it. Every value is present
    as text and the bar is `aria-hidden`, so the panel is its own table view and
    a screen reader gets "Energy 40%" rather than a meter widget. Attribution is
    required, not decorative — these are ReccoBeats' estimates, not Spotify's.
  - **More like this** links each row to `/song/spotify/:id`, i.e. back into
    this app. Six recommendations resolved across seven providers would be 42
    lookups on a page that has already done one; linking inward defers that to
    the click, where exactly one row gets resolved. Rows carry no artwork
    because ReccoBeats returns none and fetching it is the cost being avoided. Server-rendered, so there is
  no loading skeleton; a miss aborts to the error page.
- **Pasting lives in the search box**, not on its own page. Anything that
  parses as a URL is treated as a link to open rather than a search — no query
  starting `https://` is a useful search term — and the dropdown offers "Open
  this <service> link" instead of suggestions, naming the service when the host
  is recognised. It deliberately does *not* say "playlist" or "song": which one
  it is, is the server's call, and the client learns it from `kind` in the
  response. `src/playlist-url.ts` makes the link-vs-search call and is
  deliberately looser than the providers' own parsers: it is not a second copy
  of that logic, it only decides which of two jobs the box is doing. The server
  stays the authority and answers 422 with the supported shapes, which is now
  the only place they are documented — keep that message complete.
- **PlaylistPage**: title, source badge, "Open on …" buttons, per-track rows
  (artwork, title, artist + three provider link icons), copyable share URL,
  expiry note. Handle 404/expired gracefully.
- **The mark keeps its four gradient stops** — the one place the app is allowed
  chroma. They were one-per-service when there were four providers and were
  deliberately *not* grown when Bandcamp, Last.fm and Pandora arrived: a mark
  that must be redrawn whenever the registry changes is a mark doing the wrong
  job. The stops are chosen values, not Tailwind ramp steps, and none is a
  provider's actual brand colour.
- **Palette: ink plus one accent** (`src/styles.css` `@theme`). The app points
  at other services, so the provider colours are the only chroma that
  carries meaning; our own controls stay near-black (`--color-ink`). Exactly
  one accent, a deep teal, is reserved for playback — chosen because it is a
  saturated hue no provider claims, so a play button can never be misread
  as a platform's branding. Bandcamp's `#408294` is the near miss, which is
  why the accent is the darker and more saturated of the two and why nothing
  renders the pair adjacent at the same weight. Playback previously wore Deezer's purple and
  primary actions wore Tailwind's default blue.
- **Radius by role**: surfaces 2xl, controls xl, inputs lg, badges and icon
  buttons full. Uniform rounding flattened those roles into one shape.
- Provider branding: each service's real brand hex, with an `ink` variant that
  clears 4.5:1 for text, everywhere a label fits. Bandcamp's `#408294` is the
  one that misses unaided (4.3:1), so its ink is two steps darker rather than
  one. Marks: `SiBandcamp`, `SiLastdotfm` and `SiPandora` join the existing
  four. The playback
  banner is the exception — it uses each service's brand mark via `react-icons`
  (`SiSpotify`, `SiApplemusic`, `SiYoutubemusic`, and `FaDeezer`, since Simple
  Icons carries no Deezer mark), because at that size a word does not survive.
  Only **exact** links get an icon: a search URL would render as an identical
  mark while going somewhere else.

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
when a key exists, and a public-page scrape when it does not. **Bandcamp has
only the second tier** — there is no credentialed path to fall back to, so its
scrape is not a fallback but the only route in. Verified
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
- **YouTube track resolution** — `youtube.com/results?search_query=…&sp=EgIQAQ%3D%3D`
  (the `sp` parameter is YouTube's "Type: Video" filter, keeping channels,
  playlists and Shorts shelves out of the blob). Same `ytInitialData` technique
  as the playlist page, and the single highest-value keyless addition: without
  it a keyless deployment could never produce an exact YouTube link, and
  YouTube is the platform most people can reliably play something on. Two
  renderers are read — the long-standing `videoRenderer` and the newer
  `lockupViewModel` — because YouTube is mid-migration and which one a request
  gets is not stable. Results are *candidates*: they go through `pickBestMatch`
  exactly like the API path's, because YouTube search happily returns a lyric
  video, a cover, or something unrelated for a title it does not have.
- **YouTube** — `youtube.com/playlist?list={id}`, parse `var ytInitialData`.
  YouTube migrated playlist rows from `playlistVideoRenderer` to
  **`lockupViewModel`**; against today's HTML the old selector finds 0 rows and
  the new one finds 100. This tier matters more than Spotify's, because
  `playlistItems.list` costs 50 quota units of a 10,000/day budget and the
  public page costs none.
- **Bandcamp** — public album and track pages carry a `data-tralbum` attribute
  holding the same JSON the page's own player is built from: `current.title`,
  `artist`, `current.release_date`, and a `trackinfo` array with per-track
  titles, float-second durations, and `title_link` (`/track/<slug>`). Cover art
  is read from `og:image` rather than rebuilt from the blob's `art_id`, because
  the id-to-URL mapping (zero-padding, the `_N` size suffix, which `fN.bcbits`
  shard) is undocumented and has changed, while the meta tag is what Bandcamp
  hands every link preview. A row with no `title_link` is dropped: it has no
  page of its own, so no exact link could be built for it anyway. Ids are
  filed under the blob's *own* `url` host rather than the host the page was
  fetched from, so a custom-domain redirect cannot leave ids pointing
  somewhere that does not serve the page. Bandcamp's search endpoint
  (`api/bcsearch_public_api/1/autocomplete_elastic`, which backs the site's own
  search box) is likewise unauthenticated JSON and carries the same caveats.
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

## Playback

Two different mechanisms, because they do different jobs.

### Preview banner (list pages)

`GET /api/preview/deezer/:id` → **302** to the MP3. Deezer's track endpoint
carries a `preview` field: a direct MP3 of the 30-second sample, served
`audio/mpeg`. The lookup is cached 10 minutes and the redirect is marked
`private, max-age=300`, kept under the signature lifetime so a browser-cached
redirect can never outlive the URL it points at.

A redirect rather than JSON so `src` and `play()` both run **synchronously
inside the click handler**. Returning the URL for the client to fetch first put
`play()` after an await, outside the user gesture: Chrome tolerates that via
sticky activation, but Safari refuses it, which surfaced as a spurious "no
preview available" that cleared on a second press. The error state now comes
from the element's own `error` event, so it means the source genuinely failed
to load.

The URL cannot be stored on a playlist row: it carries an `exp` token and dies
after ~15 minutes, long before a 7-day share link is opened. Hence one lookup
per play.

- The banner carries the track's resolved provider links as brand-mark icons,
  so whatever is playing can be opened where you actually listen.
- The player lives in `pages/+Layout.tsx` via `PreviewPlayerProvider`, not in a
  page. Vike keeps the layout mounted while pages swap beneath it, so audio
  survives navigating from a search to a song page — verified: a preview kept
  playing across a client-side navigation. Mounted per page, every navigation
  would silently stop the music. Player keys are therefore namespaced
  (`search:…`, `playlist:<id>:<index>`) so rows cannot collide across pages.
- Playback always starts in a click handler on our own origin, so no autoplay
  policy applies and no cross-origin permission is delegated.

**Why not the embedded widget here.** The widget can be *watched* but never
*driven*: it posts `{action:'play'|'pause'}` to `window.parent` on every
transport change, and registers a listener for those same two messages — but
sending them has no effect on audio. Tested with `allow="autoplay"` delegated,
with sticky user activation, and with retries past hydration. Its own play
button is its only working control, so any custom transport had to own the
audio outright. The bundle shows `setPlayer` *is* the state setter the handler
guards on, so the wiring looks correct and the cause remains unexplained —
what is established is that it does not work.

Also ruled out, so nobody re-explores them: the only widget routes are
`/widget/{light,dark,auto}/[...slug]`, i.e. theme variants of one player; the
legacy `deezer.com/plugins/player` 308-redirects to that same widget; and the
JS SDK is a 2.8 MB Kotlin/JS build wanting an `appId` and a `channelUrl`.

### Song page widget

The song page keeps the embedded widget. It is the one place full playback
matters — signed-in Deezer users get the whole track there, which a 30-second
preview cannot offer.

- `deezerEmbedFromUrl` / `deezerEmbedFromLinks` in `providers/links.ts` pull
  the embeddable resource out of an **exact** Deezer link (a search link is a
  query, not a resource), tolerating the locale segment on shared URLs.
- Theme is `light`, not `auto`: the design system has no dark theme, so `auto`
  would follow the OS and leave a dark player on a white page.

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
- Playlist import capped at 100 tracks; link resolution batched. The live
  batch is **11 tracks**: the zero-secret ceiling is the binding case (apple +
  deezer + bandcamp + youtube = 4 fetches/track, one of which is usually the
  source and costs nothing), and 11 × 4 = 44 leaves six of the 50-subrequest
  budget for the playlist fetch and its pagination. The cap was 20 with four
  providers, 15 when Bandcamp's search arrived, and 11 now that YouTube
  resolves keylessly — each step trades rows-resolved-at-import for a better
  page, and the remainder is finished by `POST /:id/resolve` anyway.
- Pandora costs **zero** subrequests, ever: its tracks are named from the URL's
  own slugs and its links are built locally.
- Last.fm costs one fetch per resolution and only when `LASTFM_API_KEY` is
  set — its API is free but rate-limited per key, and every path into it is
  already behind the Cache API or the KV match cache.
