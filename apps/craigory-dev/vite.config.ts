/// <reference types="vitest" />
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { join } from 'path';
import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkOptions,
} from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import rehypeSlug from 'rehype-slug';
import remarkRehype from 'remark-rehype';
import remarkToc from 'remark-toc';
import { ssr } from 'vike/plugin';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import * as tsconfig from '../../tsconfig.base.json';
import remarkSmartypants from 'remark-smartypants';

const rehypeAutolinkHeadingsOptions: RehypeAutolinkOptions = {
  behavior: 'append',
  content: {
    type: 'text',
    value: '#'
  },
  properties: {
    className: 'heading-link',
  },
  test: (el) => {
    if (el.type === 'element') {
      if (el.tagName === 'h1') return false;
      if (
        el.tagName === 'h2' &&
        el.children?.find(
          (el) => el.type === 'text' && el.value === 'Table of Contents'
        )
      )
        return false;
    }
    return true;
  },
};

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
      remarkPlugins: [remarkToc, remarkSmartypants, remarkRehype],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        ],
        rehypeHighlight,
        rehypeMdxCodeProps,
        [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
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
