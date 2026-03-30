// Mutable singleton updated by VirtualJoystick, read every frame in Player.
// Not reactive — intentionally a plain object to avoid render overhead.
/**
 * Global singleton state object holding virtual joystick input vectors.
 * It provides continuous updates for the player's movement on touch devices.
 * Designed to be a plain object to prevent costly React re-renders in the game loop.
 */
export const touchInput = { x: 0, z: 0 };
