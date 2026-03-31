# Neurotoxic — Agent Instructions

## Critical Commands
- Lint: `pnpm run lint` (TypeScript only; no ESLint/Prettier gate)

## Architecture Constraints
- `@/` resolves to project root (`./`), not `src/`; keep alias config in [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json) aligned.
- New scenes require all required checklist items listed in [src/components/scenes/AGENTS.md](src/components/scenes/AGENTS.md) (scene file, `Scene` union, `Game.tsx` switch, audio ambient switch, dialogue overview update).

## Gotchas
- Tailwind is integrated via `@tailwindcss/vite`; do not replace it with a PostCSS-based Tailwind setup.
- All `@react-three/rapier` bodies must be declared inside scene components (under `<Physics>`); defining them outside fails silently.
- Keep [dialog_uebersicht.md](dialog_uebersicht.md) in sync when editing dialogue, quests, item interactions, or BandMood logic in [src/components/scenes/](src/components/scenes/), [src/dialogues/](src/dialogues/), and [src/store.ts](src/store.ts).
- Three.js typings come from `three`; fix `THREE.*` type issues by checking/updating `three`, not by adding `@types/three`.
