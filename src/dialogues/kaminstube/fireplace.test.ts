import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { getOptionTexts, setupTestState } from '../shared/test-helpers';
import { buildKaminstubeFireplaceDialogue } from './fireplace';

describe('buildKaminstubeFireplaceDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns all fireplace investigation options', () => {
    const dialogue = buildKaminstubeFireplaceDialogue();
    const options = getOptionTexts(dialogue);

    expect(dialogue.text).toContain('Der Kamin flüstert');
    expect(options).toContain('Ich fühle deine Wärme, alter Freund. [Mystic]');
    expect(options).toContain('Zwinge das Feuer zu sprechen! [Chaos 7]');
    expect(options).toContain('Die Akustik dieses Kamins... [Technical 8]');
    expect(options).toContain('Versuche, die Sprache zu deuten. [Diplomat]');
    expect(options).toContain('Ignoriere das Flüstern.');
  });

  it('applies lore unlock side effects for mystic option', () => {
    setupTestState({
      trait: 'Mystic',
    });
    useStore.getState().addQuest('forgotten_lore', 'Entschlüssele die vergessene Lore in der Kaminstube');

    const moodBefore = useStore.getState().bandMood;
    const dialogue = buildKaminstubeFireplaceDialogue();
    const option = dialogue.options?.find((entry) => entry.text.includes('[Mystic]'));

    if (!option) {
      throw new Error('Expected Mystic fireplace option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.forgotten_lore).toBe(true);
    expect(stateAfter.flags.kaminFeuerPact).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 20);
    expect(stateAfter.dialogue?.text).toContain('Der Kamin flüstert von Salzgitter');
  });

  it('applies chaos skill gain for chaos option', () => {
    setupTestState({
      skills: {
        ...useStore.getState().skills,
        chaos: 7,
      },
    });
    useStore.getState().addQuest('forgotten_lore', 'Entschlüssele die vergessene Lore in der Kaminstube');
    const chaosBefore = useStore.getState().skills.chaos;

    const dialogue = buildKaminstubeFireplaceDialogue();
    const option = dialogue.options?.find((entry) => entry.text.includes('[Chaos 7]'));

    if (!option) {
      throw new Error('Expected Chaos fireplace option');
    }

    executeDialogueOption(option);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.forgotten_lore).toBe(true);
    expect(stateAfter.skills.chaos).toBe(chaosBefore + 3);
  });
});