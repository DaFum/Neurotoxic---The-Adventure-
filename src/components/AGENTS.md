# components — Agent Instructions

## Interactable
- Interaction range is hardcoded to 4.0 units — not configurable per instance
- `isBandMember={true}` enables mood-scaled idle animations (`idleType`: "headbang" | "tap" | "sway")
- For branching `onInteract` logic, prefer `useStore.getState()` reads inside the callback so checks/actions use the latest store snapshot

## Player
- Bounds are soft clamps (not physics colliders) — player slides against them, not bounces
- Player position in physics is kept in sync with `store.playerPos` (teleports/scene resets propagate via the sync effect)
- Camera follows with 0.1 lerp factor — intentionally sluggish

## Game
- Scene components unmount/remount on scene change; scene-owned `setTimeout`/`setInterval` must always be cleaned up
- Physics pauses entirely when `isPaused` is true — affects all bodies, not selective
- Trait selection sets skills via `getState()` before scene transition. Order: trait -> skills -> music -> scene

## WorldEvents
- Camera shake only triggers randomly when `bandMood > 70`
- Music tempo target is clamped to `150..250` ms (`Math.max(150, Math.min(250, 250 - bandMood))`) and only updates when the delta is >= 3ms to reduce jittery restarts
