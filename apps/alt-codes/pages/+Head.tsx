// Restore the real URL after the GitHub Pages 404.html SPA redirect (see
// craigory-dev/public/404.html). A deep link to a non-prerendered /glyph page lands on
// "/alt-codes/?/glyph/…"; this rewrites it back to "/alt-codes/glyph/…" via replaceState
// before Vike's client router reads the URL, so the client-only viewer renders. No-op on
// normal loads. Inline + synchronous so it runs ahead of the deferred client entry.
const SPA_REDIRECT_RESTORE = `(function(l){if(l.search[1]==='/'){var d=l.search.slice(1).split('&').map(function(s){return s.replace(/~and~/g,'&')}).join('?');window.history.replaceState(null,null,l.pathname.slice(0,-1)+d+l.hash)}}(window.location))`;

export function Head() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SPA_REDIRECT_RESTORE }} />
      <title>Glyph Index — Unicode & Alt Code Reference</title>
      <meta
        name="description"
        content="A clean, fast reference for Unicode characters and Windows Alt codes. Browse by category, search by code point, and click to copy."
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
