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
export function DeezerEmbed({
  target,
  title,
}: {
  target: DeezerEmbedTarget;
  title: string;
}) {
  const tracklist = target.type !== 'track';
  // No `autoplay` param: Deezer ignores it, verified in a real browser with a
  // genuine click — the widget still renders its own play overlay and waits.
  // Retargeting the iframe cues the track; starting it is a click inside.
  const src =
    `https://widget.deezer.com/widget/light/${target.type}/${target.id}` +
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
      className="w-full rounded-2xl border-0"
    />
  );
}
