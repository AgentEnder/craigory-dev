import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // The parser and renderer are pure string transforms -- no DOM needed.
    environment: 'node',
    include: ['apps/tree-generator/src/**/*.spec.ts'],
    globals: true,
  },
});
