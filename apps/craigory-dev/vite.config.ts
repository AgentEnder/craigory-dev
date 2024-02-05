/// <reference types="vitest" />
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import { join } from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import rehypeSlug from 'rehype-slug';
import rehypeTableOfContents from 'rehype-toc';
import { ssr } from 'vike/plugin';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import * as tsconfig from '../../tsconfig.base.json';

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
        {
          src: ['CNAME'],
          dest: '.',
          rename: (_1, _2, filePath) => {
            return filePath;
          },
        },
      ],
    }),
    ssr({
      prerender: {
        partial: true,
      },
    }),
    mdx({
      rehypePlugins: [
        rehypeSlug,
        [rehypeTableOfContents, {headings: ['h2', 'h3', 'h4']}],
        rehypeExternalLinks,
        rehypeHighlight,
        rehypeMdxCodeProps,
        [
          rehypeAutolinkHeadings,
          { content: fromHtmlIsomorphic('<span>🔗</span>', { fragment: true }) },
        ],
      ],
    }),
  ],

  resolve: {
    alias: Object.fromEntries(
      Object.entries(tsconfig.compilerOptions.paths).map(([m, p]) => [
        m,
        join('../..', p[0]),
      ])
    ),
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
