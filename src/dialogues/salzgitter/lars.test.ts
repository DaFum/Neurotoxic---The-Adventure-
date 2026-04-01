import { beforeEach, describe, expect, it } from 'vitest';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildSalzgitterLarsDialogue } from './lars';

describe('buildSalzgitterLarsDialogue', () => {
  beforeEach(() => setupTestState());

  it('awards paced bonus once and sets salzgitter_lars_paced_talked', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        lars_paced: true,
      },
    });
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildSalzgitterLarsDialogue();
    expect(dialogue.text).toContain('im Backstage gebremst');

    // Find and execute the paced option action
    const pacedOption = dialogue.options?.[0];
    expect(pacedOption).toBeDefined();
    if (pacedOption?.action) {
      pacedOption.action();
    }

    const stateAfter = useStore.getState();
    expect(stateAfter.flags.salzgitter_lars_paced_talked).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 25);
  });
});
