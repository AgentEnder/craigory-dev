import { useEffect, useState } from 'react';

import type { DeezerEmbed as DeezerEmbedTarget } from '../../worker/providers/links';

/**
 * Heights that fit each widget's own layout — the track player is a single
 * row, while album and playlist widgets carry a scrolling tracklist.
 */
const HEIGHTS: Record<DeezerEmbedTarget['type'], number> = {
  track: 152,
  album: 300,
  playlist: 300,
};

/**
 * Deezer's widget player.
 *
 * Deezer is the only supported platform whose player embeds with no account,
 * API key, or SDK, so this is where JustListen stops being purely a set of
 * outbound links and actually plays something. Anonymous listeners get a
 * 30-second preview; signed-in Deezer users get the full track.
 *
 * `light` rather than `auto` because the design system has no dark theme —
 * `auto` would follow the OS and leave a dark player on a white page.
 */
/**
 * The widget's message protocol.
 *
 * It posts `{action:'play'|'pause'}` to `window.parent` when playback starts or
 * stops — verified live, and what {@link useDeezerPlaybackState} listens for.
 *
 * It also *accepts* those same two messages, with no origin check. We do not
 * send them: the inbound handler calls `audio.play()`/`audio.pause()` directly
 * without touching the widget's own React state, so the transport UI would
 * disagree with what is actually playing, and in testing an inbound `play`
 * never produced audible playback or a matching outbound event.
 */
export const DEEZER_WIDGET_ORIGIN = 'https://widget.deezer.com';

/** Deezer previews are a fixed 30 seconds. */
const PREVIEW_LENGTH_MS = 30_000;

export function DeezerEmbed({
  target,
  title,
}: {
  target: DeezerEmbedTarget;
  title: string;
}) {
  const tracklist = target.type !== 'track';
  const src =
    `${DEEZER_WIDGET_ORIGIN}/widget/light/${target.type}/${target.id}` +
    `?tracklist=${tracklist}&radius=true`;

  return (
    <iframe
      title={title}
      src={src}
      width="100%"
      height={HEIGHTS[target.type]}
      // Deezer's player needs EME for playback; clipboard-write backs its
      // share button. Nothing else is granted.
      allow="encrypted-media; clipboard-write"
      // Below the fold on the playlist page, and never the reason a page
      // should be slow to paint.
      loading="lazy"
      className="w-full rounded-xl border-0"
    />
  );
}

/**
 * Whether the Deezer widget is currently playing.
 *
 * The widget announces its own transport over postMessage, so the tracklist can
 * show a real pause icon on the row that is actually sounding rather than
 * guessing from the last row clicked.
 */
export function useDeezerPlaybackState(resetKey: unknown): boolean {
  const [playing, setPlaying] = useState(false);

  // Retargeting reloads the widget, so whatever was playing has stopped.
  const [seenKey, setSeenKey] = useState(resetKey);
  if (seenKey !== resetKey) {
    setSeenKey(resetKey);
    setPlaying(false);
  }

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== DEEZER_WIDGET_ORIGIN) return;
      const action = (event.data as { action?: unknown } | null)?.action;
      if (action === 'play') setPlaying(true);
      else if (action === 'pause') setPlaying(false);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // A preview that runs to its end is the one stop the widget does NOT
  // announce — it swaps to its "listen on Deezer" panel silently, which left
  // the row showing a pause icon forever. Deezer previews are a fixed 30s, so
  // clear on that clock; a real pause arrives as an event and lands first.
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setPlaying(false), PREVIEW_LENGTH_MS);
    return () => clearTimeout(timer);
  }, [playing, resetKey]);

  return playing;
}
