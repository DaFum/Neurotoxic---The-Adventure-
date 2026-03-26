# components — Agent Instructions

## Interactable
- Interaction range is hardcoded to 4.0 units — not configurable per instance
- `isBandMember={true}` enables mood-scaled idle animations (`idleType`: "headbang" | "tap" | "sway")
- `onInteract` callbacks should use `useStore.getState()` for reading state (not top-level destructured values), because closures capture stale state

## Player
- Bounds are soft clamps (not physics colliders) — player slides against them, not bounces
- Initial position is set once on mount from store. Changing spawn mid-scene requires `bodyRef.current.setTranslation()`
- Camera follows with 0.1 lerp factor — intentionally sluggish

## Game
- `AnimatePresence key={scene}` causes ALL scene content to fully remount on scene change — cleanup `setTimeout`/`setInterval` in scenes
- Physics pauses entirely when `isPaused` is true — affects all bodies, not selective
- Trait selection sets skills via `getState()` before scene transition. Order: trait -> skills -> music -> scene

## WorldEvents
- Camera shake only triggers randomly when `bandMood > 70`
- Music tempo formula: `250 - bandMood` ms per step — mood above 250 causes negative tempo (undefined behavior)
