import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import {
  buildVoidCosmicEchoDialogue,
  buildVoidDarkMatterPickupDialogue,
  buildVoidEgoDialogue,
  buildVoidPortalDialogue,
} from './objects';

describe('VoidStation object builders', () => {
  beforeEach(() => setupTestState());

  it('registers cosmic_echo quest and resolves it via visionary branch', () => {
    setupTestState({
      trait: 'Visionary',
    });

    const dialogue = buildVoidCosmicEchoDialogue();
    const option = dialogue.options?.find((entry) =>
      entry.text.includes('[Visionary]')
    );

    if (!option) {
      throw new Error('Expected visionary cosmic echo option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.cosmic_echo).toBe(true);
    expect(
      stateAfter.quests.find((quest) => quest.id === 'cosmic_echo')?.status
    ).toBe('completed');
  });

  it('allows picking up dark matter multiple times', () => {
    setupTestState({
      itemPickupCounts: {
        ...useStore.getState().itemPickupCounts,
        'Dunkle Materie': 999,
      },
    });

    const dialogue = buildVoidDarkMatterPickupDialogue();

    expect(dialogue.text).toContain('aufgehoben');
    expect(dialogue.text).not.toContain('keinen weiteren Klumpen');
  });

  it('handles ego strategy branch and marks ego contained', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        mariusEgoStrategy: true,
      },
      quests: [
        ...useStore.getState().quests,
        {
          id: 'ego',
          text: "Fange Marius' entflohenes Ego ein",
          status: 'active',
        },
      ],
    });

    const dialogue = buildVoidEgoDialogue();
    const option = dialogue.options?.find(
      (entry) => entry.text === 'Wende unsere Strategie an.'
    );

    if (!option) {
      throw new Error('Expected ego strategy option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.egoContained).toBe(true);
    expect(stateAfter.quests.find((quest) => quest.id === 'ego')?.status).toBe(
      'completed'
    );
  });

  it('returns stabilized portal line only when void is refueled', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        voidRefueled: true,
      },
    });

    const dialogue = buildVoidPortalDialogue();

    expect(dialogue.text).toContain('Das Portal stabilisiert sich');
  });
});
