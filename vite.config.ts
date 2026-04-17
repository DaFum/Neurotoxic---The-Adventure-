import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function suppressThreeAndRapierDeprecationWarnings(): Plugin {
  return {
    name: 'suppress-three-rapier-deprecation-warnings',
    transform(code, id) {
      const normalizedId = id.replace(/\\/g, '/');
      let next = code;

      if (normalizedId.includes('/three/')) {
        next = next.replace(
          /warn\(\s*['"]THREE\.Clock: This module has been deprecated\. Please use THREE\.Timer instead\.['"]\s*\)\s*;?/g,
          '',
        );
      }

      if (next !== code) {
        return next;
      }

      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    optimizeDeps: {
      include: [
        'zustand/traditional',
        'use-sync-external-store/shim/with-selector',
        'use-sync-external-store/shim/with-selector.js',
        'scheduler',
        'scheduler/index.js',
      ],
      // Prevent pre-bundling so our transform plugin runs on original (unbundled) dependency source.
      exclude: ['@dimforge/rapier3d-compat', '@react-three/rapier', '@react-three/fiber', 'three'],
    },
    plugins: [suppressThreeAndRapierDeprecationWarnings(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
