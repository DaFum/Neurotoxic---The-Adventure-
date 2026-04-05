import { describe, it, expect } from 'vitest';
import { checkHasSavedGame } from './saveGame';

describe('checkHasSavedGame', () => {
  describe('invalid inputs', () => {
    it('returns false for null', () => {
      expect(checkHasSavedGame(null)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(checkHasSavedGame('')).toBe(false);
    });

    it('returns false for invalid JSON', () => {
      expect(checkHasSavedGame('{ invalid }')).toBe(false);
    });

    it('returns false for valid JSON that is not an object', () => {
      expect(checkHasSavedGame('123')).toBe(false);
      expect(checkHasSavedGame('true')).toBe(false);
      expect(checkHasSavedGame('"string"')).toBe(false);
    });

    it('returns false for an array', () => {
      expect(checkHasSavedGame('[]')).toBe(false);
    });
  });

  describe('invalid structure', () => {
    it('returns false if state field is missing', () => {
      expect(checkHasSavedGame(JSON.stringify({ notState: {} }))).toBe(false);
    });

    it('returns false if state is not an object', () => {
      expect(checkHasSavedGame(JSON.stringify({ state: null }))).toBe(false);
      expect(checkHasSavedGame(JSON.stringify({ state: 123 }))).toBe(false);
      expect(checkHasSavedGame(JSON.stringify({ state: [] }))).toBe(false);
    });
  });

  describe('no progress (returns false)', () => {
    it('returns false for empty state', () => {
      expect(checkHasSavedGame(JSON.stringify({ state: {} }))).toBe(false);
    });

    it('returns false when all progress markers are at defaults or empty', () => {
      const state = {
        trait: null,
        inventory: [],
        quests: [{ status: 'active', completed: false }],
        loreEntries: [{ discovered: false }],
        bandMood: 20,
        skills: { technical: 0, social: 0, chaos: 0 }
      };
      expect(checkHasSavedGame(JSON.stringify({ state }))).toBe(false);
    });
  });

  describe('progress detection (returns true)', () => {
    it('returns true when trait is present', () => {
      expect(checkHasSavedGame(JSON.stringify({ state: { trait: 'Performer' } }))).toBe(true);
    });

    it('returns true when inventory is not empty', () => {
      expect(checkHasSavedGame(JSON.stringify({ state: { inventory: ['guitar'] } }))).toBe(true);
    });

    it('returns true when there is a completed quest (status: completed)', () => {
      const state = { quests: [{ status: 'completed' }] };
      expect(checkHasSavedGame(JSON.stringify({ state }))).toBe(true);
    });

    it('returns true when there is a completed quest (completed: true)', () => {
      const state = { quests: [{ completed: true }] };
      expect(checkHasSavedGame(JSON.stringify({ state }))).toBe(true);
    });

    it('returns true when a lore entry is discovered', () => {
      const state = { loreEntries: [{ discovered: true }] };
      expect(checkHasSavedGame(JSON.stringify({ state }))).toBe(true);
    });

    it('returns true when bandMood is not 20', () => {
      expect(checkHasSavedGame(JSON.stringify({ state: { bandMood: 15 } }))).toBe(true);
      expect(checkHasSavedGame(JSON.stringify({ state: { bandMood: 25 } }))).toBe(true);
    });

    it('returns true when a skill is increased even if bandMood is missing', () => {
      expect(checkHasSavedGame(JSON.stringify({ state: { skills: { technical: 1 } } }))).toBe(true);
    });

    it('returns true when a skill is increased even if bandMood is 20', () => {
      expect(checkHasSavedGame(JSON.stringify({ state: { bandMood: 20, skills: { technical: 1 } } }))).toBe(true);
      expect(checkHasSavedGame(JSON.stringify({ state: { bandMood: 20, skills: { social: 1 } } }))).toBe(true);
      expect(checkHasSavedGame(JSON.stringify({ state: { bandMood: 20, skills: { chaos: 1 } } }))).toBe(true);
    });
  });
});
