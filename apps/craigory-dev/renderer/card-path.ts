/**
 * The path of the card generated beside a page.
 *
 * The trailing-slash strip is the whole point. On the home page `urlOriginal` is
 * `"/"`, and naive concatenation produced `"//og.png"` — which `new URL()` reads
 * as protocol-relative, so the site's own `og:image` resolved to
 * `https://og.png/`, a domain that does not exist. Every share of the front page
 * pointed at nothing.
 */
export function cardPath(urlOriginal: string): string {
  return `${urlOriginal.replace(/\/+$/, '')}/og.png`;
}
