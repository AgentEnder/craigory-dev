import type { Plugin } from 'vite';
import { loadUnicodeData } from './pages/unicode-loader.server';
import { toGridEntry } from './src/unicode-data';

/**
 * Emits one slim JSON file per (version, category) slice for the change-history pages,
 * so a leaf grid — e.g. the 11k+ Seal characters added in Unicode 18.0 — is loaded
 * lazily on its own page and never inflates the prerendered HTML or another route.
 *
 * - Dev:   serves /generated/versions/{version}/{categoryId}.json via middleware
 * - Build: emits the files as static assets in dist/client/generated/versions/
 */
export function versionDataPlugin(): Plugin {
  const { byVersion } = loadUnicodeData();
  const jsonMap = new Map<string, string>(); // "version/categoryId" → JSON
  for (const [version, entries] of byVersion) {
    const byCat = new Map<string, ReturnType<typeof toGridEntry>[]>();
    for (const entry of entries) {
      const arr = byCat.get(entry.categoryId) ?? [];
      arr.push(toGridEntry(entry));
      byCat.set(entry.categoryId, arr);
    }
    for (const [categoryId, grid] of byCat) {
      jsonMap.set(`${version}/${categoryId}`, JSON.stringify(grid));
    }
  }

  return {
    name: 'version-data',

    configureServer(server) {
      const base = server.config.base.replace(/\/$/, '');
      server.middlewares.use((req, res, next) => {
        const prefix = `${base}/generated/versions/`;
        if (!req.url?.startsWith(prefix)) return next();
        const key = req.url.slice(prefix.length).replace(/\.json$/, '');
        const json = jsonMap.get(key);
        if (!json) return next();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(json);
      });
    },

    generateBundle() {
      for (const [key, json] of jsonMap) {
        this.emitFile({
          type: 'asset',
          fileName: `generated/versions/${key}.json`,
          source: json,
        });
      }
    },
  };
}
