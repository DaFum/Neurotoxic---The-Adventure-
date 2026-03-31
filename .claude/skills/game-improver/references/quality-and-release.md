# Quality & Release — Quick Guide

Purpose: concise release guidance and templates for PRs and release notes.

## Pre-merge checks

- `pnpm run lint`
- `pnpm run test` (unit + integration)
- `pnpm run build`
- Manual smoke of the affected path

Include these checks in the PR description and mark them off before merging.

## Release Notes Template

Title: `<release/PR short title>`

Summary: one paragraph describing the player-visible change.

Files changed: bullet list

Player impact & verification:

- What players will notice
- How to test the change (manual steps)

Risks & rollback:

- Risk level (low/medium/high)
- Rollback command or commit to revert

## Staging & Canary

- For medium-risk changes, merge to a staging branch and run a 24h smoke/playtest.
- Record any telemetry regressions and hold before full release.

## Hotfix process

1. Branch from `main` (or the production tag) as `hotfix/<short>`.
2. Apply minimal fix, add tests if possible.
3. Run the full verification suite and merge directly to `main` with `fix:` commit.

## Rollback quick steps

```bash
# Revert the merge commit
git revert <merge-commit-sha>
git push origin HEAD:main
```

Add a follow-up PR to re-implement the fix after root-cause analysis.
