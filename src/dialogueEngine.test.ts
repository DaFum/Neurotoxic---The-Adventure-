import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useStore, DialogueOption } from './store';
import { canSelectOption, executeDialogueOption, clearQuestCache } from './dialogueEngine';

describe('dialogueEngine', () => {
  beforeEach(() => {
    useStore.getState().resetGame();
    clearQuestCache();
  });

  describe('canSelectOption', () => {
    it('should check requiredFlags', () => {
      const option: DialogueOption = { text: 'Test', requiredFlags: ['ampFixed'] };

      expect(canSelectOption(option)).toBe(false);

      useStore.getState().setFlag('ampFixed', true);
      expect(canSelectOption(option)).toBe(true);
    });

    it('should check forbiddenFlags', () => {
      const option: DialogueOption = { text: 'Test', forbiddenFlags: ['ampFixed'] };

      expect(canSelectOption(option)).toBe(true);

      useStore.getState().setFlag('ampFixed', true);
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
        questDependencies: [{ id: 'test_quest', status: 'active' }]
      };

      expect(canSelectOption(option)).toBe(false);

      useStore.getState().addQuest('test_quest', 'Test');
      expect(canSelectOption(option)).toBe(true);

      useStore.getState().failQuest('test_quest');
      expect(canSelectOption(option)).toBe(false);
    });
  });

  describe('executeDialogueOption', () => {
    let warnSpy: any;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('should execute in correct order and consume items before declarative effects and actions', () => {
      const actionSpy = vi.fn();

      useStore.getState().addToInventory('Bier');
      useStore.getState().addQuest('action_quest', 'Test');

      const option: DialogueOption = {
        text: 'Test',
        consumeItems: ['Bier'],
        flagToSet: { flag: 'ampFixed', value: true },
        action: actionSpy,
      };

      // Decorate actionSpy to check state AT THE TIME it is called
      actionSpy.mockImplementation(() => {
        const state = useStore.getState();
        // Item should be gone
        expect(state.inventory).not.toContain('Bier');
        // Flag should be set
        expect(state.flags.ampFixed).toBe(true);
      });

      const success = executeDialogueOption(option);

      expect(success).toBe(true);
      expect(actionSpy).toHaveBeenCalled();
    });

    it('should warn if action calls setDialogue and nextDialogue is defined', () => {
      const option: DialogueOption = {
        text: 'Test',
        nextDialogue: { text: 'Next' },
        action: () => {
          useStore.getState().setDialogue('Action Dialogue');
        },
      };

      executeDialogueOption(option);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('option.action called setDialogue(), but option.nextDialogue is also defined')
      );

      // nextDialogue wins
      expect(useStore.getState().dialogue?.text).toBe('Next');
    });
  });
});
