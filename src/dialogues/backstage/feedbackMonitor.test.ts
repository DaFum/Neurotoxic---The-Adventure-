import { beforeEach, describe, expect, it } from 'vitest';
import { executeDialogueOption } from '../../dialogueEngine';
import { useStore } from '../../store';
import { setupTestState, getOptionTexts } from '../shared/test-helpers';
import { buildBackstageFeedbackMonitorDialogue } from './feedbackMonitor';

describe('buildBackstageFeedbackMonitorDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns final machine soul text when completion flag is set', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        maschinen_seele_complete: true,
      },
    });

    const dialogue = buildBackstageFeedbackMonitorDialogue();
    expect(dialogue.text).toContain('WIR SIND EINS');
    expect(dialogue.options).toBeUndefined();
  });

  it('offers machine merge options when backstage quest is completed and both fragments are present', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        feedbackMonitorBackstageQuestCompleted: true,
        maschinen_seele_amp: true,
        maschinen_seele_tr8080: true,
      },
    });

    const dialogue = buildBackstageFeedbackMonitorDialogue();
    const options = getOptionTexts(dialogue);

    expect(dialogue.text).toContain('Sollen wir uns verbinden?');
    expect(options).toHaveLength(4);
    expect(options).toContain('Vereinige das Maschinen-Bewusstsein. [Mystic]');
    expect(options).toContain(
      'Verbinde die Schaltkreise logisch. [Technical 7]'
    );
  });

  it('offers optimization branch when quest has started and blueprint is in inventory', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        feedbackMonitorBackstageQuestStarted: true,
      },
    });
    useStore.getState().addToInventory('Verstärker-Schaltplan');

    const dialogue = buildBackstageFeedbackMonitorDialogue();
    const options = getOptionTexts(dialogue);

    expect(dialogue.text).toContain('Du hast den Schaltplan!');
    expect(options).toContain('Optimierte Frequenzen. [Technical 5]');
    expect(options).toContain('Transzendente Frequenzen. [Visionary]');
    expect(options).toContain('Standard-Frequenzen.');
  });

  it('offers amp-specific option after first talk when amp is sentient', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        feedbackMonitorBackstageTalked: true,
        ampSentient: true,
      },
    });

    const dialogue = buildBackstageFeedbackMonitorDialogue();
    const options = getOptionTexts(dialogue);

    expect(options).toContain('Der Amp hat mir von dir erzählt.');
    expect(options).toContain('Noch nicht.');
  });

  it('sets talked flag and band mood when selecting initial hello option', () => {
    const moodBefore = useStore.getState().bandMood;
    const dialogue = buildBackstageFeedbackMonitorDialogue();
    const helloOption = dialogue.options?.find(
      (option) => option.text === 'Hallo?'
    );

    if (!helloOption) {
      throw new Error('Expected hello option in initial monitor dialogue');
    }

    executeDialogueOption(helloOption);
    const stateAfter = useStore.getState();

    expect(stateAfter.flags.feedbackMonitorBackstageTalked).toBe(true);
    expect(stateAfter.bandMood).toBe(moodBefore + 5);
    expect(stateAfter.dialogue?.text).toContain('Hallo, Fleischsack');
  });
});
