import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildSalzgitterMariusDialogue } from './marius';

describe('buildSalzgitterMariusDialogue', () => {
  beforeEach(() => setupTestState());

  it('exposes performer opener and applies rewards', () => {
    setupTestState({
      trait: 'Performer',
    });
    const socialBefore = useStore.getState().skills.social;

    const dialogue = buildSalzgitterMariusDialogue();
    const option = dialogue.options?.find(
      (entry) => entry.text === 'Fokussiere dich auf die erste Reihe.',
    );

    if (!option) throw new Error('Expected performer opener option');

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.salzgitter_performer_talked).toBe(true);
    expect(stateAfter.skills.social).toBe(socialBefore + 5);
  });
});
