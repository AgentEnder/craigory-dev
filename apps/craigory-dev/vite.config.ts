/// <reference types="vitest" />
import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { ssr } from 'vite-plugin-ssr/plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { join, normalize } from 'path';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/craigory-dev',

  server: {
    port: 4200,
    host: 'localhost',
  },

  assetsInclude: ['../../libs/presentations/**/*.md'],

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
    viteStaticCopy({
      targets: [
        {
          src: [
            '../../libs/presentations/assets/*.png',
            '../../libs/presentations/assets/**/*.png',
          ],
          dest: '.',
          rename: (_1, _2, filePath) => {
            console.log({ _1, _2, filePath });
            return filePath.replace('../../libs/presentations', '');
          },
        },
      ],
    }),
    ssr({
      prerender: {
        partial: true,
      },
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  build: {
    outDir: '../../dist/apps/craigory-dev',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: undefined,
    target: 'esnext',
    commonjsOptions: { transformMixedEsModules: true },
    sourcemap: undefined,
    minify: undefined,
    manifest: undefined,
    ssrManifest: undefined,
    ssr: undefined,
    watch: null,
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
