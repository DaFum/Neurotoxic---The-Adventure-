# Neurotoxic — Agent Instructions

## Critical Commands
- Lint: `npm run lint` (runs `tsc --noEmit` only — no eslint/prettier)

## Architecture Constraints
- `@/` alias resolves to project root, not `src/` — configured in both vite.config.ts and tsconfig.json
- Adding new scenes requires updating `Game.tsx` (scene orchestration/camera setup), not just creating a file in `src/components/scenes/`

## Gotchas
- `@tailwindcss/vite` is the Tailwind build plugin — do not replace with the standard `tailwindcss` package or add PostCSS config
- All physics bodies (`@react-three/rapier`) must live inside scene components — declaring them outside the physics world silently fails
