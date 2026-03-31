import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumWallCracksDialogue, buildProberaumPuddleDialogue, buildProberaumDrumMachineDialogue, buildProberaumMonitorDialogue } from './objects';

describe('Proberaum Objects Dialogues', () => {
  beforeEach(() => {
    useStore.getState().resetGame();
  });

  describe('Wall Cracks', () => {
    it('returns the correct text and options', () => {
      const dialogue = buildProberaumWallCracksDialogue();
      expect(dialogue.text).toContain('Risse in der Wand');
      expect(dialogue.options).toHaveLength(3);
      expect(dialogue.options?.[0].text).toContain('[Visionary]');
    });
  });

  describe('Puddle', () => {
    it('returns default text when no mop', () => {
      const dialogue = buildProberaumPuddleDialogue();
      expect(dialogue.text).toContain('Das ist eine riesige Pfütze.');
      expect(dialogue.options).toBeUndefined();
    });

    it('returns completion text when mop is present', () => {
      useStore.getState().addToInventory('Mop');
      const dialogue = buildProberaumPuddleDialogue();
      expect(dialogue.text).toContain('Du hast das Wasser aufgewischt!');
    });
  });

  describe('Drum Machine', () => {
    it('starts quest when riff is missing', () => {
      const dialogue = buildProberaumDrumMachineDialogue();
      expect(dialogue.text).toContain('Mir fehlt die ultimative Schwingung.');
      expect(dialogue.options).toHaveLength(2);
      expect(dialogue.options?.[0].text).toBe('Was suchst du?');
    });

    it('requests riff absorption when riff is found', () => {
      useStore.getState().addToInventory('Verbotenes Riff');
      const dialogue = buildProberaumDrumMachineDialogue();
      expect(dialogue.text).toContain('DIESE FREQUENZ! Es ist das Verbotene Riff!');
      expect(dialogue.options).toHaveLength(2);
    });
  });

  describe('Feedback Monitor', () => {
    it('gives quest on first talk', () => {
      const dialogue = buildProberaumMonitorDialogue();
      expect(dialogue.text).toContain('Meine Schaltkreise sind mit dem Rauschen der Ewigkeit gefüllt.');
      expect(dialogue.options).toHaveLength(2);
    });

    it('returns completion when cable is found', () => {
      useStore.setState({ flags: { ...useStore.getState().flags, feedbackMonitorTalked: true } });
      useStore.getState().addToInventory('Quanten-Kabel');
      const dialogue = buildProberaumMonitorDialogue();
      expect(dialogue.text).toContain('Das Quanten-Kabel! Meine Frequenzen... sie stabilisieren sich!');
      expect(dialogue.options).toHaveLength(1);
    });
  });
});