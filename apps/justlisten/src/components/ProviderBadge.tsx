import { cx } from '@new-personal-monorepo/small-app-design-system';
import { FaDeezer } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { SiApplemusic, SiSpotify, SiYoutubemusic } from 'react-icons/si';

import type { ProviderId, ProviderLink } from '../../worker/types';

/**
 * Provider branding. Badges and buttons are colored text; the compact icon
 * links used in the playback banner carry each service's brand mark, where a
 * word would not survive the space. Spotify green #1DB954, Apple rose, YouTube
 * red, Deezer violet.
 */
export const PROVIDER_LABELS: Record<ProviderId, string> = {
  spotify: 'Spotify',
  apple: 'Apple Music',
  youtube: 'YouTube Music',
  deezer: 'Deezer',
};

/**
 * Each service's own brand colour, plus an `ink` darkened enough to clear 4.5:1
 * on white for text use.
 *
 * Spelled out as literal hexes in every map below rather than composed at
 * runtime, because Tailwind only emits arbitrary values it can find as static
 * strings. Previously only Spotify used its real colour and the other three
 * fell back to the nearest Tailwind ramp (rose, red, violet), which is how a
 * provider ends up wearing a colour nobody chose for it.
 *
 *   spotify #1DB954 / #14833b     apple   #FA243C / #B3122A
 *   youtube #FF0033 / #C10023     deezer  #A238FF / #7A22CC
 */
const BADGE_STYLES: Record<ProviderId, string> = {
  spotify: 'bg-[#1DB954]/15 text-[#14833b]',
  apple: 'bg-[#FA243C]/15 text-[#B3122A]',
  youtube: 'bg-[#FF0033]/15 text-[#C10023]',
  deezer: 'bg-[#A238FF]/15 text-[#7A22CC]', // unslop-ignore — Deezer's brand purple
};

export interface ProviderBadgeProps {
  provider: ProviderId;
  className?: string;
}

/** Small inline pill naming a provider (used for source labels, hints, …). */
export function ProviderBadge({ provider, className }: ProviderBadgeProps) {
  return (
    <span
      className={cx(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold', // unslop-ignore — badge by role
        BADGE_STYLES[provider],
        className
      )}
    >
      {PROVIDER_LABELS[provider]}
    </span>
  );
}

const EXACT_STYLES: Record<ProviderId, string> = {
  spotify: 'bg-[#1DB954] text-white shadow-sm hover:bg-[#14833b]',
  apple: 'bg-[#FA243C] text-white shadow-sm hover:bg-[#B3122A]',
  youtube: 'bg-[#FF0033] text-white shadow-sm hover:bg-[#C10023]',
  deezer: 'bg-[#A238FF] text-white shadow-sm hover:bg-[#7A22CC]', // unslop-ignore — brand purple
};

const SEARCH_STYLES: Record<ProviderId, string> = {
  spotify:
    'border border-gray-200 bg-white text-[#14833b] hover:border-[#1DB954]/50 hover:bg-[#1DB954]/5',
  apple:
    'border border-gray-200 bg-white text-[#B3122A] hover:border-[#FA243C]/50 hover:bg-[#FA243C]/5',
  youtube:
    'border border-gray-200 bg-white text-[#C10023] hover:border-[#FF0033]/50 hover:bg-[#FF0033]/5',
  deezer: // unslop-ignore — brand purple
    'border border-gray-200 bg-white text-[#7A22CC] hover:border-[#A238FF]/50 hover:bg-[#A238FF]/5',
};

export interface ProviderLinkButtonProps {
  link: ProviderLink;
  /** Human description of the track, used in the accessible label. */
  trackLabel?: string;
  className?: string;
}

/**
 * "Listen on …" button for a resolved provider link. Exact matches render as
 * prominent brand-colored buttons; `kind: 'search'` fallbacks render as
 * subdued "Search on …" outline buttons.
 */
export function ProviderLinkButton({
  link,
  trackLabel,
  className,
}: ProviderLinkButtonProps) {
  const providerName = PROVIDER_LABELS[link.provider];
  const exact = link.kind === 'exact';
  const text = exact ? `Listen on ${providerName}` : `Search on ${providerName}`;
  const ariaLabel = `${
    trackLabel
      ? exact
        ? `Listen to ${trackLabel} on ${providerName}`
        : `Search for ${trackLabel} on ${providerName}`
      : text
  } (opens in a new tab)`;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cx(
        'flex w-full items-center justify-between gap-3 rounded-xl px-5 font-semibold transition-all duration-200 active:scale-[0.98]',
        exact
          ? cx('py-3.5 text-base', EXACT_STYLES[link.provider])
          : cx('py-3 text-sm', SEARCH_STYLES[link.provider]),
        className
      )}
    >
      <span className="truncate">{text}</span>
      <span
        aria-hidden="true"
        className={cx('text-sm', exact ? 'text-white/80' : 'text-gray-300')}
      >
        ↗
      </span>
    </a>
  );
}

/**
 * Brand marks, for places too small for a label.
 *
 * Deezer's comes from Font Awesome because Simple Icons does not carry one;
 * both sets draw solid single-color marks, so they sit together evenly.
 */
const PROVIDER_ICONS: Record<ProviderId, IconType> = {
  spotify: SiSpotify,
  apple: SiApplemusic,
  youtube: SiYoutubemusic,
  deezer: FaDeezer,
};

const PROVIDER_ICON_COLORS: Record<ProviderId, string> = {
  spotify: 'text-[#1DB954] hover:bg-[#1DB954]/10',
  apple: 'text-[#FA243C] hover:bg-[#FA243C]/10',
  youtube: 'text-[#FF0033] hover:bg-[#FF0033]/10',
  deezer: 'text-[#A238FF] hover:bg-[#A238FF]/10',
};

/** Icon-only link out to a provider. Exact matches only — a search URL here
 *  would look identical to a real one while going somewhere else. */
export function ProviderIconLink({
  link,
  trackLabel,
}: {
  link: ProviderLink;
  trackLabel: string;
}) {
  const Icon = PROVIDER_ICONS[link.provider];
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Listen to ${trackLabel} on ${PROVIDER_LABELS[link.provider]}`}
      title={`Listen on ${PROVIDER_LABELS[link.provider]}`}
      className={cx(
        'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
        PROVIDER_ICON_COLORS[link.provider]
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}
