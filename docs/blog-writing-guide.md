# Blog Format and Writing Style Guide

This guide documents the format and writing style conventions used for blog
posts in this repository. It is based on the existing posts in
`libs/blog-posts/src/lib/posts/`.

The prose rules in the "Writing Style" sections below are enforced by Vale — see
[Prose linting](#prose-linting) at the end.

## Directory Structure

Each post lives in its own directory, named for the post's topic:

```
libs/blog-posts/src/lib/posts/[post-slug]/
```

Tiki bar reviews are grouped in a subdirectory, which is also what the linter
uses to pick the relaxed review voice:

```
libs/blog-posts/src/lib/posts/tiki/[bar-slug]/
```

## Required Files

### 1. `contents.mdx` (the post body)

The prose. Starts with a single `#` heading, and uses `##`/`###` for structure.
May declare JSX fragments at the top for citations (see below).

### 2. `post.ts` (metadata)

```ts
import { BlogPost, BlogTag } from '../../blog-post';
import mdx from './contents.mdx';

export const myPost: BlogPost = {
  mdx,
  publishDate: new Date(2026, 6, 27), // NOTE: month is 0-indexed
  slug: 'my-post',
  title: 'My Post',
  description: `One or two sentences, shown on the blog index and in previews.`,
  tags: ['technical', 'tooling'] as BlogTag[],
};
```

Available tags are the `BlogTag` union in `libs/blog-posts/src/lib/blog-post.ts`:
`technical`, `non-technical`, `tiki`, `review`, `nx`, `git`, `github`, `devops`,
`react`, `typescript`, `javascript`, `tooling`, `tutorial`, `personal`.

Technical posts lead with `technical`; tiki reviews use
`['non-technical', 'tiki', 'review']`.

### Optional: cover and social images

A post may ship images alongside `contents.mdx`. Import them; vite emits the
asset and hands back its URL.

```ts
import mdx from './contents.mdx';
import cover from './cover.png';

export const myPost: BlogPost = {
  // ...
  cover: { src: cover, alt: 'What the image shows' },
};
```

- **`cover`** is the post's hero. It renders above the title on the post page,
  as the thumbnail in the blog index, and behind the text of the generated
  social card. `alt` is required — it is a real `<img>` with real readers.
  Crop for **1.91:1**; both the page and the index frame it at that ratio.
- **`ogImage`** replaces the generated social card outright, for a post whose
  preview is hand-designed. Setting it opts the post out of card generation.
  Size it **1200x630**.

Supply neither and the post still gets a card: `tools/open-graph` renders the
title, description, date, and tags over a gradient themed by the post's primary
tag. There is nothing to do to opt in.

### 3. Register it in `posts/index.ts`

Import the post and add it to `ALL_BLOG_POSTS`. Order there does not matter —
the list is sorted by `publishDate` descending at export time.

**A future `publishDate` acts as a draft flag**: `index.ts` filters out posts
dated in the future unless running in dev, so an unfinished post can live on
`main` without appearing on the live site.

## Components

Available to any `contents.mdx` without an import.

### Citations

Footnote-style citations. Declare the reference as a top-level JSX fragment,
then cite it inline at the end of the sentence it supports:

```mdx
export const npmDocs = (
  <>
    npm CLI documentation,{' '}
    <a href="https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age">
      <code>min-release-age</code>
    </a>
    .
  </>
);

The setting is read from the project's `.npmrc`.<Cite n={1} href="https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age">{npmDocs}</Cite>
```

Number `n` sequentially through the post. Attach the `<Cite>` directly to the
end of the claim, with no space before it.

### Tabs

For showing the same idea across several tools. Tabs sharing a `groupId` stay in
sync, so a reader who picks "pnpm" keeps seeing pnpm for the rest of the post:

```mdx
<Tabs groupId="package-manager">
<Tab label="npm">

Content for npm, including code fences.

</Tab>
</Tabs>
```

Leave a blank line after `<Tab label="...">` and before `</Tab>` so the contents
parse as Markdown.

### Cross-links

Link to another post by slug rather than by URL:

```mdx
<LinkToPost ref={props.post} slug="superpowered-git-aliases" />
```

### Tiki rating table

`<TikiTable />` renders the comparison table of every tiki bar reviewed. It
takes no props and belongs at the end of a review.

## Structure Conventions

### Technical posts

1. `#` title
2. A short framing paragraph — the problem, or the misconception being corrected
3. `## Table of Contents` for longer posts
4. Body sections, working from concept to implementation
5. `### Case Study: ...` for worked examples
6. `## Some Caveats` — where the approach breaks down
7. `## Conclusion`

### Tiki reviews

Reviews follow a fixed skeleton so they stay comparable:

```markdown
# [Bar Name]

## Quick Review

One paragraph: the verdict, and whether you'd return.

## The Longer Version

### Key Info:

- Location:
- Date Visited:
- Visited with:

### Our Visit:

### The Drinks

### The Food (optional)

### Decor + Theming Elements

## Tiki Rating Table

<TikiTable />
```

## Writing Style Characteristics

### Tone

- **First person, and comfortable with it**: "I personally sampled", "we walked
  over after KCDC wrapped up". Do not write around yourself.
- **Honest about limitations**: say when something was disappointing, when an
  approach has caveats, or when you did not test something.
- **Specific over sweeping**: name versions, prices, dates, and tools.

### Structure Patterns

1. **Problem → Approach → Caveats** for technical posts
2. **Verdict first, detail after** for reviews — the Quick Review should stand
   alone
3. **Show the real artifact**: actual scripts, configs, and commands rather than
   descriptions of them

### Language Choices

- **Lead with the reader's action**: "Run …" or "You can …" rather than "This
  allows you to …"
- **Don't promise ease.** Avoid "simply", "easily", "obviously", "trivial",
  "straightforward". If it were simple, it would not need a post. Prefer
  concrete alternatives: "a short script", "a small config", "as small as this".
- **Don't write about the post inside the post.** Skip "In this post we'll
  explore" and "This guide will show you". Start with the content.
- **No marketing register**: no "seamless", "effortless", "supercharge",
  "leverage", "utilize".
- **No AI tells**: "It's worth noting that", "Let's dive into", "In conclusion",
  "delve into", "It's not just X, it's Y".
- **Brand names as their owners write them**: GitHub, JavaScript, TypeScript,
  Node.js, npm, pnpm, macOS, VS Code. Lowercase CLI names stay lowercase in
  command context (`nx build`, `yarn add`).

### Technical Content

- **Cite claims about other tools.** Anything asserting how npm, pnpm, Yarn, or
  Bun behaves gets a `<Cite>` to that tool's documentation or issue tracker.
- **Version-qualify behaviour**: "since pnpm 11.0", "Yarn Berry 4.10.0".
- **Include the failure modes**: known bugs, silent-ignore conditions, and
  platform differences are usually the most valuable part of the post.

### Review Content

Reviews are held to a looser standard on purpose. Praise, hedging, subjective
description, and conversational asides are the format — "the vibrant space was
inviting", "perhaps not themed as well as some other tiki bars". The linter is
configured to leave these alone. Accuracy still matters: prices, dates, and
who you were with should be right.

## Prose linting

`nx run blog-posts:lint:vale` checks every post. Full setup, rule rationale, and
how to add vocabulary: `libs/blog-posts/README.md`.

Only `error`-level alerts fail CI — misspellings, wrong brand casing, and the
AI-phrase blocklist. Style opinions surface locally as suggestions and do not
block. Run `cd libs/blog-posts && mise exec -- vale src/lib/posts` to see
everything.

To keep a phrase Vale objects to, wrap it in an MDX comment rather than
rewriting it:

```mdx
{/* vale proselint.Skunked = NO */}

...and hopefully makes Nx easier to adopt and learn.

{/* vale proselint.Skunked = YES */}
```

(Vale's usual `<!-- vale ... -->` syntax does not work here — MDX cannot parse
HTML comments. `.vale.ini` remaps the delimiters to `{/*` and `*/}`.)

Two voices are configured: a strict baseline for technical posts, relaxed for
anything under `posts/tiki/`. Neither bans first person.

## Best Practices

1. **One post, one directory** — keep `contents.mdx` and `post.ts` together
2. **Write the description deliberately** — it is the blog index copy, and Vale
   does not lint it
3. **Date-gate drafts** rather than keeping them on a branch
4. **Cite external behaviour** instead of asserting it from memory
5. **Keep reviews to the skeleton** so the rating table stays meaningful
6. **Run the linter before publishing** — `nx run blog-posts:lint`
