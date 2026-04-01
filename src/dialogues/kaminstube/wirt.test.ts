import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { getOptionTexts, setupTestState } from '../shared/test-helpers';
import { buildKaminstubeWirtDialogue } from './wirt';

describe('buildKaminstubeWirtDialogue', () => {
  beforeEach(() => setupTestState());

  it('delegates prelude branches before general bark logic', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        kaminstube_wirt_betrayal: true,
      },
    });

    const dialogue = buildKaminstubeWirtDialogue();
    expect(dialogue.text).toContain('Verschwinde. Der Lärm hat diese Stadt schon einmal ruiniert.');
  });

  it('adds ghost shortcut in the 1982 legacy branch', () => {
    setupTestState({
      bandMood: 85,
      flags: {
        ...useStore.getState().flags,
        askedAbout1982: true,
        ghostTrustEarned: true,
      },
    });

    const dialogue = buildKaminstubeWirtDialogue();
    const options = getOptionTexts(dialogue);

    expect(dialogue.text).toContain('Ihr habt die Stimmung zum Kochen gebracht');
    expect(options[0]).toBe('Der Geist hat mich geschickt.');
    expect(options).toContain('Erzähl mir die ganze Geschichte von 1982.');
  });

  it('keeps the high-mood small-talk branch and its mood reward', () => {
    setupTestState({
      bandMood: 85,
    });
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildKaminstubeWirtDialogue();
    const option = dialogue.options?.find((entry) => entry.text === 'Erzähl mir vom Gig 1982.');

    if (!option) {
      throw new Error('Expected high-mood 1982 option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.bandMood).toBe(moodBefore + 10);
    expect(stateAfter.dialogue?.text).toContain('Fenster in ganz Tangermünde zersprangen');
  });

  it('serves beer in the neutral branch when none is carried', () => {
    setupTestState({
      bandMood: 50,
    });

    const dialogue = buildKaminstubeWirtDialogue();
    const option = dialogue.options?.find((entry) => entry.text === 'Ein Bier, bitte.');

    if (!option) {
      throw new Error('Expected beer option in neutral bark branch');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.inventory).toContain('Bier');
    expect(stateAfter.dialogue?.text).toContain('offizielle Schmiermittel');
  });
});