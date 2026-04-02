import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'jsdom'],
      ['**/*.spec.tsx', 'jsdom'],
    ],
    setupFiles: ['./vitest.setup.ts'],
  },
});
