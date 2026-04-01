# dialogues — Agent Instructions

Dialogue builder functions live here. Each file exports one or more `build[Scene][Npc]Dialogue()` factory functions that return a `Dialogue` object by reading current store state via `game()`.

## Repo Policy
All subdirectories that introduce new architectural concepts or domain rules must contain an `AGENTS.md` file.

## Capabilities
- Read and mutate the global game state using the `useStore` hook or the `game()` helper.
- Update UI elements implicitly by mutating state (e.g., setting the active dialogue or scene).
- Combine items and manage inventory constraints.
- Complete, fail, or progress quests while keeping story flags in sync.

## Responsibilities
- **Never** add unverified generic flags or quest IDs without adding them to the `Flag` union or checking `dialog_uebersicht.md`.
- **Never** bypass inventory limits; always check the boolean result of `addToInventory(item)` before granting rewards.
- Ensure all dialogue branches use atomic helpers to prevent transient state desynchronization.
- Maintain accurate documentation in `dialog_uebersicht.md` for any changes made to quests, dialogue trees, or item spawns.

## Interfaces
- **State Mutators:** Use `game()` (or `useStore.getState()`) to read/write state.
- **Inventory:** `addToInventory(item: string): boolean` adds an item and returns false if the per-item limit is reached. Limits are persisted via `itemPickupCounts`.
- **Quests & Flags:** `completeQuestWithFlag(id: string, flag: Flag, flagValue?: boolean, text?: string)` and `startQuestWithFlag(id: string, text: string, flag: Flag, flagValue?: boolean)` atomically update quests and their associated boolean flag.
- **Flags:** All flags must be part of the `Flag` union in `store.ts`.

## Gotchas

- `addToInventory(item)` returns `boolean` — always branch on the result. Quest completions, flag sets, and mood/skill rewards must be inside the `if (received)` block; the `else` branch must give explicit failure feedback (e.g. inventory-full message). Unconditional completions after a failed pickup are a bug. Note: returns `false` both for a full inventory **and** for per-item pickup limits (see `ITEM_PICKUP_LIMITS` in store.ts).
  - *Exception:* Essential quest clues or narrative progression flags (e.g., `bassist_clue_matze` in `proberaum/matze.ts`) must be granted unconditionally outside the `if (received)` block to avoid softlocking players who hit the pickup limit.
- Always call `game()` fresh inside each `action()` callback — never capture the builder-scope reference in a closure, as it will be stale by the time the action fires.
- If an option sets both `nextDialogue` and calls `setDialogue()` inside `action()`, `nextDialogue` wins and silently overwrites the action's dialogue. Use one or the other per option.
- Use `completeQuestWithFlag(id, flag, ...)` and `startQuestWithFlag(id, text, flag)` instead of paired `completeQuest` + `setFlag` (or `addQuest` + `setFlag`) calls — separate Zustand writes leave a window where subscribers observe inconsistent state.
- Completing a sub-quest (e.g. `'beer'`) does **not** auto-complete a parent quest — call `completeQuest(parentId)` explicitly where needed.
- Nested sub-menus built inline with `game().setDialogue({...})` must include a `'Zurück.'` option that calls `game().setDialogue(buildThisDialogue())` so the player can navigate back.
- New flags used in builder `action` callbacks must be added to the `Flag` union in `src/store.ts` before use — TypeScript enforces this at compile time.
- Update `dialog_uebersicht.md` when changing any builder that touches dialogue text, quest triggers, item interactions, or BandMood deltas.
