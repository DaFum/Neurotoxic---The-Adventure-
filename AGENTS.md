# Neurotoxic — Agent Instructions

## Critical Commands
- Lint: `npm run lint` (runs `tsc --noEmit` only — no eslint/prettier)

## Architecture Constraints
- `@/` alias resolves to project root, not `src/` — configured in both [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json)
- Adding new scenes requires **5 steps** — see checklist in [src/components/scenes/AGENTS.md](src/components/scenes/AGENTS.md)

## Gotchas
- `@tailwindcss/vite` is the Tailwind build plugin — do not replace with the standard `tailwindcss` package or add PostCSS config
- All physics bodies (`@react-three/rapier`) must live inside scene components — declaring them outside the `<Physics>` provider silently fails
- [dialog_uebersicht.md](dialog_uebersicht.md) documents all dialogue trees, quest triggers, item interactions, and BandMood metrics. Keep it in sync when modifying [src/components/scenes/](src/components/scenes/) or [src/store.ts](src/store.ts)
- Three.js types come from `three` package itself (no separate `@types/three`) — if type errors appear for `THREE.*`, check the `three` version, not missing type packages
