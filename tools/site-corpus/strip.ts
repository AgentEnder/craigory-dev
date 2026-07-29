/**
 * Text extraction for the build-time content pipeline.
 *
 * Both consumers want the same thing — the prose a human would read — from two
 * source formats that are anything but plain prose: remark.js slide decks and
 * MDX with embedded React components.
 */

/** Property lines remark treats as slide configuration rather than content. */
const SLIDE_PROPERTY =
  /^(name|class|layout|template|count|exclude|background-image|background-size|background-position|background-color|background-repeat):/i;

export interface StripSlidesOptions {
  /**
   * Speaker notes (everything after `???` on a slide) never render for a
   * visitor. Search must not surface them — a result whose excerpt quotes text
   * that appears nowhere on the page is a bug. Similarity scoring is the
   * opposite case: notes describe what the talk is actually about and are never
   * displayed, so they are pure signal.
   */
  includeSpeakerNotes?: boolean;
}

/**
 * Reduce a remark.js deck to its prose.
 *
 * These decks are never server-rendered — `ViewPresentation` fetches the raw
 * markdown and lets remark build the slides in the browser — so this is the only
 * way slide content reaches either the search index or the embedding corpus.
 */
export function stripRemarkSlides(
  markdown: string,
  options: StripSlidesOptions = {}
): string {
  const slides = markdown.split(/^---$/m);
  const cleaned: string[] = [];

  for (const slide of slides) {
    const [visible, ...notes] = slide.split(/^\?\?\?$/m);
    const body = options.includeSpeakerNotes
      ? [visible, ...notes].join('\n\n')
      : visible;

    const kept: string[] = [];
    // Slide properties form a leading block that may be broken up by blank
    // lines (`layout: true`, blank, `name: base`, ...), so a blank line alone
    // does not end it — the first line of real content does.
    let inProperties = true;
    for (const line of body.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) {
        kept.push('');
        continue;
      }
      if (inProperties && SLIDE_PROPERTY.test(trimmed)) continue;
      inProperties = false;
      if (trimmed === '--') continue; // incremental-reveal separator
      kept.push(line);
    }
    cleaned.push(kept.join('\n'));
  }

  return stripMarkdown(cleaned.join('\n\n'));
}

/** Reduce an MDX post to its prose, dropping imports and component syntax. */
export function stripMdx(mdx: string): string {
  const withoutModuleSyntax = mdx
    .replace(/^import\s[\s\S]*?(?:;|\n)(?=\n|$)/gm, '')
    .replace(/^export\s+(?:default\s+)?[\s\S]*?(?:;|\n)(?=\n|$)/gm, '');
  return stripMarkdown(withoutModuleSyntax);
}

/**
 * Shared markdown/JSX flattening. Keeps fenced-code contents on purpose: a
 * reader searching for `git config --global alias` expects to find the post
 * that contains that line.
 */
function stripMarkdown(source: string): string {
  return (
    source
      // MDX comments, including the `{/* vale ... */}` directives sprinkled
      // through the posts to steer prose linting.
      .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      // Fenced code: drop the fence lines, keep the code.
      .replace(/^```.*$/gm, '')
      // remark content macros: `.footnote[text]`, `.red[text]` -> `text`.
      .replace(/\.[a-zA-Z][\w-]*\[/g, '')
      // Images before links, so alt text survives rather than the URL.
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // HTML/JSX tags. Inner text is kept; the tags themselves are noise.
      .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
      // Leftover JSX expression containers, e.g. `<TikiTable data={...} />`
      // attributes that survived the tag strip.
      .replace(/\{[^{}]*\}/g, ' ')
      // Markdown emphasis/heading/quote markers.
      .replace(/^\s{0,3}#{1,6}\s+/gm, '')
      .replace(/^\s{0,3}>\s?/gm, '')
      .replace(/[*_~`]/g, '')
      // Collapse the whitespace all of the above leaves behind, but keep
      // paragraph breaks — the chunker splits on them.
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .trim()
  );
}
