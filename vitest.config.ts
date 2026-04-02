import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // @ts-expect-error: environmentMatchGlobs is missing from InlineConfig in this version of vitest
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'jsdom'],
      ['**/*.spec.tsx', 'jsdom'],
    ],
    setupFiles: ['./vitest.setup.ts'],
  },
});
