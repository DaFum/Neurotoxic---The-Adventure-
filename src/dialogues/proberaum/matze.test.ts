import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumMatzeDialogue } from './matze';

describe('buildProberaumMatzeDialogue', () => {
  beforeEach(() => {
    useStore.getState().resetGame();
  });

  it('returns deep talk dialogue when matzeDeepTalk is true', () => {
    useStore.setState({
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
    expect(dialogue.options).toHaveLength(2);
    expect(dialogue.options?.[0].text).toBe('Es ist für die Band.');
    expect(dialogue.options?.[1].text).toBe('Behalte es für dich.');
  });

  it('returns Forbidden Riff dialogue when player has Verbotenes Riff and has not shown it', () => {
    useStore.getState().addToInventory('Verbotenes Riff');

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Hast du etwa das Verbotene Riff gefunden?!');
    expect(dialogue.options).toHaveLength(2);
    expect(dialogue.options?.[0].text).toBe('Ja, es vibriert in meinem Rucksack.');
  });

  it('returns water dialogue when water is not cleaned', () => {
    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Verdammt, der Proberaum ist geflutet!');
    expect(dialogue.options).toHaveLength(2);
    expect(dialogue.options?.[0].text).toBe('Ich kümmere mich darum.');
    expect(dialogue.options?.[1].text).toBe('Vielleicht ist es ein Zeichen für ein neues Genre?');
  });

  it('returns riff warning dialogue when water is cleaned and bandMood > 60', () => {
    useStore.setState({
      flags: { ...useStore.getState().flags, waterCleaned: true },
      bandMood: 65,
    });

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Manager! Ich bin so hyped, ich zeig dir meinen neuen Power-Chord. Bereit?');
    expect(dialogue.options).toHaveLength(2);
    expect(dialogue.options?.[0].text).toContain('Lass hören!');
    expect(dialogue.options?.[1].text).toBe('Heb es dir für Salzgitter auf.');
  });

  it('returns default cleaned-room dialogue with conditional trait options', () => {
    useStore.setState({
      flags: { ...useStore.getState().flags, waterCleaned: true, matzeRiffWarning: true },
      bandMood: 75,
    });

    const dialogue = buildProberaumMatzeDialogue();
    expect(dialogue.text).toContain('Alter, ich fühl mich wie ein junger Gott!');
    // Immer doch, Performer, Cynic, Tour 1982, Buchhaltung -> 5 options by default when flags are false
    expect(dialogue.options).toHaveLength(5);

    expect(dialogue.options?.[0].text).toBe('Immer doch. Rock on!');
    expect(dialogue.options?.[1].text).toContain('[Performer]');
    expect(dialogue.options?.[2].text).toContain('[Cynic]');
    expect(dialogue.options?.[3].text).toBe('Erzähl mir von der Tour 1982.');
    expect(dialogue.options?.[4].text).toBe('Eigentlich wollte ich nur die Buchhaltung machen.');
  });

  it('hides Performer and Cynic options when their respective flags are true', () => {
    useStore.setState({
      flags: {
        ...useStore.getState().flags,
        waterCleaned: true,
        matzeRiffWarning: true,
        matzePerformerTalk: true,
        mariusEgoStrategy: true,
      },
      bandMood: 75,
    });

    const dialogue = buildProberaumMatzeDialogue();
    // Only Immer doch, Tour 1982, Buchhaltung -> 3 options
    expect(dialogue.options).toHaveLength(3);
    expect(dialogue.options?.[0].text).toBe('Immer doch. Rock on!');
    expect(dialogue.options?.[1].text).toBe('Erzähl mir von der Tour 1982.');
    expect(dialogue.options?.[2].text).toBe('Eigentlich wollte ich nur die Buchhaltung machen.');
  });
});