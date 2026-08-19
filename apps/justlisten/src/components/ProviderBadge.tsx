import { cx } from '@new-personal-monorepo/small-app-design-system';
import type { ProviderId, ProviderLink } from '../../worker/types';

/**
 * Provider branding: simple colored text badges/buttons only — no trademarked
 * logo assets. Spotify green #1DB954, Apple rose, YouTube red, Deezer violet.
 */
export const PROVIDER_LABELS: Record<ProviderId, string> = {
  spotify: 'Spotify',
  apple: 'Apple Music',
  youtube: 'YouTube Music',
  deezer: 'Deezer',
};

const BADGE_STYLES: Record<ProviderId, string> = {
  spotify: 'bg-[#1DB954]/15 text-[#14833b]',
  apple: 'bg-rose-100 text-rose-700',
  youtube: 'bg-red-100 text-red-700',
  deezer: 'bg-violet-100 text-violet-700',
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
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
        BADGE_STYLES[provider],
        className
      )}
    >
      {PROVIDER_LABELS[provider]}
    </span>
  );
}

const EXACT_STYLES: Record<ProviderId, string> = {
  spotify: 'bg-[#1DB954] text-white shadow-sm hover:bg-[#19a64b]',
  apple: 'bg-rose-500 text-white shadow-sm hover:bg-rose-600',
  youtube: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
  deezer: 'bg-violet-600 text-white shadow-sm hover:bg-violet-700',
};

const SEARCH_STYLES: Record<ProviderId, string> = {
  spotify:
    'border border-gray-200 bg-white text-[#14833b] hover:border-[#1DB954]/50 hover:bg-[#1DB954]/5',
  apple:
    'border border-gray-200 bg-white text-rose-600 hover:border-rose-300 hover:bg-rose-50',
  youtube:
    'border border-gray-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50',
  deezer:
    'border border-gray-200 bg-white text-violet-600 hover:border-violet-300 hover:bg-violet-50',
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
        'flex w-full items-center justify-between gap-3 rounded-2xl px-5 font-semibold transition-all duration-200 active:scale-[0.98]',
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
