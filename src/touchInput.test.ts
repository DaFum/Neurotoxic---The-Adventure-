import { describe, it, expect, beforeEach } from 'vitest';
import { touchInput } from './touchInput';

describe('touchInput singleton', () => {
  beforeEach(() => {
    // Reset to initial state before each test because it's a mutable singleton
    touchInput.x = 0;
    touchInput.z = 0;
  });

  it('should have initial values of 0', () => {
    expect(touchInput.x).toBe(0);
    expect(touchInput.z).toBe(0);
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
