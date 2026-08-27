/**
 * Fetching the public HTML pages the keyless playlist importers read.
 *
 * A browser User-Agent is not evasion dressing — these are the pages a browser
 * gets, and both sites serve a stripped or redirected shell to a bare fetch
 * client, which parses to nothing.
 *
 * UNVERIFIED IN PRODUCTION: local `wrangler dev` runs on your own IP, so these
 * fetches have only been exercised from a residential address. Worker egress
 * comes from Cloudflare's ranges, which YouTube in particular treats more
 * suspiciously. Every caller treats a failure as "no result" and falls back to
 * its credentialed path, so a block degrades rather than breaks.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

/** Public page HTML, or null on any non-OK response or transport error. */
export async function fetchPublicPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': BROWSER_UA,
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}
