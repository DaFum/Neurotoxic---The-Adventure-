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
    const stateAfter = useStore.getState();

    expect(dialogue.text).toContain('im Backstage gebremst');
    expect(stateAfter.flags.salzgitter_lars_paced_talked).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 25);
  });
});
