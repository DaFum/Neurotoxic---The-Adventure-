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

## Gotchas
- Collected items must use conditional rendering: `{!hasItem('X') && <Interactable ... />}` — otherwise the item persists after pickup
- Multiple interactables at the same position must be mutually exclusive via flags
- `removeFromInventory()` is NOT automatic — explicitly call it when an item is consumed
- Scene names are case-sensitive: `'void_station'` not `'voidStation'`
- Skill/mood increases must be inside `action` callbacks, not at component render level (would fire every frame)
- Band member Interactables should have `position` Y >= 1 to avoid floor clipping
- Quest IDs use snake_case: `'repair_amp'`, `'ghost_recipe'`, `'cosmic_echo'`
