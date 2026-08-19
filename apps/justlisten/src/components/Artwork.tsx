import { useEffect, useState } from 'react';
import { cx } from '@new-personal-monorepo/small-app-design-system';

export interface ArtworkProps {
  /** Preferred image URL (may be an upscaled variant). */
  url?: string;
  /** Tried when `url` is missing or fails to load. */
  fallbackUrl?: string;
  alt?: string;
  /** Size the artwork via className (e.g. `h-10 w-10`). */
  className?: string;
}

/**
 * Album artwork with graceful degradation: preferred URL → fallback URL →
 * neutral placeholder block with a music-note glyph.
 */
export function Artwork({ url, fallbackUrl, alt = '', className }: ArtworkProps) {
  const [failed, setFailed] = useState<string[]>([]);
  useEffect(() => setFailed([]), [url, fallbackUrl]);

  const src = [url, fallbackUrl].find((u) => u && !failed.includes(u));

  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={cx(
          'flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400',
          className
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-2/5 w-2/5"
          aria-hidden="true"
        >
          <path d="M9 18.5a2.5 2.5 0 1 1-2.5-2.5c.35 0 .69.07 1 .2V6.6a1 1 0 0 1 .77-.97l8-1.9A1 1 0 0 1 17.5 4.7v10.55a2.5 2.5 0 1 1-1.5 2.29V9.06l-7 1.66v7.78Z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed((prev) => [...prev, src])}
      className={cx('rounded-xl bg-slate-100 object-cover', className)}
    />
  );
}
