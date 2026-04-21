import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildKaminstubeCrowdDialogue } from './crowd';

describe('buildKaminstubeCrowdDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns short bark once the crowd is already rallied', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        kaminstube_crowd_rallied: true,
      },
    });

    const dialogue = buildKaminstubeCrowdDialogue();

    expect(dialogue.text).toContain('Die Menge tobt');
    expect(dialogue.options).toBeUndefined();
  });

  it('applies social branch rewards and rally flag', () => {
    setupTestState({
      skills: {
        ...useStore.getState().skills,
        social: 5,
      },
    });
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildKaminstubeCrowdDialogue();
    const option = dialogue.options?.find((entry) => entry.text.includes('[Social 5]'));

    if (!option) {
      throw new Error('Expected social crowd option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.kaminstube_crowd_rallied).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 20);
    expect(stateAfter.skills.social).toBe(8);
  });

  it('keeps rally flag untouched in ignore branch', () => {
    const dialogue = buildKaminstubeCrowdDialogue();
    const option = dialogue.options?.find((entry) => entry.text === 'Ignorieren und aufbauen.');

    if (!option) {
      throw new Error('Expected ignore crowd option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.kaminstube_crowd_rallied).toBe(false);
    expect(stateAfter.dialogue?.text).toContain('Die Musik wird für sich selbst sprechen');
  });
});
