import { beforeEach, describe, expect, it } from 'vitest';
import { useStore } from '../../store';
import { game, when, say } from './helpers';
import { setupTestState } from './test-helpers';

describe('dialogue helpers', () => {
  beforeEach(() => setupTestState());

  describe('game()', () => {
    it('returns the current Zustand state', () => {
      const state = game();
      expect(state).toBeDefined();
      expect(state.scene).toBe('menu');
      expect(state.inventory).toEqual([]);
    });

    it('reflects state changes', () => {
      useStore.setState({ bandMood: 99 });
      expect(game().bandMood).toBe(99);
    });
  });

  describe('when()', () => {
    it('returns an array with the value when the condition is true', () => {
      const result = when(true, { text: 'test' });
      expect(result).toEqual([{ text: 'test' }]);
    });

    it('returns an empty array when the condition is false', () => {
      const result = when(false, { text: 'test' });
      expect(result).toEqual([]);
    });
  });

  describe('say()', () => {
    it('returns a Dialogue object with the correct text', () => {
      const dialogue = say('Hello world');
      expect(dialogue).toEqual({ text: 'Hello world' });
    });
  });
});
