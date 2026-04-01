import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildTourbusAmpDialogue, buildTourbusHiddenStashDialogue, buildTourbusGhostDialogue, buildTourbusBandMeetingDialogue } from './objects';
import { setupTestState, getOptionTexts, getDialogueText } from '../shared/test-helpers';

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
  });

  describe('Band-Besprechung', () => {
    it('shows meeting options when not already done', () => {
      const dialogue = buildTourbusBandMeetingDialogue();
      expect(getDialogueText(dialogue)).toContain('Zeit für eine kurze Band-Besprechung');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(4);
      expect(options.some(o => o.includes('[Diplomat]'))).toBe(true);
      expect(options.some(o => o.includes('[Brutalist]'))).toBe(true);
    });

    it('returns simple text if meeting already happened', () => {
      setupTestState({ flags: { ...useStore.getState().flags, tourbusBandMeeting: true } });
      const dialogue = buildTourbusBandMeetingDialogue();
      expect(getDialogueText(dialogue)).toContain('Die Bandbesprechung hat bereits stattgefunden.');
      expect(getOptionTexts(dialogue)).toHaveLength(0);
    });
  });
});