# blog-posts

This library was generated with [Nx](https://nx.dev).

## Prose linting

Post prose is linted with [Vale](https://vale.sh). Vale is pinned in the
workspace `mise.toml`, so a fresh clone needs:

```sh
mise trust && mise install
```

Run it through Nx:

```sh
nx run blog-posts:lint:vale   # errors only, same as CI
nx run blog-posts:lint        # eslint + vale
```

Or directly, to see the advisory alerts CI does not gate on:

```sh
cd libs/blog-posts && mise exec -- vale src/lib/posts
```

### What blocks and what doesn't

CI runs with `--minAlertLevel=error`, so **only `error`-level alerts fail the
build**: misspellings, wrong brand casing, and the AI-phrase blocklist. Softer
opinions (weasel words, "there is" openings, over-promising ease) are
`suggestion`-level — they show up locally and are ignored by the gate.

Rules that flagged correct writing were switched off, each with its reasoning in
`.vale.ini`. Read those comments before re-enabling anything.

`write-good.Passive` and `write-good.TooWordy` are deliberately left **on** as
suggestions for technical posts (and off for tiki). They are noisy — on the
current posts roughly 0% of Passive hits and 10% of TooWordy hits were worth
acting on — but they are visible so they can be triaged rather than hidden.

### Silencing one instance

Vale's documented syntax is the HTML comment `<!-- vale ... -->`, which **MDX
refuses to parse** and would break the site build. `.vale.ini` therefore sets
`CommentDelimiters = {/*, */}` so MDX's own comment form works instead:

```mdx
{/* vale write-good.Passive = NO */}

Prose that Vale should leave alone.

{/* vale write-good.Passive = YES */}
```

Use this for a phrase you have deliberately chosen and will not change — an
intentional hedge, a proper noun, a term of art. A suggestion you will never act
on should be silenced rather than endured, or you learn to ignore the linter.
If you find yourself doing this more than a handful of times for one rule, that
is a sign the rule doesn't fit; change it in `.vale.ini` instead.

### Two voices

`.vale.ini` defines a strict baseline for technical posts, then relaxes it for
`src/lib/posts/tiki/**`. Tiki posts are first-person narrative reviews, so the
rules that police hedging, praise, passive voice, and subjective description are
switched off there. Neither voice bans first person.

### Adding words

Domain terms, drink names, and proper nouns go in
`.vale/styles/config/vocabularies/Blog/accept.txt`. Entries accept regex, so
`[Tt]iki` covers both casings.

### Styles are vendored

`.vale/styles/{proselint,write-good,alex}` are committed rather than fetched by
`vale sync`, so CI needs no network for them and builds stay reproducible.
Refresh them deliberately with `mise exec -- vale sync` from this directory.
`.vale/styles/CraigoryBlog` is hand-written and is not touched by `sync`.
