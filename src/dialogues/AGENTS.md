# dialogues — Agent Instructions

Dialogue builder functions live here. Each file exports one or more `build[Scene][Npc]Dialogue()` factory functions that return a `Dialogue` object by reading current store state via `game()`.

**Note:** Scene-specific subdirectories (e.g., `proberaum/`, `tourbus/`) inherit guidelines from this file and don't require separate AGENTS.md unless they introduce novel domain rules.

## Gotchas

- `addToInventory(item)` returns `boolean` — always branch on the result. Quest completions, flag sets, and mood/skill rewards must be inside the `if (received)` block; the `else` branch must give explicit failure feedback. Unconditional completions after a failed pickup are a bug. Note: in the current store implementation, it returns `false` when the relevant per-item pickup limit is reached (see `ITEM_PICKUP_LIMITS` in `src/store/initialState.ts`).
  - _Exception:_ Essential quest clues or narrative progression flags (e.g., `bassist_clue_matze` in `proberaum/matze.ts`) must be granted unconditionally outside the `if (received)` block to avoid softlocking players who hit the pickup limit.
- Always call `game()` fresh inside each `action()` callback — never capture the builder-scope reference in a closure, as it will be stale by the time the action fires.
- If an option sets both `nextDialogue` and calls `setDialogue()` inside `action()`, `nextDialogue` wins and silently overwrites the action's dialogue. Use one or the other per option.
- Use `completeQuestWithFlag(id, flag, ...)` and `startQuestWithFlag(id, text, flag)` instead of paired `completeQuest` + `setFlag` (or `addQuest` + `setFlag`) calls — separate Zustand writes leave a window where subscribers observe inconsistent state.
- Completing a sub-quest (e.g. `'beer'`) does **not** auto-complete a parent quest — call `completeQuest(parentId)` explicitly where needed.
- Nested sub-menus built with `game().setDialogue({...})` must include a `'Zurück.'` option that calls `game().setDialogue(buildThisDialogue())` so the player can navigate back.
- New flags must be added to the `Flag` union in `src/store/types.ts` before use — TypeScript enforces this at compile time.
- Update `dialog_uebersicht.md` when changing any builder that touches dialogue text, quest triggers, item interactions, or BandMood deltas.
