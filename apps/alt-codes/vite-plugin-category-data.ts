import type { Plugin } from 'vite';
import { loadUnicodeData } from './pages/unicode-loader.server';
import { toGridEntry } from './src/unicode-data';

/**
 * Vite plugin that generates per-category JSON files for lazy loading on the home page.
 * Emits slim GridEntry objects (no emoji metadata or decimal) to reduce transfer size.
 *
 * - Dev: serves /generated/{categoryId}.json via middleware
 * - Build: emits the files as static assets in dist/client/generated/
 */
export function categoryDataPlugin(): Plugin {
  const { byCategory } = loadUnicodeData();
  const jsonMap = new Map<string, string>();
  for (const [categoryId, entries] of byCategory) {
    jsonMap.set(categoryId, JSON.stringify(entries.map(toGridEntry)));
  }

  return {
    name: 'category-data',

    configureServer(server) {
      const base = server.config.base.replace(/\/$/, '');
      server.middlewares.use((req, res, next) => {
        const prefix = `${base}/generated/`;
        if (!req.url?.startsWith(prefix)) return next();
        const categoryId = req.url.slice(prefix.length).replace(/\.json$/, '');
        const json = jsonMap.get(categoryId);
        if (!json) return next();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(json);
      });
    },

    generateBundle() {
      for (const [categoryId, json] of jsonMap) {
        this.emitFile({
          type: 'asset',
          fileName: `generated/${categoryId}.json`,
          source: json,
        });
      }
    },
  };
}
