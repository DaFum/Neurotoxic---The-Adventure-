const _secureRandomBuffer = new Uint32Array(1);

/**
 * Generates a secure random number between 0 (inclusive) and 1 (exclusive).
 * Replaces Math.random() for environments where security/hygiene is important.
 */
export function secureRandom(): number {
  crypto.getRandomValues(_secureRandomBuffer);
  return _secureRandomBuffer[0] / (0xffffffff + 1);
}

export function clampPlayerPosition(
  pos: { x: number; z: number },
  bounds: { x: [number, number]; z: [number, number] }
) {
  return {
    clampedX: Math.max(bounds.x[0], Math.min(bounds.x[1], pos.x)),
    clampedZ: Math.max(bounds.z[0], Math.min(bounds.z[1], pos.z)),
  };
}
