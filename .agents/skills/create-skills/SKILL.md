---
name: create-skills
description: '**WORKFLOW SKILL** — Produce a reusable SKILL.md from a conversation, PR, or code change. Outputs a conservative draft, concise clarifying questions, and runnable example prompts tailored to this repository.'
user-invocable: true
metadata:
  scope: user
  version: '0.2.0'
---

# create-skills

Short summary

- Generate a safe, discoverable `SKILL.md` from a conversation, issue, or PR. The agent extracts the step-by-step workflow, decision points, inputs/outputs, and success criteria; surfaces ambiguous items as clarifying questions; and emits 3–5 runnable example prompts. Drafts are conservative and require explicit confirmation to write into the workspace unless `askConfirm=false` is provided.

When to use

- When a conversation, PR, or code change describes a repeatable multi-step workflow that should be reusable.
- When you want a clear checklist for contributors (e.g., adding scenes, wiring audio, updating dialogue trees) rather than ad-hoc instructions.

Inputs

- `conversation` (optional): text or highlighted excerpt to extract the workflow from. If omitted, agent scans recent chat context.
- `scope` (optional): `user` or `workspace` (default: `user`). Stored under `metadata.scope` in drafts.
- `skillName` (optional): short, hyphenated name for the skill (default: `create-skills`).
- `targetPath` (optional): explicit path to write the SKILL.md instead of the default.
- `askConfirm` (optional, default true): if true, present the draft and request confirmation before writing.
- `draftOnly` / `toPrompt` (optional): return a draft only, or generate a `.prompt.md` instead of a full SKILL.

Outputs

- A conservative `SKILL.md` draft (shown inline). If confirmed, writes to the chosen path:
  - workspace: `.agents/skills/<skillName>/SKILL.md`
  - user prompt: VS Code prompts folder as `<skillName>.prompt.md` when `toPrompt=true`.
- A short list of clarifying questions for ambiguous or missing parts.
- 3–5 runnable example prompts tailored to the repository.

Process (detailed)

1. Gather context: use the provided `conversation` or read recent chat context and referenced files (e.g., `dialog_uebersicht.md`, `src/store.ts`, `audio.ts`).
2. Extract the workflow: enumerate ordered steps, actors, side effects, required files, inputs/outputs, and decision points.
3. Identify quality checks and completion criteria that define "done" for the workflow.
4. Draft `SKILL.md` using the template below and place any ambiguity in `Clarifying questions`.
5. Validate frontmatter keys against supported skill fields (allowed: `name`, `description`, `user-invocable`, `argument-hint`, `compatibility`, `disable-model-invocation`, `license`, `metadata`).
6. Show the draft if `askConfirm=true` or `draftOnly=true`.
7. If the user confirms, write the file via `apply_patch`; otherwise iterate.
8. Offer next steps: create a feature branch, commit, and open a PR with the new skill.

Decision points & branching

- Multi-step workflows → full `SKILL.md` with steps, branching logic, and example prompts.
- Single-step templates → recommend a `.prompt.md` and offer to create it.
- Team-wide changes or CI hooks → prefer `workspace` scope and recommend adding documentation to `AGENTS.md`.

Quality criteria / completion checks

- Frontmatter: `name` and `description` present; `user-invocable: true` when intended for direct invocation.
- `metadata` for non-standard fields like `scope` and `version`.
- `description` includes trigger phrases (e.g., "Use when:") for discoverability.
- Process lists steps, decision points, and explicit success criteria.
- Examples: 3 runnable prompts with consistent parameter naming (camelCase by default).
- Safety: draft is not written automatically unless confirmation disabled.
- YAML: no tabs, quote values that include colons.

Frontmatter example

```yaml
---
name: create-skills
description: 'Use when: convert a conversation or PR into a reusable SKILL.md'
user-invocable: true
metadata:
  scope: user
  version: '0.2.0'
tags:
  - skills
  - workflow
---
```

SKILL.md template (canonical)

```text
---
name: {{skillName}}
description: "Use when: concise trigger phrases that enable discovery"
user-invocable: true
metadata:
  scope: {{user|workspace}}
  version: "0.1.0"
---

# Short summary

# When to use

# Inputs

# Outputs

# Process

# Decision points

# Example prompts

# Clarifying questions

```

Example prompts (Neurotoxic-tailored)

- Scaffold a new scene (includes the 5 required wiring steps):
  - `/create-skills action=createScene scope=workspace skillName=add-void-station sceneName=VoidStationExtended askConfirm=true`

  Returns: a draft `SKILL.md` (text), suggested file list (files to create), a completion checklist, and a recommended branch name.

- Propose dialogue / quest changes for review:
  - `/create-skills action=updateDialogue scope=workspace skillName=update-dialogue target=dialog_uebersicht.md askConfirm=true`

  Returns: suggested dialogue edits (inline), affected dialog entries to update, clarifying questions, and a draft patch or instructions to apply.

- Diagnose inventory/quest bug and suggest minimal code edits:
  - `/create-skills action=diagnoseBug scope=workspace skillName=inventory-quest-diagnostics branch=fix-quest-inventory-bugs-3736012791563995728`

  Returns: reproduction steps, likely root causes (e.g., store persistence, combineItems ordering), minimal code-edit suggestions or diff snippets, and test ideas.

- Create a single-step prompt (no multi-step workflow):
  - `/create-skills toPrompt=true skillName=add-audio-track reason="single-step: add ambient audio" example="Add ambient track 'amb_void' to audio.ts"`

  Returns: the `.prompt.md` content ready to save.

- Show draft only (no writes):
  - `/create-skills draftOnly=true skillName=review-scene-wiring`

  Returns: draft `SKILL.md` content and clarifying questions; no files written.

Neurotoxic checklist & gotchas (embedded guidance)

- Adding a new scene — required steps:
  1. Create `src/components/scenes/<SceneName>.tsx` (physics bodies must live inside the component).
  2. Add the scene key to the `Scene` union in `src/store.ts`.
  3. Import and wire the scene in `src/components/Game.tsx` (scene switch + camera).
  4. Add ambient track handling in `audio.ts` `startAmbient()`.
  5. Update `dialog_uebersicht.md` with dialogues, quest triggers, and BandMood metrics.

- Repository gotchas to surface in drafts:
  - `@/` alias resolves to project root (not `src/`).
  - `requiredSkill` must be an object `{ name: 'skill', level: N }`.
  - All physics bodies must be declared inside scene components (inside `<Physics>`).

Clarifying questions the generated SKILL should ask

- Scope: `workspace` or `user`?
- Preferred `skillName` (short, hyphenated)?
- Should I write the file now or show the draft first?
- Do you want example prompts included? If so, which 3 invocations?

Implementation notes for agents

- Use a read-only subagent to scan the repo for examples or matching patterns before drafting.
- Validate frontmatter keys against the supported list and move non-standard fields into `metadata`.
- Present the draft and only call `apply_patch` to write files when confirmed (or when `askConfirm=false`).
- When writing, return the path written and suggest next steps (create branch, commit, PR).

Next steps (suggested)

- Review the draft shown by the agent and confirm writing.
- Optionally: create a branch and open a PR with the new `SKILL.md` and related `.prompt.md`.
- Register the skill in `AGENTS.md` by adding a short entry linking to `.agents/skills/<skillName>/SKILL.md` so teammates can discover it.

ChangeLog

- 0.2.0 — reorganized content, stricter frontmatter, standardized parameter naming (camelCase), added Neurotoxic examples and checklist.
