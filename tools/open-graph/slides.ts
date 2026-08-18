/**
 * Getting a deck's backdrop art out of its first slide.
 *
 * A screenshot of the whole slide was the obvious move and the wrong one: most
 * title slides are a heading and a name on a flat background, so the cards came
 * out plainer than the templated ones, and in a set they read as inconsistent.
 * Taking just the backdrop and setting the site's own card text over it keeps
 * the deck's visual identity and the site's typography at the same time.
 *
 * It still needs a real browser against a served build. A deck's viewer page is
 * an empty shell on disk — `ViewPresentation` fetches the markdown and hands it
 * to remark in the browser, the same fact `tools/build-search-index.ts` works
 * around — and the backdrop is only knowable once remark has applied the
 * layout slide's `background-image` to the slide that inherits it.
 */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { extname, join, normalize } from 'node:path';
import type { Page } from 'playwright';

import { SITE_BASE } from './page-meta';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.md': 'text/markdown; charset=utf-8',
};

export interface StaticSite {
  origin: string;
  close(): Promise<void>;
}

/**
 * Serves the built client directory on an ephemeral loopback port, under the
 * Base URL the build was made for.
 *
 * A preview build's own asset URLs carry that prefix, so its pages request
 * `/pr/12/assets/...`; served from the root, every one of those 404s, the deck
 * viewer never boots, and the backdrop read below fails for all decks at once.
 * Taking the prefix back off here serves the build the way its deploy will.
 */
export function serveStatic(root: string): Promise<StaticSite> {
  const server: Server = createServer((req, res) => {
    const requestPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
    const base = SITE_BASE.pathname;
    const sitePath = requestPath.startsWith(base)
      ? `/${requestPath.slice(base.length)}`
      : requestPath;
    // `normalize` collapses any `..`, and the prefix check rejects whatever is
    // left that still points outside the build output.
    let filePath = normalize(join(root, sitePath));
    if (!filePath.startsWith(normalize(root))) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html');
    }
    if (!existsSync(filePath)) {
      res.writeHead(404).end(`Not found: ${requestPath}`);
      return;
    }
    res.writeHead(200, {
      'Content-Type':
        MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        reject(new Error('Static server did not bind to a TCP port'));
        return;
      }
      resolve({
        origin: `http://127.0.0.1:${address.port}`,
        close: () =>
          new Promise<void>((done, fail) =>
            server.close((err) => (err ? fail(err) : done()))
          ),
      });
    });
  });
}

/**
 * The first slide's background image, as a `data:` URL, or `undefined` when the
 * deck's opening slide is painted with a flat color or a CSS gradient rather
 * than art. Callers fall back to the card's own themed gradient, which is why
 * a missing backdrop is a return value rather than an error.
 */
export async function firstSlideBackground(
  page: Page,
  origin: string,
  slug: string
): Promise<string | undefined> {
  // `SITE_BASE.pathname` ends in a slash, and is `/` off a preview deploy.
  const url = `${origin}${SITE_BASE.pathname}presentations/view/${slug}`;
  // 16:9, so the slide lays out the way it does in the viewer. Nothing is
  // screenshotted here, but a deck could reasonably swap art by aspect ratio.
  await page.setViewportSize({ width: 1200, height: 675 });

  const consoleErrors: string[] = [];
  const onConsole = (message: { type(): string; text(): string }) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  };
  page.on('console', onConsole);

  try {
    await page.goto(url, { waitUntil: 'networkidle' });

    // remark is loaded from its CDN by the viewer, so this covers the network
    // round trip as well as the render. Failing loudly beats silently treating
    // an unrendered deck as one that simply has no backdrop.
    try {
      await page.waitForFunction(
        () => {
          const slide = document.querySelector(
            '.remark-visible .remark-slide-content'
          );
          return !!slide && (slide.textContent ?? '').trim().length > 0;
        },
        undefined,
        { timeout: 30_000 }
      );
    } catch (cause) {
      throw new Error(
        `remark never rendered a first slide for "${slug}" at ${url}.` +
          (consoleErrors.length
            ? `\nPage console errors:\n  ${consoleErrors.join('\n  ')}`
            : '\nNo page console errors were reported; check that the deck viewer could reach https://remarkjs.com.'),
        { cause }
      );
    }

    const backgroundUrl = await page.evaluate(() => {
      // A deck usually sets its art on a `layout: true` slide that the title
      // slide inherits via `template:`, and remark applies that to the slide
      // content element. Walking up covers decks that paint a container
      // instead. `none` and `linear-gradient(...)` simply do not match.
      let element: Element | null = document.querySelector(
        '.remark-visible .remark-slide-content'
      );
      while (element) {
        const match = getComputedStyle(element).backgroundImage.match(
          /url\("?([^")]+)"?\)/
        );
        if (match) return match[1];
        element = element.parentElement;
      }
      return null;
    });
    if (!backgroundUrl) return undefined;

    // Fetched inside the page so the browser resolves it against the deck's own
    // document, and so the bytes come back already encoded for the card.
    const dataUrl = await page.evaluate(async (target) => {
      const response = await fetch(target);
      if (!response.ok) return null;
      const blob = await response.blob();
      return await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }, backgroundUrl);

    if (!dataUrl) {
      throw new Error(
        `Deck "${slug}" declares a background image at ${backgroundUrl}, but it could not be fetched from the built site.`
      );
    }
    return dataUrl;
  } finally {
    page.off('console', onConsole);
  }
}
