import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumWallCracksDialogue, buildProberaumPuddleDialogue, buildProberaumDrumMachineDialogue, buildProberaumMonitorDialogue } from './objects';
import { setupTestState, getOptionTexts, getDialogueText } from '../shared/test-helpers';

describe('Proberaum Objects Dialogues', () => {
  beforeEach(() => setupTestState());

  describe('Wall Cracks', () => {
    it('returns the correct text and options', () => {
      const dialogue = buildProberaumWallCracksDialogue();
      expect(getDialogueText(dialogue)).toContain('Risse in der Wand');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(3);
      expect(options.some(o => o.includes('[Visionary]'))).toBe(true);
    });
  });

  describe('Puddle', () => {
    it('returns default text when no mop', () => {
      const dialogue = buildProberaumPuddleDialogue();
      expect(getDialogueText(dialogue)).toContain('Das ist eine riesige Pfütze.');
      expect(getOptionTexts(dialogue)).toHaveLength(0);
    });

    it('returns completion text when mop is present', () => {
      useStore.getState().addToInventory('Mop');
      const dialogue = buildProberaumPuddleDialogue();
      expect(getDialogueText(dialogue)).toContain('Du hast das Wasser aufgewischt!');
    });
  });

  describe('Drum Machine', () => {
    it('starts quest when riff is missing', () => {
      const dialogue = buildProberaumDrumMachineDialogue();
      expect(getDialogueText(dialogue)).toContain('Mir fehlt die ultimative Schwingung.');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(2);
      expect(options).toContain('Was suchst du?');
    });

    it('requests riff absorption when riff is found', () => {
      useStore.getState().addToInventory('Verbotenes Riff');
      const dialogue = buildProberaumDrumMachineDialogue();
      expect(getDialogueText(dialogue)).toContain('DIESE FREQUENZ! Es ist das Verbotene Riff!');
      expect(getOptionTexts(dialogue)).toHaveLength(2);
    });
  });

  describe('Feedback Monitor', () => {
    it('gives quest on first talk', () => {
      const dialogue = buildProberaumMonitorDialogue();
      expect(getDialogueText(dialogue)).toContain('Meine Schaltkreise sind mit dem Rauschen der Ewigkeit gefüllt.');
      expect(getOptionTexts(dialogue)).toHaveLength(2);
    });

    it('returns completion when cable is found', () => {
      setupTestState({ flags: { ...useStore.getState().flags, feedbackMonitorTalked: true } });
      useStore.getState().addToInventory('Quanten-Kabel');
      const dialogue = buildProberaumMonitorDialogue();
      expect(getDialogueText(dialogue)).toContain('Das Quanten-Kabel! Meine Frequenzen... sie stabilisieren sich!');
      expect(getOptionTexts(dialogue)).toHaveLength(1);
    });
  });
});