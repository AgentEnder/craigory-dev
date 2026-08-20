import { useEffect, useRef, useState } from 'react';
import { Card, cx } from '@new-personal-monorepo/small-app-design-system';
import type {
  PlaylistOpenLinks,
  PlaylistTrack,
  ProviderId,
  ProviderLink,
} from '../../worker/types';
import { PROVIDER_IDS } from '../../worker/types';
import { usePageContext } from 'vike-react/usePageContext';

import { resolvePlaylistSlice } from '../api';

import { deezerEmbedFromLinks } from '../../worker/providers/links';
import type { PlaylistView as PlaylistData } from '../../worker/playlists';
import {
  PreviewButton,
  usePreviewPlayerContext,
} from './PreviewPlayer';
import { Artwork } from './Artwork';
import { PROVIDER_LABELS, ProviderBadge } from './ProviderBadge';

/** Playlists live 7 days (KV expirationTtl) — mirrored here for the note. */
const PLAYLIST_TTL_DAYS = 7;

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function expiryDate(createdAt: string): string | undefined {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return undefined;
  const expires = new Date(
    created.getTime() + PLAYLIST_TTL_DAYS * 24 * 60 * 60 * 1000
  );
  return formatDate(expires.toISOString());
}

/** Full imported-playlist view: header, share row, expiry note, track list. */
/**
 * Finishes the cross-provider links the importer could not.
 *
 * A single Worker invocation gets 50 outbound fetches, so import resolves only
 * its first slice; every call here is a fresh invocation with a fresh budget,
 * and the endpoint writes results back, so a later visitor gets a complete
 * page server-side. Rows already marked `resolved` are skipped, which is what
 * stops a track that exists nowhere else being retried on every view.
 */
function useResolvedTracks(playlist: PlaylistData): PlaylistTrack[] {
  const [tracks, setTracks] = useState(playlist.tracks);
  // The authoritative list while the loop runs. State drives rendering, but the
  // loop needs to read the merged result synchronously to find the next gap,
  // and a state read there would see a stale closure.
  const merged = useRef(playlist.tracks);

  // A fresh playlist id means a different page: start over from its own rows.
  const [seenId, setSeenId] = useState(playlist.id);
  if (seenId !== playlist.id) {
    setSeenId(playlist.id);
    setTracks(playlist.tracks);
    merged.current = playlist.tracks;
  }

  useEffect(() => {
    if (merged.current.every((row) => row.resolved)) return;
    const controller = new AbortController();

    (async () => {
      for (;;) {
        const from = merged.current.findIndex((row) => !row.resolved);
        if (from < 0) return;

        let batch;
        try {
          batch = await resolvePlaylistSlice(playlist.id, from, {
            signal: controller.signal,
          });
        } catch {
          // Offline, expired, or aborted — keep the search links already shown.
          return;
        }
        if (controller.signal.aborted || batch.tracks.length === 0) return;

        const next = [...merged.current];
        batch.tracks.forEach((row, offset) => {
          next[batch.from + offset] = row;
        });
        merged.current = next;
        setTracks(next);
        if (batch.done) return;
      }
    })();

    return () => controller.abort();
  }, [playlist.id]);

  return tracks;
}

/** Player keys are global now, so a row must not collide across playlists. */
function rowKey(playlistId: string, index: number): string {
  return `playlist:${playlistId}:${index}`;
}

/** A row's Deezer track id, from its exact link — '' when it has no match. */
function deezerIdFor(item: PlaylistTrack): string {
  return deezerEmbedFromLinks(item.links)?.id ?? '';
}

export function PlaylistView({ playlist }: { playlist: PlaylistData }) {
  const expires = expiryDate(playlist.createdAt);
  const tracks = useResolvedTracks(playlist);

  const player = usePreviewPlayerContext();

  return (
    <div className="space-y-6">
      <Card>
        <PlaylistHeader playlist={playlist} />
        <div className="mt-6">
          <PlaylistShareRow />
        </div>
        <div className="mt-6">
          <PlaylistExportRow playlist={playlist} />
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Imported playlists expire {PLAYLIST_TTL_DAYS} days after import
          {expires ? ` — this one is available until ${expires}` : ''}. Anyone
          with the link above can view it until then.
        </p>
      </Card>

      <Card className="overflow-hidden">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Tracks
        </h2>
        {tracks.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            No tracks could be read from this playlist.
          </p>
        ) : (
          <ol className="mt-2 divide-y divide-gray-100">
            {tracks.map((item, index) => (
              <PlaylistTrackRow
                key={`${item.track.provider}:${item.track.id}:${index}`}
                index={index + 1}
                item={item}
                isCurrent={player.current?.key === rowKey(playlist.id, index)}
                status={player.status}
                onPlay={() => {
                  if (player.current?.key === rowKey(playlist.id, index)) player.toggle();
                  else
                    player.play({
                      key: rowKey(playlist.id, index),
                      deezerId: deezerIdFor(item),
                      title: item.track.title,
                      artist: item.track.artist,
                      artworkUrl: item.track.artworkUrl,
                      href: `/song/${item.track.provider}/${encodeURIComponent(item.track.id)}`,
                      links: item.links,
                    });
                }}
              />
            ))}
          </ol>
        )}
      </Card>

    </div>
  );
}

function PlaylistHeader({ playlist }: { playlist: PlaylistData }) {
  const orderedOpen = PROVIDER_IDS.map((p) =>
    playlist.open.find((link) => link.provider === p)
  ).filter((link): link is PlaylistOpenLinks => link !== undefined);

  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <ProviderBadge provider={playlist.sourceProvider} />
        <span className="text-xs text-gray-400">
          Imported from {PROVIDER_LABELS[playlist.sourceProvider]}
        </span>
      </div>
      <h1 className="mt-2 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
        {playlist.title}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {playlist.tracks.length}{' '}
        {playlist.tracks.length === 1 ? 'track' : 'tracks'} · imported{' '}
        {formatDate(playlist.createdAt)}
      </p>

      {orderedOpen.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {orderedOpen.map((link) => (
            <PlaylistOpenButton key={link.provider} link={link} />
          ))}
        </div>
      )}
    </header>
  );
}

const OPEN_EXACT_STYLES: Record<ProviderId, string> = {
  spotify: 'bg-[#1DB954] text-white shadow-sm hover:bg-[#14833b]',
  apple: 'bg-[#FA243C] text-white shadow-sm hover:bg-[#B3122A]',
  youtube: 'bg-[#FF0033] text-white shadow-sm hover:bg-[#C10023]',
  deezer: 'bg-[#A238FF] text-white shadow-sm hover:bg-[#7A22CC]', // unslop-ignore — brand purple
};

const OPEN_SEARCH_STYLES: Record<ProviderId, string> = {
  spotify:
    'border border-gray-200 bg-white text-[#14833b] hover:border-[#1DB954]/50 hover:bg-[#1DB954]/5',
  apple:
    'border border-gray-200 bg-white text-[#B3122A] hover:border-[#FA243C]/50 hover:bg-[#FA243C]/5',
  youtube:
    'border border-gray-200 bg-white text-[#C10023] hover:border-[#FF0033]/50 hover:bg-[#FF0033]/5',
  deezer: // unslop-ignore — brand purple
    'border border-gray-200 bg-white text-[#7A22CC] hover:border-[#A238FF]/50 hover:bg-[#A238FF]/5',
};

/**
 * "Open on …" / "Find on …" button using the API-provided label. Exact links
 * (the source platform) get the solid brand treatment; search links (title
 * search on the other platforms) get the subdued outline treatment.
 */
function PlaylistOpenButton({ link }: { link: PlaylistOpenLinks }) {
  const exact = link.kind === 'exact';
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${link.label} (opens in a new tab)`}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
        exact ? OPEN_EXACT_STYLES[link.provider] : OPEN_SEARCH_STYLES[link.provider]
      )}
    >
      {link.label}
      <span
        aria-hidden="true"
        className={cx('text-xs', exact ? 'text-white/80' : 'text-gray-300')}
      >
        ↗
      </span>
    </a>
  );
}

/**
 * CSV download plus the handoff it exists for. No platform accepts a file as a
 * write path — Apple Music's own import only matches your local library — so
 * the file's job is to carry the playlist into a transfer service, which does
 * hold the per-user credentials needed to create the real thing.
 */
function PlaylistExportRow({ playlist }: { playlist: PlaylistData }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Take it to another platform
      </span>
      <div className="mt-2">
        <a
          href={`/api/playlists/${playlist.id}/export.csv`}
          download
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
        >
          <span aria-hidden="true">↓</span>
          Download CSV
        </a>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Building the playlist on another service requires your account
        credentials, which JustListen never asks for. Upload this file to a
        transfer service such as{' '}
        <a
          href="https://soundiiz.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          Soundiiz
        </a>{' '}
        or{' '}
        <a
          href="https://www.tunemymusic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          TuneMyMusic
        </a>{' '}
        to create it on Spotify, Apple Music, or YouTube Music.
      </p>
    </div>
  );
}

/** Read-only share URL input + Copy button with copied feedback. */
function PlaylistShareRow() {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  // From pageContext rather than `window.location`: this renders on the server
  // too, where reading a browser global throws and takes the whole page with
  // it. `origin` is null only when the request URL was relative, which a real
  // request never is.
  const { urlParsed } = usePageContext();
  const shareUrl = `${urlParsed.origin ?? ''}${urlParsed.pathname}`;

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard API unavailable (insecure context / permission denied):
      // select the text so the user can copy manually.
      inputRef.current?.select();
      return;
    }
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <label
        htmlFor="playlist-share-url"
        className="text-xs font-semibold uppercase tracking-wider text-gray-400"
      >
        Share this playlist
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="playlist-share-url"
          ref={inputRef}
          type="text"
          readOnly
          value={shareUrl}
          onFocus={(event) => event.target.select()}
          className="w-full flex-1 truncate rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={copy}
          className={cx(
            'shrink-0 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
          )}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <span role="status" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}

function PlaylistTrackRow({
  index,
  item,
  isCurrent,
  status,
  onPlay,
}: {
  index: number;
  item: PlaylistTrack;
  isCurrent: boolean;
  status: Parameters<typeof PreviewButton>[0]['status'];
  onPlay: () => void;
}) {
  const { track } = item;
  const playable = deezerEmbedFromLinks(item.links);
  const orderedLinks = PROVIDER_IDS.map((p) =>
    item.links.find((link) => link.provider === p)
  ).filter((link): link is ProviderLink => link !== undefined);
  const trackLabel = `${track.title} by ${track.artist}`;

  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {playable ? (
          <PreviewButton
            isCurrent={isCurrent}
            status={status}
            onPlay={onPlay}
          />
        ) : (
          <span
            aria-hidden="true"
            className="w-6 shrink-0 text-right font-mono text-xs text-gray-400"
          >
            {index}
          </span>
        )}
        <Artwork
          url={track.artworkUrl}
          alt=""
          className="h-10 w-10 shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {track.title}
          </p>
          <p className="truncate text-xs text-gray-500">{track.artist}</p>
        </div>
      </div>
      <div className="flex shrink-0 gap-1.5 pl-9 sm:pl-0">
        {orderedLinks.map((link) => (
          <PlaylistTrackLinkBadge
            key={link.provider}
            link={link}
            trackLabel={trackLabel}
          />
        ))}
      </div>
    </li>
  );
}

const TRACK_EXACT_STYLES: Record<ProviderId, string> = {
  spotify: 'bg-[#1DB954]/15 text-[#14833b] hover:bg-[#1DB954]/25',
  apple: 'bg-[#FA243C]/15 text-[#B3122A] hover:bg-[#FA243C]/25',
  youtube: 'bg-[#FF0033]/15 text-[#C10023] hover:bg-[#FF0033]/25',
  deezer: 'bg-[#A238FF]/15 text-[#7A22CC] hover:bg-[#A238FF]/25', // unslop-ignore — brand purple
};

const TRACK_SEARCH_STYLES: Record<ProviderId, string> = {
  spotify:
    'border border-dashed border-gray-300 text-gray-500 hover:border-[#1DB954]/60 hover:text-[#14833b]',
  apple:
    'border border-dashed border-gray-300 text-gray-500 hover:border-[#FA243C]/60 hover:text-[#B3122A]',
  youtube:
    'border border-dashed border-gray-300 text-gray-500 hover:border-[#FF0033]/60 hover:text-[#C10023]',
  deezer: // unslop-ignore — brand purple
    'border border-dashed border-gray-300 text-gray-500 hover:border-[#A238FF]/60 hover:text-[#7A22CC]',
};

const TRACK_BADGE_ABBR: Record<ProviderId, string> = {
  spotify: 'Spotify',
  apple: 'Apple',
  youtube: 'YouTube',
  deezer: 'Deezer',
};

/**
 * Compact per-track provider link. Exact matches are solid brand-tinted
 * pills; search fallbacks are dashed-outline pills prefixed with a magnifier.
 */
function PlaylistTrackLinkBadge({
  link,
  trackLabel,
}: {
  link: ProviderLink;
  trackLabel: string;
}) {
  const providerName = PROVIDER_LABELS[link.provider];
  const exact = link.kind === 'exact';
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={
        exact
          ? `Listen on ${providerName}`
          : `Search on ${providerName} — no exact match found`
      }
      aria-label={`${
        exact
          ? `Listen to ${trackLabel} on ${providerName}`
          : `Search for ${trackLabel} on ${providerName}`
      } (opens in a new tab)`}
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
        exact ? TRACK_EXACT_STYLES[link.provider] : TRACK_SEARCH_STYLES[link.provider]
      )}
    >
      {!exact && <span aria-hidden="true">⌕</span>}
      {TRACK_BADGE_ABBR[link.provider]}
    </a>
  );
}
