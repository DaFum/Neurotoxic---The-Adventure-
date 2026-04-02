import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // @ts-ignore
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'jsdom'],
      ['**/*.spec.tsx', 'jsdom'],
    ] as any,
    setupFiles: ['./vitest.setup.ts'],
  },
});
