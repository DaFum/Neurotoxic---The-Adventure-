# src — Agent Instructions

## Store (`store.ts`)

- `setScene()` always resets `playerPos` to `[0, 1, 0]` — every scene must work with this spawn point
- `addToInventory(item)` returns `false` only when the item has hit its per-item pickup limit (e.g. `Bier: 2`, `Frequenzfragment: 2` — see `ITEM_PICKUP_LIMITS` in store/initialState.ts). The limit is per-playthrough and persists across saves via `itemPickupCounts`.
- `increaseBandMood(amount, sourceId?)` deduplicates positive increases explicitly — a second call with the same `sourceId` is silently skipped. Omitting `sourceId` entirely bypasses deduplication, allowing infinite repeated gains (which may be intended for certain interactions but should generally be avoided). Always pass a stable `sourceId` string for narrative dialogue rewards to prevent infinite mood farming.
- `combineItems()` checks both orderings (A,B) and (B,A) — add new recipes to the `RECIPES` array defined in store/initialState.ts
- `discoverLore()` is idempotent — calling it twice on the same ID is safe
- Persistence uses a custom merge in `onRehydrateStorage` that preserves player progress when new quests/lore are added to code. Adding new initial quests or loreEntries won't wipe saved data.
- Persistence merge data comes from localStorage and must be bounded: validate dynamic quest shape and enforce limits on added quest count and text/ID length before merging.
- Only these fields persist to localStorage: `inventory`, `flags`, `quests`, `bandMood`, `loreEntries`, `trait`, `skills`, `itemPickupCounts`, `bandMoodGainClaims`. `scene`, `playerPos`, `dialogue`, `isPaused`, and `cameraShake` are NOT persisted.

### Quest API

- `addQuest(id, text)` — if a quest with that id already exists, updates its display text while preserving its current status. Never reopens a completed quest. For scene-entry objectives call it inside a mount `useEffect(() => { addQuest(...); }, [])`.
- `startQuestWithFlag(id, text, flag, flagValue?)` — atomic helper that adds/updates a quest and sets a boolean flag in one step, guaranteeing they stay in sync. Sets status to `active` for new or `failed` quests; preserves `completed` status (only updates the text).
- `startAndFinishQuest(id, text)` — records a milestone as completed in one step. If the quest already exists as 'active', transitions it to 'completed'. No-op if already completed or failed. Safe to call regardless of whether the quest was previously registered. Use for one-shot events (band meeting, fan movement, bassist contact, etc.).
- `completeQuest(id, text?)` — call this when resolving a quest. If the quest is not registered, it will auto-register and complete it if `text` is provided, otherwise it logs a warning via `console.warn` and returns the state unmodified.
- `completeQuestWithFlag(id, flag, flagValue?, text?)` — atomic helper that completes a quest and sets a boolean flag in one step. Accepts optional `text` to auto-register missing quests. If the quest is unregistered and no `text` is provided, it logs a warning via `console.warn` and skips only the quest update; it still applies the provided flag change if that would modify the current flag value, so this case is not a pure no-op.
- `failQuest(id, text?)` — marks a quest failed; appears with strikethrough in the journal. Works identically to `completeQuest` regarding unregistered quests (logs a warning via `console.warn` if no text is provided).
- Quest entries have `status: QuestStatus` (`'active' | 'completed' | 'failed'`) — not `completed: boolean`. Read with `q.status === 'completed'`, not `q.completed`.

### Flags

- All known flags are enumerated in the `Flag` union type in `store/types.ts`. `setFlag()` only accepts `Flag` values — TypeScript will catch unknown flag names at compile time.
- Before using a new flag, add it to the `Flag` union in `store/types.ts`. Using an unlisted string will be a type error.

### Dialogue Engine (`dialogueEngine.ts`)

- `executeDialogueOption(option)` — runs the full pipeline. The strict execution order is: 1) requirement check 2) consume items (`option.consumeItems`) 3) apply declarative flag/quest effects 4) execute custom `action()` 5) navigation (`nextDialogue`). This ensures `action()` callbacks always read the up-to-date post-consumption state.
- `canSelectOption(option)` — pure requirement check evaluating traits, skills, `questDependencies`, `requiredFlags`, `forbiddenFlags`, and `requiredItems` (which correctly handles multiple quantities based on the current inventory state). Returns bool. Used by UI to compute locked state.

## Audio (`audio.ts`)

- All sound methods call `init()` internally — no need to initialize AudioContext before playing
- Ambient tracks loop on a `setInterval` — `startAmbient(sceneName)` and `stopAmbient()` manage the lifecycle
- `setTempo()` restarts the music loop if currently playing — don't call it in a tight loop or bandMood will cause audio stuttering
