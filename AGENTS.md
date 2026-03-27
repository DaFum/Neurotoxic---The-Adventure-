# Neurotoxic — Agent Instructions

## Critical Commands
- Lint: `npm run lint` (runs `tsc --noEmit` only — no eslint/prettier)

## Architecture Constraints
- `@/` alias resolves to project root, not `src/` — configured in both [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json)
- Adding new scenes requires three changes: (1) create file in [src/components/scenes/](src/components/scenes/), (2) add to the `Scene` union type in [src/store.ts](src/store.ts), (3) import and wire up in [src/components/Game.tsx](src/components/Game.tsx) (scene switch + camera)

## Gotchas
- `@tailwindcss/vite` is the Tailwind build plugin — do not replace with the standard `tailwindcss` package or add PostCSS config
- All physics bodies (`@react-three/rapier`) must live inside scene components — declaring them outside the `<Physics>` provider silently fails
- [dialog_uebersicht.md](dialog_uebersicht.md) documents all dialogue trees, quest triggers, item interactions, and BandMood metrics. Keep it in sync when modifying [src/components/scenes/](src/components/scenes/) or [src/store.ts](src/store.ts)
- Three.js types come from `three` package itself (no separate `@types/three`) — if type errors appear for `THREE.*`, check the `three` version, not missing type packages
- For deeper insights read [docs/architecture_analysis.md](docs/architecture_analysis.md), [docs/scene_architecture.md](docs/scene_architecture.md), and [docs/store_and_audio.md](docs/store_and_audio.md)
