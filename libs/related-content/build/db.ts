import { Database } from 'bun:sqlite';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import * as sqliteVec from 'sqlite-vec';

/** bge-small-en-v1.5. The vec0 tables and the embedder must agree on this. */
export const EMBED_DIM = 384;

/**
 * Derived cache, not source. It lives under node_modules so it is gitignored by
 * construction and disappears with a clean install — everything in it can be
 * rebuilt from the content.
 */
export const CACHE_DIR = (workspaceRoot: string) =>
  join(workspaceRoot, 'node_modules', '.cache', 'related-content');

/**
 * Bun links Apple's system SQLite on macOS, which is built with
 * SQLITE_OMIT_LOAD_EXTENSION — `loadExtension` throws and sqlite-vec cannot
 * load. Homebrew's build is extension-capable. Returns null off macOS (and on a
 * Mac without Homebrew), where the bundled SQLite handles extensions fine.
 */
function findExtensionCapableSqlite(): string | null {
  if (process.platform !== 'darwin') return null;

  const candidates: string[] = [];
  try {
    const prefix = execFileSync('brew', ['--prefix', 'sqlite'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (prefix) candidates.push(join(prefix, 'lib', 'libsqlite3.dylib'));
  } catch {
    /* brew absent or not on PATH */
  }
  candidates.push('/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib'); // apple silicon
  candidates.push('/usr/local/opt/sqlite/lib/libsqlite3.dylib'); // intel
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export const EXTENSION_UNAVAILABLE =
  'Related content needs an extension-capable SQLite so sqlite-vec can load.\n' +
  "  On macOS, Bun links Apple's SQLite, which blocks extensions.\n" +
  '  fix: `brew install sqlite`, then re-run.';

export interface EmbeddingsDb {
  sqlite: Database;
  close: () => void;
}

export function openDb(workspaceRoot: string): EmbeddingsDb {
  const dir = CACHE_DIR(workspaceRoot);
  mkdirSync(dir, { recursive: true });

  // Process-global and must precede the first `new Database()`.
  const customSqlite = findExtensionCapableSqlite();
  if (customSqlite) {
    try {
      Database.setCustomSQLite(customSqlite);
    } catch {
      /* already set, or this Bun build ignores it — loadExtension decides */
    }
  }

  const sqlite = new Database(join(dir, 'embeddings.db'));
  sqlite.run('PRAGMA journal_mode = WAL;');
  sqlite.run('PRAGMA synchronous = NORMAL;');

  try {
    sqlite.loadExtension(sqliteVec.getLoadablePath());
  } catch (error) {
    sqlite.close();
    throw new Error(`${EXTENSION_UNAVAILABLE}\n  (${String(error)})`);
  }

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS items (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      key           TEXT NOT NULL UNIQUE,
      type          TEXT NOT NULL,
      slug          TEXT NOT NULL,
      title         TEXT NOT NULL,
      description   TEXT NOT NULL,
      url           TEXT NOT NULL,
      content_hash  TEXT NOT NULL
    );
  `);
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS chunks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id     INTEGER NOT NULL,
      chunk_index INTEGER NOT NULL,
      text        TEXT NOT NULL
    );
  `);
  sqlite.run('CREATE INDEX IF NOT EXISTS chunks_item_idx ON chunks(item_id);');
  // Two vector tables on purpose: chunk vectors are what the model produces,
  // item vectors are their mean. Similarity between whole items is the question
  // this feature asks, and answering it from chunk KNN would rank a post highly
  // because one paragraph matched.
  sqlite.run(
    `CREATE VIRTUAL TABLE IF NOT EXISTS vec_chunks USING vec0(embedding float[${EMBED_DIM}]);`
  );
  sqlite.run(
    `CREATE VIRTUAL TABLE IF NOT EXISTS vec_items USING vec0(embedding float[${EMBED_DIM}]);`
  );

  return { sqlite, close: () => sqlite.close() };
}

/** vec0 stores vectors as raw float32 blobs. */
export const asBlob = (vector: Float32Array) =>
  new Uint8Array(vector.buffer, vector.byteOffset, vector.byteLength);

/** Copy out of the blob — a Float32Array view needs 4-byte alignment the driver does not promise. */
export const fromBlob = (blob: Uint8Array) =>
  new Float32Array(
    blob.buffer.slice(blob.byteOffset, blob.byteOffset + blob.byteLength)
  );
