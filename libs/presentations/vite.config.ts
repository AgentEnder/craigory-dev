import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/presentations',

  plugins: [
    // vite-plugin-dts is still typed against Vite 7 (Rollup-based plugin
    // hooks); cast until it ships Vite 8 / Rolldown-compatible types.
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }) as any,
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  assetsInclude: ['**/*.md'],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'presentations',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    // Intentionally `rollupOptions` (not `rolldownOptions`): this config is
    // only consumed by vitest, which still runs Vite 7 internally. Vite 8
    // accepts `rollupOptions` as a deprecated alias, so this also works if
    // this config is ever loaded by Vite 8.
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },

  test: {
    reporters: ['default'],
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
