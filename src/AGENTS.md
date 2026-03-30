# src — Agent Instructions

## Store (`store.ts`)
- `setScene()` always resets `playerPos` to `[0, 1, 0]` — every scene must work with this spawn point
- `combineItems()` checks both orderings (A,B) and (B,A) — add new recipes to the `RECIPES` array defined above the store
- `discoverLore()` is idempotent — calling it twice on the same ID is safe
- Persistence uses a custom merge in `onRehydrateStorage` that preserves player progress when new quests/lore are added to code. Adding new initial quests or loreEntries won't wipe saved data.
- Only these fields persist to localStorage: `inventory`, `flags`, `quests`, `bandMood`, `loreEntries`, `trait`, `skills`. `scene`, `playerPos`, `dialogue`, `isPaused`, and `cameraShake` are NOT persisted.

### Quest API

- `addQuest(id, text)` — if a quest with that id already exists, updates its display text while preserving its current status. Never reopens a completed quest. For scene-entry objectives call it inside a mount `useEffect(() => { addQuest(...); }, [])`.
- `startAndFinishQuest(id, text)` — records a milestone as completed in one step. If the quest already exists as 'active', transitions it to 'completed'. No-op if already completed or failed. Safe to call regardless of whether the quest was previously registered. Use for one-shot events (band meeting, fan movement, bassist contact, etc.).
- `completeQuest(id)` — call this when resolving a quest. If other gameplay logic explicitly depends on a completion flag (e.g. gating dialogue or item visibility), update that flag in the same action. Do not rely on a flag alone to update the journal, or quest-log drift will occur. When no external logic reads the flag, rely solely on the quest status — two truth sources for the same fact cause drift in the opposite direction.
- `failQuest(id)` — marks a quest failed; appears with strikethrough in the journal.
- Quest entries have `status: QuestStatus` (`'active' | 'completed' | 'failed'`) — not `completed: boolean`. Read with `q.status === 'completed'`, not `q.completed`.

### Flags

- All known flags are enumerated in the `Flag` union type in `store.ts`. `setFlag()` only accepts `Flag` values — TypeScript will catch unknown flag names at compile time.
- Before using a new flag, add it to the `Flag` union in `store.ts`. Using an unlisted string will be a type error.

### Dialogue Engine (`dialogueEngine.ts`)

- `executeDialogueOption(option)` — runs the full pipeline (requirement check → action → flag/quest effects → navigation). Used by UI; do not replicate this logic in scene callbacks.
- `canSelectOption(option)` — pure requirement check (trait / skill / quest deps); returns bool. Used by UI to compute locked state.

## Audio (`audio.ts`)
- All sound methods call `init()` internally — no need to initialize AudioContext before playing
- Ambient tracks loop on a `setInterval` — `startAmbient(sceneName)` and `stopAmbient()` manage the lifecycle
- `setTempo()` restarts the music loop if currently playing — don't call it in a tight loop or bandMood will cause audio stuttering
