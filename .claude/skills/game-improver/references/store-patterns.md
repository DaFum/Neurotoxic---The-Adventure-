# Store Patterns

Real patterns for state changes in `src/store.ts`. The store uses Zustand with a flat state shape — no nested `player` object.

## State Shape (quick reference)

```
inventory: string[]                    # Held items
flags: Record<Flag, boolean>           # Boolean progress flags (100+)
quests: { id, text, status }[]         # Quest log (status: 'active' | 'completed' | 'failed')
bandMood: number                       # 0-100, affects music tempo and camera shake
loreEntries: LoreEntry[]               # Discovered lore
trait: Trait | null                    # Player's chosen trait
skills: { technical, social, chaos }   # Numeric skill levels
scene: Scene                           # Current scene (not persisted)
playerPos: [x, y, z]                   # Player position (not persisted)
dialogue: Dialogue | null              # Current dialogue box (not persisted)
isPaused: boolean                      # Pause state (not persisted)
cameraShake: number                    # Camera effect (not persisted)
```

Persisted to localStorage: `inventory`, `itemPickupCounts`, `flags`, `quests`, `bandMood`, `bandMoodGainClaims`, `loreEntries`, `trait`, `skills`

## Adding a New Mutator

Add to the `useStore` create function. Always use `set()` with immutable updates.

```ts
// Example: reset bandMood to a default
resetBandMood: () => set((state) => ({
  ...state,
  bandMood: 50,
})),
```

Test pattern:

```ts
import { describe, it, expect } from 'vitest';
import { useStore } from './store'; // relative import — test files use './store', not '@/src/store'

describe('resetBandMood', () => {
  it('resets bandMood to 50', () => {
    useStore.setState({ bandMood: 85 });
    useStore.getState().resetBandMood();
    expect(useStore.getState().bandMood).toBe(50);
  });
});
```

## Adding a Crafting Recipe

Recipes live in the `RECIPES` array defined above `useStore`. The Recipe type uses an `ingredients` tuple — **not** `item1`/`item2`.

```ts
// Recipe interface (from store.ts):
// interface Recipe {
//   ingredients: [string, string];
//   result: string;
//   flagToSet?: keyof typeof initialState.flags;  // optional: set a flag on craft
// }

// Add to RECIPES array — use the ingredients tuple:
{ ingredients: ['Neues Teil A', 'Neues Teil B'], result: 'Kombination' },

// With a flag set on craft:
{ ingredients: ['Defektes Kabel', 'Klebeband'], result: 'Repariertes Kabel', flagToSet: 'cableFixed' },
```

`combineItems()` checks both orderings automatically. It removes both inputs and adds the result — no separate `removeFromInventory()` needed for recipes.

Current recipes (for reference — read `src/store.ts` for the authoritative list):

```
'Defektes Kabel'     + 'Klebeband'         -> 'Repariertes Kabel'      (flagToSet: 'cableFixed')
'Setliste'           + 'Stift'             -> 'Signierte Setliste'
'Energiedrink'       + 'Kaffee'            -> 'Turbo-Koffein'
'Schrottmetall'      + 'Lötkolben'         -> 'Industrie-Talisman'
'Batterie'           + 'Lötkolben'         -> 'Plasma-Zünder'
'Turbo-Koffein'      + 'Rostiges Plektrum' -> 'Geister-Drink'
'Splitter der Leere' + 'Altes Plektrum'    -> 'Void-Plektrum'
'Frequenzfragment'   + 'Splitter der Leere'-> 'Resonanz-Kristall'
```

## Adding a New Flag

1. Add the name to the `Flag` union type in `src/store.ts`
2. Add it to `initialState.flags` with `false` as default
3. Use in scene code:

```ts
const flags = useStore((s) => s.flags);
const setFlag = useStore((s) => s.setFlag);

// Read
if (flags.new_flag_name) {
  /* ... */
}

// Write (inside dialogue action callback)
action: () => {
  setFlag('new_flag_name', true);
};
```

## Quest Patterns

The quest API is idempotent — safe to call multiple times.

```ts
// Register on scene mount (scene-entry quests only)
useEffect(() => {
  addQuest('quest_id', 'Quest description');
}, []);

// Complete when condition met (inside dialogue action)
action: () => {
  completeQuestWithFlag('quest_id', 'completion_flag');
};

// One-shot milestone (no prior registration needed)
startAndFinishQuest('milestone_id', 'Milestone text');

// Atomic quest start + flag in one call
startQuestWithFlag('quest_id', 'Quest text', 'associated_flag');

// Complete without a flag (quest was registered elsewhere)
completeQuest('quest_id');
```

Key: quest `status` is `'active' | 'completed' | 'failed'` — check with `q.status === 'completed'`, not `q.completed`.

## BandMood

Always use `increaseBandMood(delta)` for increments — it clamps to [0, 100] automatically.
Direct `set({ bandMood: value })` calls do **not** clamp and can produce invalid state.

```ts
// Safe — clamps automatically
increaseBandMood(15);
increaseBandMood(-10);

// Unsafe — no clamping, can go out of range
set({ bandMood: state.bandMood + 200 }); // ❌ will exceed 100
```

## Stale Closure Pattern

`onInteract` callbacks close over render-time values. If a callback reads from
destructured store state, it may see stale values after state updates.

```ts
// ❌ Stale — flags captured at render time, won't reflect updates
const { flags } = useStore.getState()
onInteract={() => {
  if (flags.questDone) { ... }  // may be stale
}}

// ✅ Fresh — reads latest state at call time
onInteract={() => {
  const { flags } = useStore.getState()
  if (flags.questDone) { ... }
}}
```

## Modifying Persisted State

If adding or removing a persisted field:

1. Update `partialize` in the `persist` config to include/exclude the field
2. Update `merge` in `onRehydrateStorage` to handle old saves missing the new field
3. Test with both fresh localStorage and existing saves

## Immutable Update Patterns

Always use immutable updates inside `set()`:

```ts
// Add to array
set((state) => ({ ...state, inventory: [...state.inventory, item] }));

// Remove from array
set((state) => ({ ...state, inventory: state.inventory.filter((i) => i !== item) }));

// Update item in array
set((state) => ({
  ...state,
  quests: state.quests.map((q) => (q.id === id ? { ...q, status: 'completed' } : q)),
}));

// Clamp number (when not using increaseBandMood)
set((state) => ({
  ...state,
  bandMood: Math.max(0, Math.min(100, state.bandMood + delta)),
}));
```

Never use `push()`, `splice()`, or direct mutation on state arrays.
