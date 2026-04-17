import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as React from 'react';
/**
 * @vitest-environment jsdom
 */
import { render } from '@testing-library/react';
import { Player } from './Player';
import type { GameState } from '../store';

const makeMockGameState = (overrides: Partial<GameState>): GameState => {
  return overrides as GameState;
};

let mockStoreSubscriptions: ((state: GameState) => void)[] = [];
let mockStoreState = makeMockGameState({
  playerPos: [1, 2, 3],
  cameraShakeKick: 0,
  cameraShakeIntensity: 0,
});

vi.mock('../store', () => {
  const useStore = vi.fn((selector) => {
    return selector ? selector(mockStoreState) : mockStoreState;
  }) as unknown as typeof import('../store').useStore;
  useStore.getState = vi.fn(() => mockStoreState) as any;
  useStore.subscribe = vi.fn((cb) => {
    mockStoreSubscriptions.push(cb);
    return vi.fn();
  }) as any;
  return { useStore };
});

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  useKeyboardControls: vi.fn(() => [vi.fn(), vi.fn(() => ({}))]),
  Sparkles: () => null,
}));

let mockBodyMethods = {
  setTranslation: vi.fn(),
  setLinvel: vi.fn(),
  setAngvel: vi.fn(),
  translation: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
};

vi.mock('@react-three/rapier', async () => {
  const React = await import('react');
  return {
    RigidBody: React.forwardRef(
      (
        { children }: { children: React.ReactNode },
        ref: React.Ref<{
          setTranslation: (...args: any[]) => void;
          setLinvel: (...args: any[]) => void;
          setAngvel: (...args: any[]) => void;
          translation: () => { x: number; y: number; z: number };
        }>,
      ) => {
        React.useImperativeHandle(ref, () => mockBodyMethods);
        return <>{children}</>;
      },
    ),
    CuboidCollider: () => null,
  };
});

vi.mock('../audio', () => ({
  audio: { playFootstep: vi.fn() },
}));

vi.mock('../touchInput', () => ({
  touchInput: { x: 0, z: 0 },
}));

describe('Player Rigidbody Initialization Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreSubscriptions = [];
    mockBodyMethods = {
      setTranslation: vi.fn(),
      setLinvel: vi.fn(),
      setAngvel: vi.fn(),
      translation: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    };
  });

  it('should ignore errors when bodyRef.current.setTranslation throws on mount', () => {
    mockBodyMethods.setTranslation.mockImplementation(() => {
      throw new Error('Uninitialized');
    });

    // Render should not crash
    expect(() => render(<Player />)).not.toThrow();

    expect(mockBodyMethods.setTranslation).toHaveBeenCalled();
    expect(mockBodyMethods.setLinvel).not.toHaveBeenCalled();
  });

  it('should ignore errors when bodyRef.current.setAngvel throws on mount', () => {
    mockBodyMethods.setAngvel.mockImplementation(() => {
      throw new Error('setAngvel missing');
    });

    expect(() => render(<Player />)).not.toThrow();

    expect(mockBodyMethods.setTranslation).toHaveBeenCalled();
    expect(mockBodyMethods.setLinvel).toHaveBeenCalled();
    expect(mockBodyMethods.setAngvel).toHaveBeenCalled();
  });

  it('should handle bodyRef setTranslation throwing in the store subscription', () => {
    // Render initially
    render(<Player />);

    // Reset mocks for clarity before subscription
    vi.clearAllMocks();

    // Make setTranslation throw for the subscription
    mockBodyMethods.setTranslation.mockImplementation(() => {
      throw new Error('Uninitialized');
    });

    // Now trigger the store subscription with a new position
    const posSubscription = mockStoreSubscriptions[0];

    expect(() =>
      posSubscription(makeMockGameState({ ...mockStoreState, playerPos: [10, 10, 10] })),
    ).not.toThrow();

    // In the subscription, setTranslation should be called and the error caught
    expect(mockBodyMethods.setTranslation).toHaveBeenCalledTimes(1);
    expect(mockBodyMethods.setLinvel).not.toHaveBeenCalled();
  });
});
