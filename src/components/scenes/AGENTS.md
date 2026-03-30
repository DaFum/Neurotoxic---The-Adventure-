# scenes — Agent Instructions

## New Scene Checklist
1. Create `src/components/scenes/YourScene.tsx`
2. Add scene name to `Scene` union type in `src/store.ts` (lowercase, underscores for spaces)
3. Import and add to scene switch in `src/components/Game.tsx`
4. Add ambient track in `audio.ts` `startAmbient()` switch
5. Update `dialog_uebersicht.md` with all dialogue trees

## Required Structure
- Floor: `<RigidBody type="fixed">` at `position={[0, -0.1, 0]}` with `rotation={[-Math.PI / 2, 0, 0]}`
- All physics bodies must be inside the scene component (which renders inside `<Physics>`)
- Set `<Player bounds={{ x: [min, max], z: [min, max] }} />` — align with any invisible wall RigidBodies
- Player spawns at `[0, 1, 0]` — ensure this position is accessible and not inside geometry

## Dialogue Conventions
- Simple: `setDialogue('Text string')` — auto-wrapped into `{ text: '...' }`
- With options: `setDialogue({ text: '...', options: [...] })` — never pass string if you need options
- Skill names are lowercase: `'technical'`, `'social'`, `'chaos'`
- Trait names are Title Case: `'Visionary'`, `'Technician'`, `'Brutalist'`, `'Diplomat'`, `'Mystic'`, `'Performer'`, `'Cynic'`
- `requiredSkill` must be an object `{ name: 'skill', level: N }` — passing a string silently fails
- `questDependencies` hides the option unless those quests are completed — ensure referenced quests exist

## Quest API in Scenes
- Scene-specific quests (objectives the player only learns about by entering the scene) must be registered in a mount `useEffect(() => { addQuest(id, text); }, [])`, not in `initialState`. This prevents future-scene spoilers in the journal.
- Use `startAndFinishQuest(id, text)` for one-shot milestones that have no open phase (e.g. band meeting, bassist contact, wirt_legacy). Do NOT use `addQuest + completeQuest` for these — unless the quest can be discovered as 'active' first via a separate code path (e.g. `backstage_ritual` has a discovery path at the ritual circle before the player performs it, so it must use `addQuest + completeQuest`).
- Always call `completeQuest(id)` when a questline resolves, even if you also set a completion flag. Relying only on a flag causes quest-log drift (journal stays open, narrative says done).

## Gotchas
- Flag names passed to `setFlag()` and `flagToSet.flag` must exist in the `Flag` union in `store.ts` — TypeScript enforces this. Add new flags to the union before using them.
- Collected items must use conditional rendering: `{!hasItem('X') && <Interactable ... />}` — otherwise the item persists after pickup
- Multiple interactables at the same position must be mutually exclusive via flags
- `removeFromInventory()` is NOT automatic — explicitly call it when an item is consumed
- One-shot dialogue options must be **excluded from the options array** via a flag check before the `setDialogue()` call — guarding only the rewards inside `action` still shows the option on every interaction. Concrete pattern: `...(!flags.done ? [{ text: '...', requiredTrait: 'Mystic' as const, action: () => { ...; setFlag('done', true); } }] as DialogueOption[] : [])`
- Multiple `setDialogue()` calls within the same `action` callback: only the **last** call is visible — earlier calls are silently overwritten. Use a single conditional call instead
- Scene names are case-sensitive: `'void_station'` not `'voidStation'`
- Skill/mood increases must be inside option `action` callbacks — calling them in `onInteract` directly (outside any action) fires them on every interaction, not just once
- Band member Interactables should have `position` Y >= 1 to avoid floor clipping
- Quest IDs use snake_case: `'repair_amp'`, `'ghost_recipe'`, `'cosmic_echo'`
