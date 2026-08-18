export type BlogTag =
  | 'technical'
  | 'non-technical'
  | 'tiki'
  | 'review'
  | 'nx'
  | 'git'
  | 'github'
  | 'devops'
  | 'react'
  | 'typescript'
  | 'javascript'
  | 'tooling'
  | 'tutorial'
  | 'personal';

/**
 * An image a post carries with it, colocated beside `contents.mdx` and pulled in
 * with a plain `import cover from './cover.png'`.
 *
 * The imported value's SHAPE depends on who resolved the import, and the two
 * consumers happen to each want their own:
 *
 * - **Under vite** (the site) it is the hashed, site-relative URL of the emitted
 *   asset — `/assets/cover-a1b2c3.png`. That is exactly what an `<img src>` and
 *   an absolute `og:image` need.
 * - **Under bun** (`tools/open-graph`) `.png`/`.jpg`/`.webp`
 *   fall to bun's default `file` loader, which returns the asset's absolute path
 *   on disk. That is exactly what the generator needs to inline the image into
 *   the page it screenshots.
 *
 * Neither side ever sees the other's shape, so neither has to discriminate. This
 * is the same trick `tools/site-corpus` relies on for `.mdx`, except that `.png`
 * needs no `bunfig.toml` entry — `file` is already bun's default for it.
 */
export interface PostImage {
  src: string;
  /**
   * Required, not optional: the cover renders as a real `<img>` in the post
   * header and in the blog listing, so there is always a reader who needs it.
   */
  alt: string;
}

export interface BlogPost {
  publishDate: Date;
  mdx: typeof import('*.mdx').default;
  slug: string;
  title: string;
  description: string;
  tags: BlogTag[];
  readingTimeMinutes?: number;
  /**
   * Hero image for the post — shown above the title on the post page, as the
   * thumbnail in the blog listing, and behind the text of the generated social
   * card. Omit it and the card falls back to its themed gradient.
   */
  cover?: PostImage;
  /**
   * A ready-made social card, used verbatim as `og:image`. Setting this opts the
   * post out of card generation entirely, so it is the escape hatch for a post
   * whose preview is hand-designed rather than templated.
   */
  ogImage?: PostImage;
}
