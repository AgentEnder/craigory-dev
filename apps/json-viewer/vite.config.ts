import { defineConfig, type Plugin } from 'vite';
import vike from 'vike/plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, cpSync, mkdirSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * Serves jq.wasm from node_modules during dev and copies it to the
 * build output. jq-web's Emscripten runtime looks for jq.wasm relative
 * to the JS file's URL.
 */
function jqWasmPlugin(): Plugin {
  const wasmPath = require.resolve('jq-web/jq.wasm');

  return {
    name: 'jq-wasm',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('/jq.wasm')) {
          res.setHeader('Content-Type', 'application/wasm');
          res.end(readFileSync(wasmPath));
          return;
        }
        next();
      });
    },
    closeBundle() {
      // Copy jq.wasm to the client build output
      try {
        mkdirSync('dist/client', { recursive: true });
        cpSync(wasmPath, 'dist/client/jq.wasm');
      } catch {
        // Build output may not exist in all scenarios
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), jqWasmPlugin(), vike()],
  optimizeDeps: {},
  worker: { format: 'es' },
  build: {},
  base: (process.env.PUBLIC_ENV__BASE_URL ?? '') + '/json-viewer/',
});
