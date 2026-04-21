import { StateCreator } from 'zustand';
import { GameState, LoreEntry } from '../types';
import { initialState } from '../initialState';

export interface LoreSlice {
  loreEntries: LoreEntry[];
  discoverLore: (id: string) => void;
}

export const createLoreSlice: StateCreator<GameState, [], [], LoreSlice> = (set) => ({
  loreEntries: initialState.loreEntries,
  discoverLore: (id) =>
    set((state) => {
      const index = state.loreEntries.findIndex((e) => e.id === id);
      if (index === -1 || state.loreEntries[index].discovered) {
        return state;
      }
      const newEntries = [...state.loreEntries];
      newEntries[index] = { ...newEntries[index], discovered: true };
      return {
        loreEntries: newEntries,
      };
    }),
});
