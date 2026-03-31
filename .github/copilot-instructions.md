# Neurotoxic — Agent Instructions

## Critical Commands
- Lint: `pnpm run lint` (runs `tsc --noEmit` only — no eslint/prettier)

## Architecture Constraints
- `@/` alias resolves to project root, not `src/` — configured in both vite.config.ts and tsconfig.json
- Adding new scenes requires five changes: (1) create file in `src/components/scenes/`, (2) add to the `Scene` union type in `src/store.ts`, (3) import and wire up in `src/components/Game.tsx` (scene switch + camera), (4) add ambient track in `audio.ts` `startAmbient()` switch, (5) update `dialog_uebersicht.md` with all dialogue trees

## Gotchas
- `@tailwindcss/vite` is the Tailwind build plugin — do not replace with the standard `tailwindcss` package or add PostCSS config
- All physics bodies (`@react-three/rapier`) must live inside scene components — declaring them outside the `<Physics>` provider silently fails
- `dialog_uebersicht.md` documents all dialogue trees, quest triggers, item interactions, and BandMood metrics. Keep it in sync when modifying `src/components/scenes/*.tsx` or `src/store.ts`
- Three.js types come from `three` package itself (no separate `@types/three`) — if type errors appear for `THREE.*`, check the `three` version, not missing type packages

## Store
- `setScene()` always resets `playerPos` to `[0, 1, 0]` — every scene must work with this spawn point
- `combineItems()` checks both orderings (A,B) and (B,A) — add new recipes to the `RECIPES` array in `src/store.ts`
-- Only these fields persist to localStorage: `inventory`, `flags`, `quests`, `bandMood`, `loreEntries`, `trait`, `skills`. `scene`, `playerPos`, `dialogue`, `isPaused`, and `cameraShake` are NOT persisted.

## Scene Conventions
- Floor: `<RigidBody type="fixed">` at `position={[0, -0.1, 0]}` with `rotation={[-Math.PI / 2, 0, 0]}`
- Skill names are lowercase (`'technical'`, `'social'`, `'chaos'`); trait names are Title Case (`'Visionary'`, `'Technician'`, `'Brutalist'`, `'Diplomat'`, `'Mystic'`, `'Performer'`, `'Cynic'`)
- `requiredSkill` must be an object `{ name: 'skill', level: N }` — passing a string silently fails
- Collected items must use conditional rendering: `{!hasItem('X') && <Interactable ... />}`
- `removeFromInventory()` is NOT automatic — explicitly call it when an item is consumed
- Scene names are case-sensitive: `'void_station'` not `'voidStation'`
- Skill/mood increases must be inside `action` callbacks, not at component render level

## Components
- `onInteract` callbacks should use `useStore.getState()` for reading state — closures capture stale values
- `AnimatePresence key={scene}` causes full scene remount on transition — cleanup timers in scenes
- Interaction range is hardcoded to 4.0 units — not configurable per instance
