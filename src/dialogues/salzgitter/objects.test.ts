import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import {
  buildSalzgitterBassistDialogue,
  buildSalzgitterFanDialogue,
  buildSalzgitterFinaleDialogue,
} from './objects';

describe('Salzgitter object dialogues', () => {
  beforeEach(() => setupTestState());

  it('auto-restores bassist after completed mystery without items', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        voidBassistSpoken: true,
      },
      quests: [
        ...useStore.getState().quests,
        {
          id: 'bassist_mystery',
          text: 'Finde den Bassisten',
          status: 'completed',
        },
      ],
    });

    const dialogue = buildSalzgitterBassistDialogue();
    const stateAfter = useStore.getState();

    expect(dialogue.text).toContain('Ich segne diesen Gig');
    expect(stateAfter.flags.bassist_restored).toBe(true);
  });

  it('starts fan movement via social option', () => {
    setupTestState({
      skills: {
        ...useStore.getState().skills,
        social: 8,
      },
    });

    const dialogue = buildSalzgitterFanDialogue();
    const option = dialogue.options?.find((entry) =>
      entry.text.includes('[Social 8]')
    );

    if (!option) throw new Error('Expected social fan movement option');

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.fanMovement).toBe(true);
    expect(stateAfter.quests.find((q) => q.id === 'fan_movement')?.status).toBe(
      'completed'
    );
  });

  it('returns finalized text when finale already triggered', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        salzgitter_finalized: true,
      },
    });

    const dialogue = buildSalzgitterFinaleDialogue();

    expect(dialogue.text).toContain(
      'Die Buhne schweigt'.replace('Buhne', 'Bühne')
    );
  });

  it('returns finalized text when final quest is already completed', () => {
    setupTestState({
      quests: [
        {
          id: 'final',
          text: 'Spiele das Finale in Salzgitter',
          status: 'completed',
        },
      ],
    });

    const dialogue = buildSalzgitterFinaleDialogue();

    expect(dialogue.text).toContain(
      'Die Buhne schweigt'.replace('Buhne', 'Bühne')
    );
  });
});
