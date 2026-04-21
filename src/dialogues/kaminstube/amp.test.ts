import { beforeEach, describe, expect, it } from 'vitest';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildKaminstubeAmpDialogue, buildKaminstubeTubePickupDialogue } from './amp';

describe('buildKaminstubeTubePickupDialogue', () => {
  beforeEach(() => setupTestState());

  it('adds a tube when pickup is allowed', () => {
    const dialogue = buildKaminstubeTubePickupDialogue();
    const stateAfter = useStore.getState();

    expect(dialogue.text).toContain('Ersatzröhre');
    expect(stateAfter.inventory).toContain('Röhre');
  });

  it('returns explicit failure text when pickup limit is reached', () => {
    setupTestState({
      itemPickupCounts: {
        ...useStore.getState().itemPickupCounts,
        Röhre: 1,
      },
    });

    const dialogue = buildKaminstubeTubePickupDialogue();
    const stateAfter = useStore.getState();

    expect(dialogue.text).toContain('keine weitere Ersatzröhre');
    expect(stateAfter.inventory).not.toContain('Röhre');
  });
});

describe('buildKaminstubeAmpDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns broken-amp text when no tube is available', () => {
    const dialogue = buildKaminstubeAmpDialogue();

    expect(dialogue.text).toContain('Amp ist stumm');
    expect(useStore.getState().flags.ampRepaired).toBe(false);
  });

  it('consumes tube, fixes amp and completes quest when tube exists', () => {
    setupTestState({
      inventory: ['Röhre'],
      quests: [
        ...useStore.getState().quests,
        {
          id: 'amp',
          text: 'Repariere Matzes Amp mit einer Ersatzröhre',
          status: 'active',
        },
      ],
    });
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildKaminstubeAmpDialogue();
    const stateAfter = useStore.getState();

    expect(dialogue.text).toContain('Amp funktioniert wieder');
    expect(stateAfter.inventory).not.toContain('Röhre');
    expect(stateAfter.flags.ampRepaired).toBe(true);
    expect(stateAfter.quests.find((quest) => quest.id === 'amp')?.status).toBe('completed');
    expect(stateAfter.bandMood).toBe(moodBefore + 30);
  });
});
