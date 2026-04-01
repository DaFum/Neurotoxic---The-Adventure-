# voidstation dialogues — Agent Instructions

- Keep VoidStation dialogue and quest branching in builder functions under this folder.
- Use `game()` for reads/writes; avoid capturing store snapshots in long-lived closures.
- For item rewards, always branch on `addToInventory(...)` result and provide explicit fallback text.
- Keep all flag names aligned with the `Flag` union in `src/store.ts`.
- Update `dialog_uebersicht.md` when changing dialogue text, quest triggers, item interactions, or BandMood deltas.
