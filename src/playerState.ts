/**
 * Module-level shared player position updated every frame by Player.tsx.
 * Interactables read from this instead of calling useStore.getState() per frame,
 * reducing N store reads per frame to 1.
 */
export const livePlayerPos: [number, number, number] = [0, 1, 0];
