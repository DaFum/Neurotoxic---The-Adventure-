import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useStore, DialogueOption } from './store';
import { canSelectOption, executeDialogueOption } from './dialogueEngine';

describe('dialogueEngine', () => {
  beforeEach(() => {
    useStore.getState().resetGame();
  });

  describe('canSelectOption', () => {
    it('should check requiredFlags', () => {
      const option: DialogueOption = { text: 'Test', requiredFlags: ['ampRepaired'] };

      expect(canSelectOption(option)).toBe(false);

      useStore.getState().setFlag('ampRepaired', true);
      expect(canSelectOption(option)).toBe(true);
    });

    it('should check forbiddenFlags', () => {
      const option: DialogueOption = { text: 'Test', forbiddenFlags: ['ampRepaired'] };

      expect(canSelectOption(option)).toBe(true);

      useStore.getState().setFlag('ampRepaired', true);
      expect(canSelectOption(option)).toBe(false);
    });

    it('should check requiredItems with duplicates', () => {
      const option: DialogueOption = { text: 'Test', requiredItems: ['Bier', 'Bier'] };

      expect(canSelectOption(option)).toBe(false);

      useStore.getState().addToInventory('Bier');
      expect(canSelectOption(option)).toBe(false);

      useStore.getState().addToInventory('Bier');
      expect(canSelectOption(option)).toBe(true);
    });

    it('should treat consumeItems as implicit requiredItems', () => {
      const option: DialogueOption = { text: 'Test', consumeItems: ['Bier'] };

      expect(canSelectOption(option)).toBe(false);

      useStore.getState().addToInventory('Bier');
      expect(canSelectOption(option)).toBe(true);
    });

    it('should check questDependencies with object notation', () => {
      const option: DialogueOption = {
        text: 'Test',
        questDependencies: [{ id: 'test_quest', status: 'active' }],
      };

      expect(canSelectOption(option)).toBe(false);

      useStore.getState().addQuest('test_quest', 'Test');
      expect(canSelectOption(option)).toBe(true);

      useStore.getState().failQuest('test_quest');
      expect(canSelectOption(option)).toBe(false);
    });
  });

  describe('executeDialogueOption', () => {
    it('should execute in correct order and consume items before declarative effects and actions', () => {
      const actionSpy = vi.fn();

      useStore.getState().addToInventory('Bier');
      useStore.getState().addQuest('action_quest', 'Test');

      const option: DialogueOption = {
        text: 'Test',
        consumeItems: ['Bier'],
        flagToSet: { flag: 'ampRepaired', value: true },
        action: actionSpy,
      };

      // Decorate actionSpy to check state AT THE TIME it is called
      actionSpy.mockImplementation(() => {
        const state = useStore.getState();
        // Item should be gone
        expect(state.inventory).not.toContain('Bier');
        // Flag should be set
        expect(state.flags.ampRepaired).toBe(true);
      });

      const success = executeDialogueOption(option);

      expect(success).toBe(true);
      expect(actionSpy).toHaveBeenCalled();
    });

    it('should handle throwing questToComplete and continue executing pipeline', () => {
      const actionSpy = vi.fn();
      const option: DialogueOption = {
        text: 'Test',
        questToComplete: 'missing_quest', // This will throw in store.ts
        action: actionSpy,
      };

      const success = executeDialogueOption(option);

      expect(success).toBe(true);
      expect(actionSpy).toHaveBeenCalled();
    });

    it('should handle throwing questToFail and continue executing pipeline', () => {
      const actionSpy = vi.fn();
      const option: DialogueOption = {
        text: 'Test',
        questToFail: 'missing_quest', // This will throw in store.ts
        action: actionSpy,
      };

      const success = executeDialogueOption(option);

      expect(success).toBe(true);
      expect(actionSpy).toHaveBeenCalled();
    });

    it('should throw an error if both action and nextDialogue are defined', () => {
      const option: DialogueOption = {
        text: 'Test',
        nextDialogue: { text: 'Next' },
        action: () => {
          useStore.getState().setDialogue('Action Dialogue');
        },
      };

      expect(() => executeDialogueOption(option)).toThrow(
        'executeDialogueOption: option.nextDialogue and option.action are mutually exclusive. This conflicting pattern is deprecated and no longer allowed.',
      );
    });
  });
});
