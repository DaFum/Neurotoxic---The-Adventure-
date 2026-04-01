import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { buildProberaumMariusDialogue } from './marius';
import { setupTestState, getOptionTexts } from '../shared/test-helpers';
import { executeDialogueOption } from '../../dialogueEngine';

describe('buildProberaumMariusDialogue', () => {
  beforeEach(() => setupTestState());

  it('prompts for beer when missing', () => {
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.text).toContain('Ohne ein kühles Bier kann ich nicht singen');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(2); // 'Ich beeile mich' and 'Trink doch Wasser'
  });

  it('shows beer handover option when player has beer', () => {
    useStore.getState().addToInventory('Bier');
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.text).toContain('Ohne ein kühles Bier kann ich nicht singen');
    const options = getOptionTexts(dialogue);
    expect(options).toContain('Hier ist dein Bier.');
  });

  it('beer handover consumes Bier, completes beer quest, sets flag, boosts mood — does NOT complete marius quest', () => {
    useStore.getState().addToInventory('Bier');
    useStore.getState().addQuest('beer', 'Besorg Marius ein Bier');
    useStore.getState().addQuest('marius', 'Beruhige Marius vor dem Auftritt');
    const moodBefore = useStore.getState().bandMood;

    const dialogue = buildProberaumMariusDialogue();
    const beerOption = dialogue.options?.find(o => o.text === 'Hier ist dein Bier.');
    if (!beerOption) throw new Error('Beer option not found');

    executeDialogueOption(beerOption);
    const state = useStore.getState();

    expect(state.inventory).not.toContain('Bier');
    expect(state.flags.gaveBeerToMarius).toBe(true);
    expect(state.bandMood).toBe(moodBefore + 15);
    const beerQuest = state.quests.find(q => q.id === 'beer');
    expect(beerQuest?.status).toBe('completed');
    // marius quest must stay active — it resolves in Backstage
    const mariusQuest = state.quests.find(q => q.id === 'marius');
    expect(mariusQuest?.status).toBe('active');
  });

  it('Social 5 calm-down sets mariusCalmedDown flag without completing marius quest', () => {
    setupTestState({ skills: { ...useStore.getState().skills, social: 5 } });
    useStore.getState().addQuest('marius', 'Beruhige Marius vor dem Auftritt');

    const dialogue = buildProberaumMariusDialogue();
    const calmOption = dialogue.options?.find(o => o.text?.includes('[Social 5]'));
    if (!calmOption) throw new Error('Social 5 calm option not found');

    executeDialogueOption(calmOption);
    const state = useStore.getState();

    expect(state.flags.mariusCalmedDown).toBe(true);
    const mariusQuest = state.quests.find(q => q.id === 'marius');
    expect(mariusQuest?.status).toBe('active');
  });

  it('shows trait options when conditions are met and no beer given', () => {
    setupTestState({ trait: 'Visionary', skills: { ...useStore.getState().skills, social: 5 } });
    const dialogue = buildProberaumMariusDialogue();
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(4); // 2 default + Visionary + Social
    expect(options.some(o => o.includes('[Visionary]'))).toBe(true);
    expect(options.some(o => o.includes('[Social 5]'))).toBe(true);
  });

  it('returns plain text when beer is given but bandMood is low', () => {
    setupTestState({ flags: { ...useStore.getState().flags, gaveBeerToMarius: true }, bandMood: 40 });
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.text).toContain('Prost!');
    expect(dialogue.options).toBeUndefined();
  });

  it('returns menu options when beer is given and bandMood is high', () => {
    setupTestState({ flags: { ...useStore.getState().flags, gaveBeerToMarius: true }, bandMood: 60 });
    const dialogue = buildProberaumMariusDialogue();
    expect(dialogue.text).toContain('Prost!');
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(2); // Prep question and default
    expect(options).toContain('Wie bereitest du dich auf Salzgitter vor?');
    expect(options).toContain('Bereit für den Gig?');
  });

  it('shows trait options when beer is given and bandMood is high', () => {
    setupTestState({ flags: { ...useStore.getState().flags, gaveBeerToMarius: true }, bandMood: 60, trait: 'Cynic' });
    const dialogue = buildProberaumMariusDialogue();
    const options = getOptionTexts(dialogue);
    expect(options).toHaveLength(3); // Prep, Cynic, default
    expect(options.some(o => o.includes('[Cynic]'))).toBe(true);
  });
});