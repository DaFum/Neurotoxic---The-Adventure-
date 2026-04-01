import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildTourbusMariusDialogue } from './marius';
import { setupTestState, getOptionTexts, getDialogueText } from '../shared/test-helpers';

describe('buildTourbusMariusDialogue', () => {
  beforeEach(() => setupTestState());

  it('prompts to return ego when player has it', () => {
    useStore.getState().addToInventory('Marius Ego');
    const dialogue = buildTourbusMariusDialogue();
    expect(getDialogueText(dialogue)).toContain('Ist das... mein Ego? Es fühlt sich so... klein an');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(2);
    expect(options).toContain('Es ist jetzt sicher.');
    expect(options).toContain('Ich behalte es als Pfand.');
  });

  it('shows depression dialogue when bandMood is low without ego', () => {
    setupTestState({
      bandMood: 20,
      flags: { ...useStore.getState().flags, marius_tourbus_doubt: true },
    });
    const dialogue = buildTourbusMariusDialogue();
    expect(getDialogueText(dialogue)).toContain('Ich bin ein Betrug. Ohne mein Ego bin ich nur ein Typ, der in ein Mikrofon schreit.');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(3);
    expect(options.some(o => o.includes('[Social 7]'))).toBe(true);
    expect(options.some(o => o.includes('[Diplomat]'))).toBe(true);
    expect(options).toContain('Dann hör auf zu jammern.');
  });

  it('shows confident dialogue when bandMood is high without ego', () => {
    setupTestState({ bandMood: 70 });
    const dialogue = buildTourbusMariusDialogue();
    expect(getDialogueText(dialogue)).toContain('Die Energie im Bus ist fantastisch!');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(2);
    expect(options.some(o => o.includes('[Performer]'))).toBe(true);
    expect(options).toContain('Wir sind auf dem Weg.');
  });
});