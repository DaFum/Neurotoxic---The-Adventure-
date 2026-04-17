import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState, getOptionTexts } from '../shared/test-helpers';
import { buildBackstageMariusDialogue } from './marius';

describe('buildBackstageMariusDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns confident text when Marius is already calmed and mood is high', () => {
    setupTestState({
      bandMood: 75,
      flags: {
        ...useStore.getState().flags,
        mariusCalmed: true,
      },
    });

    const dialogue = buildBackstageMariusDialogue();
    expect(dialogue.text).toContain('Ich fühle mich wie ein Gott');
    expect(dialogue.options).toBeUndefined();
  });

  it('includes ego strategy option when strategy flag is set', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        mariusEgoStrategy: true,
      },
    });

    const dialogue = buildBackstageMariusDialogue();
    const options = getOptionTexts(dialogue);

    expect(options[0]).toBe('Erinnerst du dich an unsere Strategie?');
    expect(options).toContain('Du bist ein Gott am Mikrofon. Vertrau dir. [Social 5]');
  });

  it('applies nervous branch penalty when 1982 is not unlocked', () => {
    const moodBefore = useStore.getState().bandMood;
    const dialogue = buildBackstageMariusDialogue();
    const option = dialogue.options?.find(
      (entry) => entry.text === 'Denk an den Gig 1982. Wir haben Schlimmeres überlebt.',
    );

    if (!option) {
      throw new Error('Expected 1982 option in Marius dialogue');
    }

    executeDialogueOption(option);

    const stateAfter = useStore.getState();
    expect(stateAfter.bandMood).toBe(moodBefore - 5);
    expect(stateAfter.flags.mariusCalmed).toBe(false);
    expect(stateAfter.dialogue?.text).toContain('Da war ich noch nicht mal in der Band');
  });

  it('calms Marius and boosts confidence when social option is chosen', () => {
    setupTestState({
      skills: {
        ...useStore.getState().skills,
        social: 5,
      },
    });

    const moodBefore = useStore.getState().bandMood;
    const dialogue = buildBackstageMariusDialogue();
    const option = dialogue.options?.find((entry) => entry.text.includes('[Social 5]'));

    if (!option) {
      throw new Error('Expected social option in Marius dialogue');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.mariusCalmed).toBe(true);
    expect(stateAfter.flags.mariusConfidenceBoost).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 30);
    expect(stateAfter.dialogue?.text).toContain('Ein Gott des Lärms');
  });
});
