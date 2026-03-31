# Workflow Templates

Repeatable patterns for common changes in Neurotoxic.

## Bug Fix

1. **Reproduce**: Write a failing test in `src/store.test.ts` or `src/dialogueEngine.test.ts`
2. **Locate**: Identify the source of truth — usually `src/store.ts`, a scene file, or `src/audio.ts`
3. **Fix**: Make the minimal change. If state bug: fix the mutator. If scene bug: fix the handler.
4. **Test**: Failing test now passes, full suite still green
5. **Verify**: `pnpm run lint && pnpm run test && pnpm run build`

Commit: `fix(scope): short description`

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
- [ ] Numbers clamped (bandMood in [0, 100])
- [ ] `dialog_uebersicht.md` updated if dialogue/quests/items changed
- [ ] Timers and listeners cleaned up on unmount
- [ ] New flags added to `Flag` union before use

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
