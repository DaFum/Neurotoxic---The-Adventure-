import { describe, expect, it } from 'vitest';
import { buildKaminstubeExitDialogue } from './exit';

describe('buildKaminstubeExitDialogue', () => {
  it('returns the salzgitter departure line', () => {
    const dialogue = buildKaminstubeExitDialogue();

    expect(dialogue.text).toContain('SZaturday 3 Riff Night in Salzgitter');
    expect(dialogue.options).toBeUndefined();
  });
});