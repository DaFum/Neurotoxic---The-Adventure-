import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStore } from '../../store';
import { getOptionTexts, setupTestState } from '../shared/test-helpers';
import { buildBackstageRitualCircleDialogue } from './ritualCircle';

describe('buildBackstageRitualCircleDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns ritual options when Marius is calmed and ritual has not been performed', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        mariusCalmed: true,
      },
    });

    const ritualActionWrapper = vi.fn();
    const dialogue = buildBackstageRitualCircleDialogue(ritualActionWrapper);
    const options = getOptionTexts(dialogue);

    expect(dialogue.text).toContain('Zeit für unser Ritual');
    expect(options).toContain('Kosmisches Ritual. [Mystic]');
    expect(options).toContain('Showmanship Ritual. [Performer]');
    expect(options).toContain('Frequenz-Anpassung. [Technician]');
    expect(options).toContain('Einfacher Gruppen-Chant.');
  });

  it('returns completed frequency text when 1982 sequence is completed', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        frequenz1982_complete: true,
      },
    });

    const dialogue = buildBackstageRitualCircleDialogue(vi.fn());
    expect(dialogue.text).toContain('stetig im Takt von 1982');
    expect(dialogue.options).toBeUndefined();
  });

  it('consumes plasma igniter and grants mood when used at ritual circle', () => {
    const store = useStore.getState();
    store.addToInventory('Plasma-Zünder');
    const moodBefore = store.bandMood;

    const dialogue = buildBackstageRitualCircleDialogue(vi.fn());
    const stateAfter = useStore.getState();

    expect(dialogue.text).toContain('Du benutzt den Plasma-Zünder');
    expect(stateAfter.inventory).not.toContain('Plasma-Zünder');
    expect(stateAfter.bandMood).toBe(moodBefore + 30);
  });

  it('registers backstage ritual quest once when no special branch applies', () => {
    const moodBefore = useStore.getState().bandMood;

    const first = buildBackstageRitualCircleDialogue(vi.fn());
    const afterFirst = useStore.getState();
    const questAfterFirst = afterFirst.quests.filter((quest) => quest.id === 'backstage_ritual');

    expect(first.text).toContain('Marius muss erst beruhigt werden');
    expect(questAfterFirst).toHaveLength(1);
    expect(afterFirst.bandMood).toBe(moodBefore + 5);

    const second = buildBackstageRitualCircleDialogue(vi.fn());
    const afterSecond = useStore.getState();
    const questAfterSecond = afterSecond.quests.filter((quest) => quest.id === 'backstage_ritual');

    expect(second.text).toContain('Marius muss erst beruhigt werden');
    expect(questAfterSecond).toHaveLength(1);
    expect(afterSecond.bandMood).toBe(moodBefore + 5);
  });
});