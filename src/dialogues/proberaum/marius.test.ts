import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumMariusDialogue } from './marius';

describe('buildProberaumMariusDialogue', () => {
  beforeEach(() => {
    useStore.getState().resetGame();
  });

  it('prompts for beer when missing', () => {
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.text).toContain('Ohne ein kühles Bier kann ich nicht singen');
    expect(dialogue.options).toHaveLength(2); // 'Ich beeile mich' and 'Trink doch Wasser'
  });

  it('shows beer handover option when player has beer', () => {
    useStore.getState().addToInventory('Bier');
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.text).toContain('Ohne ein kühles Bier kann ich nicht singen');
    expect(dialogue.options).toHaveLength(3);
    expect(dialogue.options?.[0].text).toBe('Hier ist dein Bier.');
  });

  it('shows trait options when conditions are met and no beer given', () => {
    useStore.setState({ trait: 'Visionary', skills: { ...useStore.getState().skills, social: 5 } });
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.options).toHaveLength(4); // 2 default + Visionary + Social
    expect(dialogue.options?.[2].text).toContain('[Visionary]');
    expect(dialogue.options?.[3].text).toContain('[Social 5]');
  });

  it('returns plain text when beer is given but bandMood is low', () => {
    useStore.setState({ flags: { ...useStore.getState().flags, gaveBeerToMarius: true }, bandMood: 40 });
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.text).toContain('Prost!');
    expect(dialogue.options).toBeUndefined();
  });

  it('returns menu options when beer is given and bandMood is high', () => {
    useStore.setState({ flags: { ...useStore.getState().flags, gaveBeerToMarius: true }, bandMood: 60 });
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.text).toContain('Prost!');
    expect(dialogue.options).toHaveLength(2); // Prep question and default
    expect(dialogue.options?.[0].text).toContain('Wie bereitest du dich auf Salzgitter vor?');
    expect(dialogue.options?.[1].text).toContain('Bereit für den Gig?');
  });

  it('shows trait options when beer is given and bandMood is high', () => {
    useStore.setState({ flags: { ...useStore.getState().flags, gaveBeerToMarius: true }, bandMood: 60, trait: 'Cynic' });
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.options).toHaveLength(3); // Prep, Cynic, default
    expect(dialogue.options?.[1].text).toContain('[Cynic]');
  });
});