---
name: game-improver
description: |
  Implement bug fixes, features, and targeted improvements for the Neurotoxic codebase — a 3D narrative adventure game built with React, Three.js (R3F), Zustand, and Rapier physics.

  Trigger when: the user wants to fix bugs, add features, refactor code, or improve anything touching dialogue, inventory, quests, scenes, audio, physics, or state logic in this game codebase. Also trigger for performance fixes, test additions, scene wiring, new crafting recipes, or dialogue tree changes.

  Use this skill even when the request seems small — it encodes critical gotchas (silent failures, stale closures, persistence pitfalls) that prevent common mistakes. If the user mentions store.ts, a scene file, audio.ts, dialog_uebersicht.md, or any game mechanic, this skill applies.
user-invocable: true
metadata:
  scope: user
  version: '1.1.0'
---

# Game Improver

Implement production-ready changes for Neurotoxic — bug fixes, features, refactoring, performance improvements, and test additions.

## Workflow

### 1. Understand What's Changing

Identify which systems the request touches, then use Read on the relevant files and their AGENTS.md before writing any code. Claude Code auto-loads AGENTS.md files — these contain the authoritative conventions for each subsystem.

| System               | Key Files                                 | AGENTS.md to Read                   |
| -------------------- | ----------------------------------------- | ----------------------------------- |
| State / store        | `src/store.ts`                            | `src/AGENTS.md`                     |
| Dialogue trees       | Scene files + `dialog_uebersicht.md`      | `src/components/scenes/AGENTS.md`   |
| Scenes / physics     | `src/components/scenes/*.tsx`, `Game.tsx` | `src/components/scenes/AGENTS.md`   |
| Audio                | `src/audio.ts`                            | `src/AGENTS.md` (Audio section)     |
| UI / components      | `src/components/*.tsx`                    | `src/components/AGENTS.md`          |
| Inventory / crafting | `src/store.ts` (RECIPES array + mutators) | `src/AGENTS.md` (Store section)     |
| Quests               | `src/store.ts` + scene files              | `src/AGENTS.md` (Quest API section) |

### 2. Locate and Inspect

**Read before you write.** This step isn't optional — the codebase has many subtle conventions that aren't obvious from the request alone. A fix that looks correct but uses the wrong API, wrong field name, or wrong import path will fail silently or at lint time.

- Read `src/store.ts` for the current state shape, `Flag` union, `RECIPES` array, mutator signatures, and persistence config
- Read `dialog_uebersicht.md` if touching dialogue, quests, items, or BandMood — it's the single source of truth
- Read existing tests in `src/store.test.ts` and `src/dialogueEngine.test.ts` for test patterns and style before writing new tests
- Use Grep to find the actual call site before diagnosing a bug — the issue is often in a different file than expected

**For bugs specifically — diagnose before fixing:**

1. Find the code path that produces the symptom (Grep for the relevant function or item name)
2. Read the implementation to understand what it actually does vs. what it should do
3. Identify the exact gap — missing call, wrong field, wrong condition
4. Then write the fix

### 3. Implement

Use Edit to make targeted changes. Make the smallest change that solves the problem.

- One behavioral change per commit
- Add/update unit tests for any behavior change
- If adding state fields or mutators, read `references/store-patterns.md` for real examples and correct field names
- If adding a scene, follow the 6-step checklist in `src/components/scenes/AGENTS.md`
- Update `dialog_uebersicht.md` when changing dialogue, quests, items, or BandMood values

### 4. Verify

Run via Bash:

```bash
pnpm run lint          # TypeScript type-check (tsc --noEmit) — no eslint
pnpm run test          # Vitest unit tests
pnpm run build         # Production build
```

If any step fails, read the error output, fix the issue with Edit, and re-run. Don't skip verification.

## Scene Addition Checklist (6 steps)

When adding a new scene, all 6 steps are required. Missing any one causes a silent or broken experience:

1. **Scene file** — Create `src/components/scenes/YourScene.tsx` with a `<RigidBody type="fixed" position={[0, -0.1, 0]}>` floor and `<Player bounds={...} />`
2. **Scene union** — Add the scene name to the `Scene` union type in `src/store.ts`
3. **Game.tsx wiring** — Import and add `{scene === 'your_scene' && <YourScene />}` in the Physics block
4. **Ambient audio** — Add a `'your_scene'` branch to `startAmbient()` in `src/audio.ts` (also add it to the union type on that function)
5. **dialog_uebersicht.md** — Add a section with dialogue trees, quest triggers, items, and BandMood deltas
6. **SceneEnvironmentSetpieces** _(if shared décor is needed)_ — Add a `variant` to `src/components/scenes/SceneEnvironmentSetpieces.tsx` and render `<SceneEnvironmentSetpieces variant="..." />` in the scene

## Critical Gotchas

These cause real bugs in this codebase. The AGENTS.md files have full details — these are the concentrated danger zones.

### Silent failures (no error, just broken)

- **Physics bodies outside scenes** — `<RigidBody>` declared outside a scene component (which lives inside `<Physics>`) simply doesn't exist at runtime. No error thrown.
- **`requiredSkill` as string** — passing `requiredSkill: 'technical'` instead of `requiredSkill: { name: 'technical', level: 2 }` makes the option appear unlocked but the check never runs.
- **`removeFromInventory()` not automatic** — consuming an item in a dialogue action requires explicitly calling it. The only exception is `combineItems()`, which handles removal internally.
- **One-shot dialogue showing repeatedly** — guarding only the rewards inside `action()` still shows the option every time. Exclude it from the options array via a flag check before `setDialogue()`.
- **Multiple `setDialogue()` in one callback** — only the last call is visible. Use a single conditional call.
- **Recipe field names** — the `Recipe` type uses `ingredients: [string, string]`, not `item1`/`item2`. Wrong field names are silently ignored at runtime.

### Stale state

- **Closure capture** — `onInteract` callbacks capture stale state. Use `useStore.getState()` for reads inside callbacks, not destructured values from render scope.
- **Scene remount** — `AnimatePresence key={scene}` in `Game.tsx` fully remounts all scene content on transition. Any `setTimeout` or `setInterval` must be cleared in cleanup or it leaks.

### Data integrity

- **`bandMood` range** — must stay in [0, 100]. The built-in `increaseBandMood()` clamps automatically, but direct `set({ bandMood: value })` calls do not clamp. Always use `increaseBandMood()` for increments.
- **Flag names** — must exist in the `Flag` union in `store.ts`. TypeScript catches this at `pnpm run lint`, but not at runtime.
- **Quest IDs** — use snake_case: `'repair_amp'`, `'ghost_recipe'`, `'cosmic_echo'`.
- **`dialog_uebersicht.md` sync** — if you change a quest trigger, BandMood delta, or item interaction in code, update the doc too. And vice versa.
- **`@/` alias** — resolves to project root, not `src/`. Imports: `import { useStore } from '@/src/store'`.

## Commit Conventions

Format: `type(scope): short summary`

Types: `feat`, `fix`, `refactor`, `test`, `chore`

Scopes: `inventory`, `quest`, `dialogue`, `audio`, `scene`, `store`, `physics`, `ui`

Branch naming: `fix/<short>-<ticket>` or `feat/<short>-<ticket>`

## PR Body

Include: motivation (one sentence), changes (file list with reasons), verification (exact commands + manual steps), and risks (brief assessment).

## Reference Files

Read these when you need deeper patterns:

- `references/store-patterns.md` — State mutation examples using real store fields, correct Recipe syntax, crafting recipes, quest patterns, persistence changes, immutable update patterns
- `references/workflow-templates.md` — Bug fix / feature / scene addition / refactor / performance fix workflows, PR body template
