export default [
  {
    test: {
      name: 'node',
      environment: 'node',
      include: ['**/*.test.ts', '**/*.spec.ts'],
      exclude: ['**/*.test.node.ts'],
    },
  },
  {
    test: {
      name: 'jsdom',
      environment: 'jsdom',
      include: ['**/*.test.tsx', '**/*.spec.tsx'],
      setupFiles: ['./vitest.setup.ts'],
    },
  },
];
