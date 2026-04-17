# Workflow Templates

Repeatable patterns for common changes in Neurotoxic.

## Bug Fix

1. **Reproduce**: Write a failing test in `src/store.test.ts` or `src/dialogueEngine.test.ts`
2. **Locate**: Grep for the relevant function/item name to find the actual code path
3. **Read**: Open the implementation and read it — understand what it actually does
4. **Identify**: Name the exact gap (missing call, wrong field, wrong condition)
5. **Fix**: Make the minimal change. If state bug: fix the mutator. If scene bug: fix the handler.
6. **Test**: Failing test now passes, full suite still green
7. **Verify**: `pnpm run lint && pnpm run test && pnpm run build`

Commit: `fix(scope): short description`

## New Crafting Recipe

1. Read `src/store.ts` — find the `RECIPES` array and the `Recipe` interface (uses `ingredients: [string, string]`, not `item1`/`item2`)
2. Add the recipe to the `RECIPES` array
3. If gating a dialogue hint on having both items, use `requiredItems` on the `DialogueOption`
4. Add/update a unit test in `src/store.test.ts`
5. Update `dialog_uebersicht.md` with the new recipe and any dialogue changes

## New Scene

Follow all 6 steps — missing any one causes silent or broken behavior:

1. Create `src/components/scenes/YourScene.tsx`
   - Include `<RigidBody type="fixed" position={[0, -0.1, 0]}>` floor with `rotation={[-Math.PI / 2, 0, 0]}`
   - Include `<Player bounds={{ x: [min, max], z: [min, max] }} />`
   - Clean up any `setTimeout`/`setInterval` in `useEffect` returns
2. Add scene name to `Scene` union type in `src/store.ts` (lowercase, underscores)
3. Import and add to scene switch in `src/components/Game.tsx` inside the `<Physics>` block
4. Add `'your_scene'` to `startAmbient()` union type **and** the ambient loop switch in `src/audio.ts`
5. Update `dialog_uebersicht.md` with all dialogue trees, quest triggers, items, and BandMood deltas
6. If the scene uses shared décor, add a variant to `SceneEnvironmentSetpieces.tsx`

Verify: `pnpm run lint && pnpm run test && pnpm run build`, then manually load the scene and confirm floor, player spawn, and ambient audio work.

## New Feature

1. **Design**: Identify what state changes are needed, which files to modify
2. **State**: Add mutators to `useStore` in `src/store.ts`. Update persistence config if adding persisted fields.
3. **UI/Scene**: Wire up the feature in the relevant scene or component
4. **Test**: Add unit tests for new mutators
5. **Docs**: Update `dialog_uebersicht.md` if the feature involves dialogue, quests, items, or BandMood

Commit: `feat(scope): short description`

## Refactor

1. **Pin**: Write tests that capture current behavior before changing structure
2. **Refactor**: Small, focused commits. Each commit passes lint + tests.
3. **Verify**: Full test suite + build

Commit: `refactor(scope): short description`

## Performance Fix

1. **Profile**: Use DevTools to identify the bottleneck
2. **Fix**: Add cleanup in `useEffect` returns, debounce expensive operations, remove unnecessary re-renders
3. **Validate**: Confirm the improvement

Common leaks in this codebase:

- `setInterval` in scenes not cleared on unmount (scenes fully remount on transition)
- Audio nodes not stopped on scene change
- Event listeners not removed in cleanup

## PR Body Template

```
type(scope): short description

**Motivation**: One sentence explaining why.

**Changes**:
- `src/store.ts`: reason
- `src/components/scenes/Foo.tsx`: reason

**Verification**:
- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`
- Manual: [steps to verify the fix/feature]

**Risks**: [low/medium — brief assessment]
```

## Verification Checklist

Run before every PR:

```bash
pnpm run lint          # tsc --noEmit (no eslint)
pnpm run test          # Vitest
pnpm run build         # Production build
```

Code-level checks:

- [ ] No direct state mutation (use `set()` with spread)
- [ ] New mutators added to `useStore` when state behavior changes
- [ ] Numbers clamped (bandMood via `increaseBandMood()`, not manual `set()`)
- [ ] `dialog_uebersicht.md` updated if dialogue/quests/items changed
- [ ] Timers and listeners cleaned up on unmount
- [ ] New flags added to `Flag` union and `initialState.flags` before use
- [ ] Recipe uses `ingredients: [string, string]` (not `item1`/`item2`)
- [ ] `onInteract` callbacks read state via `useStore.getState()` (not stale closure)

## Repro Template (for issues/PRs)

```
Environment: node/pnpm versions, OS, branch
Steps: 1) open scene X  2) perform Y  3) observe Z
Expected: concise
Actual: concise
Minimal reproduction: test or snippet
```

## PR Size

Prefer PRs under ~300 LOC for faster review. Split large changes into multiple small PRs.
