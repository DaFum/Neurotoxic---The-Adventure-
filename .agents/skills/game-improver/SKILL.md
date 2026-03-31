---
name: game-improver
description: |
  Implement bug fixes, features, and targeted improvements for the Neurotoxic codebase — a 3D narrative adventure game built with React, Three.js (R3F), Zustand, and Rapier physics.

  Trigger when: the user wants to fix bugs, add features, refactor code, or improve anything touching dialogue, inventory, quests, scenes, audio, physics, or state logic in this game codebase. Also trigger for performance fixes, test additions, scene wiring, new crafting recipes, or dialogue tree changes.

  Use this skill even when the request seems small — it encodes critical gotchas (silent failures, stale closures, persistence pitfalls) that prevent common mistakes. If the user mentions store.ts, a scene file, audio.ts, dialog_uebersicht.md, or any game mechanic, this skill applies.
user-invocable: true
metadata:
  scope: user
  version: "1.0.0"
---

# Game Improver

Implement production-ready changes for Neurotoxic — bug fixes, features, refactoring, performance improvements, and test additions.

## Workflow

### 1. Understand What's Changing

Read the request and identify which systems are involved:

| System | Key Files | Read Before Changing |
|--------|-----------|----------------------|
| State / store | `src/store.ts` | `src/AGENTS.md` |
| Dialogue trees | Scene files + `dialog_uebersicht.md` | `src/components/scenes/AGENTS.md` |
| Scenes / physics | `src/components/scenes/*.tsx`, `Game.tsx` | `src/components/scenes/AGENTS.md` |
| Audio | `src/audio.ts` | `src/AGENTS.md` (Audio section) |
| UI / components | `src/components/*.tsx` | `src/components/AGENTS.md` |
| Inventory / crafting | `src/store.ts` (RECIPES array + mutators) | `src/AGENTS.md` (Store section) |
| Quests | `src/store.ts` + scene files | `src/AGENTS.md` (Quest API section) |

The AGENTS.md files at each directory level contain the authoritative conventions and API docs for each subsystem. Read the relevant one before making changes — they prevent the most common mistakes.

### 2. Locate and Inspect

Before writing any code:

- Read the files you'll modify
- Read `dialog_uebersicht.md` if touching dialogue or quests (single source of truth for all dialogue trees, quest triggers, item interactions, and BandMood deltas)
- Check `src/store.ts` for: current state shape, available mutators, `Flag` union type, `RECIPES` array, and persistence config
- Check existing tests in `src/store.test.ts` and `src/dialogueEngine.test.ts` for patterns

### 3. Implement

Make the smallest change that solves the problem:

- One behavioral change per commit
- Add/update unit tests for any behavior change
- If adding state fields or mutators, see `references/store-patterns.md` for real examples
- If adding a scene, follow the 5-step checklist in `src/components/scenes/AGENTS.md`
- Update `dialog_uebersicht.md` when changing dialogue, quests, items, or BandMood values

### 4. Verify

```bash
pnpm run lint          # TypeScript type-check (tsc --noEmit) — no eslint
pnpm run test          # Vitest unit tests
pnpm run build         # Production build
```

Manual smoke: start the affected scene, verify spawn point works, test the changed interaction.

## Critical Gotchas

These are the mistakes that cause real bugs in this codebase. The AGENTS.md files have the full details — these are the concentrated danger zones.

### Silent failures (no error, just broken)

- **Physics bodies outside scenes** — declaring `<RigidBody>` outside a scene component (which lives inside `<Physics>`) means the body simply doesn't exist at runtime. No error.
- **`requiredSkill` as string** — passing `requiredSkill: 'technical'` instead of `requiredSkill: { name: 'technical', level: 2 }` makes the option appear unlocked but the check never runs.
- **`removeFromInventory()` not automatic** — consuming an item in a dialogue action requires explicitly calling `removeFromInventory()`. The only exception is `combineItems()`, which handles removal internally.
- **One-shot dialogue showing repeatedly** — guarding only the rewards inside `action()` still shows the option every time. Exclude it from the options array via a flag check before the `setDialogue()` call.
- **Multiple `setDialogue()` in one callback** — only the last call is visible. Use a single conditional call.

### Stale state

- **Closure capture** — `onInteract` callbacks capture stale state. Use `useStore.getState()` for reads inside callbacks, not destructured values from render scope.
- **Scene remount** — `AnimatePresence key={scene}` in `Game.tsx` fully remounts all scene content on transition. Any `setTimeout` or `setInterval` must be cleared in cleanup or it leaks.

### Data integrity

- **`bandMood` range** — must stay in [0, 100]. The built-in `increaseBandMood()` clamps, but manual `set()` calls won't.
- **Flag names** — must exist in the `Flag` union in `store.ts`. TypeScript catches this, but only if you run `pnpm run lint`.
- **Quest IDs** — use snake_case: `'repair_amp'`, `'ghost_recipe'`, `'cosmic_echo'`.
- **`dialog_uebersicht.md` sync** — if you change a quest trigger, BandMood delta, or item interaction in code, update the doc too. And vice versa.
- **`@/` alias** — resolves to project root, not `src/`. Imports look like `import { useStore } from '@/src/store'`.

## Commit Conventions

Format: `type(scope): short summary`

Types: `feat`, `fix`, `refactor`, `test`, `chore`

Scopes: `inventory`, `quest`, `dialogue`, `audio`, `scene`, `store`, `physics`, `ui`

Branch naming: `fix/<short>-<ticket>` or `feat/<short>-<ticket>`

## PR Body

Include: motivation (one sentence), changes (file list with reasons), verification (exact commands + manual steps), and risks (brief assessment).

## Reference Files

Read these when you need deeper patterns:

- `references/store-patterns.md` — State mutation examples using real store fields, crafting recipes, persistence changes, immutable update patterns
- `references/workflow-templates.md` — Bug fix / feature / refactor / performance fix workflows, PR body template
