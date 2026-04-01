import { beforeEach, describe, expect, it } from 'vitest';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildKaminstubeDrumMachineDialogue } from './drumMachine';

describe('buildKaminstubeDrumMachineDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns the expected TR-808 lore text', () => {
    const dialogue = buildKaminstubeDrumMachineDialogue();

    expect(dialogue.text).toContain('Ein alter TR-808');
    expect(dialogue.text).toContain('Herzstück der ersten NEUROTOXIC-Platte');
    expect(dialogue.options).toBeUndefined();
  });

  it('does not mutate band mood or flags when built', () => {
    const moodBefore = useStore.getState().bandMood;
    const flagBefore = useStore.getState().flags.kaminstubeDrumLoreHeard;

    buildKaminstubeDrumMachineDialogue();

    const stateAfter = useStore.getState();
    expect(stateAfter.bandMood).toBe(moodBefore);
    expect(stateAfter.flags.kaminstubeDrumLoreHeard).toBe(flagBefore);
  });
});