import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { defineConfig, type Plugin } from 'vite';

// vike's server runtime imports `@brillout/vite-plugin-server-entry`'s
// `autoImporter.js`: ONE file inside node_modules that every vike app in this
// repo rewrites while it builds, ending with an `import()` of that app's own
// `dist/server/entry.mjs`. The prerendered apps keep vike external, so they
// never look inside it — but the Cloudflare plugin bundles vike into the
// Worker, so rollup parses whatever some *other* app's parallel `nx run-many`
// build last wrote there and fails on a path that doesn't exist. justlisten
// doesn't need the file (the entry is bundled via `vike:server-entry`), so
// bundle its pristine "unset" form instead of the shared mailbox.
function stubServerEntryAutoImporter(): Plugin {
  const stubId = '\0justlisten:server-entry-auto-importer';
  let stubbed = false;
  return {
    name: 'justlisten:stub-server-entry-auto-importer',
    enforce: 'pre',
    resolveId(source, importer) {
      if (
        source.endsWith('/autoImporter.js') &&
        importer?.includes('/@brillout/vite-plugin-server-entry/')
      ) {
        stubbed = true;
        return stubId;
      }
    },
    load(id) {
      if (id === stubId) return "export const status = 'UNSET';";
    },
    // The match above is against a private path, so a plugin upgrade could
    // rename it out from under us. Fail here rather than silently going back
    // to bundling the shared file (which only breaks when a sibling build
    // happens to be mid-flight).
    buildEnd(error) {
      if (error || this.environment.name !== 'ssr' || stubbed) return;
      throw new Error(
        'stubServerEntryAutoImporter: the SSR build never imported ' +
          "@brillout/vite-plugin-server-entry's autoImporter.js — the path " +
          'it matches has probably changed; update the plugin or drop it.'
      );
    },
  };
}

export default defineConfig({
  plugins: [
    // Per vike.dev/cloudflare, `cloudflare()` must come BEFORE `vike()`: it
    // hosts SSR inside workerd in dev too, which is what makes `c.env` (the KV
    // bindings the page data hooks read) the same object in dev and prod.
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    react(),
    tailwindcss(),
    vike(),
    stubServerEntryAutoImporter(),
  ],
  // Stop writing the shared file too (see stubServerEntryAutoImporter above),
  // so justlisten can't be the app that breaks a sibling's parallel build.
  vitePluginServerEntry: { disableAutoImport: true },
  environments: {
    ssr: {
      optimizeDeps: {
        // Hono and its Vike adapter are ESM-native, so pre-bundling buys
        // nothing — and letting the SSR optimizer re-bundle them mid-startup
        // kills the workerd runner ("there is a new version of the pre-bundle
        // for hono.js"), which takes `vike dev` down with it on every boot.
        exclude: ['hono', '@vikejs/hono'],
      },
    },
  },
});
