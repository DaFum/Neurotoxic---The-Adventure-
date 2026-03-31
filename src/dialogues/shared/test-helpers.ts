import { useStore, type GameState, type Dialogue } from '../../store';

/**
 * Resets the game to a clean slate, then applies any partial state needed for the test.
 */
export function setupTestState(partialState?: Partial<GameState>) {
  useStore.getState().resetGame();
  if (partialState) {
    useStore.setState(partialState as GameState);
  }
}

/**
 * Extracts all option texts from a Dialogue object.
 * Returns an empty array if no options exist, making assertions like `.toContain()` safe.
 */
export function getOptionTexts(dialogue: Dialogue): string[] {
  return dialogue.options?.map(o => o.text) || [];
}