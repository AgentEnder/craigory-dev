import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

const nodeStub = resolve(__dirname, 'src/node-stubs.ts');

export default defineConfig({
  plugins: [react(), tailwindcss(), vike()],
  resolve: {
    alias: {
      child_process: nodeStub,
      'fs/promises': nodeStub,
      fs: nodeStub,
      'node:fs': nodeStub,
      'node:util': nodeStub,
      'node:path': nodeStub,
      path: nodeStub,
      readline: nodeStub,
      os: nodeStub,
      crypto: nodeStub,
      util: nodeStub,
    },
  },
  define: {
    'process.env': '{}',
    'process.argv': '[]',
    'process.platform': '"browser"',
    'process.version': '"v0.0.0"',
    'process.stdout': '{}',
    'process.stderr': '{}',
  },
  build: {},
  base: (process.env.PUBLIC_ENV__BASE_URL ?? '') + '/pr-digest/',
});
