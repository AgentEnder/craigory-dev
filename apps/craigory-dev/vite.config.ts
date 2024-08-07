/// <reference types="vitest" />
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';

import { ssr } from 'vike/plugin';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import viteTsConfigPaths from 'vite-tsconfig-paths';

import { REMARK_PLUGINS, REHYPE_PLUGINS } from './plugins';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/craigory-dev',

  server: {
    port: 4200,
    host: 'localhost',
  },

  base: process.env.PUBLIC_ENV__BASE_URL || '/',

  assetsInclude: ['../../libs/presentations/**/*.md', './static/**/*'],

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    viteTsConfigPaths(),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: [
            `../../libs/presentations/assets/*`,
            `../../libs/presentations/assets/**/*`,
          ],
          dest: '.',
          rename: (_1, _2, filePath) => {
            const dest = filePath.replace('../../libs/presentations', '');
            return dest;
          },
        },
      ],
    }),
    ssr({
      prerender: {
        partial: false,
      },
      trailingSlash: false,
    }),
    mdx({
      remarkPlugins: REMARK_PLUGINS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehypePlugins: REHYPE_PLUGINS as any,
    }),
  ],

  resolve: {
    // alias,
  },

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
    manifest: undefined,
    ssrManifest: undefined,
    ssr: undefined,
    watch: null,
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false,
    },
  },

  test: {
    reporters: ['default'],
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['{src,pages}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
