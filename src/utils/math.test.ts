import { describe, it, expect } from 'vitest';
import { clampPlayerPosition } from './math';

describe('clampPlayerPosition', () => {
  const bounds: { x: [number, number]; z: [number, number] } = {
    x: [-10, 10],
    z: [-5, 5]
  };

  it('leaves position unchanged when within bounds', () => {
    const pos = { x: 5, z: 2 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(5);
    expect(clampedZ).toBe(2);
  });

  it('leaves position unchanged when exactly on bounds', () => {
    const pos1 = { x: -10, z: -5 };
    const { clampedX: cx1, clampedZ: cz1 } = clampPlayerPosition(pos1, bounds);
    expect(cx1).toBe(-10);
    expect(cz1).toBe(-5);

    const pos2 = { x: 10, z: 5 };
    const { clampedX: cx2, clampedZ: cz2 } = clampPlayerPosition(pos2, bounds);
    expect(cx2).toBe(10);
    expect(cz2).toBe(5);
  });

  it('clamps position when out of bounds in -X direction', () => {
    const pos = { x: -15, z: 0 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(-10);
    expect(clampedZ).toBe(0);
  });

  it('clamps position when out of bounds in +X direction', () => {
    const pos = { x: 15, z: 0 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(10);
    expect(clampedZ).toBe(0);
  });

  it('clamps position when out of bounds in -Z direction', () => {
    const pos = { x: 0, z: -10 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(0);
    expect(clampedZ).toBe(-5);
  });

  it('clamps position when out of bounds in +Z direction', () => {
    const pos = { x: 0, z: 10 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(0);
    expect(clampedZ).toBe(5);
  });

  it('clamps position when out of bounds diagonally', () => {
    const pos = { x: 20, z: -20 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    expect(clampedX).toBe(10);
    expect(clampedZ).toBe(-5);
  });
});
