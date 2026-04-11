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
    div: ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>,
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
      />
    );

    const dialogElement = screen.getByRole('dialog');
    expect(dialogElement.hasAttribute('aria-live')).toBe(false);
    expect(dialogElement.hasAttribute('aria-atomic')).toBe(false);
  });

  it('keeps sr-only element empty until typing completes, then populates it', () => {
    const mockDialogue = { text: 'Test message', urgency: 3 }; // urgency 3 -> 50ms delay

    const { container } = render(
      <DialogueBox
        dialogue={mockDialogue as any}
        setDialogue={vi.fn()}
        questDictionary={new Map()}
      />
    );

    // The sr-only div has aria-live="polite"
    // Using container.querySelector because it's a hidden element and screen.getByText might fail before it has text
    const liveRegion = container.querySelector('.sr-only');
    expect(liveRegion).not.toBeNull();

    // Initially empty
    expect(liveRegion?.textContent).toBe('');

    // Advance time partially (not enough to finish typing)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Still empty while typing
    expect(liveRegion?.textContent).toBe('');

    // Advance enough to finish (12 chars * 50ms = 600ms)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Now populated with full text
    expect(liveRegion?.textContent).toBe('Test message');
  });
});
