# Neurotoxic — Agent Instructions

## Critical Commands

- Install: `npm install`
- Dev server: `npm run dev` (starts on port 3000)
- Build: `npm run build`
- Lint: `npm run lint` (TypeScript check only)
- Clean build: `npm run clean` (removes dist/)

## Architecture Constraints

- The `@/` alias resolves to the project root (defined in vite.config.ts and tsconfig.json)
- All scenes are in `src/components/scenes/` — coordinate with scene components when adding world content
- Audio system is centralized in `src/audio.ts` — use this for all sound effects and music
- State management uses Zustand (`src/store.ts`) — all game state lives here

## Environment Configuration

- **GEMINI_API_KEY** is required for AI features. In development, set this in `.env.local` (copy from `.env.example`)
- In AI Studio deployment, secrets are injected at runtime — do not hardcode API keys
- **APP_URL** is auto-injected in AI Studio for self-referential links and OAuth callbacks
- The `DISABLE_HMR` env var disables hot-reload in AI Studio (file watching is disabled during agent edits)

## Gotchas

- `@tailwindcss/vite` is the build plugin, not the standard tailwindcss package — do not downgrade or replace it
- Three.js scenes are in `components/scenes/` but Game.tsx orchestrates the rendering — modify Game.tsx when adding new scenes or cameras
- Rapier physics is imported from `@react-three/rapier` — all physics bodies must be declared in scene components
- TypeScript `skipLibCheck` is true — library type errors are ignored (this is intentional for Three.js compatibility)
