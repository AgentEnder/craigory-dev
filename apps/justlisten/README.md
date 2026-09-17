# JustListen

"JustWatch, but for music": search for a song, see where you can listen to it
(Spotify, Apple Music, YouTube / YouTube Music, Deezer, Bandcamp, Last.fm,
Pandora), and import a playlist from any supported platform to get listen links
for every track.

The seven platforms are not seven of a kind, and what each one can do here
follows directly from what it publishes:

| Platform | Search | Resolve a track | Import a collection | Needs a key |
|---|---|---|---|---|
| Deezer | ✅ lead catalog | ISRC, then title/artist | playlists + albums | no |
| Apple Music | ✅ | ISRC, then title/artist | public playlists | no |
| Spotify | ✅ | ISRC, then title/artist | playlists + albums | optional |
| YouTube Music | ❌ quota | title/artist (keyless page scrape, or the API) | playlists | optional |
| **Bandcamp** | ✅ | title/artist, stricter | albums | no |
| **Last.fm** | ✅ | exact name lookup | ❌ none exist | **yes** |
| **Pandora** | ❌ no API | ❌ cache only | ❌ none exist | n/a |

Search runs against the catalogs that need no credentials or quota — Deezer
first, then Spotify and iTunes when configured, then Bandcamp and (with a key)
Last.fm. Deezer leads because it is
keyless, indexes independent releases the other catalogs miss, and returns an
ISRC on every row, which makes cross-platform resolution exact rather than
fuzzy. Pressing Enter (or the last row of the suggestions dropdown) opens
`/search?q=…`, which fans out across every available catalog, merges
duplicates, and shows which platforms carry each recording.

Song pages also carry **audio features** (tempo, key, energy, danceability…)
and **"more like this"** recommendations, from
[ReccoBeats](https://reccobeats.com) — a metadata source rather than an eighth
platform. See "Audio features and recommendations" below.

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

The app works with **zero secrets** (Deezer, Apple/iTunes and Bandcamp need no
credentials) and degrades per provider:

- No Spotify creds → Spotify is skipped as a search catalog and unresolved
  Spotify links become search links. A pasted `open.spotify.com/track/…` link
  still opens a real song page, via the embed page — and, once opened, seeds
  the match cache so later visitors get that exact Spotify track too (see
  "Every pasted link teaches the cache" below).
- No YouTube key → track resolution reads the public search results page
  instead (no quota, no key), and only falls back to a
  `https://music.youtube.com/search?q=…` link when that finds no convincing
  match. Playlist import likewise falls back to the public playlist page, and a
  pasted `watch?v=…` link opens via the keyless `oembed` endpoint. YouTube never
  backs the search box either way: its `search.list` costs 100 of a 10,000-unit
  daily quota, so the API is only ever used to resolve a single link.
- No Last.fm key → Last.fm is skipped as a search catalog and its links become
  search links. Unlike the others it has no keyless tier at all: every
  `ws.audioscrobbler.com` method requires an `api_key`. Keys are free and
  instant from <https://www.last.fm/api/account/create>.
- Bandcamp and Pandora never take credentials. Bandcamp's search endpoint and
  its album/track pages are unauthenticated; Pandora publishes no public API
  to authenticate against at all.

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

## Pasting links without credentials

Paste a link into the search box — there is no separate import page. It takes
a link to **one song** as happily as a playlist, because that is what most
share buttons give you: `youtube.com/watch?v=…` is the link a desktop browser
puts on your clipboard, and it names a single video, not a collection. A song
link goes straight to that song's page; a playlist link is imported. The server
decides which, so the box never has to guess.

A playlist link that also carries a video (`watch?v=…&list=…`) is treated as
the playlist — the collection is the more useful reading of a link that names
both.

Spotify and YouTube fall back to reading public pages when no credentials are
configured, so everything works with zero secrets:

| Provider | With credentials | Without |
|---|---|---|
| Spotify playlist | Web API (ISRC, album) | `open.spotify.com/embed` — 100 tracks, no ISRC |
| Spotify track | Web API (ISRC, album) | `open.spotify.com/embed/track` — no ISRC |
| YouTube playlist | Data API (50 quota units/call) | public playlist page — no quota |
| YouTube video | Data API `videos.list` (1 unit, has duration) | `youtube.com/oembed` — no quota, no duration |
| Bandcamp album | *(no API tier exists)* | `data-tralbum` on the public album page |
| Bandcamp track | *(no API tier exists)* | `data-tralbum` on the public track page |
| Deezer / Apple | *(never needed any)* | public APIs |

Both fallbacks also catch credentials that exist but fail — an expired token,
an outage, a YouTube key whose daily quota has run out. The API path is tried
first and *any* failure falls through rather than 404ing the song page. Losing
duration costs only the +0.1 duration bonus in `scoreMatch`, so cross-provider
matching stays good — and auto-generated YouTube music channels are named
"<Artist> - Topic", which normalizes to the bare artist.

## Getting more than one real link

The honest failure mode of a zero-secret deployment: **five of the seven
providers cannot produce an exact link at all.** Spotify, YouTube and Last.fm
each bail out the moment `available(env)` is false; Pandora has no API to call;
Bandcamp's raised threshold means it rarely claims a mainstream recording. That
leaves Apple and Deezer — and on a page you reached from a Deezer search,
Deezer's link is built from the id it already has, costing no network at all. So
the page can show one real link and six search boxes, which reads as broken even
though every part is behaving as designed.

Two things close most of that gap without asking anyone for a credential.

**YouTube now resolves without a key.** `search.list` costs 100 of a
10,000-unit daily quota, which is why YouTube can never back the search box —
but it also meant a keyless deployment could never link to a specific YouTube
video, only to a search. Reading the public search results page uses the same
`ytInitialData` technique the playlist importer already relies on, costs no
quota and no key, and the rows it returns go through the same `pickBestMatch`
scoring as the API path, so a lyric video or a cover is rejected the same way.
For most people YouTube is the one platform they can definitely play something
on, which made this the most expensive absence in the set.

**MusicBrainz fills the rest.** Every other resolution path searches a platform
and then has to *decide* whether the result is the same recording. MusicBrainz
is looked up by **ISRC**, so identity comes from the recording code rather than
a title guess, and the URL relationships its editors attach to a recording are
exactly the cross-platform mapping everything else is trying to infer. It is
keyless, documented, and stable — not a scrape.

The mapping step reuses the providers' *own* `parseTrackUrl` implementations
rather than adding a second set of URL patterns, so a MusicBrainz link and a
pasted link are understood identically. Anything nothing claims is dropped, as
is any relationship MusicBrainz marks `ended` — a delisted URL looks exact and
goes nowhere, which is worse than a search link.

It runs only for providers that came back with a search link, and only for
tracks carrying an ISRC (every Deezer row has one). A provider that resolved on
its own keeps its own answer — that one arrived with artwork and an album, which
a bare URL relationship doesn't carry. Whatever the oracle finds is written into
the match cache, so playlist rows and later views get it for free.

Coverage is uneven and that's expected: the relationships are
editor-contributed, so they're good on well-known releases, thin on the long
tail, and better for YouTube than for the subscription services.

MusicBrainz allows about one request per second per IP and **requires** a
descriptive User-Agent naming the app and a contact — the opposite of the
browser-impersonating header the page scrapers send, and it must not be
replaced with one. Real volume is one request per recording per 30 days.

### If you want all seven

The above is what code can do. The rest is credentials, and they are free:

| Credential | Unlocks | Cost |
|---|---|---|
| `SPOTIFY_CLIENT_ID` / `_SECRET` | exact Spotify links, **plus ISRCs** that make every other provider's match exact rather than fuzzy | free app registration |
| `YOUTUBE_API_KEY` | the API path (durations, better ranking) instead of the page scrape | free, 10k units/day |
| `LASTFM_API_KEY` | exact Last.fm links and Last.fm as a search catalog | free, instant |

Spotify is the one worth doing first — not for its own link, but because its
ISRCs feed the ISRC-first path in `matching.ts` for *everything else*.

### One thing to check on the deployed site

Apple is keyless and should already be exact. If it isn't, suspect throttling
rather than matching: the iTunes Search API allows roughly **20 calls per minute
per IP**, it is unauthenticated so the budget is per *egress IP*, Workers share
those per PoP, and it signals throttling with a **403** — which `itunes()`
throws on and `resolve` swallows into a search link. A throttled PoP is
indistinguishable from "no match found" without looking at the logs.

## Audio features and recommendations

ReccoBeats is wired in as a **metadata source, not a provider**. `MusicProvider`
answers "where can I listen to this", and ReccoBeats has no player and no
human-facing track page — so it gets no `PROVIDER_IDS` entry, no listen button,
and no CSV column, all of which would be dead weight. It lives in
`worker/reccobeats/` beside the registry and enriches what the registry
produces.

It supplies three things none of the seven platforms do.

**Audio features.** Tempo, key, loudness, and seven 0–1 measures — energy,
danceability, valence, acousticness, instrumentalness, liveness, speechiness —
on Spotify's own field names and scales. Spotify deprecated its
`/v1/audio-features` endpoint in November 2024 and shipped no replacement, which
is largely why ReccoBeats exists. The numbers are ReccoBeats' *estimates*, not
Spotify's originals, which is why the panel says so rather than presenting them
as neutral fact.

**An ISRC for a Spotify track id.** The quieter win, and the reason this runs
*before* cross-provider resolution rather than after. The keyless Spotify path
(the embed scrape) produces tracks carrying no ISRC at all — which is exactly
why those fall back to fuzzy title/artist/duration matching on every other
platform. One lookup turns six guesses into six exact identity matches.

**Recommendations**, rendered as rows linking back to this app's own
`/song/spotify/:id`. Resolving six recommendations across seven providers would
be 42 lookups on a page that has already done one; linking inward defers that to
the click, where exactly one of the six gets resolved and the other five cost
nothing. It is also the better page — a recommendation you can only open on
Spotify is useless to someone who doesn't use Spotify, which is the whole
premise of this app.

### The lookup key is always a Spotify id

ReccoBeats is keyed on a Spotify track id (or its own UUID). That sounds like it
limits this to Spotify-sourced songs and doesn't: the song page has already
resolved a Spotify link for every track it renders, so a Deezer- or
Bandcamp-sourced recording reaches ReccoBeats through the Spotify id sitting in
its own resolved links. A track with no *exact* Spotify match gets no features,
which is the honest outcome — a search link is a query, not a recording, and
there is nothing to look up.

What the key does constrain is *timing*, and that asymmetry is inherent: only a
Spotify-sourced track has its id early enough for the ISRC to improve its own
page's matching. Everything else is enriched after resolution, which still fills
the KV entry that the next render of that recording reads.

### Caching, because it is rate-limited

No credentials and no quota to buy, but ReccoBeats rate-limits and does not
publish the numbers. The UUID, ISRC and features are cached together in KV under
`recco:<spotifyId>` for 30 days — one entry, because all three are immutable
facts about a recording and all three are wanted at once. Keying on the
**Spotify** id rather than the page's own provider/id is what makes it pay: the
same recording is reachable from seven different `/song/:provider/:id` URLs, and
this collapses all seven into one entry, so the second platform's page costs a
KV read instead of two more HTTP calls.

Misses are cached too, for 7 days rather than 30 — ReccoBeats' catalog grows, so
today's miss is next month's hit. But only *durable* misses: a 404 is cached, a
429 or an outage is not. Caching a rate-limit response would suppress features
for a week over a five-minute limit.

The `Retry-After` header on a 429 is deliberately ignored. A Worker cannot sit
and wait inside a user's request, and a song page that hangs to be polite about
somebody else's quota is a worse page than one without a tempo on it.

### Unverified against the live API

**This is the one upstream here that has never been called for real.** The
network policy on the machine it was built on returns 403 for `reccobeats.com`
and `api.reccobeats.com` alike, so the endpoint paths and field names come from
ReccoBeats' published documentation and other public consumers of the API rather
than from a response anybody here has seen.

Two consequences are built into the code rather than left as a warning:

- The **list envelope is accepted in any plausible shape** — a bare array, or
  rows under `content`, `data` or `tracks`. Guessing wrong would mean every
  lookup silently returning nothing; accepting all four costs a few lines.
- **Every field is range-checked at the boundary.** An energy of 1.4 or a
  loudness of +12 means a field was misread, not that the song is unusual, so it
  is dropped rather than rendered.

Everything returns null on any failure and every caller treats null as "no
enrichment", so if a path is wrong the song page renders exactly as it did
before ReccoBeats existed — no error, just no features. **The first live deploy
should confirm the real shapes**, after which the envelope handling can be
narrowed to whatever the service actually sends.

## The three that aren't streaming catalogs

Bandcamp, Last.fm and Pandora were added because the four licensed catalogs
miss in three different directions, and each one needs a different mechanism.

**Bandcamp is the long tail.** Its music is artist-uploaded rather than
licensed, so a great deal of what it carries exists on none of the other six —
and, just as importantly, a great deal of what they carry exists on none of
Bandcamp. That asymmetry is why its match threshold is raised from 0.6 to
**0.8**: search Bandcamp for a mainstream track and you will usually find
something, but that something is a cover, a bedroom remix or an unrelated song
of the same name, filed under whatever artist string the uploader typed. At the
default threshold those clear the bar, and the row gets a confident link to the
wrong song. A wrong "exact" link is the one failure this app cannot degrade out
of — it looks exactly like a right one — so Bandcamp has to be more certain
than its peers before claiming one.

Bandcamp also has no credentialed tier to fall back to. Its album and track
pages carry a `data-tralbum` blob (the same JSON its own player is built from)
and its search box is backed by an unauthenticated JSON endpoint; both are
undocumented, so both carry the caveats at the end of this section. Albums
import as collections — a Bandcamp "collection" in the site's own sense is a
fan's purchase history, not a track list, so there is nothing else to import.

**Last.fm is not a streaming service, which is the point.** It is the scrobble
ledger the other platforms report *into*, so it knows about a recording whether
or not any given catalog licenses it, and its track page is where you go for
tags, similar tracks and play counts. Its identity is a *name pair* rather than
an id — its URLs are `/music/<artist>/_/<track>` and its API is queried the same
way — so resolution uses `track.getInfo` (exact, one request) before falling
back to `track.search`. `autocorrect=1` is on, and its answer is checked against
the normalized source artist and title before it is trusted: autocorrect can
walk far enough to name a different act, and an unverified correction would
mean linking to somebody else's song.

**Pandora publishes nothing, so it is link-only.** There is no public catalog
API; the one that exists is a partner/device integration behind a commercial
agreement, and the web app is a client-rendered SPA whose data arrives over an
authenticated endpoint. There is no keyless page equivalent to Spotify's embed
or Bandcamp's `data-tralbum`. So Pandora costs **zero** subrequests and does two
things instead:

1. A pasted Pandora link opens a real song page. Its track URLs are
   `/artist/<artist>/<album>/<track>` — human-written slugs, not opaque ids —
   so the recording is named from the URL alone with no request at all. The
   names come back lowercased and punctuation-stripped ("AC/DC" becomes "Ac
   Dc"), which costs nothing downstream: `matching.ts` normalizes exactly that
   away before comparing anything.
2. That paste is then the *only* supply of exact Pandora links for everyone
   else — see the next section. Pandora is the clearest case in the whole
   registry for the match cache: `resolve()` can never find a Pandora link, so
   every one that is ever shown came from somebody's paste.

## Every pasted link teaches the cache

Resolution used to cache only the links it went out and *found*, which threw
away the best datum in the whole request: the provider id a human just handed
us by pasting a link. That id is now recorded too, under
`match:norm:<artist>~<title>:<provider>`.

The payoff is direct links on platforms this deployment has no credentials
for. Paste one `open.spotify.com/track/…` link with Spotify unconfigured, and
every later visitor who reaches that recording from Deezer or YouTube gets the
exact Spotify track instead of a search box. For Pandora this is not an
optimization but the entire mechanism: nothing else can ever produce an exact
Pandora link. It is also the only affordable way
to learn YouTube video ids, since `search.list` costs 100 of a 10,000-unit
daily quota and a paste costs nothing.

**Searching backfills too, and it is the richest source of all.** The
cross-catalog search page already works out which rows are the same recording
— by ISRC, or by normalized key plus a compatible duration — and reports each
catalog's native id for it. One search establishes a whole set of
cross-provider mappings at once, for free, and that used to evaporate when the
6h search cache expired. It is now kept. Autocomplete is excluded: it queries
one catalog, so it learns no mapping, and it fires far more often.

Three details keep it cheap:

- Entries are filed under the **normalized** artist/title key even when an
  ISRC is available. The readers who need them most are keyless-sourced tracks
  (YouTube oEmbed, the Spotify embed), which have no ISRC and look nowhere
  else.
- Reads try **every** key a track could be filed under — ISRC first, then
  normalized — so an ISRC-carrying track still finds an entry left by a
  keyless one.
- **Writes are net-new only.** Seeding reads first and skips the write when an
  exact link is already on file, so a warm recording costs nothing. Reads are
  the plentiful side of KV on either tier (Workers Paid: 10M reads vs 1M
  writes per month, $0.50 vs $5.00 per million), so trading a read for a write
  is the right direction.

Measured: one 25-row search for "bohemian rhapsody" with two catalogs
configured wrote 33 keys. Re-running the same search wrote 0.

Nothing is seeded for a track with no id or an artist that normalizes to empty:
`norm:~<title>` would collide across every artist with that song title. First
writer wins — an existing exact link is never replaced by an equally valid
alternative id, which would churn a write on every visit.

Adding credentials still improves things: Spotify's API supplies ISRCs, which
is what makes cross-provider matching exact rather than a title/artist/duration
guess. The scrape is a fallback, not a replacement, and a failure at either
tier falls through to the other.

Two caveats. These parsers read undocumented page structure and will break when
the sites change — YouTube has already moved playlist rows from
`playlistVideoRenderer` to `lockupViewModel` once, and Bandcamp's
`data-tralbum` and its `autocomplete_elastic` endpoint carry no contract
either. And these platforms' terms prohibit automated access, which is worth
knowing even though this only reads public pages with no authentication.
Bandcamp is the one with no second tier to fall back to, so a break there
degrades it to search links rather than to a slower path.

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

  Bandcamp, Last.fm and Pandora have no write path at all, per-user OAuth or
  otherwise: Bandcamp has no user playlists, Last.fm retired its playlist API,
  and Pandora publishes no public API.

  Adding any of these would mean per-user OAuth; with PKCE and MusicKit JS it
  could run entirely client-side, leaving the Worker stateless.
- **Last.fm and Pandora collections cannot be imported**, and the app says so
  rather than trying: their `parsePlaylistUrl` returns null, so a pasted
  collection link falls to the 422 that lists what *is* supported instead of a
  "could not import" that implies it might work next time.
- **Pandora track metadata is reconstructed from the URL**, not fetched. Case
  and punctuation are lost — "AC/DC" reads as "Ac Dc" on the song page — which
  is invisible to matching (everything normalizes through the same lowercasing
  and punctuation-stripping) and mildly visible to the reader. The alternative
  was no Pandora song page at all.
- **Apple Music playlist import caveat.** Public Apple Music playlists are
  fetched via the iTunes/Apple embed lookup, which has no official contract.
  If a playlist cannot be fetched without a MusicKit developer token, the API
  returns a clear `422` explaining that Apple playlist import is unavailable.
- **Imported playlists are ephemeral** — stored in KV with a 7-day TTL, after
  which the share URL 404s with a friendly message.
- **No playback for Bandcamp.** Its pages do carry streamable MP3 URLs in the
  same `data-tralbum` blob the importer reads, so a Bandcamp preview is
  feasible — it is simply not built. The playback banner streams Deezer
  previews only. Worth revisiting; out of scope for adding the providers.
- **Long imports finish in the background, not during the import request.**
  A Worker invocation gets 50 outbound fetches on the free plan (KV draws on a
  separate 1,000 budget, so it does not compete). Import live-resolves its
  first 15 tracks, reads the KV match cache for the next 20, and gives the
  remainder locally-built *search* links. The playlist page then walks the
  tail through `POST /api/playlists/:id/resolve` in batches of 8 — each its
  own invocation with its own budget — and the endpoint writes results back,
  so a later visitor gets a complete page server-side. The live batch was 20
  until Bandcamp's search joined the per-track cost: the zero-secret ceiling is
  now 3 fetches/track (apple + deezer + bandcamp term searches, one of which is
  usually the track's own source and costs nothing), and 15 × 3 = 45 leaves
  five of the 50 for the playlist fetch itself. Measured on an 88-track
  playlist with no credentials, before that change: 20 rows resolved at import,
  all 88 after the walk, with 82 carrying artwork.
