export function clampPlayerPosition(
  pos: { x: number; z: number },
  bounds: { x: [number, number]; z: [number, number] }
) {
  return {
    clampedX: Math.max(bounds.x[0], Math.min(bounds.x[1], pos.x)),
    clampedZ: Math.max(bounds.z[0], Math.min(bounds.z[1], pos.z)),
  };
}
