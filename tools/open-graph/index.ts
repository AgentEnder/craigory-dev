/**
 * Generates every page's `og.png` into the built client directory, where
 * `renderer/+image.ts` has already pointed `og:image` at it.
 *
 * Three kinds of card come out of this:
 *
 * 1. **A post with its own `ogImage`** — nothing is generated. The author has
 *    supplied the card; overwriting it would make the setting a no-op.
 * 2. **A deck with slides** — a screenshot of slide one, taken from the real
 *    viewer page. See `slides.ts` for why that needs a served build.
 * 3. **Everything else** — the templated card in `card.ts`, themed to match the
 *    post's own page.
 *
 * Runs under **bun**, which is what lets it import post modules directly:
 * `bunfig.toml` maps `.mdx` to the `text` loader, and `.png` falls to bun's
 * default `file` loader, so a post's colocated cover arrives here as an absolute
 * path on disk while the same import gives the site a hashed URL. See the
 * `PostImage` docs in `libs/blog-posts/src/lib/blog-post.ts`.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { chromium, type Page } from 'playwright';

import { blogPosts } from '../../libs/blog-posts/src/lib/posts';
import { formatDateString } from '../../libs/date-utils/src';
import { PRESENTATIONS } from '../../libs/presentations/src/lib/presentations';
import { getPostThemeClass } from '../../apps/craigory-dev/src/utils/post-theming';
import {
  CARD_FONT_FAMILY,
  CARD_VIEWPORT,
  fileToDataUrl,
  renderCard,
} from './card';
import { localApps, withSocialMeta } from './apps';
import {
  SITE_BASE,
  cardOutputPath,
  declaresGeneratedCard,
  findPageFiles,
  readMeta,
} from './page-meta';
import { firstSlideBackground, serveStatic } from './slides';

const WORKSPACE_ROOT = join(__dirname, '../..');
const OUTPUT_BASE_PATH = join(
  WORKSPACE_ROOT,
  'dist/apps/craigory-dev/client'
);

// Deliberately larger than any title needs: the fit loop walks down from here,
// so a two-word title gets to fill the card instead of sitting small in the
// middle of it, and a four-line title still lands wherever it stops overflowing.
const MAX_TITLE_PX = 96;
const MIN_TITLE_PX = 38;

const formatDate = (date: Date) =>
  date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    .toUpperCase();

/**
 * Shrinks the title until it and the description both fit the body row.
 *
 * A measured loop rather than length-based buckets, because "how many lines does
 * this become" depends on where the words break, not on how many characters
 * there are: two 60-character titles can wrap to two lines and to four.
 */
async function fitTitle(page: Page): Promise<number> {
  return page.evaluate(
    ({ max, min }) => {
      const main = document.querySelector('main');
      const title = document.querySelector('h1');
      if (!main || !title) throw new Error('Card is missing its body element');
      const body = document.querySelector('main p');

      // The clamp is a backstop for titles that do not fit even at the minimum;
      // while measuring it would hide exactly the overflow we are looking for.
      const clamp = title.style.webkitLineClamp;
      title.style.webkitLineClamp = 'unset';

      const gap = parseFloat(getComputedStyle(main).rowGap) || 0;
      const budget = main.clientHeight;
      // offsetHeight, not scrollHeight: the description's own clamp is real and
      // its clamped height is what the layout will actually spend.
      const bodyHeight = body ? body.offsetHeight + gap : 0;

      let size = min;
      for (let candidate = max; candidate >= min; candidate -= 2) {
        title.style.fontSize = `${candidate}px`;
        if (title.scrollHeight + bodyHeight <= budget) {
          size = candidate;
          break;
        }
      }
      title.style.fontSize = `${size}px`;
      title.style.webkitLineClamp = clamp;
      return size;
    },
    { max: MAX_TITLE_PX, min: MIN_TITLE_PX }
  );
}

async function screenshotCard(page: Page, html: string, outputPath: string) {
  await page.setViewportSize(CARD_VIEWPORT);
  await page.setContent(html, { waitUntil: 'load' });

  // A card that silently falls back to the platform sans is a regression nobody
  // notices until it is on someone else's timeline, so prove the webfont landed.
  await page.evaluate(async (family) => {
    await document.fonts.ready;
    if (!document.fonts.check(`900 64px "${family}"`)) {
      throw new Error(
        `The ${family} webfont did not load; social cards would render in a fallback face. Check network access to fonts.googleapis.com.`
      );
    }
  }, CARD_FONT_FAMILY);

  await fitTitle(page);
  mkdirSync(dirname(outputPath), { recursive: true });
  await page.screenshot({ path: outputPath });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // `pages/presentations/view/+onBeforePrerenderStart.ts` only prerenders decks
  // that have slides; the rest are link-outs with no viewer page of their own.
  // Generating cards for them would write files nothing ever references.
  const decks = Object.values(PRESENTATIONS).filter((deck) => deck.mdUrl);
  // Only paid for when a deck actually needs rendering.
  const site = decks.length ? await serveStatic(OUTPUT_BASE_PATH) : undefined;

  try {
    for (const post of blogPosts) {
      if (post.ogImage) {
        console.log(`Skipping ${post.slug}: post supplies its own og image`);
        continue;
      }
      console.log('Generating card for blog post:', post.slug);
      await screenshotCard(
        page,
        renderCard({
          theme: getPostThemeClass(post),
          title: post.title,
          // Descriptions are authored as prose and some run to several
          // paragraphs; the card only ever has room for the opening one.
          body: post.description.split('\n').find((line) => line.trim()),
          eyebrow: formatDate(post.publishDate),
          meta: post.tags.join(' · '),
          cover: post.cover && fileToDataUrl(post.cover.src),
        }),
        join(
          OUTPUT_BASE_PATH,
          'blog',
          formatDateString(post.publishDate),
          post.slug,
          'og.png'
        )
      );
    }

    for (const deck of decks) {
      if (!site) {
        throw new Error(
          `No static server is running, so "${deck.slug}" has no backdrop to read.`
        );
      }
      console.log('Reading first-slide backdrop for deck:', deck.slug);
      const cover = await firstSlideBackground(page, site.origin, deck.slug);
      await screenshotCard(
        page,
        renderCard({
          theme: 'theme-technical',
          title: deck.title,
          // Talk abstracts run to several paragraphs; a card holds the first.
          body: deck.description.split('\n').find((line) => line.trim()),
          eyebrow: formatDate(deck.presentedOn),
          meta: deck.presentedAt,
          cover,
        }),
        join(OUTPUT_BASE_PATH, 'presentations', 'view', deck.slug, 'og.png')
      );
    }

    // Everything else that asks for a card: the home page, the blog and
    // presentation indexes, /projects, /tools, and every future page, since
    // `renderer/+image.ts` points them all at an adjacent `og.png` by default.
    // Sweeping the build output rather than keeping a list means a new page
    // cannot ship a social preview that 404s just because nobody remembered it.
    //
    // A card goes wherever the page says it is, which is usually beside it but
    // need not be: the blog index's pagination all declare the one
    // `/blog/og.png`. The first page to ask for a card generates it and the rest
    // find it already there, so the sweep runs in sorted order — `readdirSync`
    // gives the filesystem's order, and which sibling was visited first would
    // otherwise decide whether a shared card reads "Blog" or "Blog, page 3".
    for (const pagePath of findPageFiles(OUTPUT_BASE_PATH).sort()) {
      const html = readFileSync(pagePath, 'utf-8');
      const image = readMeta(html, 'og:image');
      if (!declaresGeneratedCard(image)) continue;

      const outputPath = cardOutputPath(OUTPUT_BASE_PATH, image);
      // Skips the posts and decks handled above with richer input than a page's
      // head can offer — their own theme, cover art, or actual slides — and
      // every page after the first that shares a card.
      if (existsSync(outputPath)) continue;

      const title = readMeta(html, 'og:title');
      if (!title) {
        throw new Error(
          `${pagePath} asks for a generated card but declares no og:title.`
        );
      }
      console.log('Generating card for page:', pagePath);
      await screenshotCard(
        page,
        renderCard({
          theme: 'theme-default',
          title,
          body: readMeta(html, 'og:description'),
          // No eyebrow: these pages set their own titles, so a section label
          // derived from the URL only ever restated it ("BLOG" over "Blog").
          eyebrow: '',
        }),
        outputPath
      );
    }

    // The sibling apps published at craigory.dev/<app>. Unlike everything
    // above they are not vike pages, so nothing has given them social tags;
    // the card and the tags that point at it are both written here.
    for (const app of localApps(WORKSPACE_ROOT, readdirSync(join(WORKSPACE_ROOT, 'apps')))) {
      const pagePath = join(OUTPUT_BASE_PATH, app.dir, 'index.html');
      if (!existsSync(pagePath)) {
        throw new Error(
          `apps/${app.dir} is published to the site but ${pagePath} is missing; did copy-local-projects.cjs run?`
        );
      }
      console.log('Generating card for app:', app.dir);
      const outputPath = join(OUTPUT_BASE_PATH, app.dir, 'og.png');
      await screenshotCard(
        page,
        renderCard({
          theme: 'theme-default',
          title: app.name,
          body: app.description,
          eyebrow: 'Tools',
        }),
        outputPath
      );

      const appUrl = new URL(`${app.dir}/`, SITE_BASE).href;
      writeFileSync(
        pagePath,
        withSocialMeta(readFileSync(pagePath, 'utf-8'), [
          { name: 'description', content: app.description },
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: app.name },
          { property: 'og:description', content: app.description },
          { property: 'og:url', content: appUrl },
          { property: 'og:image', content: new URL('og.png', appUrl).href },
          { property: 'og:image:alt', content: app.name },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:image:alt', content: app.name },
        ])
      );
    }
  } finally {
    await site?.close();
    await browser.close();
  }
})();
