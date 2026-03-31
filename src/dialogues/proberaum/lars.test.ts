import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumLarsDialogue } from './lars';

describe('buildProberaumLarsDialogue', () => {
  beforeEach(() => {
    useStore.getState().resetGame();
  });

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
    useStore.getState().addToInventory('Mop');
    useStore.setState({
      flags: { ...useStore.getState().flags, waterCleaned: true },
      bandMood: 10,
    });

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Ich pack meine Sticks ein. Dieser Gig wird ein Desaster.');
  });

  it('returns ready dialogue with trait options when water is cleaned and mood is ok', () => {
    useStore.getState().addToInventory('Mop');
    useStore.setState({
      flags: { ...useStore.getState().flags, waterCleaned: true },
      bandMood: 50,
    });

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Geiler Beat, oder?');
    expect(dialogue.options).toHaveLength(3);
    expect(dialogue.options?.[0].text).toContain('[Performer]');
    expect(dialogue.options?.[1].text).toContain('[Technical 3]');
    expect(dialogue.options?.[2].text).toBe('Weiter so.');
  });

  it('hides secrets if already discovered', () => {
    useStore.getState().addToInventory('Mop');
    useStore.setState({
      flags: { ...useStore.getState().flags, waterCleaned: true, lars_proberaum_secret: true },
      bandMood: 50,
    });

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Die Hi-Hat ist perfekt. Ich bin bereit.');
    expect(dialogue.options).toBeUndefined();
  });

  it('handles beer dialogue when Lars has not received beer yet', () => {
    useStore.getState().addToInventory('Bier');
    const dialogue = buildProberaumLarsDialogue();

    expect(dialogue.text).toContain('Ist das... ein kühles Blondes? Gib her');
    expect(dialogue.options).toHaveLength(3);
    expect(dialogue.options?.[0].text).toBe('Hier, lass es dir schmecken.');
    expect(dialogue.options?.[1].text).toBe('Was ist deine Drum-Philosophie?');
    expect(dialogue.options?.[2].text).toBe('Das ist für Marius.');
  });

  it('handles philosophy dialogue without pact when flags are partially set', () => {
    useStore.setState({
      flags: { ...useStore.getState().flags, larsDrumPhilosophy: true, larsRhythmPact: false },
    });

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Du kennst jetzt meine Philosophie. Der Beat ist alles.');
    expect(dialogue.options).toHaveLength(2); // Pact, later
    expect(dialogue.options?.[0].text).toBe('Lass uns einen Rhythmus-Pakt schließen.');
  });

  it('handles final pact state with beer', () => {
    useStore.getState().addToInventory('Bier');
    useStore.setState({
      flags: { ...useStore.getState().flags, larsDrumPhilosophy: true, larsRhythmPact: true },
    });

    const dialogue = buildProberaumLarsDialogue();
    expect(dialogue.text).toContain('Der Pakt steht. Wir sind das Skelett der Welt. Und... ist das ein kühles Blondes?');
    expect(dialogue.options).toHaveLength(2);
    expect(dialogue.options?.[0].text).toBe('Hier, lass es dir schmecken.');
  });
});