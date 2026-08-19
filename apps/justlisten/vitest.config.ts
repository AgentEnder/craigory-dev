import { defineConfig } from 'vitest/config';

// Pure-logic unit tests for the worker (matching, links, URL parsing).
// No network, no Workers runtime — plain node environment.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['worker/__tests__/**/*.spec.ts'],
  },
});
