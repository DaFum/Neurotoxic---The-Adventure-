# store — Agent Instructions

Zustand store containing the entire game state. Organized into 5 slices (coreSlice, inventorySlice, questSlice, dialogueSlice, loreSlice) plus types and initial state.

## Key Files

- `types.ts` — GameState interface, Scene union (7 scenes), Flag union (100+ flags), QuestStatus, Quest, Trait, Skills, LoreEntry, Dialogue, DialogueOption
- `initialState.ts` — Default state values, ITEM_PICKUP_LIMITS, RECIPES for item combining
- `../store.ts` — Zustand store setup, persistence wiring, and migration / backward-compatibility logic (including custom `persist.merge()` behavior)
- `slices/*.ts` — Slice factories for state mutation (each exports a creator function)

## Persistence

Only these 9 fields persist to localStorage (via Zustand's `persist` middleware):
- `inventory`, `itemPickupCounts`, `flags`, `quests`, `bandMood`, `bandMoodGainClaims`, `loreEntries`, `trait`, `skills`

Non-persisted fields reset on reload: `scene`, `playerPos`, `dialogue`, `isPaused`, `cameraShake`.

Custom `merge()` function handles backward compatibility — adding new quests or lore entries to initialState won't wipe saved player data.

## Flags

All flags must be declared in the `Flag` union in `types.ts`. TypeScript enforces this at compile time when calling `setFlag()` or any mutation using a flag name. Unknown flag strings will be type errors.

Flag names are immutable after first use — changing or removing a flag from the union can break existing saves. Always add new flags; never remove.

## Gotchas

- `bandMoodGainClaims` deduplicates positive BandMood increases — passing the same `sourceId` twice prevents farming infinite mood points. Pass a unique, stable ID for each dialogue reward.
- `itemPickupCounts` enforces per-item limits (defined in `ITEM_PICKUP_LIMITS`). Always check the boolean return value of `addToInventory()` before granting rewards.
- `ITEM_PICKUP_LIMITS` has global defaults (1 per item) and exceptions for specific items (Bier: 2, Lötkolben: 3, Schrottmetall: 2, Frequenzfragment: 2, Dunkle Materie: Infinity).
- `RECIPES` in `initialState.ts` automatically handles both orderings (A, B) and (B, A) — simply add new recipes to the array.
- `setScene()` always resets `playerPos` to `[0, 1, 0]` — every scene must have a valid spawn point there.
