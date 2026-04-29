import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  {
    ignores: ['dist/**', 'coverage/**', '.agents/**', '.claude/**'],
  },
  eslintConfigPrettier,
  {
        files: [
      'src/components/Interactable.test.tsx',
      'src/components/Player.test.tsx',
      'src/components/ui/DialogueBox.test.tsx',
      'src/components/ui/GlitchOverlay.test.tsx',
      'src/dialogueEngine.test.ts',
      'vitest.setup.ts',
    ],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prefer-const': 'off',
    },
  },
];
