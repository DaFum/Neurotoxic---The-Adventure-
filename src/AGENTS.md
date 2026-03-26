# src — Agent Instructions

## Store (`store.ts`)
- `setScene()` always resets `playerPos` to `[0, 1, 0]` — every scene must work with this spawn point
- `combineItems()` checks both orderings (A,B) and (B,A) — add new recipes to the existing switch block
- `addQuest()` replaces any existing quest with the same ID (deduplication) — safe to call repeatedly
- `discoverLore()` is idempotent — calling it twice on the same ID is safe
- Persistence uses a custom merge in `onRehydrateStorage` that preserves player progress when new quests/lore are added to code. Adding new initial quests or loreEntries won't wipe saved data.
- Only these fields persist to localStorage: `scene`, `inventory`, `flags`, `playerPos`, `quests`, `bandMood`, `loreEntries`, `trait`, `skills`. `dialogue`, `isPaused`, and `cameraShake` are NOT persisted.

## Audio (`audio.ts`)
- All sound methods call `init()` internally — no need to initialize AudioContext before playing
- Ambient tracks loop on a `setInterval` — `startAmbient(sceneName)` and `stopAmbient()` manage the lifecycle
- `setTempo()` restarts the music loop if currently playing — don't call it in a tight loop or bandMood will cause audio stuttering
