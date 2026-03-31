import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumMatzeDialogue } from './matze';
import { setupTestState, getOptionTexts } from '../shared/test-helpers';

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

  it('returns riff warning dialogue when water is cleaned and bandMood > 60', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, waterCleaned: true },
      bandMood: 65,
    });

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Manager! Ich bin so hyped, ich zeig dir meinen neuen Power-Chord. Bereit?');
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
    expect(options.some(o => o.includes('[Performer]'))).toBe(true);
    expect(options.some(o => o.includes('[Cynic]'))).toBe(true);
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
    expect(options.some(o => o.includes('[Performer]'))).toBe(false);
    expect(options.some(o => o.includes('[Cynic]'))).toBe(false);
    expect(options).toContain('Erzähl mir von der Tour 1982.');
  });
});