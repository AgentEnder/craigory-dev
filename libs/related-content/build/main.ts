/**
 * Build-time related-content pass.
 *
 * Runs BEFORE `vike build` — the result is baked into prerendered HTML, and
 * there is no server at runtime to compute it. Reads the site's prose, embeds
 * what changed, and writes `src/generated/related.json`.
 *
 * Hash-gated: an unchanged corpus re-embeds nothing, so the expensive part only
 * runs when content actually moves.
 */

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Reached by relative path, and `@nx/enforce-module-boundaries` is disabled for
// this directory in .eslintrc.json. Everything under `build/` is a standalone
// bun script rather than part of the shipped library or the app's module graph:
// it is never bundled, so an import here cannot pull another project into a
// build. The corpus lives in tools/ because the Pagefind step reads it too.
import {
  collectBlogPosts,
  collectPresentations,
  collectProjects,
  type CorpusItem,
} from '../../../tools/site-corpus';
import type { RelatedItem, RelatedMap } from '../src/lib/types';
import { asBlob, CACHE_DIR, openDb } from './db';
import { chunkText, embedPassages, l2ToCosine, meanVector } from './embed';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACE_ROOT = join(PROJECT_ROOT, '..', '..');
const OUTPUT = join(PROJECT_ROOT, 'src', 'generated', 'related.json');

/** Top-N neighbours kept per item. */
const MAX_RELATED = 4;
/**
 * Cosine floor. bge-small puts genuinely unrelated technical prose around
 * 0.5-0.6, so this sits above the "everything is vaguely about software" band.
 * Items with no neighbour above it render no Related section at all, which is
 * the intended outcome — four bad links are worse than none.
 */
const MIN_SIMILARITY = 0.7;

/**
 * Cosine ceiling, to drop near-identical items.
 *
 * The same talk given at two conferences is two items with two slugs and
 * near-identical slides — `that-conf-wi-2024-spaghetti` scores 0.999 against
 * `that-conf-tx-2024-compartmentalization`. Suggesting a talk as "related" to
 * itself is noise; the presentations index is where every delivery is listed.
 */
const MAX_SIMILARITY = 0.97;

const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

interface StoredItem {
  id: number;
  key: string;
  content_hash: string;
}

async function main() {
  const corpus: CorpusItem[] = [
    ...collectBlogPosts(),
    // Speaker notes describe what a talk is actually about and never render,
    // so they are pure signal for similarity (unlike for search, where quoting
    // them in an excerpt would be a bug).
    ...collectPresentations({ includeSpeakerNotes: true }),
    // Async because it goes through the site's own project loader, which
    // fetches on a cold cache and reads tmp/*.json on a warm one.
    ...(await collectProjects()),
  ];

  const cacheDir = CACHE_DIR(WORKSPACE_ROOT);
  const { sqlite, close } = openDb(WORKSPACE_ROOT);

  try {
    const stored = new Map(
      sqlite
        .prepare<StoredItem>('SELECT id, key, content_hash FROM items')
        .all()
        .map((row) => [row.key, row])
    );

    // Prune items that no longer exist, so a deleted post stops being suggested.
    const live = new Set(corpus.map((item) => item.id));
    let pruned = 0;
    for (const [key, row] of stored) {
      if (live.has(key)) continue;
      deleteItem(sqlite, row.id);
      stored.delete(key);
      pruned++;
    }

    let embedded = 0;
    let skipped = 0;

    for (const item of corpus) {
      const hash = sha256(
        JSON.stringify([item.title, item.description, item.content])
      );
      const existing = stored.get(item.id);

      if (existing?.content_hash === hash) {
        // Content is unchanged; url/title may still have moved, and updating
        // them is far cheaper than re-embedding.
        sqlite
          .prepare(
            'UPDATE items SET title = ?, description = ?, url = ? WHERE id = ?'
          )
          .run(item.title, item.description, item.url, existing.id);
        skipped++;
        continue;
      }

      if (existing) deleteItem(sqlite, existing.id);

      const pieces = chunkText(item.content);
      if (!pieces.length) continue;

      const vectors = await embedPassages(pieces, cacheDir);

      sqlite
        .prepare(
          `INSERT INTO items (key, type, slug, title, description, url, content_hash)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          item.id,
          item.type,
          item.slug,
          item.title,
          item.description,
          item.url,
          hash
        );
      const itemId = (
        sqlite
          .prepare<{ id: number }>('SELECT id FROM items WHERE key = ?')
          .get(item.id) as { id: number }
      ).id;

      const insertChunk = sqlite.prepare(
        'INSERT INTO chunks (item_id, chunk_index, text) VALUES (?, ?, ?)'
      );
      const insertChunkVector = sqlite.prepare(
        'INSERT INTO vec_chunks(rowid, embedding) VALUES (?, ?)'
      );
      for (let i = 0; i < pieces.length; i++) {
        insertChunk.run(itemId, i, pieces[i]);
        const chunkId = (
          sqlite
            .prepare<{ id: number }>(
              'SELECT id FROM chunks WHERE item_id = ? AND chunk_index = ?'
            )
            .get(itemId, i) as { id: number }
        ).id;
        insertChunkVector.run(chunkId, asBlob(vectors[i]));
      }

      sqlite
        .prepare('INSERT INTO vec_items(rowid, embedding) VALUES (?, ?)')
        .run(itemId, asBlob(meanVector(vectors)));

      embedded++;
      console.log(
        `[related] embedded ${item.id} (${pieces.length} chunk${
          pieces.length === 1 ? '' : 's'
        })`
      );
    }

    const related = buildRelatedMap(sqlite);

    mkdirSync(dirname(OUTPUT), { recursive: true });
    writeFileSync(OUTPUT, `${JSON.stringify(related, null, 2)}\n`);

    const withNeighbours = Object.keys(related).length;
    console.log(
      `[related] ${corpus.length} items (${embedded} embedded, ${skipped} unchanged, ${pruned} pruned) -> ` +
        `${withNeighbours} with neighbours -> ${relative(
          WORKSPACE_ROOT,
          OUTPUT
        )}`
    );
  } finally {
    close();
  }
}

function deleteItem(sqlite: ReturnType<typeof openDb>['sqlite'], id: number) {
  const chunkIds = sqlite
    .prepare<{ id: number }>('SELECT id FROM chunks WHERE item_id = ?')
    .all(id);
  const deleteChunkVector = sqlite.prepare(
    'DELETE FROM vec_chunks WHERE rowid = ?'
  );
  for (const chunk of chunkIds) deleteChunkVector.run(chunk.id);
  sqlite.prepare('DELETE FROM chunks WHERE item_id = ?').run(id);
  sqlite.prepare('DELETE FROM vec_items WHERE rowid = ?').run(id);
  sqlite.prepare('DELETE FROM items WHERE id = ?').run(id);
}

const normalizeTitle = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();

interface NeighbourRow {
  key: string;
  type: RelatedItem['type'];
  slug: string;
  title: string;
  description: string;
  url: string;
  distance: number;
}

function buildRelatedMap(
  sqlite: ReturnType<typeof openDb>['sqlite']
): RelatedMap {
  const items = sqlite
    .prepare<{ id: number; key: string }>('SELECT id, key FROM items')
    .all();

  const related: RelatedMap = {};

  for (const item of items) {
    const vector = sqlite
      .prepare<{ embedding: Uint8Array }>(
        'SELECT embedding FROM vec_items WHERE rowid = ?'
      )
      .get(item.id);
    if (!vector) continue;

    // KNN must live directly on the vec0 table (MATCH + LIMIT); the join back to
    // `items` happens after, via a CTE. Over-fetched because the self-match, the
    // ceiling and title dedup all remove rows before the top-N is taken.
    const neighbours = sqlite
      .prepare<NeighbourRow>(
        `WITH knn AS (
           SELECT rowid, distance FROM vec_items
            WHERE embedding MATCH ? ORDER BY distance LIMIT ?
         )
         SELECT i.key, i.type, i.slug, i.title, i.description, i.url, knn.distance
           FROM knn JOIN items i ON i.id = knn.rowid
          WHERE i.id != ?
          ORDER BY knn.distance`
      )
      .all(vector.embedding, MAX_RELATED * 3 + 1, item.id);

    const seenTitles = new Set<string>();
    const picked = neighbours
      .map((row) => ({
        type: row.type,
        slug: row.slug,
        title: row.title,
        description: row.description,
        url: row.url,
        score: Number(l2ToCosine(row.distance).toFixed(4)),
      }))
      .filter(
        (row) => row.score >= MIN_SIMILARITY && row.score <= MAX_SIMILARITY
      )
      // A re-delivered talk can fall under the ceiling when only one of the two
      // has slides on file, so titles are deduped as well. Neighbours arrive
      // sorted by distance, so the first of a title is the closest.
      .filter((row) => {
        const key = normalizeTitle(row.title);
        if (seenTitles.has(key)) return false;
        seenTitles.add(key);
        return true;
      })
      .slice(0, MAX_RELATED);

    if (picked.length) related[item.key] = picked;
  }

  // Stable key order keeps the generated file diffable when it is inspected.
  return Object.fromEntries(
    Object.entries(related).sort(([a], [b]) => a.localeCompare(b))
  );
}

main().catch((error) => {
  console.error('[related] failed:', error);
  process.exit(1);
});
