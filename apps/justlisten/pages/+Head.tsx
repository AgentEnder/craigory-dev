/**
 * An SVG favicon only — no .ico fallback. Every browser that can run this app
 * (it needs ES modules and the Cache API) supports SVG favicons.
 */
export function Head() {
  return (
    <>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <meta name="theme-color" content="#0F172A" />
    </>
  );
}
