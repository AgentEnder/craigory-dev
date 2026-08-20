# JustListen

"JustWatch, but for music": search for a song, see where you can listen to it
(Spotify, Apple Music, YouTube / YouTube Music, Deezer), and import a playlist
from any supported platform to get listen links for every track.

Search runs against the catalogs that need no credentials or quota — Deezer
first, then Spotify and iTunes when configured. Deezer leads because it is
keyless, indexes independent releases the other catalogs miss, and returns an
ISRC on every row, which makes cross-platform resolution exact rather than
fuzzy. Pressing Enter (or the last row of the suggestions dropdown) opens
`/search?q=…`, which fans out across every available catalog, merges
duplicates, and shows which platforms carry each recording.

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

The app works with **zero secrets** (Deezer and Apple/iTunes need no
credentials) and degrades per provider:

- No Spotify creds → Spotify is skipped as a search catalog and Spotify links
  become search links.
- No YouTube key → YouTube links are `https://music.youtube.com/search?q=…`
  search links. Playlist import still works — it falls back to reading the
  public playlist page, which also costs no quota. YouTube never backs
  search either way: its `search.list` costs 100 of a 10,000-unit daily quota,
  so it is only used to resolve a link on the song detail page.

For local dev, `vike dev` reads secrets from an untracked `.dev.vars` beside
`wrangler.jsonc` — `@cloudflare/vite-plugin` sources them there rather than
from the shell, so there is no secreq path into the dev server. Running
credential-free is fine: search falls back to the keyless catalogs.

## Commands

```sh
pnpm --filter justlisten dev        # vike dev (SSR inside workerd)
pnpm --filter justlisten build      # vike build → dist/client + dist/server
pnpm --filter justlisten preview    # vike preview
pnpm --filter justlisten typecheck  # tsc --noEmit
pnpm --filter justlisten test       # vitest (pure-logic worker tests)
pnpm --filter justlisten secrets:push  # 1Password → Cloudflare secrets

npx nx deploy justlisten            # build, then wrangler deploy
npx nx deploy justlisten -c preview # build, then upload a preview version
```

Deployment goes through Nx rather than a package script so the build is a real
task dependency instead of a `&&`, and so the target can carry the preview
configuration below.

## Deployments

| | |
|---|---|
| Production | `wrangler deploy` — serves traffic at the Worker's route |
| Preview | `wrangler versions upload` — a version at **0% traffic**, on its own URL |

Both run from `tools/deploy.mjs`.

CI reaches this indirectly: `craigory-dev`'s deploy target declares
`implicitDependencies: ["apps/*"]` and `dependsOn: ["^deploy"]`, so deploying
the site fans out across every app. Nx passes its `-c` down to each dependency
that defines that configuration, which is what routes a PR to the preview path
and a `main` push to the production one.

Preview versions bind the **same KV namespaces as production** — there is only
one pair. `--var KV_PREFIX:pr-<n>` therefore namespaces every key a preview
touches, on reads as well as writes, so it gets a cold cache and an empty
playlist store rather than production's data (see `worker/kv-scope.ts`). Both
key families already expire on their own (7 days for playlists, 30 for
matches), so a merged PR's keys need no cleanup.

`--preview-alias pr-<n>` keeps a PR's preview URL stable across pushes instead
of changing with each version id; `tools/update-preview-comment.ts` reads that
URL out of wrangler's `WRANGLER_OUTPUT_FILE_PATH` output and puts it in the PR
comment.

**CI needs a `CLOUDFLARE_API_TOKEN` repo secret** (locally, wrangler's
interactive OAuth login covers it). Without one, `tools/deploy.mjs` logs a note
and exits 0 rather than failing the PR — so an unconfigured repo, or a fork PR
where secrets are withheld, still gets a green check and a site preview, just
no JustListen preview URL.

## Playlist import without credentials

Paste a playlist link into the search box — there is no separate import page.
Spotify and YouTube fall back to reading the public page when no credentials
are configured, so all four providers import with zero secrets:
Spotify and YouTube playlist import fall back to reading the public page when
no credentials are configured, so all four providers import with zero secrets:

| Provider | With credentials | Without |
|---|---|---|
| Spotify | Web API (ISRC, album) | `open.spotify.com/embed` — 100 tracks, no ISRC |
| YouTube | Data API (50 quota units/call) | public playlist page — no quota |
| Deezer / Apple | *(never needed any)* | public APIs |

Adding credentials still improves things: Spotify's API supplies ISRCs, which
is what makes cross-provider matching exact rather than a title/artist/duration
guess. The scrape is a fallback, not a replacement, and a failure at either
tier falls through to the other.

Two caveats. These parsers read undocumented page structure and will break when
the sites change — YouTube has already moved playlist rows from
`playlistVideoRenderer` to `lockupViewModel` once. And both platforms' terms
prohibit automated access, which is worth knowing even though this only reads
public pages with no authentication.

## Playback

Playlist and search rows have a play button that streams Deezer's 30-second
preview through a plain `<audio>` element — no iframe. The "now playing" banner
lives in the root layout, so audio keeps playing as you move between pages.

Previews are fetched per play via `GET /api/preview/deezer/:id`: the URL
carries a ~15-minute expiry token, so it cannot be stored with a 7-day
playlist. The MP3 itself streams straight from Deezer's CDN, so only the lookup
touches the Worker.

Song pages instead embed Deezer's [widget player](https://widget.deezer.com/),
which gives signed-in Deezer users the *full* track rather than a preview. The
widget cannot be driven programmatically — its inbound postMessage commands
have no effect — which is why list pages use the audio element instead.

## Architecture

Vike (`vike-react`) server-renders every page inside the same Worker that
serves the API, via `@cloudflare/vite-plugin` — including in dev, so `c.env`
holds the real KV bindings in both modes.

- `+server.ts` is the Worker entry (`main: "vike:server-entry"`). Hono owns
  `/api/*`; `vike(app, [...])` catches everything else as SSR.
- Song and playlist pages load in `+data.ts`, calling `worker/song.ts` and
  `worker/playlists.ts` **in process**. Fetching this app's own API over HTTP
  would spend a subrequest to reach code already in the same isolate, so those
  two GET endpoints don't exist — the page ships rendered instead.
- `worker/page-env.ts` is the universal middleware that puts the Worker's
  bindings on `pageContext` for those hooks.
- The interactive calls that genuinely are APIs — autocomplete, cross-catalog
  search, playlist import, CSV export — stay in `src/api.ts` + `worker/routes/`.

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
- Playlist imports are capped at 100 tracks. Link resolution is split across
  requests to respect the per-invocation subrequest limit (see Limitations).

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
- **Long imports finish in the background, not during the import request.**
  A Worker invocation gets 50 outbound fetches on the free plan (KV draws on a
  separate 1,000 budget, so it does not compete). Import live-resolves its
  first 20 tracks, reads the KV match cache for the next 20, and gives the
  remainder locally-built *search* links. The playlist page then walks the
  tail through `POST /api/playlists/:id/resolve` in batches of 8 — each its
  own invocation with its own budget — and the endpoint writes results back,
  so a later visitor gets a complete page server-side. Measured on an
  88-track playlist with no credentials: 20 rows resolved at import, all 88
  after the walk, with 82 carrying artwork.
