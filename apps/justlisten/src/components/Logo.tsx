/**
 * The JustListen mark: a play triangle in ink and the app's single accent.
 * Inline rather than an <img> so it inherits size from whatever renders it and
 * adds no request; `public/favicon.svg` is the same artwork for the tab.
 *
 * It carried a four-colour gradient first, one stop per service. That read as
 * a rainbow the app had not earned — and its stops were Tailwind ramp values,
 * which is the thing the palette in styles.css exists to avoid. Ink plus the
 * accent says what the app actually is: neutral, with the services supplying
 * the colour.
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
          <stop offset="0" stopColor="#12A594" />
          <stop offset="1" stopColor="#0B7C74" />
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
