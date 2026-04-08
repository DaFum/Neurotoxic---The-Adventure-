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
let canvasTextureCtorCount = 0;
vi.mock('three', async () => {
  const actual = await vi.importActual('three') as any;
  return {
    ...actual,
    CanvasTexture: class {
      needsUpdate = false;
      dispose = mockDispose;
      constructor() {
        canvasTextureCtorCount++;
      }
    },
  };
});

describe('Interactable', () => {
  const mockRegister = vi.fn();
  const mockUnregister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    canvasTextureCtorCount = 0;
    (useKeyboardInteraction as any).mockReturnValue({
      register: mockRegister,
      unregister: mockUnregister,
    });
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

  it('reuses CanvasTexture instances for identical interactables and disposes only when all unmount', () => {
    mockDispose.mockClear();

    const { rerender, unmount } = render(
      <>
        <Interactable
          position={[0, 0, 0]}
          emoji="🎸"
          name="Guitar"
          onInteract={() => {}}
        />
        <Interactable
          position={[1, 0, 0]}
          emoji="🎸"
          name="Guitar"
          onInteract={() => {}}
        />
      </>
    );

    // Initial render creates the textures (one for emoji, two for in/out range labels per unique identity)
    expect(canvasTextureCtorCount).toBe(3);
    expect(mockDispose).not.toHaveBeenCalled();

    // Rerender with only one interactable
    rerender(
      <>
        <Interactable
          position={[0, 0, 0]}
          emoji="🎸"
          name="Guitar"
          onInteract={() => {}}
        />
      </>
    );

    // One instance unmounted, but the other is still using the textures, so dispose should not be called
    expect(mockDispose).not.toHaveBeenCalled();

    // Unmount the remaining interactable
    unmount();

    // Now all consumers are gone, textures should be disposed.
    // Emoji (1) + Label In Range (1) + Label Out of Range (1) = 3 calls
    expect(mockDispose).toHaveBeenCalledTimes(3);
  });
});
