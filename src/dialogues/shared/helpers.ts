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
 * Returns a simple string dialogue (the store handles string-to-Dialogue promotion).
 */
export function say(text: string): string {
  return text;
}