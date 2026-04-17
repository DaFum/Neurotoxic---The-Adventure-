import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumMatzeDialogue, buildMatze1982Dialogue } from './matze';
import { setupTestState, getOptionTexts } from '../shared/test-helpers';
import { executeDialogueOption } from '../../dialogueEngine';

describe('buildProberaumMatzeDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns deep talk dialogue when matzeDeepTalk is true', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, matzeDeepTalk: true },
    });

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Der Lärm... er ist die einzige Wahrheit.');
    expect(dialogue.options).toBeUndefined();
  });

  it('returns Talisman dialogue when player has Industrie-Talisman', () => {
    useStore.getState().addToInventory('Industrie-Talisman');
    const dialogue = buildProberaumMatzeDialogue();

    expect(dialogue.text).toContain('Ist das der Industrie-Talisman?!');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(2);
    expect(options).toContain('Es ist für die Band.');
    expect(options).toContain('Behalte es für dich.');
  });

  it('returns Forbidden Riff dialogue when player has Verbotenes Riff and has not shown it', () => {
    useStore.getState().addToInventory('Verbotenes Riff');
    const dialogue = buildProberaumMatzeDialogue();

    expect(dialogue.text).toContain('Hast du etwa das Verbotene Riff gefunden?!');
    expect(getOptionTexts(dialogue)).toContain('Ja, es vibriert in meinem Rucksack.');
  });

  it('returns water dialogue when water is not cleaned', () => {
    const dialogue = buildProberaumMatzeDialogue();

    expect(dialogue.text).toContain('Verdammt, der Proberaum ist geflutet!');
    const options = getOptionTexts(dialogue);
    expect(options).toContain('Ich kümmere mich darum.');
    expect(options).toContain('Vielleicht ist es ein Zeichen für ein neues Genre?');
  });

  it('returns medium mood water dialogue when bandMood is between 40 and 60', () => {
    setupTestState({ bandMood: 50 });

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Der Raum ist zwar nass, aber ich bin heiß wie Frittenfett!');
  });

  it('returns high mood water dialogue when bandMood is above 60', () => {
    setupTestState({ bandMood: 65 });

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Hey Manager! Ich hab ein paar neue Riffs geschrieben!');
  });

  it('returns riff warning dialogue when water is cleaned and bandMood > 60', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, waterCleaned: true },
      bandMood: 65,
    });

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain(
      'Manager! Ich bin so hyped, ich zeig dir meinen neuen Power-Chord. Bereit?',
    );
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(2);
    expect(options[0]).toContain('Lass hören!');
    expect(options[1]).toBe('Heb es dir für Salzgitter auf.');
  });

  it('returns default cleaned-room dialogue with conditional trait options', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, waterCleaned: true, matzeRiffWarning: true },
      bandMood: 75,
    });

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Alter, ich fühl mich wie ein junger Gott!');

    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(5);
    expect(options).toContain('Immer doch. Rock on!');
    expect(options.some((o) => o.includes('[Performer]'))).toBe(true);
    expect(options.some((o) => o.includes('[Cynic]'))).toBe(true);
    expect(options).toContain('Erzähl mir von der Tour 1982.');
    expect(options).toContain('Eigentlich wollte ich nur die Buchhaltung machen.');
  });

  it('hides Performer and Cynic options when their respective flags are true', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        waterCleaned: true,
        matzeRiffWarning: true,
        matzePerformerTalk: true,
        matzeCynicOneShot: true,
      },
      bandMood: 75,
    });

    const dialogue = buildProberaumMatzeDialogue();
    const options = getOptionTexts(dialogue);

    expect(options).toHaveLength(3);
    expect(options.some((o) => o.includes('[Performer]'))).toBe(false);
    expect(options.some((o) => o.includes('[Cynic]'))).toBe(false);
    expect(options).toContain('Erzähl mir von der Tour 1982.');
  });
});

describe('buildMatze1982Dialogue', () => {
  beforeEach(() => setupTestState());

  it('sets bassist_clue_matze but not frequenz1982_proberaum when pickup limit is reached in Mystic branch', () => {
    setupTestState({ trait: 'Mystic' });
    const store = useStore.getState();
    // Fill the pickup limit (default limit is 2 for Frequenzfragment)
    store.addToInventory('Frequenzfragment');
    store.addToInventory('Frequenzfragment');

    const dialogue = buildMatze1982Dialogue();
    const mysticOption = dialogue.options?.find((o) => o.text.includes('[Mystic]'));
    expect(mysticOption).toBeDefined();

    executeDialogueOption(mysticOption!);

    const stateAfter = useStore.getState();
    expect(stateAfter.flags.bassist_clue_matze).toBe(true);
    expect(stateAfter.flags.frequenz1982_proberaum).toBe(false);
    expect(stateAfter.dialogue?.text).toContain(
      'Das Fragment ist echt, aber du kannst gerade keins mehr tragen.',
    );
  });
});
