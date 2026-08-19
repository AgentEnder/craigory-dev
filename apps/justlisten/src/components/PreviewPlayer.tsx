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

import { getDeezerPreview } from '../api';
import { Artwork } from './Artwork';

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
  // Guards against a slow lookup for a track the listener has already moved on
  // from: only the newest request may take the player.
  const latest = useRef(0);

  useEffect(() => {
    const element = new Audio();
    element.preload = 'none';
    audio.current = element;
    const onEnded = () => setStatus('paused');
    element.addEventListener('ended', onEnded);
    element.addEventListener('play', () => setStatus('playing'));
    element.addEventListener('pause', () =>
      setStatus((s) => (s === 'playing' ? 'paused' : s))
    );
    return () => {
      element.pause();
      element.removeEventListener('ended', onEnded);
      audio.current = null;
    };
  }, []);

  const play = useCallback((track: PreviewTrack) => {
    const element = audio.current;
    if (!element) return;
    const ticket = ++latest.current;
    setCurrent(track);
    setStatus('loading');
    element.pause();

    getDeezerPreview(track.deezerId)
      .then(({ url }) => {
        if (ticket !== latest.current || !audio.current) return;
        element.src = url;
        return element.play();
      })
      .catch(() => {
        if (ticket !== latest.current) return;
        setStatus('error');
      });
  }, []);

  const toggle = useCallback(() => {
    const element = audio.current;
    if (!element || !element.src) return;
    if (element.paused) void element.play();
    else element.pause();
  }, []);

  const close = useCallback(() => {
    latest.current++;
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
          ? 'bg-[#A238FF] text-white'
          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
      )}
    >
      <span aria-hidden="true">{busy ? '···' : playing ? '❚❚' : '▶'}</span>
    </button>
  );
}

/**
 * Fixed "now playing" bar.
 *
 * Fixed rather than sticky: it belongs to the viewport, not to a position in
 * the list, and a `bottom` sticky only holds an element you are scrolling
 * toward (measured — it scrolled straight away).
 */
export function PreviewBanner({ player }: { player: PreviewPlayer }) {
  const { current, status, audio } = player;
  const bar = useRef<HTMLDivElement | null>(null);

  // Animate from the element's clock rather than from React state: `timeupdate`
  // ticks ~4x a second, which is visibly steppy, and re-rendering the banner at
  // 60fps to fix that would be worse than writing the one style we need.
  useEffect(() => {
    if (!current) return;
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
        className="h-0.5 bg-[#A238FF]"
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
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A238FF] text-sm text-white transition-transform active:scale-95"
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

        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:block">
          30s preview · Deezer
        </span>

        <button
          type="button"
          onClick={player.close}
          aria-label="Close player"
          className="shrink-0 rounded-full px-2 py-1 text-sm text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
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
