import { describe, it, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { clampPlayerPosition, secureRandom } from './math';

describe('secureRandom', () => {
  const originalGetRandomValues = global.crypto.getRandomValues;

  afterEach(() => {
    global.crypto.getRandomValues = originalGetRandomValues;
  });

  it('returns a number between 0 and 1', () => {
    const val = secureRandom();
    assert.ok(val >= 0);
    assert.ok(val < 1);
  });

  it('returns 0 when rng generates 0', () => {
    global.crypto.getRandomValues = mock.fn((arr: any) => {
      arr[0] = 0;
      return arr;
    });
    assert.equal(secureRandom(), 0);
  });

  it('returns a value strictly less than 1 when rng generates max uint32', () => {
    global.crypto.getRandomValues = mock.fn((arr: any) => {
      arr[0] = 0xFFFFFFFF;
      return arr;
    });
    const val = secureRandom();
    assert.ok(val < 1);
    assert.ok(val > 0);
  });
});

describe('clampPlayerPosition', () => {
  const bounds: { x: [number, number]; z: [number, number] } = {
    x: [-10, 10],
    z: [-5, 5]
  };

  it('leaves position unchanged when within bounds', () => {
    const pos = { x: 5, z: 2 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    assert.equal(clampedX, 5);
    assert.equal(clampedZ, 2);
  });

  it('leaves position unchanged when exactly on bounds', () => {
    const pos1 = { x: -10, z: -5 };
    const { clampedX: cx1, clampedZ: cz1 } = clampPlayerPosition(pos1, bounds);
    assert.equal(cx1, -10);
    assert.equal(cz1, -5);

    const pos2 = { x: 10, z: 5 };
    const { clampedX: cx2, clampedZ: cz2 } = clampPlayerPosition(pos2, bounds);
    assert.equal(cx2, 10);
    assert.equal(cz2, 5);
  });

  it('clamps position when out of bounds in -X direction', () => {
    const pos = { x: -15, z: 0 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    assert.equal(clampedX, -10);
    assert.equal(clampedZ, 0);
  });

  it('clamps position when out of bounds in +X direction', () => {
    const pos = { x: 15, z: 0 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    assert.equal(clampedX, 10);
    assert.equal(clampedZ, 0);
  });

  it('clamps position when out of bounds in -Z direction', () => {
    const pos = { x: 0, z: -10 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    assert.equal(clampedX, 0);
    assert.equal(clampedZ, -5);
  });

  it('clamps position when out of bounds in +Z direction', () => {
    const pos = { x: 0, z: 10 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    assert.equal(clampedX, 0);
    assert.equal(clampedZ, 5);
  });

  it('clamps position when out of bounds diagonally', () => {
    const pos = { x: 20, z: -20 };
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    assert.equal(clampedX, 10);
    assert.equal(clampedZ, -5);
  });
});
