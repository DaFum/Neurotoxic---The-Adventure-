import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildSalzgitterMatzeDialogue } from './matze';

describe('buildSalzgitterMatzeDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns void-pick branch with high reward option', () => {
    setupTestState({
      inventory: ['Verbotenes Riff', 'Void-Plektrum'],
      skills: {
        ...useStore.getState().skills,
        chaos: 10,
      },
    });

    const dialogue = buildSalzgitterMatzeDialogue();
    const option = dialogue.options?.find((entry) =>
      entry.text.includes('[Chaos 10]')
    );

    if (!option) throw new Error('Expected chaos option for void pick branch');

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.matzeRiffDialogueDone).toBe(true);
    expect(stateAfter.dialogue?.text).toContain(
      'DER LARM WIRD UNSER GOTT SEIN'.replace('LARM', 'LÄRM')
    );
  });
});
