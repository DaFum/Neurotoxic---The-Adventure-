import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { getOptionTexts, setupTestState } from '../shared/test-helpers';
import { buildKaminstubeWirtPreludeDialogue } from './wirtPrelude';

describe('buildKaminstubeWirtPreludeDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns betrayal text when wirt betrayal flag is set', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        kaminstube_wirt_betrayal: true,
      },
    });

    const dialogue = buildKaminstubeWirtPreludeDialogue();
    expect(dialogue?.text).toContain('Verschwinde. Der Lärm hat diese Stadt schon einmal ruiniert.');
  });

  it('returns bassist confession branch when bassist is contacted and clue is missing', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        bassist_contacted: true,
      },
    });

    const dialogue = buildKaminstubeWirtPreludeDialogue();
    if (!dialogue) throw new Error('Expected dialogue for bassist_contacted branch');

    const options = getOptionTexts(dialogue);
    expect(options).toContain('Zwinge ihn zur Wahrheit. [Social 8]');
    expect(options).toContain('Drohe ihm mit dem Lärm. [Brutalist]');
    expect(options).toContain('Verzeihe ihm. [Diplomat]');
  });

  it('returns secret item line when item was already granted', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        wirtSecretItem: true,
      },
    });

    const dialogue = buildKaminstubeWirtPreludeDialogue();
    expect(dialogue?.text).toContain('Viel Erfolg beim Gig');
  });

  it('grants old pick on talisman branch action', () => {
    const store = useStore.getState();
    store.addToInventory('Industrie-Talisman');
    const moodBefore = store.bandMood;

    const dialogue = buildKaminstubeWirtPreludeDialogue();
    if (!dialogue) throw new Error('Expected dialogue for talisman branch');

    const option = dialogue.options?.find((entry) => entry.text === 'Was ist das?');
    if (!option) throw new Error('Expected talisman reveal option');

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.inventory).toContain('Altes Plektrum');
    expect(stateAfter.flags.wirtSecretItem).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 20);
  });

  it('returns null when no prelude branch applies', () => {
    const dialogue = buildKaminstubeWirtPreludeDialogue();
    expect(dialogue).toBeNull();
  });
});