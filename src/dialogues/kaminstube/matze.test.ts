import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildKaminstubeMatzeDialogue } from './matze';

describe('buildKaminstubeMatzeDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns the broken amp line before the amp is fixed', () => {
    const dialogue = buildKaminstubeMatzeDialogue();

    expect(dialogue.text).toContain('Mein Amp hat den Geist aufgegeben');
    expect(dialogue.options).toBeUndefined();
  });

  it('completes the saboteur confession atomically for the diplomat branch', () => {
    setupTestState({
      trait: 'Diplomat',
      flags: {
        ...useStore.getState().flags,
        ampFixed: true,
        tourbus_sabotage_discovered: true,
      },
      quests: [
        ...useStore.getState().quests,
        { id: 'tourbus_saboteur', text: 'Finde den Saboteur im Tourbus', status: 'active' },
      ],
    });
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildKaminstubeMatzeDialogue();
    const option = dialogue.options?.find((entry) => entry.text.includes('[Diplomat]'));

    if (!option) {
      throw new Error('Expected diplomat confession option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.tourbus_matze_confession).toBe(true);
    expect(stateAfter.quests.find((quest) => quest.id === 'tourbus_saboteur')?.status).toBe('completed');
    expect(stateAfter.bandMood).toBe(moodBefore + 30);
    expect(stateAfter.dialogue?.text).toContain('Die Röhren glühen wieder');
  });

  it('returns the short follow-up line after Matze confessed', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        ampFixed: true,
        tourbus_sabotage_discovered: true,
        tourbus_matze_confession: true,
      },
    });

    const dialogue = buildKaminstubeMatzeDialogue();

    expect(dialogue.text).toContain('Ich spiele heute Abend nur für uns');
    expect(dialogue.options).toBeUndefined();
  });
});