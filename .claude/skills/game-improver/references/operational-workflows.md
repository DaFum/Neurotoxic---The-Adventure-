# Operational Workflows

Purpose: a compact set of workflows for taking a reported issue or enhancement from intake through verified release.

## Intake & Triage

1. Reproduce or validate the report by running the minimal steps.
2. Capture reproduction artifact (test case, console log, screenshot).
3. Assign severity and expected effort (trivial/medium/complex).
4. If trivial/medium, proceed with `game-improver`; if complex, assign to an expert or create a design ticket.

## Assigning & Delegation

- `game-improver` handles most state/scene/audio fixes and small features.
- Delegate to specialized skills for deep audio, memory, or balance work (list at bottom).

## Implementation flow

1. Branch from the appropriate base (feature/fix branch naming).
2. Add a failing unit test that captures the bug when possible.
3. Implement minimal patched code; update `useStore` mutator functions in `src/store.ts` if state changes.
4. Run `pnpm run lint && pnpm run test`; iterate until green.
5. Add manual verification steps to the PR and request review.

## Review & Merge

- Use focused reviews: reviewers should validate the reproduction, the fix, tests, and smoke steps.
- For UX-impacting changes, include a short video/gif or step-by-step manual test.

## Release & Rollback

1. Merge once CI checks pass.
2. If risk is medium-high, release to a staging channel first and perform smoke runs.
3. If regression appears after release, revert the PR and open a follow-up patch.

## Specialist mapping (quick)

- `audio-debugger-ambient-vs-gig`: ambiguous audio lifecycle or autoplay issues
- `webaudio-reliability-fixer`: cross-browser audio inconsistencies
- `pixi-lifecycle-memory-leak-sentinel`: Pixi leaks and graphics resource problems
- `state-safety-action-creator-guard`: complex reducer/state invariants
- `game-balancing-assistant`: deep balance or progression curve changes

---

Keep records of the reproduction and any temporary debugging fixtures in the PR description so reviewers can reproduce easily.
