/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DialogueBox } from './DialogueBox';
import { useStore } from '../../store';

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
  },
}));

vi.mock('../../audio', () => ({
  audio: {
    playTypewriter: vi.fn(),
  },
}));

vi.mock('../../store', () => {
  const mockUseStore = vi.fn() as any;
  mockUseStore.getState = vi.fn().mockReturnValue({ dialogue: null, quests: [] });
  mockUseStore.subscribe = vi.fn();
  return {
    useStore: mockUseStore,
  };
});

describe('DialogueBox', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Default mock for useStore so it doesn't crash
    (useStore as any).mockReturnValue({
      flags: [],
      trait: null,
      skills: [],
      quests: [],
      inventoryCounts: {},
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does not apply aria-live to the dialog container', () => {
    const mockDialogue = { text: 'Hello', urgency: 2 };

    render(
      <DialogueBox
        dialogue={mockDialogue as any}
        setDialogue={vi.fn()}
        questDictionary={new Map()}
      />,
    );

    const dialogElement = screen.getByRole('dialog');
    expect(dialogElement.hasAttribute('aria-live')).toBe(false);
    expect(dialogElement.hasAttribute('aria-atomic')).toBe(false);
  });

  it('populates sr-only element immediately with full text', () => {
    const mockDialogue = { text: 'Test message', urgency: 3 };

    const { container } = render(
      <DialogueBox
        dialogue={mockDialogue as any}
        setDialogue={vi.fn()}
        questDictionary={new Map()}
      />,
    );

    const liveRegion = container.querySelector('.sr-only');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion?.textContent).toBe('Test message');
  });
});
