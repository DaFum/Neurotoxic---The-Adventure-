import { describe, it, expect, vi } from 'vitest';
import { clampPlayerPosition } from './Player';

// Setup minimum browser env needed for drei/fiber mock dependencies
if (typeof navigator === 'undefined') {
  (global as any).navigator = { userAgent: 'node.js', hardwareConcurrency: 4 };
}

// Mock drei which imports detect-gpu that causes the issue
vi.mock('@react-three/drei', () => ({
  useKeyboardControls: () => [() => {}, () => ({})],
  Sparkles: () => null
}));

// Mock three since we just want to test our clamp logic, not the UI
vi.mock('three', () => {
  return {
    MathUtils: {
      clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value)),
    },
    Vector3: class {
      x = 0; y = 0; z = 0;
      constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
      set(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; return this; }
      length() { return 0; }
      normalize() { return this; }
      multiplyScalar() { return this; }
    },
    Group: class {},
    Sprite: class {},
    Mesh: class {},
    CanvasTexture: class {
      dispose() {}
    },
    SRGBColorSpace: 'srgb',
    SpriteMaterial: class {}
  };
});

describe('clampPlayerPosition', () => {
  const bounds: { x: [number, number]; z: [number, number] } = {
    x: [-10, 10],
    z: [-5, 5]
  };

  it('leaves position unchanged when within bounds', () => {
    const pos = { x: 5, y: 0, z: 2 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(5);
    expect(clampedZ).toBe(2);
  });

  it('leaves position unchanged when exactly on bounds', () => {
    const pos1 = { x: -10, y: 0, z: -5 };
    const { clampedX: cx1, clampedZ: cz1 } = clampPlayerPosition(pos1, bounds);
    expect(cx1).toBe(-10);
    expect(cz1).toBe(-5);

    const pos2 = { x: 10, y: 0, z: 5 };
    const { clampedX: cx2, clampedZ: cz2 } = clampPlayerPosition(pos2, bounds);
    expect(cx2).toBe(10);
    expect(cz2).toBe(5);
  });

  it('clamps position when out of bounds in -X direction', () => {
    const pos = { x: -15, y: 0, z: 0 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(-10);
    expect(clampedZ).toBe(0);
  });

  it('clamps position when out of bounds in +X direction', () => {
    const pos = { x: 15, y: 0, z: 0 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(10);
    expect(clampedZ).toBe(0);
  });

  it('clamps position when out of bounds in -Z direction', () => {
    const pos = { x: 0, y: 0, z: -10 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(0);
    expect(clampedZ).toBe(-5);
  });

  it('clamps position when out of bounds in +Z direction', () => {
    const pos = { x: 0, y: 0, z: 10 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(0);
    expect(clampedZ).toBe(5);
  });

  it('clamps position when out of bounds diagonally', () => {
    const pos = { x: 20, y: 0, z: -20 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(10);
    expect(clampedZ).toBe(-5);
  });
});
