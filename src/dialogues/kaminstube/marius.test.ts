import { beforeEach, describe, expect, it } from 'vitest';
import { useStore } from '../../store';
import { setupTestState } from '../shared/test-helpers';
import { buildKaminstubeMariusDialogue } from './marius';

describe('buildKaminstubeMariusDialogue', () => {
  beforeEach(() => setupTestState());

  it('returns the uneasy line while the amp is still broken', () => {
    const dialogue = buildKaminstubeMariusDialogue();

    expect(dialogue.text).toContain('Die Stille hier ist unerträglich');
    expect(dialogue.options).toBeUndefined();
  });

  it('returns the ego strategy line when that flag is set after the amp is fixed', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        ampFixed: true,
        mariusEgoStrategy: true,
      },
    });

    const dialogue = buildKaminstubeMariusDialogue();
    expect(dialogue.text).toContain('Unsere Strategie funktioniert');
  });

  it('returns the ego contained line when ego is contained without strategy flag', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        ampFixed: true,
        egoContained: true,
      },
    });

    const dialogue = buildKaminstubeMariusDialogue();
    expect(dialogue.text).toContain('Mein Ego brennt in mir');
  });

  it('returns the default stage line once the amp is fixed', () => {
    setupTestState({
      flags: {
        ...useStore.getState().flags,
        ampFixed: true,
      },
    });

    const dialogue = buildKaminstubeMariusDialogue();
    expect(dialogue.text).toContain('Underground Metal Fest');
  });
});
