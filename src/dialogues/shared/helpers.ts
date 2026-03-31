import { useStore, type Dialogue } from '../../store';

/**
 * Returns a thin wrapper around the global Zustand store state.
 */
export function game() {
  return useStore.getState();
}

/**
 * Conditionally includes a value in an array. Useful for spreading dialogue options.
 * Example: `...when(condition, { text: '...', action: ... })`
 */
export function when<T>(condition: boolean, value: T): T[] {
  return condition ? [value] : [];
}

/**
 * Creates a simple Dialogue object containing only text.
 */
export function say(text: string): Dialogue {
  return { text };
}