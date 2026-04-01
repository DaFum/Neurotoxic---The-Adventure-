import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildTourbusMatzeDialogue } from './matze';
import { setupTestState, getOptionTexts, getDialogueText } from '../shared/test-helpers';

describe('buildTourbusMatzeDialogue', () => {
  beforeEach(() => setupTestState());

  it('shows depressed state when bandMood < 20 and no fixed cable', () => {
    setupTestState({ bandMood: 10 });
    const dialogue = buildTourbusMatzeDialogue();
    expect(getDialogueText(dialogue)).toContain('Dieses kaputte Kabel ist das Ende der Band');
    expect(getOptionTexts(dialogue)).toHaveLength(0);
  });

  it('avoids early return when bandMood < 20 but cable is fixed (and not in inventory)', () => {
    setupTestState({
      bandMood: 10,
      flags: { ...useStore.getState().flags, cableFixed: true }
    });
    const dialogue = buildTourbusMatzeDialogue();
    expect(getDialogueText(dialogue)).not.toContain('Dieses kaputte Kabel ist das Ende der Band');
    expect(getDialogueText(dialogue)).toContain('Aber wenigstens funktioniert das Kabel wieder');
  });

  it('shows cable return options when player has Repariertes Kabel', () => {
    useStore.getState().addToInventory('Repariertes Kabel');
    const dialogue = buildTourbusMatzeDialogue();
    expect(getDialogueText(dialogue)).toContain('Hast du Angst vor Salzgitter?');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(5);
    expect(options.some(o => o.includes('[Visionary]'))).toBe(true);
    expect(options.some(o => o.includes('[Technical 5]'))).toBe(true);
  });

  it('shows sabotage options when sabotage is discovered but matze has not confessed', () => {
    setupTestState({ flags: { ...useStore.getState().flags, tourbus_sabotage_discovered: true, marius_tourbus_doubt: true } });
    const dialogue = buildTourbusMatzeDialogue();
    expect(getDialogueText(dialogue)).toContain('Das zerschnittene Kabel... okay, ich geb\'s ja zu.');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(3);
    expect(options.some(o => o.includes('[Social 5]'))).toBe(true);
    expect(options.some(o => o.includes('[Brutalist]'))).toBe(true);
  });

  it('prompts to search for tape when mood is ok and sabotage not yet discovered', () => {
    setupTestState({ bandMood: 50 });
    const dialogue = buildTourbusMatzeDialogue();
    expect(getDialogueText(dialogue)).toContain('Geht schon. Aber mein Kabel ist im Eimer. Hast du Klebeband?');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(3);
    expect(options).toContain('Ich suche danach.');
  });
});