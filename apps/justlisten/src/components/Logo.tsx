/**
 * The JustListen mark: one play triangle carrying four colours, for one song
 * across four services. Inline rather than an <img> so it inherits size from
 * whatever renders it and adds no request; `public/favicon.svg` is the same
 * artwork for the browser tab.
 *
 * The gradient evokes the streaming services without reproducing any of their
 * marks — brand colours belong to the provider links, not to our own logo.
 */
export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="JustListen"
    >
      <defs>
        {/* Scoped id: two Logos on one page must not share a gradient node. */}
        <linearGradient id="justlisten-mark" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#34D399" />
          <stop offset="0.38" stopColor="#FBBF24" />
          <stop offset="0.7" stopColor="#FB7185" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0F172A" />
      <path
        d="M25.5 21.5 L25.5 42.5 L44 32 Z"
        fill="url(#justlisten-mark)"
        stroke="url(#justlisten-mark)"
        strokeWidth="9"
        strokeLinejoin="round"
      />
    </svg>
  );
}
