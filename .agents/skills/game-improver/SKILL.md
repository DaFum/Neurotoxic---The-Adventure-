---
name: game-improver
description: |
  Implement bug fixes, features, and targeted improvements for the Neurotoxic codebase.

  Trigger when: requested changes touch `dialogue`, `inventory`, `quests`, `scene` wiring, audio, physics, or store/state logic — or when small, repository-conforming features, performance tweaks, or refactors are desired.

  This skill encodes repository conventions (scene wiring, `src/store.ts` patterns, `dialog_uebersicht.md` dialogue trees, `audio.ts` ambient handling, and `three` + `@react-three/rapier` patterns), provides a safe implementation checklist, and emits ready-to-apply patches or draft PR summaries.

  Route to specialists when appropriate (audio, deep state-safety, UI styling, balancing).
user-invocable: true
argument-hint: |
  action: string (createScene | diagnoseBug | updateDialogue | fixAudioAmbient | diagnoseInventoryQuestBug | implementPatch)
  scope: string (user | workspace) — default: user
  skillName: string — short hyphenated identifier for the skill
  sceneName: string — name when creating a scene
  branch: string — branch name to base patches on
  target: path — primary file to modify (e.g., src/audio.ts)
  askConfirm: boolean — show draft and request confirmation before writing (default: true)
  draftOnly: boolean — show draft only, do not write files
metadata:
  scope: user
  version: "0.3.0"
---

# Game Improver

Implement production-ready improvements—bug fixes, features, optimizations, and refactoring—for NEUROTOXIC.

## Quick Routing Decision Tree

**Is the issue primarily...?**

| Issue Type                                               | Use This Skill | Else Use                                                        |
| -------------------------------------------------------- | -------------- | --------------------------------------------------------------- |
| **Gameplay balance** (costs, rewards, difficulty)        | ❌             | `game-balancing-assistant`                                      |
| **Audio playback** (ambient vs gig, suspended context)   | ❌             | `audio-debugger-ambient-vs-gig` or `webaudio-reliability-fixer` |
| **UI design** (colors, borders, layout, typography)      | ❌             | `convention-keeper-brutalist-ui`                                |
| **State bugs** (reducer errors, invalid transitions; persistence issues) | ✅ | `state-safety-action-creator-guard`                             |
| **Core logic bug** (game loop, travel cost calc)         | ✅             | —                                                               |
| **New feature** (upgrade, item, system)                  | ✅             | —                                                               |
| **Performance** (render loops, memory, bundle)           | ✅             | —                                                               |
| **Testing** (regression, integration, edge cases)        | ✅             | —                                                               |
| **Refactoring** (extract components, reduce duplication) | ✅             | —                                                               |
| **Scene wiring / three.js** (missing physics bodies, camera issues) | ✅ | —                                                               |

**Unsure?** Proceed here. If we need a specialist, we'll delegate mid-workflow.

## Core Workflow

### 1. Understand the Request

- What problem are we solving? (user pain, crash, balance, performance)
## Game Improver — Purpose

Help contributors and automated agents implement small-to-medium scoped changes in the Neurotoxic repo with minimal risk: bug fixes, correctness patches, small features, scene wiring, audio fixes, and test-backed state changes.

This skill produces a structured deliverable: a short diagnosis, a proposed patch or draft code, tests to validate the change, and a concise PR summary with verification steps.

## When to Use

- Use this skill for: `dialogue`, `inventory`, `quests`, `scene` wiring, `audio`, `physics`, `state` bugs, small feature additions, or focused performance fixes.
- Defer to specialized skills for UI design, large balancing changes, or cross-cutting architectural rewrites.

## Inputs

- `action` — one of: `diagnoseBug`, `diagnoseInventoryQuestBug`, `fixAudioAmbient`, `createScene`, `implementPatch`, `updateDialogue`.
- `scope` — `user` or `workspace` (defaults to `user`).
- `skillName` — short hyphenated identifier for the task.
- `branch` — branch to base a patch on (optional).
- `target` — primary file path to modify (optional).
- `askConfirm` — show draft and request confirmation before writing (default true).

## Outputs

- `draft` — human-readable plan + code diff (if requested).
- `files` — list of touched files.
- `patch` — unified diff (optional, null if draftOnly).
- `tests` — suggested/added tests to validate the change.

## Compact Workflow

1. Clarify intent and success criteria.
2. Inspect `src/store.ts`, `src/components/scenes/*`, `src/audio.ts`, and `dialog_uebersicht.md` for domain rules.
3. Produce a minimal, test-backed patch; prefer small atomic commits.
4. Run `pnpm run lint` and `pnpm run test` locally; include verification steps in PR body.

## Repository Conventions (must-follow)

- Aliases: `@/` resolves to the project root (not `src/`). Update imports accordingly.
- Tailwind: the project uses the `@tailwindcss/vite` plugin — do not replace it with the standard `tailwindcss` package or add PostCSS config.
- Scene addition checklist (perform all five steps when adding a scene):
  1. Create the scene file in `src/components/scenes/`.
  2. Add the scene to the `Scene` union type in `src/store.ts`.
  3. Import and wire the scene in `src/components/Game.tsx` (scene switch + camera).
  4. Add ambient track handling in `src/audio.ts` inside the `startAmbient()` switch.
  5. Update `dialog_uebersicht.md` with dialogue trees, quest triggers, item interactions, and BandMood metrics.
- Persistence: Only these fields persist to localStorage: `inventory`, `flags`, `quests`, `bandMood`, `loreEntries`, `trait`, `skills`. Do not persist `scene`, `playerPos`, `dialogue`, `isPaused`, or `cameraShake`.
- Store behavior:
  - `setScene()` resets `playerPos` to `[0, 1, 0]` — ensure scenes support this spawn point.
  - `combineItems()` checks both permutations (A,B) and (B,A).
  - `removeFromInventory()` is not automatic — call it explicitly when consuming items.
  - `requiredSkill` must be an object: `{ name: 'skill', level: N }`.
- Naming conventions:
  - Skill names are lowercase (`technical`, `social`, `chaos`).
  - Trait names are Title Case (`Visionary`, `Technician`, `Brutalist`, `Diplomat`, `Mystic`, `Performer`, `Cynic`).
- Physics & Scenes:
  - All physics bodies (`@react-three/rapier`) must live inside scene components — declaring them outside the `<Physics>` provider silently fails.
  - Floor: use `<RigidBody type="fixed">` at `position={[0, -0.1, 0]}` with `rotation={[-Math.PI / 2, 0, 0]}`.
- Components & interactions:
  - `onInteract` callbacks should use `useStore.getState()` for reads to avoid stale closures.
  - Use conditional rendering for collected items: `{!hasItem('X') && <Interactable ... />}`.
  - `AnimatePresence key={scene}` causes full scene remount — clean up timers in scenes.
  - Interaction range is hardcoded to `4.0` units.
- Audio:
  - Use `startAmbient()` for ambient switching and handle suspended `AudioContext` (resume on user gesture).

## Implementation Guidelines (short)

- State: use `useStore.getState()` in callbacks. Add/review `useStore` mutator functions in `src/store.ts`, and make state mutations explicit.
- Inventory: `combineItems()` checks both orderings — add recipes responsibly and call `removeFromInventory()` when consuming.
- Scenes: place physics bodies inside scene components and `<Physics>`. Follow floor/spawn conventions described above.
- Audio: prefer `startAmbient()` for ambient switching and handle suspended `AudioContext` properly.
- Tests: update or add unit tests in `src/*.test.ts` covering the regression and add integration tests where appropriate.

## Verification Checklist

- [ ] Lint (`pnpm run lint`) passes.
- [ ] Unit tests covering modified logic pass (`pnpm run test`).
- [ ] Build succeeds (`pnpm run build`).
- [ ] Manual smoke: start scene, verify spawn, verify audio starts after interaction when needed.
- [ ] PR body includes: motivation, files changed, test plan, and verification instructions.

## Prompt Template (for automated/drafting agents)

Use this template when generating code diffs or drafts:

```
Task: <short description>
Repo: Neurotoxic (follow repository conventions in .agents/skills/game-improver)
Goal: <success criteria — e.g., fix crash when combining items X and Y; tests must pass>
Files to inspect: src/store.ts, src/components/scenes/*, src/audio.ts, dialog_uebersicht.md
Constraints: minimal changes, add unit tests, follow scene/audio/state conventions
Deliverables: draft summary, unified diff (patch), tests, verification steps
```

## Invocation Examples

1) Diagnose inventory/quest bug on branch:

```
/game-improver action=diagnoseInventoryQuestBug scope=workspace skillName=inventory-quest-diagnostics branch=fix-quest-inventory-bugs-3736012791563995728
```

2) Draft audio ambient fix (ask before writing):

```
/game-improver action=fixAudioAmbient target=src/audio.ts askConfirm=true
```

## Common Pitfalls

- Declaring physics bodies outside a scene component (they won't be wired into Rapier).
- Assuming `removeFromInventory()` runs automatically when combining items.
- Mutating store state in component render rather than in action handlers.

## Quick References
- `src/store.ts` — state and recipes
- `src/components/scenes/*` — scene conventions and physics
- `src/audio.ts` — ambient handling
- `dialog_uebersicht.md` — dialogue & quest triggers
- `src/store.test.ts` — test style reference

---
Change log:
- 0.3.0: reorganized content, added inputs/outputs, prompt template, checklist, and examples.

