# Verification Checklist

Purpose: short, actionable pre-merge checks and quick fixes for common failures.

## Quick commands

```bash
pnpm install
pnpm run lint
pnpm run test  # run UI tests separately if your project provides them
pnpm run build
```

## Pre-merge checks (required)

- [ ] Lint passes: `pnpm run lint`
- [ ] Unit tests pass: `pnpm run test`
- [ ] UI tests pass (if affected) — run the project's UI test command if available
- [ ] Build succeeds: `pnpm run build`
- [ ] Manual smoke for affected path (steps in PR)

## Code-level checks

- [ ] No direct state mutation
- [ ] New `useStore` mutator functions added/updated in `src/store.ts` when state behavior changes
- [ ] Numbers clamped (`bandMood ∈ [0,100]`; any new bounded numeric fields use the same `Math.max`/`Math.min` pattern)
- [ ] i18n keys added for `en` and `de` for new user strings
- [ ] Pixi and audio resources cleaned on unmount

## Common failure fixes

- Lint `unused import`: remove import or use it in test scaffolding.
- Test flaky: wrap assertions in `await waitFor()` and reduce reliance on timers.
- Build error: check import path and file extension, ensure export default vs named.
- Memory leak: ensure `app.destroy()` and effect cleanup functions exist.

## When to block the merge

- Core loop regression or data corruption risk
- Failing critical e2e test
- Persistent memory leak in smoke test

Keep this checklist short and add the verification commands to the PR for reviewer convenience.
