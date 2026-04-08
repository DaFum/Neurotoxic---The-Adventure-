import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as React from 'react';
/**
 * @vitest-environment jsdom
 */
import { render } from '@testing-library/react';
import { Interactable } from './Interactable';
import { useKeyboardInteraction } from './KeyboardInteractionManager';

vi.mock('./KeyboardInteractionManager', () => ({
  useKeyboardInteraction: vi.fn(),
}));

vi.mock('../store', () => {
  const mockState = {
    isPaused: false,
    bandMood: 20,
    setCameraShake: vi.fn(),
    playerPos: [0, 0, 0],
    dialogue: null,
    setDialogue: vi.fn(),
  };

  const useStoreMock = vi.fn((selector) => selector ? selector(mockState) : mockState) as any;
  useStoreMock.getState = () => mockState;

  return {
    useStore: useStoreMock,
  };
});

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('@react-three/rapier', () => ({
  RigidBody: ({ children }: any) => <div data-testid="rigid-body">{children}</div>,
  CuboidCollider: () => null,
}));

vi.mock('../audio', () => ({
  audio: { playInteraction: vi.fn(), playInteract: vi.fn() },
}));

// Mock THREE to avoid issues with CanvasTexture and other things
const mockDispose = vi.fn();
vi.mock('three', async () => {
  const actual = await vi.importActual('three') as any;
  // We need CanvasTexture to be constructable.
  class MockCanvasTexture {
    colorSpace: any;
    needsUpdate: boolean = false;
    dispose() {
      mockDispose();
    }
  }
  return {
    ...actual,
    CanvasTexture: MockCanvasTexture,
  };
});

describe('Interactable', () => {
  const mockRegister = vi.fn();
  const mockUnregister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useKeyboardInteraction as any).mockReturnValue({
      register: mockRegister,
      unregister: mockUnregister,
    });
  });

  it('shares CanvasTexture instances for identical interactables and disposes when all are unmounted', async () => {
    // We are going to test caching by rendering two identical interactables.
    const { unmount, rerender } = render(
      <>
        <Interactable
          position={[0, 0, 0]}
          emoji="🎸"
          name="Test Guitar"
          onInteract={() => {}}
        />
        <Interactable
          position={[1, 0, 0]}
          emoji="🎸"
          name="Test Guitar"
          onInteract={() => {}}
        />
      </>
    );

    // One texture for the emoji "🎸", one for label in-range, one for label out-of-range
    // That makes 3 textures.
    // They should be created only once, shared between the two instances.

    expect(mockDispose).not.toHaveBeenCalled();

    // Unmount one instance (by rerendering with only one)
    rerender(
      <>
        <Interactable
          position={[0, 0, 0]}
          emoji="🎸"
          name="Test Guitar"
          onInteract={() => {}}
        />
      </>
    );

    // The other instance is still using the textures, dispose should NOT be called.
    expect(mockDispose).not.toHaveBeenCalled();

    // Now unmount everything
    unmount();

    // Now dispose SHOULD be called 3 times (once for emoji, twice for labels)
    expect(mockDispose).toHaveBeenCalledTimes(3);
  });

  it('registers interactables with stable prefixed unique IDs and unregisters them on unmount', () => {
    const { unmount } = render(
      <>
        <Interactable
          position={[0, 0, 0]}
          emoji="🎸"
          name="Test Item 1"
          onInteract={() => {}}
        />
        <Interactable
          position={[1, 0, 0]}
          emoji="🥁"
          name="Test Item 2"
          onInteract={() => {}}
        />
      </>
    );

    expect(mockRegister).toHaveBeenCalledTimes(2);
    const firstRegisteredId = mockRegister.mock.calls[0][0];
    const secondRegisteredId = mockRegister.mock.calls[1][0];

    expect(firstRegisteredId).toMatch(/^interactable-/);
    expect(secondRegisteredId).toMatch(/^interactable-/);

    // Ensure IDs are no longer using the old Math.random() pattern.
    expect(firstRegisteredId).not.toMatch(/^interactable-[a-z0-9]{8}$/);
    expect(secondRegisteredId).not.toMatch(/^interactable-[a-z0-9]{8}$/);

    // Separate instances should register distinct IDs.
    expect(firstRegisteredId).not.toBe(secondRegisteredId);

    unmount();

    expect(mockUnregister).toHaveBeenCalledWith(firstRegisteredId);
    expect(mockUnregister).toHaveBeenCalledWith(secondRegisteredId);
  });
});
