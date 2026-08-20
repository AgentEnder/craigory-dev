/**
 * The JustListen mark: one play triangle carrying four colours, for one song
 * across four services. Inline rather than an <img> so it inherits size from
 * whatever renders it and adds no request; `public/favicon.svg` is the same
 * artwork for the tab.
 *
 * The mark is the one place the app is allowed chroma — `styles.css` keeps the
 * UI itself to ink and a single accent so the provider colours stay meaningful.
 * Each stop is a chosen value rather than a Tailwind ramp step, and none is any
 * provider's actual brand colour: the gradient evokes the services without
 * claiming to be one of them.
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
          <stop offset="0" stopColor="#2FBF8F" />
          <stop offset="0.38" stopColor="#F0B429" />
          <stop offset="0.7" stopColor="#F2647C" />
          {/* unslop-ignore — chosen, not a ramp */}
          <stop offset="1" stopColor="#9B4DE0" />
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
