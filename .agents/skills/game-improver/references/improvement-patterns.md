# Improvement Patterns & Quick Templates

Purpose: small, repeatable patterns for common changes (bug fix, feature, perf, refactor) aligned to the Neurotoxic codebase (Zustand `useStore`).

## Pattern A — Bug fix (logic error)

When: deterministic wrong result, crash, or regression.

Steps:
1. Reproduce and write a minimal failing unit test (add to `src/*.test.ts`).
2. Locate source-of-truth (`src/store.ts` `useStore`, utils, hooks, scene handlers).
3. Make the minimal change (update `useStore` mutator or a pure util) and run tests.
4. Add integration test if the bug spans modules.
5. PR with verification steps and risk note.

PR template snippet:

```
fix(<area>): <short summary>

Motivation: one line

Changes:
- file A: reason
- file B: reason

Tests:
- Added unit test X
```

## Pattern B — Small feature / behavior addition

When: add one UX affordance, a small upgrade, or an HQ item.

Steps:
1. Design minimal data model addition (data file + TypeScript type).
2. Implement state changes by adding/updating `useStore` mutator functions in `src/store.ts`.
3. Add unit tests for the new behavior and update `partialize`/`merge` in the persist config if the persisted shape changes.
4. Add i18n keys for `en` and `de` if user-visible.

PR summary guidance: include a short game-design rationale and test cases.

## Pattern C — Performance regression fix

When: memory leak, FPS drop, or excessive allocations.

Steps:
1. Profile to identify the root cause (DevTools, heap snapshots).
2. Confirm leak path (e.g., Pixi app not destroyed, event listeners retained, AudioContext nodes persistent).
3. Add cleanup in `useEffect` returns and validate with memory snapshots.
4. Add a smoke test or integration test where possible to prevent regressions.

## Pattern D — Refactor (behavior-preserving)

When: reduce complexity, extract component, or move logic to hooks.

Steps:
1. Prepare unit tests that pin behavior before refactor.
2. Apply extract/inline changes in small commits.
3. Run full test suite and build.

PR description: explain why refactor is needed and list the behavior-preserving tests.

---

## Quick PR size guidance

- Prefer PRs under ~300 LOC for faster review; split large changes into multiple small PRs.

## Example test scaffold (Vitest)

```ts
import { describe, it, expect } from 'vitest'
import { useStore } from '@/store'

describe('combineItems', () => {
  it('removes both input items when recipe matches', () => {
    // Setup a minimal store state
    useStore.setState({ inventory: ['A', 'B'] })
    const result = useStore.getState().combineItems('A', 'B')
    expect(result).toBe(true)
    expect(useStore.getState().inventory).not.toContain('A')
    expect(useStore.getState().inventory).not.toContain('B')
  })
})
```

Run the example test with Vitest via pnpm:

```bash
pnpm run test -- src/store.test.ts
```
