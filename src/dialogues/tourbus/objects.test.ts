import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import {
  buildTourbusAmpDialogue,
  buildTourbusHiddenStashDialogue,
  buildTourbusGhostDialogue,
  buildTourbusBandMeetingDialogue,
} from './objects';
import { setupTestState, getOptionTexts, getDialogueText } from '../shared/test-helpers';
import { executeDialogueOption } from '../../dialogueEngine';

describe('TourBus Objects Dialogues', () => {
  beforeEach(() => setupTestState());

  describe('Defekter Verstärker', () => {
    it('returns technician repair option when trait is Technician', () => {
      setupTestState({ trait: 'Technician' });
      const dialogue = buildTourbusAmpDialogue();
      expect(getDialogueText(dialogue)).toContain('Ein alter Röhrenverstärker');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(1);
      expect(options).toContain('Repariere ihn schnell.');
    });

    it('returns default clueless text when not Technician', () => {
      setupTestState({ trait: 'Brutalist' });
      const dialogue = buildTourbusAmpDialogue();
      expect(getDialogueText(dialogue)).toContain('du hast keine Ahnung, wie man das repariert');
      expect(getOptionTexts(dialogue)).toHaveLength(0);
    });
  });

  describe('Verstecktes Fach', () => {
    it('shows stash interaction', () => {
      const dialogue = buildTourbusHiddenStashDialogue();
      expect(getDialogueText(dialogue)).toContain('Ein kleines Geheimfach in der Wandverkleidung.');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(2);
      expect(options).toContain('Notiz einstecken.');
    });
  });

  describe('Geist eines Roadies', () => {
    it('returns default text if nothing else triggers', () => {
      const dialogue = buildTourbusGhostDialogue();
      // Without Verbotenes Riff, it defaults to the 80er menu now since the original logic had an else branch
      expect(getDialogueText(dialogue)).toContain('Ich hab die 80er überlebt');
    });

    it('shows Geister-Drink interaction when player has it', () => {
      useStore.getState().addToInventory('Geister-Drink');
      const dialogue = buildTourbusGhostDialogue();
      expect(getDialogueText(dialogue)).toContain('Ist das... der Geister-Drink?');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(1);
      expect(options).toContain('Prost!');
    });

    it('does not complete ghost recipe when plan pickup limit is exhausted', () => {
      const store = useStore.getState();
      store.addQuest('ghost_recipe', 'Mixe den Geister-Drink für den Geist des Roadies');
      store.addToInventory('Geister-Drink');
      const moodBefore = store.bandMood;
      const socialBefore = store.skills.social;

      // Exhaust default pickup limit (1) for Verstärker-Schaltplan.
      store.addToInventory('Verstärker-Schaltplan');
      store.removeFromInventory('Verstärker-Schaltplan');

      const dialogue = buildTourbusGhostDialogue();
      if (typeof dialogue === 'string')
        throw new Error('Expected dialogue object for Geister-Drink branch');
      const prostOption = dialogue.options?.find((o) => o.text === 'Prost!');
      if (!prostOption) throw new Error('Prost option not found');

      executeDialogueOption(prostOption);
      const state = useStore.getState();

      // Quest should NOT complete; item should NOT be consumed when inventory fails
      expect(state.inventory).toContain('Geister-Drink');
      expect(state.flags.ghostRecipeQuestCompleted).toBe(false);
      const quest = state.quests.find((q) => q.id === 'ghost_recipe');
      expect(quest?.status).toBe('active');
      expect(state.bandMood).toBe(moodBefore);
      expect(state.skills.social).toBe(socialBefore);
    });

    it('sets bassist clue even when Bassist-Saite pickup fails', () => {
      setupTestState({
        flags: { ...useStore.getState().flags, bassist_clue_matze: true },
        trait: 'Mystic',
      });
      const store = useStore.getState();

      // Exhaust default pickup limit (1) for Bassist-Saite.
      store.addToInventory('Bassist-Saite');
      store.removeFromInventory('Bassist-Saite');

      const moodBefore = store.bandMood;
      const dialogue = buildTourbusGhostDialogue();
      if (typeof dialogue === 'string')
        throw new Error('Expected dialogue object for bassist clue branch');
      const mysticOption = dialogue.options?.find((o) => o.text.includes('[Mystic]'));
      if (!mysticOption) throw new Error('Mystic option not found');

      executeDialogueOption(mysticOption);
      const state = useStore.getState();

      expect(state.flags.bassist_clue_ghost).toBe(true);
      expect(state.bandMood).toBe(moodBefore + 20);
      expect(state.inventory).not.toContain('Bassist-Saite');
    });

    it('suppresses ghost recipe reminder when ghost_recipe quest is completed', () => {
      setupTestState({
        quests: [
          {
            id: 'ghost_recipe',
            text: 'Mixe den Geister-Drink für den Geist des Roadies',
            status: 'completed',
          },
        ],
      });

      const dialogue = buildTourbusGhostDialogue();

      expect(getDialogueText(dialogue)).not.toContain('Hast du den Geister-Drink schon gemixt?');
    });

    it('applies forbidden riff mood bonus only once', () => {
      const store = useStore.getState();
      store.addToInventory('Verbotenes Riff');

      const firstDialogue = buildTourbusGhostDialogue();
      if (typeof firstDialogue === 'string') {
        throw new Error('Expected dialogue object for forbidden riff branch');
      }
      const metalOption = firstDialogue.options?.find(
        (o) => o.text === 'Für den Metal tue ich alles.',
      );
      if (!metalOption) throw new Error('Metal option not found');

      const moodBefore = store.bandMood;
      executeDialogueOption(metalOption);
      const afterFirst = useStore.getState();
      expect(afterFirst.flags.tourbusGhostRiffUsed).toBe(true);
      expect(afterFirst.bandMood).toBe(moodBefore + 10);

      const secondDialogue = buildTourbusGhostDialogue();
      if (typeof secondDialogue === 'string') {
        throw new Error('Expected dialogue object for forbidden riff branch');
      }
      const metalOptionAgain = secondDialogue.options?.find(
        (o) => o.text === 'Für den Metal tue ich alles.',
      );
      if (!metalOptionAgain) throw new Error('Metal option not found on second pass');

      const moodBeforeSecond = useStore.getState().bandMood;
      executeDialogueOption(metalOptionAgain);
      const afterSecond = useStore.getState();
      expect(afterSecond.bandMood).toBe(moodBeforeSecond);
      expect(afterSecond.flags.tourbusGhostRiffUsed).toBe(true);
    });
  });

  describe('Band-Besprechung', () => {
    it('shows meeting options when not already done', () => {
      const dialogue = buildTourbusBandMeetingDialogue();
      expect(getDialogueText(dialogue)).toContain('Zeit für eine kurze Band-Besprechung');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(4);
      expect(options.some((o) => o.includes('[Diplomat]'))).toBe(true);
      expect(options.some((o) => o.includes('[Brutalist]'))).toBe(true);
    });

    it('returns simple text if meeting already happened', () => {
      setupTestState({
        flags: { ...useStore.getState().flags, tourbusBandMeeting: true },
      });
      const dialogue = buildTourbusBandMeetingDialogue();
      expect(getDialogueText(dialogue)).toContain('Die Bandbesprechung hat bereits stattgefunden.');
      expect(getOptionTexts(dialogue)).toHaveLength(0);
    });
  });
});
