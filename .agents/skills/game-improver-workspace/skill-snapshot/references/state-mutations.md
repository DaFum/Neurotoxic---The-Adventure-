# State Mutations & Patterns

Purpose: authoritative patterns for making safe, testable state changes in Neurotoxic (Zustand `useStore`).

## Key rules for `useStore` changes

When adding or changing state behavior in this repo (which uses Zustand), follow these steps in the same PR:

1. Update `initialState` or add new fields in `src/store.ts` (if adding persisted fields, update the `partialize` and `merge` logic in the `persist` config).
2. Add or update a mutator function inside the `useStore` definition (a named function exposed on the hook) that performs the state update via `set(...)` or updater callbacks.
3. Update any consumers (components/hooks) that call the mutator and add unit tests that exercise the new behavior.

## Safe update checklist

- Use immutable updates inside `set` callbacks: `set(state => ({ ...state, nested: { ...state.nested, x: y } }))`.
- Clamp critical numeric fields: `bandMood ∈ [0,100]` (use `Math.max(0, Math.min(100, ...))`). Apply the same pattern to any new bounded numeric fields you add.
- Prefer derived selectors for computed values rather than persisting redundant derived state.
- Use `useStore.getState()` inside event handlers/callbacks to avoid stale closures when mutating state outside React render.

## Example: add `repairVan(cost, amount)` mutator

1. Add any default value to `initialState` in `src/store.ts` if needed.
2. Add a mutator inside the exported `useStore`:

```ts
repairVan: (cost: number, amount: number) => set((state) => ({
	player: {
		...state.player,
		money: Math.max(0, state.player.money - cost),
		van: { ...state.player.van, condition: Math.min(100, state.player.van.condition + amount) }
	}
})),
```

3. Add a unit test that sets up a minimal store state, calls `useStore.getState().repairVan(...)` and asserts the new money and condition values with clamping.

## Array updates

- Use array `map`/`filter`/`slice` for immutable updates to lists (inventory, quests). Avoid direct `push`/`splice` on state arrays.

## Persist & migrate

- If the change affects persisted fields, update the `partialize` function and `merge` logic in the `persist` config located in `src/store.ts` so old saves remain compatible.

## Persisted fields (reference)

- The store's `partialize` currently persists these keys to localStorage: `inventory`, `flags`, `quests`, `bandMood`, `loreEntries`, `trait`, `skills`.
- When adding or removing persisted fields, update `partialize` and the `merge` logic in `src/store.ts` and include a migration strategy in `onRehydrateStorage` if necessary.

## PR checklist for state changes

- [ ] `initialState` updated if new fields are added
- [ ] `useStore` mutator function added/updated in `src/store.ts`
- [ ] Persist `partialize` / `merge` updated if needed
- [ ] Unit tests added covering happy & edge cases
- [ ] Lint/build/test pass
