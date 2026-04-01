import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildVoidTankwartDialogue } from './tankwart';

describe('buildVoidTankwartDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns mystic prelude branch and grants splitter on success', () => {
    setupTestState({
      trait: 'Mystic',
    });

    const dialogue = buildVoidTankwartDialogue();
    const option = dialogue.options?.find(
      (entry) => entry.text === 'Ich suche die Wahrheit.'
    );

    expect(option).toBeDefined();

    executeDialogueOption(option!);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.tankwartMysticDone).toBe(true);
    expect(stateAfter.inventory).toContain('Splitter der Leere');
  });

  it('builds refuel options when dark matter is available', () => {
    setupTestState({
      inventory: ['Dunkle Materie'],
    });

    const dialogue = buildVoidTankwartDialogue();
    const optionTexts = dialogue.options?.map((entry) => entry.text) ?? [];

    expect(dialogue.text).toContain('Dunkle Materie');
    expect(optionTexts).toContain('440Hz - Standard Industrial Power.');
    expect(optionTexts).toContain(
      '432Hz - Wir wollen die Chakren der Fans öffnen.'
    );
  });
});
