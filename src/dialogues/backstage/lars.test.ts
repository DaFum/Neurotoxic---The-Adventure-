import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { getOptionTexts, setupTestState } from '../shared/test-helpers';
import { buildBackstageLarsDialogue } from './lars';

describe('buildBackstageLarsDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns default exhausted text when no stimulant items are available', () => {
    const dialogue = buildBackstageLarsDialogue();
    expect(dialogue.text).toContain('Ohne Koffein geht hier gar nichts');
    expect(dialogue.options).toBeUndefined();
  });

  it('offers turbo options and prepends rhythm pact options', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        larsRhythmPact: true,
      },
    });
    useStore.getState().addToInventory('Turbo-Koffein');

    const dialogue = buildBackstageLarsDialogue();
    const options = getOptionTexts(dialogue);

    expect(dialogue.text).toContain('Turbo-Koffein');
    expect(options[0]).toBe('Lass den Rhythmus explodieren! [Chaos 5]');
    expect(options).toContain('Der Pakt hält.');
    expect(options).toContain('Trink es auf Ex!');
  });

  it('sets energized and removes turbo item when choosing drink it all', () => {
    useStore.getState().addToInventory('Turbo-Koffein');
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildBackstageLarsDialogue();
    const option = dialogue.options?.find(
      (entry) => entry.text === 'Trink es auf Ex!'
    );

    if (!option) {
      throw new Error('Expected turbo drink option for Lars');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.larsEnergized).toBe(true);
    expect(stateAfter.flags.larsVibrating).toBe(true);
    expect(stateAfter.inventory).not.toContain('Turbo-Koffein');
    expect(stateAfter.bandMood).toBe(moodBefore + 40);
  });

  it('returns vibrating philosophy branch with tactical options', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        larsEnergized: true,
        larsVibrating: true,
        larsDrumPhilosophy: false,
      },
    });

    const dialogue = buildBackstageLarsDialogue();
    const options = getOptionTexts(dialogue);

    expect(dialogue.text).toContain('ICH SEHE DIE ZEIT');
    expect(options).toContain('Konzentriere dich auf das Chaos. [Chaos 5]');
    expect(options).toContain('Folge dem Metronom. [Technical 5]');
  });

  it('consumes energy drink and energizes Lars in fallback stimulant path', () => {
    useStore.getState().addToInventory('Energiedrink');
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildBackstageLarsDialogue();
    const stateAfter = useStore.getState();

    expect(dialogue.text).toContain('Nicht so gut wie Turbo-Koffein');
    expect(stateAfter.flags.larsEnergized).toBe(true);
    expect(stateAfter.inventory).not.toContain('Energiedrink');
    expect(stateAfter.bandMood).toBe(moodBefore + 10);
  });
});
