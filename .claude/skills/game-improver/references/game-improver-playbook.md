# Game Improver Playbook

Purpose: a concise, repeatable playbook for diagnosing, fixing, and delivering small-to-medium scoped changes in the Neurotoxic repo that follow `.agents/skills/game-improver/SKILL.md` conventions.

---

## Quick flow (5 steps)

1. Reproduce: create the smallest reproduction steps and a minimal failing test when possible.
2. Diagnose: locate the source-of-truth files and enumerate side-effects and invariants to preserve.
3. Patch: implement the minimal change with a test, follow repo conventions (state, scenes, audio).
4. Verify: run lint, unit tests, build, and a short manual smoke test for the affected flow.
5. Ship: open a PR with a clear summary, verification steps, and a short rollback note.

---

## Repro template (fill and attach to issue/PR)

- Environment: `node`/`pnpm` versions, OS, branch name
- Steps to reproduce: 1) open scene X 2) perform Y 3) observe Z
- Expected behavior: concise
- Actual behavior: concise
- Minimal reproduction: path to test or snippet
- Logs / stack traces: paste relevant console/traces

---

## Triage scoring (quick)

- High: Crash, data loss, inability to progress — require human review and quick patch.
- Medium: Incorrect calculation, broken audio/visual element — safe to produce focused fix + tests.
- Low: Cosmetic or content-only changes — follow normal PR review.

---

## PR summary template

Title: `fix(inventory): <short description>` or `feat(scene): <short description>`

Body:

- **Motivation**: one-sentence reason
- **Changes**: bullet list of touched files
- **Verification**: commands + manual steps (exact steps to verify)
- **Notes / Risks**: brief risk assessment and rollback steps

Checklist:

- [ ] `pnpm run lint` passes
- [ ] `pnpm run test` passes (new tests added)
- [ ] `pnpm run build` succeeds
- [ ] Manual smoke: reproduce scenario and verify fix

---

## Minimal commands (local)

```bash
pnpm install
pnpm run lint
pnpm run test -- src/store.test.ts
pnpm run build
```

---

## Example: inventory/quest bug workflow

1. Reproduce bug locally and write a failing unit test in `src/store.test.ts` or a new test file.
2. Inspect `src/store.ts`, `dialog_uebersicht.md`, and scene handlers that modify inventory/quests.
3. Implement minimal fix (explicit `removeFromInventory()` when consuming items), add unit test.
4. Run `pnpm run lint && pnpm run test` and manual verify the most common play path.
5. Open PR with template above and request review from maintainers.

---

## When to escalate

- Escalate to maintainers for changes that affect the core loop, data migrations, or persistence format changes.
- For audio, if uncertain about autoplay/context behavior across browsers, consult the `audio-debugger-ambient-vs-gig` specialist.

---

Keep this playbook minimal: prefer reproducible tests and small patches that are easy to reason about in review.
