import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { getOptionTexts, setupTestState } from '../shared/test-helpers';
import { buildKaminstubeLarsDialogue } from './lars';

describe('buildKaminstubeLarsDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns the short follow-up line after Lars was already handled', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        kaminstube_lars_talked: true,
      },
    });

    const dialogue = buildKaminstubeLarsDialogue();
    expect(dialogue.text).toContain('Die Schmiede ruft');
    expect(dialogue.options).toBeDefined();
    expect(getOptionTexts(dialogue)).toContain('Gut so.');
  });

  it('prepends rhythm pact option when pact flag is set', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        larsRhythmPact: true,
      },
    });

    const dialogue = buildKaminstubeLarsDialogue();
    const options = getOptionTexts(dialogue);

    expect(dialogue.text).toContain('früher eine echte Schmiede');
    expect(options[0]).toBe('Dieser Ort hat einen eigenen Rhythmus.');
    expect(options).toContain('Dann spiel im Takt der Hämmer. [Technical 5]');
  });

  it('applies technical branch reward and talk flag', () => {
    setupTestState({
      skills: {
        ...useStore.getState().skills,
        technical: 5,
      },
    });
    const moodBefore = useStore.getState().bandMood;
    const technicalBefore = useStore.getState().skills.technical;

    const dialogue = buildKaminstubeLarsDialogue();
    const option = dialogue.options?.find((entry) => entry.text.includes('[Technical 5]'));

    if (!option) {
      throw new Error('Expected technical Lars option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.kaminstube_lars_talked).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 15);
    expect(stateAfter.skills.technical).toBe(technicalBefore + 3);
    expect(stateAfter.dialogue?.text).toContain('120 BPM');
  });

  it('applies chaos branch reward and talk flag', () => {
    setupTestState({
      skills: {
        ...useStore.getState().skills,
        chaos: 5,
      },
    });
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildKaminstubeLarsDialogue();
    const option = dialogue.options?.find((entry) => entry.text.includes('[Chaos 5]'));

    if (!option) {
      throw new Error('Expected chaos Lars option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.kaminstube_lars_talked).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 20);
    expect(stateAfter.dialogue?.text).toContain('Polyrhythmus');
  });
});
