import { Card, cx } from '@new-personal-monorepo/small-app-design-system';
import { useState } from 'react';

import type { DeezerEmbed as DeezerEmbedTarget } from '../../worker/providers/links';
import { DeezerEmbed, useDeezerPlaybackState } from './DeezerEmbed';

/** What the shared widget is currently pointed at, and how to say so. */
interface Cued {
  /** Row identity, NOT the Deezer track id — two rows in one list can resolve
   *  to the same recording, and keying on the id lights both up as playing. */
  key: string;
  target: DeezerEmbedTarget;
  label: string;
}

export interface DeezerPlayer {
  cued: Cued | null;
  /** True only while the widget reports audio actually sounding. */
  playing: boolean;
  cue: (key: string, target: DeezerEmbedTarget, label: string) => void;
  clear: () => void;
  /** What to render: the cued track, else the caller's fallback, else nothing. */
  embed: DeezerEmbedTarget | null;
}

/**
 * One shared Deezer widget driven by a list of rows.
 *
 * `fallback` is an optional whole-collection target (a Deezer-sourced playlist)
 * shown until a row is picked; lists with no such target simply show no player
 * until something is cued.
 */
export function useDeezerPlayer(
  fallback: DeezerEmbedTarget | null = null
): DeezerPlayer {
  const [cued, setCued] = useState<Cued | null>(null);
  const playing = useDeezerPlaybackState(cued?.key ?? null);

  return {
    cued,
    playing,
    cue: (key, target, label) => setCued({ key, target, label }),
    clear: () => setCued(null),
    embed: cued?.target ?? fallback,
  };
}

/**
 * The player card.
 *
 * Pinned to the TOP, not the bottom: a `bottom` sticky only holds an element
 * you are scrolling *toward*, and this one sits above its list, so it would
 * simply scroll away (measured). Sticking it to the top keeps it reachable
 * while a long list scrolls under it — otherwise a row's button retargets a
 * widget that is no longer on screen.
 */
export function DeezerPlayerPanel({
  player,
  fallbackLabel,
  returnLabel,
}: {
  player: DeezerPlayer;
  /** Describes the fallback target, for the iframe's accessible name. */
  fallbackLabel?: string;
  /** Dismiss wording — "Back to playlist" when a fallback exists. */
  returnLabel: string;
}) {
  if (!player.embed) return null;

  return (
    <div className="sticky top-4 z-10">
      <Card>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Play
          </h2>
          {player.cued && (
            <button
              type="button"
              onClick={player.clear}
              className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-700"
            >
              {returnLabel}
            </button>
          )}
        </div>
        <div className="mt-3">
          <DeezerEmbed
            target={player.embed}
            title={`Deezer player for ${player.cued?.label ?? fallbackLabel ?? 'this playlist'}`}
          />
        </div>
      </Card>
    </div>
  );
}

/**
 * A row's cue control.
 *
 * "Load", not "Play": pointing the widget at a track does not start it —
 * Deezer requires a click inside the widget to begin audio.
 */
export function DeezerCueButton({
  target,
  label,
  isCued,
  isPlaying,
  onCue,
}: {
  target: DeezerEmbedTarget;
  label: string;
  isCued: boolean;
  isPlaying: boolean;
  onCue: (target: DeezerEmbedTarget, label: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCue(target, label)}
      aria-pressed={isCued}
      aria-label={`Load ${label} in the Deezer player`}
      className={cx(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] transition-colors',
        isCued
          ? 'bg-[#A238FF] text-white'
          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
      )}
    >
      <span aria-hidden="true">{isPlaying ? '❚❚' : '▶'}</span>
    </button>
  );
}
