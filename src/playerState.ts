/**
 * Module-level shared player position updated every frame by Player.tsx.
 * Interactables read from this instead of calling useStore.getState() per frame,
 * reducing N store reads per frame to 1.
 *
 * Hardcoded to [0, 1, 0] rather than read from the store at module init because
 * playerPos is not persisted — the store always starts at [0, 1, 0] too.
 * Player.tsx overwrites this on the very first frame, before any Interactable
 * useFrame runs.
 */
export const livePlayerPos: [number, number, number] = [0, 1, 0];
