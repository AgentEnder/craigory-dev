import { cx } from '@new-personal-monorepo/small-app-design-system';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

import type { ProviderLink } from '../../worker/types';
import { PROVIDER_IDS } from '../../worker/types';
import { Artwork } from './Artwork';
import { ProviderIconLink } from './ProviderBadge';

/** What the banner is playing, supplied by whichever row was pressed. */
export interface PreviewTrack {
  /** Row identity. Two rows can share a Deezer id, so this is not that id. */
  key: string;
  deezerId: string;
  title: string;
  artist: string;
  artworkUrl?: string;
  /** Where to read more — the row's own detail page. */
  href?: string;
  /** Provider links for the banner's icon row; only exact ones are shown. */
  links?: ProviderLink[];
}

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface PreviewPlayer {
  current: PreviewTrack | null;
  status: Status;
  /**
   * The element itself, so the progress bar can animate from it directly.
   * `timeupdate` fires only ~4x a second, which reads as a stagger; the banner
   * runs a rAF loop against `currentTime` instead and writes the DOM without
   * re-rendering React 60 times a second.
   */
  audio: RefObject<HTMLAudioElement | null>;
  play: (track: PreviewTrack) => void;
  toggle: () => void;
  close: () => void;
}

/** The Worker redirects this to a fresh preview MP3. */
function previewSrc(deezerId: string): string {
  return `/api/preview/deezer/${encodeURIComponent(deezerId)}`;
}

/**
 * A plain `<audio>` element playing Deezer's preview MP3s.
 *
 * This replaces the embedded widget on list pages. The widget could be watched
 * but never driven — its inbound postMessage commands had no effect — so any
 * custom transport had to own the audio outright. Deezer serves previews as
 * `audio/mpeg` with `access-control-allow-origin: *`, so the element streams
 * from their CDN directly and only the URL lookup goes through our Worker.
 *
 * Playback always begins in a click handler, so no autoplay policy applies.
 */
export function usePreviewPlayer(): PreviewPlayer {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<PreviewTrack | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const element = new Audio();
    element.preload = 'none';
    audio.current = element;
    const onEnded = () => setStatus('paused');
    const onError = () => setStatus('error');
    element.addEventListener('ended', onEnded);
    element.addEventListener('error', onError);
    element.addEventListener('play', () => setStatus('playing'));
    element.addEventListener('pause', () =>
      setStatus((s) => (s === 'playing' ? 'paused' : s))
    );
    return () => {
      element.pause();
      element.removeEventListener('ended', onEnded);
      element.removeEventListener('error', onError);
      audio.current = null;
    };
  }, []);

  const play = useCallback((track: PreviewTrack) => {
    const element = audio.current;
    if (!element) return;
    setCurrent(track);
    setStatus('loading');
    // `src` + `play()` both run synchronously inside the click handler. Looking
    // the URL up first and playing in the callback put `play()` outside the
    // user gesture, which Safari refuses — it surfaced as a spurious "no
    // preview available" that went away on a second press.
    element.src = previewSrc(track.deezerId);
    const started = element.play();
    // A rejection here is a real failure to start, not a stale request.
    if (started) started.catch(() => setStatus('error'));
  }, []);

  const toggle = useCallback(() => {
    const element = audio.current;
    if (!element || !element.src) return;
    if (element.paused) void element.play();
    else element.pause();
  }, []);

  const close = useCallback(() => {
    audio.current?.pause();
    setCurrent(null);
    setStatus('idle');
  }, []);

  return { current, status, audio, play, toggle, close };
}

/** Row control: starts this track in the banner, or pauses it if already on. */
export function PreviewButton({
  isCurrent,
  status,
  onPlay,
}: {
  isCurrent: boolean;
  status: Status;
  onPlay: () => void;
}) {
  const busy = isCurrent && status === 'loading';
  const playing = isCurrent && status === 'playing';

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-pressed={isCurrent}
      aria-label={playing ? 'Pause preview' : 'Play preview'}
      className={cx(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] transition-colors',
        isCurrent
          ? 'bg-accent text-white'
          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
      )}
    >
      <span aria-hidden="true">{busy ? '···' : playing ? '❚❚' : '▶'}</span>
    </button>
  );
}

/**
 * Resolved links only, in provider order. A search URL would render as an
 * identical icon while going somewhere else entirely.
 */
function exactLinks(links: ProviderLink[] | undefined): ProviderLink[] {
  if (!links) return [];
  return PROVIDER_IDS.map((provider) =>
    links.find((link) => link.provider === provider && link.kind === 'exact')
  ).filter((link): link is ProviderLink => link !== undefined);
}

/**
 * Fixed "now playing" bar.
 *
 * Fixed rather than sticky: it belongs to the viewport, not to a position in
 * the list, and a `bottom` sticky only holds an element you are scrolling
 * toward (measured — it scrolled straight away).
 */
/** Icon button — round by role. */
const CLOSE_BUTTON =
  'shrink-0 rounded-full px-2 py-1 text-sm text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700'; // unslop-ignore — icon button

export function PreviewBanner({ player }: { player: PreviewPlayer }) {
  const { current, status, audio } = player;
  const bar = useRef<HTMLDivElement | null>(null);

  // Animate from the element's clock rather than from React state: `timeupdate`
  // ticks ~4x a second, which is visibly steppy, and re-rendering the banner at
  // 60fps to fix that would be worse than writing the one style we need.
  useEffect(() => {
    if (!current) return;
    // Zero it up front: on a swap the element keeps the previous track's
    // currentTime until the new source loads, which left the bar parked at the
    // old position for a beat before snapping back.
    if (bar.current) bar.current.style.width = '0%';
    let frame = 0;
    const tick = () => {
      const element = audio.current;
      const node = bar.current;
      if (node && element && element.duration > 0) {
        const ratio = Math.min(1, element.currentTime / element.duration);
        node.style.width = `${ratio * 100}%`;
        // Announced value stays coarse; screen readers do not want 60 updates.
        const percent = String(Math.round(ratio * 100));
        if (node.getAttribute('aria-valuenow') !== percent) {
          node.setAttribute('aria-valuenow', percent);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [audio, current]);

  if (!current) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div
        ref={bar}
        className="h-0.5 bg-accent-bright"
        style={{ width: '0%' }}
        role="progressbar"
        aria-label="Preview progress"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={player.toggle}
          aria-label={status === 'playing' ? 'Pause preview' : 'Play preview'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm text-white transition-transform active:scale-95"
        >
          <span aria-hidden="true">
            {status === 'loading' ? '···' : status === 'playing' ? '❚❚' : '▶'}
          </span>
        </button>

        <Artwork
          url={current.artworkUrl}
          alt=""
          className="h-10 w-10 shrink-0 rounded-lg"
        />

        <div className="min-w-0 flex-1">
          {current.href ? (
            <a href={current.href} className="block min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {current.title}
              </p>
            </a>
          ) : (
            <p className="truncate text-sm font-medium text-gray-900">
              {current.title}
            </p>
          )}
          <p className="truncate text-xs text-gray-500">
            {status === 'error'
              ? 'No preview available for this track'
              : current.artist}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
          {exactLinks(current.links).map((link) => (
            <ProviderIconLink
              key={link.provider}
              link={link}
              trackLabel={`${current.title} by ${current.artist}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={player.close}
          aria-label="Close player"
          className={CLOSE_BUTTON}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
}

/**
 * The player lives in the root layout, not in a page.
 *
 * Vike keeps the layout mounted across client-side navigation while pages swap
 * beneath it, so audio survives moving from a search to a song page — mounted
 * per page, every navigation would silently stop the music.
 */
const PreviewPlayerContext = createContext<PreviewPlayer | null>(null);

export function PreviewPlayerProvider({ children }: { children: ReactNode }) {
  const player = usePreviewPlayer();
  return (
    <PreviewPlayerContext.Provider value={player}>
      {children}
      <PreviewBanner player={player} />
      {/* Reserve the banner's height so a fixed bar never covers page content. */}
      {player.current && <div aria-hidden="true" className="h-20" />}
    </PreviewPlayerContext.Provider>
  );
}

export function usePreviewPlayerContext(): PreviewPlayer {
  const player = useContext(PreviewPlayerContext);
  if (!player) {
    throw new Error('usePreviewPlayerContext must be used inside the root layout');
  }
  return player;
}
