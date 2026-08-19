# JustListen

"JustWatch, but for music": search for a song, see where you can listen to it
(Spotify, Apple Music, YouTube / YouTube Music), and import a playlist from any
supported platform to get listen links for every track.

See [SPEC.md](./SPEC.md) for the full architecture and contracts.

## Setup

```sh
pnpm install
```

### KV namespaces

The worker uses two KV namespaces. Create them once and paste the generated
ids into `wrangler.jsonc` (replacing the `REPLACE_WITH_…` placeholders):

```sh
pnpm exec wrangler kv namespace create CACHE
pnpm exec wrangler kv namespace create PLAYLISTS
```

`wrangler dev` uses local simulations automatically — real ids are only needed
for deploys.

### Secrets (all optional)

The app works with **zero secrets** (Apple/iTunes needs no credentials), but
degrades gracefully without the others:

```sh
pnpm exec wrangler secret put SPOTIFY_CLIENT_ID
pnpm exec wrangler secret put SPOTIFY_CLIENT_SECRET
pnpm exec wrangler secret put YOUTUBE_API_KEY
```

- No Spotify creds → search falls back to iTunes; Spotify links become search
  links.
- No YouTube key → YouTube links are `https://music.youtube.com/search?q=…`
  search links and YouTube playlist import is unavailable.

For local dev, put the same names in an untracked `.dev.vars` file instead.

## Commands

```sh
pnpm --filter justlisten dev        # vite build && wrangler dev
pnpm --filter justlisten build      # vite build → dist/client
pnpm --filter justlisten typecheck  # app + worker tsconfigs
pnpm --filter justlisten test       # vitest (pure-logic worker tests)
pnpm --filter justlisten deploy     # vite build && wrangler deploy
```

## Cost notes

- One Cloudflare Worker serves both the API and the SPA (static assets
  binding) — free tier friendly (100k requests/day), no Pages project, no
  Durable Objects, no D1.
- Autocomplete uses a single upstream provider plus the Cache API (free,
  per-PoP) — never KV. KV free tier only allows ~1k writes/day, so KV writes
  are reserved for long-TTL match data and playlist imports.
- YouTube Data API is used only when a key is present, and only for
  detail-page resolution and playlist import — never autocomplete (search
  costs 100 quota units per call).
- Playlist imports are capped at 100 tracks and link resolution is batched
  *and capped* to stay under Workers subrequest limits (see Limitations).

## Limitations

- **Playlist "export" is deep links, not real playlists.** Opening an imported
  playlist on another platform gives you the exact source-platform URL plus
  *search* links for the playlist title on the other platforms. True
  cross-platform playlist creation requires per-user OAuth with each service —
  out of scope.
- **Apple Music playlist import caveat.** Public Apple Music playlists are
  fetched via the iTunes/Apple embed lookup, which has no official contract.
  If a playlist cannot be fetched without a MusicKit developer token, the API
  returns a clear `422` explaining that Apple playlist import is unavailable.
- **Imported playlists are ephemeral** — stored in KV with a 7-day TTL, after
  which the share URL 404s with a friendly message.
- **Only the first few tracks of an import get live cross-provider
  resolution.** Workers free tier allows ~50 subrequests per request (KV
  operations count too), so during import only the first 4 tracks are
  live-resolved against the other providers (using the KV match cache), the
  next 4 are resolved from the KV match cache only, and every remaining track
  gets locally-built *search* links on the other platforms (its
  source-platform link is still exact). Opening individual songs via search
  or the song page always fully resolves (and caches) links, so re-imports
  gradually pick up more exact links from the cache.
