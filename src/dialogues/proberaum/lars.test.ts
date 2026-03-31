import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumLarsDialogue } from './lars';
import { setupTestState, getOptionTexts } from '../shared/test-helpers';

describe('buildProberaumLarsDialogue', () => {
  beforeEach(() => setupTestState());

  it('prompts for Mop when missing', () => {
    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Ich hab hier irgendwo einen Wischmopp gesehen');
    expect(dialogue.options).toBeUndefined();
  });

  it('tells player to wipe puddle when Mop is found but water is not cleaned', () => {
    useStore.getState().addToInventory('Mop');
    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Du hast den Mopp! Wisch die Pfütze in der Mitte auf!');
  });

  it('returns pessimistic dialogue if bandMood is low', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, waterCleaned: true },
      bandMood: 10,
    });
    useStore.getState().addToInventory('Mop');

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Ich pack meine Sticks ein. Dieser Gig wird ein Desaster.');
  });

  it('returns ready dialogue with trait options when water is cleaned and mood is ok', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, waterCleaned: true },
      bandMood: 50,
    });
    useStore.getState().addToInventory('Mop');

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Geiler Beat, oder?');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(3);
    expect(options.some(o => o.includes('[Performer]'))).toBe(true);
    expect(options.some(o => o.includes('[Technical 3]'))).toBe(true);
    expect(options).toContain('Weiter so.');
  });

  it('hides secrets if already discovered', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, waterCleaned: true, lars_proberaum_secret: true },
      bandMood: 50,
    });
    useStore.getState().addToInventory('Mop');

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Die Hi-Hat ist perfekt. Ich bin bereit.');
    expect(dialogue.options).toBeUndefined();
  });

  it('handles beer dialogue when Lars has not received beer yet', () => {
    useStore.getState().addToInventory('Bier');
    const dialogue = buildProberaumLarsDialogue();

    expect(dialogue.text).toContain('Ist das... ein kühles Blondes? Gib her');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(3);
    expect(options).toContain('Hier, lass es dir schmecken.');
    expect(options).toContain('Was ist deine Drum-Philosophie?');
    expect(options).toContain('Das ist für Marius.');
  });

  it('handles philosophy dialogue without pact when flags are partially set', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, larsDrumPhilosophy: true, larsRhythmPact: false },
    });

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Du kennst jetzt meine Philosophie. Der Beat ist alles.');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(2); // Pact, later
    expect(options).toContain('Lass uns einen Rhythmus-Pakt schließen.');
  });

  it('handles final pact state with beer', () => {
    setupTestState({
      flags: { ...useStore.getState().flags, larsDrumPhilosophy: true, larsRhythmPact: true },
    });
    useStore.getState().addToInventory('Bier');

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Der Pakt steht. Wir sind das Skelett der Welt. Und... ist das ein kühles Blondes?');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(2);
    expect(options).toContain('Hier, lass es dir schmecken.');
  });
});