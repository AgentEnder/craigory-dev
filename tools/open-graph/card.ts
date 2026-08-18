/**
 * The templated social card — one 1200x630 page, rendered by a real browser and
 * screenshotted by `tools/open-graph/index.ts`.
 *
 * The layout is a three-row grid (header / body / footer) rather than the
 * centered `place-items: center` box this replaced. Centering was the source of
 * the old card's worst defect: with `overflow: hidden` on a centered grid, a long
 * description was sliced mid-word with nothing to signal the cut, because
 * `text-overflow: ellipsis` only ever applies to a single unwrapped line. Rows
 * plus `-webkit-line-clamp` give the browser a real budget and a real ellipsis.
 */

import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

import type { PostThemeClass } from '../../apps/craigory-dev/src/utils/post-theming';
import { escapeHtml } from './page-meta';

interface Palette {
  /** Page background, and the color the cover scrim fades toward. */
  base: string;
  /** Start of the rule/glow gradient. */
  accent: string;
  /** End of the rule/glow gradient. */
  accentEnd: string;
}

/**
 * Card colors, keyed by the theme class the post's own page uses. Sharing
 * `PostThemeClass` is deliberate twice over: a tiki post's card and its page
 * cannot drift apart because someone re-tagged the post, and adding a theme
 * without a palette here fails to compile rather than falling through to an
 * undefined lookup at render time.
 */
const PALETTES: Record<PostThemeClass, Palette> = {
  // Warm cocoa and coral, taken from the tropical radial gradients that
  // `.theme-tiki` paints behind a tiki post's body.
  'theme-tiki': { base: '#1a0e08', accent: '#ff6b47', accentEnd: '#ffc107' },
  // The site's own accent, the indigo-to-violet used for the /blog heading and
  // post-title hovers.
  'theme-technical': { base: '#0d1024', accent: '#667eea', accentEnd: '#764ba2' },
  // Gold, so a non-tiki review still reads as a review at a glance.
  'theme-review': { base: '#181206', accent: '#e8a33d', accentEnd: '#f2d16b' },
  // Navy into teal — the one thing worth keeping from the card this replaces,
  // so untagged posts stay visually continuous with older shares.
  'theme-default': { base: '#02001f', accent: '#00b4c8', accentEnd: '#3f7fb3' },
};

export interface CardContent {
  theme: PostThemeClass;
  /** Rendered large; shrinks to fit rather than overflowing. */
  title: string;
  /** Optional supporting prose, clamped to three lines with an ellipsis. */
  body?: string;
  /** Right side of the header, e.g. a publish date or the venue and date. */
  eyebrow: string;
  /** Footer line, e.g. a post's tags. */
  meta?: string;
  /**
   * An image to bleed behind the text, as a `data:` URL. Callers build it:
   * a post's cover comes off disk via `fileToDataUrl`, a deck's comes out of
   * the running page, and neither shape belongs in the template.
   */
  cover?: string;
}

const WIDTH = 1200;
const HEIGHT = 630;

export const CARD_VIEWPORT = { width: WIDTH, height: HEIGHT };

/**
 * The one font the card uses, matching the site's body font. Loaded from Google
 * Fonts, which `index.ts` then *verifies* actually arrived — a card that
 * silently falls back to the platform sans is the kind of regression nobody
 * notices until it is on someone else's timeline.
 */
export const CARD_FONT_FAMILY = 'Rubik';
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;900&display=swap';

const COVER_MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
};

/**
 * Reads a cover off disk as a `data:` URL. Covers are inlined rather than
 * referenced by path because `setContent` leaves the document on an
 * `about:blank` origin, from which `file://` subresources do not reliably load.
 * Inlining sidesteps the origin question and removes any chance of
 * screenshotting a card whose image had not finished arriving.
 */
export function fileToDataUrl(path: string): string {
  const extension = extname(path).toLowerCase();
  const mime = COVER_MIME_TYPES[extension];
  // Guessing at `application/octet-stream` would leave the browser refusing to
  // decode the image and the card shipping without the cover it was supposed to
  // have — a defect that only shows up on someone else's timeline.
  if (!mime) {
    throw new Error(
      `Cover image "${path}" has unsupported extension "${extension}". Supported: ${Object.keys(
        COVER_MIME_TYPES
      ).join(', ')}.`
    );
  }
  return `data:${mime};base64,${readFileSync(path).toString('base64')}`;
}

export function renderCard(content: CardContent): string {
  const palette = PALETTES[content.theme];
  const cover = content.cover;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${FONT_URL}">
<style>
  * { box-sizing: border-box; margin: 0; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    padding: 60px 72px;
    display: grid;
    /* minmax(0, ...) drops the min-content floor a bare 1fr carries. Without
       it an oversized title grows its own row and shoves the footer off the
       card, and fitTitle() has no honest budget to measure against. */
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    gap: 28px;
    position: relative;
    overflow: hidden;
    background: ${palette.base};
    color: #fff;
    font-family: '${CARD_FONT_FAMILY}', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Keeps a card without a cover from reading as a flat rectangle. */
  .glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(900px 520px at 100% 0%, ${palette.accent}42, transparent 62%),
      radial-gradient(760px 480px at 0% 100%, ${palette.accentEnd}33, transparent 60%);
  }

  .cover { position: absolute; inset: 0; }
  .cover img { width: 100%; height: 100%; object-fit: cover; }
  /* Two scrims, because one cannot do both jobs. The linear pass thins toward
     the right so the image still reads as an image; the flat pass underneath
     guarantees a contrast floor no matter how bright the photo is, since the
     title and description both run nearly the full width of the card. */
  .cover::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        100deg,
        ${palette.base}f2 0%,
        ${palette.base}e0 44%,
        ${palette.base}a8 76%,
        ${palette.base}8a 100%
      ),
      ${palette.base}73;
  }

  header, .rule, main, footer { position: relative; }

  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    font-size: 26px;
    font-weight: 500;
  }
  .wordmark { letter-spacing: -0.01em; }
  .wordmark b { font-weight: 900; }
  .eyebrow {
    font-size: 22px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${palette.accent};
  }

  .rule {
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(
      90deg,
      ${palette.accent} 0%,
      ${palette.accentEnd} 42%,
      transparent 100%
    );
  }

  main {
    display: grid;
    align-content: center;
    gap: 26px;
    overflow: hidden;
  }

  h1 {
    font-weight: 900;
    line-height: 1.08;
    letter-spacing: -0.02em;
    /* Sized by fitTitle() in index.ts; clamping is the backstop for a title so
       long that even the minimum size overflows. */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }

  p {
    font-size: 28px;
    line-height: 1.45;
    color: #ffffffbf;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  footer {
    font-size: 22px;
    letter-spacing: 0.06em;
    color: #ffffffa8;
  }
</style>
</head>
<body>
  ${
    cover
      ? `<div class="cover"><img src="${cover}" alt=""></div>`
      : '<div class="glow"></div>'
  }
  <header>
    <span class="wordmark">craigory<b>.dev</b></span>
    <span class="eyebrow">${escapeHtml(content.eyebrow)}</span>
  </header>
  <div class="rule"></div>
  <main>
    <h1>${escapeHtml(content.title)}</h1>
    ${content.body ? `<p>${escapeHtml(content.body)}</p>` : ''}
  </main>
  <footer>${content.meta ? escapeHtml(content.meta) : ''}</footer>
</body>
</html>`;
}
