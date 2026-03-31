# Implementation Standards

Purpose: concrete coding, testing, and PR standards contributors must follow when implementing fixes or small features for Neurotoxic.

## Core rules

- Use explicit mutator functions on `useStore` inside `src/store.ts` for state changes — keep the data flow centralized in `useStore`.
- No direct state mutations: prefer immutable updates when using `set(...)` or updater callbacks inside `useStore`.
- Keep changes small and focused: a single behavioral change per PR when possible.
- Add or update unit tests for any behavior change; tests are the source of truth for regressions.
 - If the change affects persisted fields, update the `partialize`/`merge` logic in `src/store.ts` and include migration code if required.

## Commit & PR conventions

- Commit message: `type(scope): short summary` — e.g., `fix(inventory): ensure items removed when consumed`
- Conventional types: `feat`, `fix`, `refactor`, `test`, `chore`.
- Branch naming: `fix/<short>-<ticket>` or `feat/<short>-<ticket>`.
- PR body must include: Motivation, Changes, Verification steps, Risks & rollback.

## Import / file conventions

- Preserve existing import ordering (external libs first, then internal aliases `@/`).
- Keep file extensions aligned to content: `.tsx` for React components, `.ts` for logic and hooks.
- Place physics bodies inside scene files under `src/components/scenes/*` and inside `<Physics>`.

## TypeScript / React best practices

- Prefer explicit types for mutator arguments and `unknown` guards when parsing external inputs.
- Use `useStore.getState()` inside callbacks to avoid stale closure capture; prefer invoking `useStore` selectors for renders.
- Avoid heavy computations on render; use `useMemo`/`useCallback` and memoized selectors.

## Testing standards

- Unit tests: cover `useStore` mutator functions, utilities, and pure functions.
- Component tests: render, props, accessibility attributes, cleanup of effects.
- Integration tests: critical state transitions across hooks/components (exercise `useStore` flows).
- Add flakiness guard: if a test depends on timing, wrap with `await waitFor()` and increase timeouts conservatively.

## Performance & resource hygiene

- Destroy Pixi apps on unmount: `app.destroy({ removeView: true }, { children: true, texture: true })`.
- Remove event listeners and audio nodes on cleanup.
- Avoid per-frame heap allocations; reuse objects where possible.

## Small PR checklist

- [ ] Tests updated / added
- [ ] Lint clean (`pnpm run lint`)
- [ ] Build succeeds (`pnpm run build`)
- [ ] Manual smoke verification included in PR

## Example PR summary (short)

```
fix(inventory): remove consumed items when combining

Motivation: Combining items left consumed items still present, confusing players.

Changes:
- src/store.ts: ensure `removeFromInventory()` called when recipe matches
- src/store.test.ts: add test for combineItems removal

Verification:
- pnpm run test -- src/store.test.ts
- Manual: Open scene X, combine A+B, verify inventory updated

Risks: low — localized change
```
