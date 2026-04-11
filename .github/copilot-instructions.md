# Neurotoxic — Agent Instructions

## Critical Commands

- Lint: `pnpm run lint` (TypeScript only; no ESLint/Prettier gate)
- Test: `pnpm run test` (Vitest in run mode; use this instead of watch defaults)

## Architecture Constraints

- `@/` resolves to project root (`./`), not `src/`; keep alias config in vite.config.ts and tsconfig.json aligned.
- New scenes must complete the checklist in src/components/scenes/AGENTS.md (scene file, `Scene` union, `Game.tsx` switch, ambient audio switch, dialogue overview update).
- Only these fields persist to localStorage: `inventory`, `itemPickupCounts`, `flags`, `quests`, `bandMood`, `bandMoodGainClaims`, `loreEntries`, `trait`, `skills`. Everything else (`scene`, `playerPos`, `dialogue`, `isPaused`, `cameraShake`) resets on reload.

## Gotchas

- Tailwind is integrated via `@tailwindcss/vite`; do not replace it with a PostCSS-based Tailwind setup.
- All `@react-three/rapier` bodies must be declared inside scene components (under `<Physics>`); defining them outside fails silently.
- Keep dialog_uebersicht.md in sync when editing dialogue, quests, item interactions, or BandMood logic in src/components/scenes/, src/dialogues/, or src/store/.
- Three.js typings come from `three`; fix `THREE.*` type issues by checking/updating `three`, not by adding `@types/three`.
- `setScene()` resets `playerPos` to `[0, 1, 0]` — every scene must have accessible geometry at that spawn point.
- Skill names are lowercase (`'technical'`, `'social'`, `'chaos'`); trait names are Title Case (`'Visionary'`, `'Technician'`, etc.) — mismatches silently fail.
- `requiredSkill` must be an object `{ name: 'skill', level: N }` — passing a bare string silently fails.
- Scene names are case-sensitive: `'void_station'` not `'voidStation'`.
