#!/usr/bin/env node

import { cli } from 'cli-forge';
import { PerformanceObserver } from 'perf_hooks';

import { createPagefindClient, printCacheInspection } from './pagefind.js';

function installPerfLogger(): void {
  const measures: PerformanceEntry[] = [];
  const obs = new PerformanceObserver((list) => {
    measures.push(...list.getEntries());
  });
  obs.observe({ entryTypes: ['measure'] });

  process.on('beforeExit', () => {
    obs.disconnect();
    if (measures.length === 0) return;
    console.error('\n[perf] ─────────────────────────────');
    for (const m of measures) {
      console.error(`[perf] ${m.name.padEnd(10)} ${m.duration.toFixed(0)}ms`);
    }
    console.error('[perf] ─────────────────────────────');
  });
}

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
      .option('verbose', {
        type: 'boolean',
        default: false,
        description: 'Log fetch events and cache details to stderr',
      })
      .option('skipCache', {
        type: 'boolean',
        default: false,
        description: 'Skip all caching — always fetch from remote',
      })
      .middleware((opts) => {
        if (opts.verbose) {
          installPerfLogger();
        }
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
            })
            .option('minScore', {
              type: 'number',
              default: 5,
              description: 'Minimum score threshold (0-1) to include a result',
            }),
        handler: async (opts) => {
          performance.mark('start');

          const client = createPagefindClient({
            path: opts.path,
            url: opts.url,
            cachePath: opts.cachePath,
            verbose: opts.verbose,
            skipCache: opts.skipCache,
          });
          await client.init(opts.lang);

          performance.mark('init');
          performance.measure('init', 'start', 'init');

          // When invoked via $0 alias, positionals land in unmatched
          const query = opts.query ?? opts.unmatched?.[0];
          if (!query) {
            console.error('Usage: pagefind search <query>');
            process.exit(1);
          }
          const result = await client.search(query, {
            language: opts.lang,
            excerpt: opts.excerpt,
            limit: opts.limit,
          });

          performance.mark('search');
          performance.measure('search', 'init', 'search');

          const candidates = result.results
            .filter((r) => {
              return !opts.minScore || r.score >= opts.minScore;
            })
            .slice(0, opts.limit);

          if (candidates.length === 0) {
            console.log('No results found');
            performance.measure('total', 'start');
            return { query, results: [] };
          }

          console.log(`\nFound ${result.results.length} result(s):\n`);

          const resolvedResults = await Promise.all(
            candidates.map(async (r) => ({
              score: r.score,
              data: await r.data(),
            }))
          );

          for (const { score, data } of resolvedResults) {
            console.log(`[${score.toFixed(2)}] ${data.meta.title}`);
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

          const remaining = result.results.length - candidates.length;
          if (remaining > 0) {
            console.log(`... and ${remaining} more results`);
          }

          performance.mark('resolve');
          performance.measure('resolve', 'search', 'resolve');
          performance.measure('total', 'start', 'resolve');

          return { query, results: resolvedResults };
        },
        alias: ['$0'],
      })
      .command('filters', {
        description: 'List available search filters',
        builder: (c) => c,
        handler: async (opts) => {
          performance.mark('start');

          const client = createPagefindClient({
            path: opts.path,
            url: opts.url,
            cachePath: opts.cachePath,
            verbose: opts.verbose,
            skipCache: opts.skipCache,
          });
          await client.init();

          performance.mark('init');
          performance.measure('init', 'start', 'init');

          const filters = await client.filters();
          console.log('Available filters:');
          for (const [key, values] of Object.entries(filters)) {
            console.log(`  ${key}: ${Object.keys(values).join(', ')}`);
          }

          performance.measure('total', 'start');

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
            verbose: opts.verbose,
            skipCache: opts.skipCache,
          });
          const info = client.getInfo();
          console.log(`Base URL: ${info.baseUrl}`);
          console.log(`Pagefind path: ${info.pagefindPath}`);
          console.log(`Initialized: ${info.initialized}`);

          return info;
        },
      })
      .command('inspect-cache', {
        description: 'Show information about the local pagefind cache',
        builder: (c) => c,
        handler: async () => {
          return printCacheInspection();
        },
      }),
});

export default pagefindCLI;

pagefindCLI.forge();
