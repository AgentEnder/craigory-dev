/// <reference types="vite/client" />
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';

import vike from 'vike/plugin';
import { defineConfig } from 'vitest/config';
import viteTsConfigPaths from 'vite-tsconfig-paths';

import { REMARK_PLUGINS, REHYPE_PLUGINS } from './plugins';
import { copyAssetsPlugin } from './vite-plugin-copy-assets';
import { rawMarkdownPlugin } from './vite-plugin-raw-markdown';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/craigory-dev',

  server: {
    port: 4200,
    host: 'localhost',
  },

  base: process.env.PUBLIC_ENV__BASE_URL || '/',

  assetsInclude: ['./static/**/*'],

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    viteTsConfigPaths(),
    react(),
    rawMarkdownPlugin(),
    copyAssetsPlugin({
      src: '../../libs/presentations/assets',
      dest: 'assets',
    }),
    vike(),
    mdx({
      remarkPlugins: REMARK_PLUGINS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehypePlugins: REHYPE_PLUGINS as any,
      include: ['**/*.mdx'],
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
    environment: 'jsdom',
    include: ['{src,pages}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
