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

Already provisioned and wired into `wrangler.jsonc` (`CACHE` and `PLAYLISTS`,
on the personal Cloudflare account). `wrangler dev` uses local simulations, so
the real ids only matter for deploys. To recreate them from scratch:

```sh
pnpm exec wrangler kv namespace create CACHE
pnpm exec wrangler kv namespace create PLAYLISTS
```

### Secrets (all optional)

Credentials live in 1Password (`Dev Secrets` → `justlisten-production`) and
never touch the repo. `.env.example` holds `secret://op/...` *references*;
`secreq run` resolves them through the consent daemon and `tools/secrets.mjs`
hands the values to Cloudflare — the same route as `my-oss-indie`.

```sh
cp .env.example .env.production          # one-time, gitignored working copy
pnpm --filter justlisten secrets:push    # secreq → wrangler secret bulk
```

`secret bulk` preserves secrets absent from the payload, so a key you leave
empty in 1Password is skipped rather than cleared.

The app works with **zero secrets** (Apple/iTunes needs no credentials) and
degrades per provider:

- No Spotify creds → search falls back to iTunes; Spotify links become search
  links.
- No YouTube key → YouTube links are `https://music.youtube.com/search?q=…`
  search links and YouTube playlist import is unavailable.

For local dev, `pnpm --filter justlisten dev:secrets` injects the same
1Password values as `wrangler dev --var`, keeping plaintext off disk. Plain
`dev` runs credential-free (or reads an untracked `.dev.vars` if you prefer).

## Commands

```sh
pnpm --filter justlisten dev        # vite build && wrangler dev
pnpm --filter justlisten build      # vite build → dist/client
pnpm --filter justlisten typecheck  # app + worker tsconfigs
pnpm --filter justlisten test       # vitest (pure-logic worker tests)
pnpm --filter justlisten deploy     # vite build && wrangler deploy
pnpm --filter justlisten secrets:push  # 1Password → Cloudflare secrets
pnpm --filter justlisten dev:secrets   # dev server with 1Password creds
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

- **Playlist "export" is a CSV plus deep links, not a written playlist.**
  Opening an imported playlist on another platform gives you the exact
  source-platform URL plus *search* links for the title elsewhere, and
  `GET /api/playlists/:id/export.csv` downloads the tracks (title, artist,
  album, ISRC, release date, and any resolved per-platform URLs).

  No service accepts a file as a write path. The macOS Music app's
  File → Library → Import Playlist matches only tracks already in your local
  library, not the Apple Music catalog, so an uploaded file yields an empty or
  partial playlist. Transfer services (Soundiiz, TuneMyMusic, PlaylistGo) read
  those files, but they write via the APIs below, holding per-user credentials
  JustListen deliberately never asks for:

  | Platform | Write path | Gate |
  |---|---|---|
  | Spotify | `POST /v1/users/{id}/playlists` + add tracks | Free; OAuth 2.0 PKCE works browser-side. Dev-mode apps cap at 25 allowlisted users until a quota extension is approved. |
  | YouTube | `playlists.insert` + `playlistItems.insert` | Free OAuth, but 50 quota units per call — a 100-track playlist costs ~5,050 of the 10,000/day project quota. |
  | Apple Music | `POST /v1/me/library/playlists` via MusicKit JS | Requires a paid Apple Developer Program membership for the MusicKit key that signs the developer token. |

  Adding any of these would mean per-user OAuth; with PKCE and MusicKit JS it
  could run entirely client-side, leaving the Worker stateless.
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
