#!/usr/bin/env node

import { cli } from 'cli-forge';

import { createPagefindClient } from './pagefind.js';
import type { PagefindResultData } from './types.js';

const pagefindCLI = cli('pagefind', {
  description: 'Query Pagefind search indices from Node.js',
  builder: (args) =>
    args
      .option('url', {
        type: 'string',
        description: 'Base URL of a remote site that hosts the Pagefind index',
        coerce: (input) => {
          if (input && !input.match(/^.*:\/\//)) {
            // default scheme to https if not provided
            return `https://${input}`;
          }
          return input;
        },
      })
      .option('path', {
        type: 'string',
        description:
          'Path to a locally built site (directory containing pagefind/)',
      })
      .option('cachePath', {
        type: 'string',
        description:
          'Custom cache directory for downloaded pagefind.js (bypasses version-based caching)',
      })
      .command('search', {
        description: 'Search the pagefind index',
        builder: (c) =>
          c
            .positional('query', {
              type: 'string',
              description: 'Search query',
              required: true,
            })
            .option('lang', {
              type: 'string',
              default: 'en',
              description: 'Language code',
            })
            .option('excerpt', {
              type: 'boolean',
              default: false,
              description: 'Show excerpt from each result',
            })
            .option('limit', {
              type: 'number',
              default: 10,
              description: 'Maximum results to show',
            }),
        handler: async (opts) => {
          const client = createPagefindClient({
            path: opts.path,
            url: opts.url,
            cachePath: opts.cachePath,
          });
          await client.init(opts.lang);

          const query = opts.query;
          const result = await client.search(query, {
            language: opts.lang,
            excerpt: opts.excerpt,
            limit: opts.limit,
          });

          if (result.results.length === 0) {
            console.log('No results found');
            return { query, results: [] };
          }

          console.log(`\nFound ${result.results.length} result(s):\n`);

          const maxResults = opts.limit;
          const resolvedResults: Array<{
            score: number;
            data: PagefindResultData;
          }> = [];

          for (const r of result.results.slice(0, maxResults)) {
            const data = await r.data();
            resolvedResults.push({ score: r.score, data });

            console.log(`[${r.score.toFixed(2)}] ${data.meta.title}`);
            console.log(`    URL: ${data.url}`);

            if (opts.excerpt && data.excerpt) {
              console.log(
                `    ${data.excerpt
                  .replace(/<[^>]*>/g, '')
                  .substring(0, 150)}...`
              );
            }
            console.log();
          }

          if (result.results.length > maxResults) {
            console.log(
              `... and ${result.results.length - maxResults} more results`
            );
          }

          return { query, results: resolvedResults };
        },
        alias: ['$0'],
      })
      .command('filters', {
        description: 'List available search filters',
        builder: (c) => c,
        handler: async (opts) => {
          const client = createPagefindClient({
            path: opts.path,
            url: opts.url,
            cachePath: opts.cachePath,
          });
          await client.init();

          const filters = await client.filters();
          console.log('Available filters:');
          for (const [key, values] of Object.entries(filters)) {
            console.log(`  ${key}: ${Object.keys(values).join(', ')}`);
          }

          return filters;
        },
      })
      .command('info', {
        description: 'Show index configuration information',
        builder: (c) => c,
        handler: async (opts) => {
          const client = createPagefindClient({
            path: opts.path,
            url: opts.url,
            cachePath: opts.cachePath,
          });
          const info = client.getInfo();
          console.log(`Base URL: ${info.baseUrl}`);
          console.log(`Pagefind path: ${info.pagefindPath}`);
          console.log(`Initialized: ${info.initialized}`);

          return info;
        },
      }),
});

export default pagefindCLI;

pagefindCLI.forge();
