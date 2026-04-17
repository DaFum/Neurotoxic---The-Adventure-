import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import {
  buildProberaumWallCracksDialogue,
  buildProberaumPuddleDialogue,
  buildProberaumDrumMachineDialogue,
  buildProberaumMonitorDialogue,
  buildProberaumAmpDialogue,
} from './objects';
import { setupTestState, getOptionTexts } from '../shared/test-helpers';
import { executeDialogueOption } from '../../dialogueEngine';

describe('Proberaum Objects Dialogues', () => {
  beforeEach(() => setupTestState());

  describe('Wall Cracks', () => {
    it('returns the correct text and options', () => {
      const dialogue = buildProberaumWallCracksDialogue();
      expect(dialogue.text).toContain('Risse in der Wand');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(3);
      expect(options.some((o) => o.includes('[Visionary]'))).toBe(true);
    });
  });

  describe('Puddle', () => {
    it('returns static text regardless of inventory (mop logic lives in Proberaum.tsx onInteract)', () => {
      const dialogue = buildProberaumPuddleDialogue();
      expect(dialogue.text).toContain('Das ist eine riesige Pfütze.');
      expect(dialogue.options).toBeUndefined();
    });
  });

  describe('Drum Machine', () => {
    it('starts quest when riff is missing', () => {
      const dialogue = buildProberaumDrumMachineDialogue();
      expect(dialogue.text).toContain('Mir fehlt die ultimative Schwingung.');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(2);
      expect(options).toContain('Was suchst du?');
    });

    it('requests riff absorption when riff is found', () => {
      useStore.getState().addToInventory('Verbotenes Riff');
      const dialogue = buildProberaumDrumMachineDialogue();
      expect(dialogue.text).toContain('DIESE FREQUENZ! Es ist das Verbotene Riff!');
      expect(getOptionTexts(dialogue)).toHaveLength(2);
    });

    it('does not complete quest or grant rewards when Quanten-Kabel pickup limit is exhausted', () => {
      const store = useStore.getState();
      store.addToInventory('Verbotenes Riff');
      store.addQuest('drum_machine', 'Finde das Verbotene Riff für die TR-8080');

      // Exhaust default pickup limit (1) for Quanten-Kabel.
      store.addToInventory('Quanten-Kabel');
      store.removeFromInventory('Quanten-Kabel');

      const moodBefore = store.bandMood;
      const chaosBefore = store.skills.chaos;

      const dialogue = buildProberaumDrumMachineDialogue();
      const feedOption = dialogue.options?.find(
        (o) => o.text === 'Ja, füttere deine Schaltkreise.',
      );
      expect(feedOption).toBeDefined();

      executeDialogueOption(feedOption!);
      const state = useStore.getState();

      expect(state.inventory).toContain('Verbotenes Riff');
      expect(state.flags.drumMachineQuestCompleted).toBe(false);
      const quest = state.quests.find((q) => q.id === 'drum_machine');
      expect(quest?.status).toBe('active');
      expect(state.bandMood).toBe(moodBefore);
      expect(state.skills.chaos).toBe(chaosBefore);
    });

    it('treats completed drum_machine quest as source of truth', () => {
      setupTestState({
        quests: [
          {
            id: 'drum_machine',
            text: 'Finde das Verbotene Riff für die TR-8080',
            status: 'completed',
          },
        ],
      });

      const dialogue = buildProberaumDrumMachineDialogue();

      expect(dialogue.text).toContain('Mein Geist ist eins mit dem Riff');
      expect(dialogue.options).toBeUndefined();
    });
  });

  describe('Amp', () => {
    it('initial encounter returns static text if not heard', () => {
      const dialogue = buildProberaumAmpDialogue();
      expect(dialogue.text).toContain('Ich habe Dinge gesehen, Manager.');
      const options = getOptionTexts(dialogue);
      expect(options).toHaveLength(1);
      expect(options).toContain('Was brauchst du?');
    });

    it('returns options when heard but not repaired', () => {
      setupTestState({
        flags: { ...useStore.getState().flags, talkingAmpHeard: true },
      });
      const dialogue = buildProberaumAmpDialogue();
      expect(dialogue.text).toContain('Ich brauche einen Lötkolben und Schrottmetall');
      const options = getOptionTexts(dialogue);
      expect(options).toContain('Ich suche weiter.');
      expect(options).not.toContain('Repariere den Amp.');
    });

    it('can repair the amp when required items are in inventory', () => {
      setupTestState({
        flags: { ...useStore.getState().flags, talkingAmpHeard: true },
      });
      useStore.getState().addToInventory('Lötkolben');
      useStore.getState().addToInventory('Schrottmetall');
      const dialogue = buildProberaumAmpDialogue();
      expect(dialogue.text).toContain('kannst du meine Schaltkreise neu verlöten');
      const options = getOptionTexts(dialogue);
      expect(options).toContain('Repariere den Amp.');

      const repairOption = dialogue.options?.find((o) => o.text === 'Repariere den Amp.');
      expect(repairOption).toBeDefined();
      executeDialogueOption(repairOption!);
      const state = useStore.getState();
      expect(state.inventory).not.toContain('Lötkolben');
      expect(state.inventory).not.toContain('Schrottmetall');
      expect(state.flags.talkingAmpRepaired).toBe(true);
    });

    it('can start therapy when repaired', () => {
      setupTestState({
        flags: { ...useStore.getState().flags, talkingAmpRepaired: true },
      });
      const dialogue = buildProberaumAmpDialogue();
      expect(dialogue.text).toContain('warum bin ich hier');
      const options = getOptionTexts(dialogue);
      expect(options).toContain('Lass uns über deine Existenz reden.');
    });

    it('returns therapy options when therapy is started', () => {
      setupTestState({
        flags: { ...useStore.getState().flags, ampTherapyStarted: true },
        trait: 'Brutalist',
      });
      useStore
        .getState()
        .addQuest('amp_therapy', 'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch');
      const dialogue = buildProberaumAmpDialogue();
      expect(dialogue.text).toContain('Bin ich nur ein Werkzeug oder ein Bewusstsein?');
      const options = getOptionTexts(dialogue);
      expect(options.length).toBeGreaterThan(0);

      const brutalistOption = dialogue.options?.find((o) => o.text.includes('Werkzeug'));
      expect(brutalistOption).toBeDefined();
      executeDialogueOption(brutalistOption!);
      const state = useStore.getState();
      expect(state.flags.ampTherapyCompleted).toBe(true);
    });

    it('returns final text when therapy is completed', () => {
      setupTestState({
        flags: { ...useStore.getState().flags, ampTherapyCompleted: true },
      });
      const dialogue = buildProberaumAmpDialogue();
      expect(dialogue.text).toContain('Ich fühle mich... besser.');
      expect(dialogue.options).toBeUndefined();
    });
  });

  describe('Feedback Monitor', () => {
    it('gives quest on first talk', () => {
      const dialogue = buildProberaumMonitorDialogue();
      expect(dialogue.text).toContain(
        'Meine Schaltkreise sind mit dem Rauschen der Ewigkeit gefüllt.',
      );
      expect(getOptionTexts(dialogue)).toHaveLength(2);
    });

    it('returns completion when cable is found', () => {
      setupTestState({
        flags: { ...useStore.getState().flags, feedbackMonitorTalked: true },
      });
      useStore.getState().addToInventory('Quanten-Kabel');
      const dialogue = buildProberaumMonitorDialogue();
      expect(dialogue.text).toContain(
        'Das Quanten-Kabel! Meine Frequenzen... sie stabilisieren sich!',
      );
      expect(getOptionTexts(dialogue)).toHaveLength(1);
    });

    it('uses feedback_monitor completed quest as source of truth', () => {
      setupTestState({
        quests: [
          {
            id: 'feedback_monitor',
            text: 'Finde das Quanten-Kabel für den Feedback Monitor',
            status: 'completed',
          },
        ],
      });

      const dialogue = buildProberaumMonitorDialogue();

      expect(dialogue.text).toContain('Du bist nun ein Meister der Frequenzen');
      expect(dialogue.options).toBeUndefined();
    });
  });
});
