import { describe, it, expect, beforeEach, vi } from 'vitest';
import { touchInput } from './touchInput';

describe('touchInput initialization', () => {
  it('should have initial values of 0', async () => {
    vi.resetModules();
    const { touchInput: freshTouchInput } = await import('./touchInput');
    expect(freshTouchInput.x).toBe(0);
    expect(freshTouchInput.z).toBe(0);
  });
});

describe('touchInput singleton', () => {
  const initialState = { ...touchInput };

  beforeEach(() => {
    Object.assign(touchInput, initialState);
  });

  it('should allow updating x and z values', () => {
    touchInput.x = 0.5;
    touchInput.z = -0.8;
    expect(touchInput.x).toBe(0.5);
    expect(touchInput.z).toBe(-0.8);
  });

  it('should persist changes across multiple updates', () => {
    touchInput.x = 1;
    expect(touchInput.x).toBe(1);
    touchInput.x = -1;
    expect(touchInput.x).toBe(-1);
  });

  it('should handle zeroing out values', () => {
    touchInput.x = 0.7;
    touchInput.z = 0.3;

    touchInput.x = 0;
    touchInput.z = 0;

    expect(touchInput.x).toBe(0);
    expect(touchInput.z).toBe(0);
  });
});
