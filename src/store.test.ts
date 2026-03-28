import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';

describe('useStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useStore.getState().resetGame();
  });

  describe('Flags', () => {
    it('should set flags correctly', () => {
      const state = useStore.getState();
      expect(state.flags.frequenz1982_proberaum).toBe(false);

      state.setFlag('frequenz1982_proberaum', true);
      expect(useStore.getState().flags.frequenz1982_proberaum).toBe(true);

      state.setFlag('salzgitter_true_ending', true);
      expect(useStore.getState().flags.salzgitter_true_ending).toBe(true);
    });
  });

  describe('Lore', () => {
    it('should unlock lore entries correctly', () => {
      const state = useStore.getState();

      // Initially not discovered
      const loreEntry = state.loreEntries.find((e) => e.id === 'frequenz_1982_decoded');
      expect(loreEntry?.discovered).toBe(false);

      // Discover it
      state.discoverLore('frequenz_1982_decoded');
      const discoveredEntry = useStore.getState().loreEntries.find((e) => e.id === 'frequenz_1982_decoded');
      expect(discoveredEntry?.discovered).toBe(true);
    });
  });

  describe('Crafting (combineItems)', () => {
    it('should craft Resonanz-Kristall from Frequenzfragment and Splitter der Leere', () => {
      const state = useStore.getState();
      state.addToInventory('Frequenzfragment');
      state.addToInventory('Splitter der Leere');

      state.combineItems('Frequenzfragment', 'Splitter der Leere');

      const newState = useStore.getState();
      expect(newState.inventory).toContain('Resonanz-Kristall');
      expect(newState.inventory).not.toContain('Frequenzfragment');
      expect(newState.inventory).not.toContain('Splitter der Leere');
    });

    it('should craft Geister-Drink from Turbo-Koffein and Rostiges Plektrum', () => {
      const state = useStore.getState();
      state.addToInventory('Turbo-Koffein');
      state.addToInventory('Rostiges Plektrum');

      state.combineItems('Turbo-Koffein', 'Rostiges Plektrum');

      const newState = useStore.getState();
      expect(newState.inventory).toContain('Geister-Drink');
      expect(newState.inventory).not.toContain('Turbo-Koffein');
      expect(newState.inventory).not.toContain('Rostiges Plektrum');
    });

    it('should fail gracefully if ingredients do not match', () => {
      const state = useStore.getState();
      state.addToInventory('Turbo-Koffein');
      state.addToInventory('Bier');

      // Attempt invalid combination
      state.combineItems('Turbo-Koffein', 'Bier');

      const newState = useStore.getState();
      // Should still have original items
      expect(newState.inventory).toContain('Turbo-Koffein');
      expect(newState.inventory).toContain('Bier');
    });
  });

  describe('Uniqueness Check', () => {
    it('should have unique flags, lore IDs, and quest IDs in initial state', () => {
      const state = useStore.getState();

      const flagKeys = Object.keys(state.flags);
      const uniqueFlags = new Set(flagKeys);
      expect(flagKeys.length).toBe(uniqueFlags.size);

      const loreIds = state.loreEntries.map(e => e.id);
      const uniqueLoreIds = new Set(loreIds);
      expect(loreIds.length).toBe(uniqueLoreIds.size);

      const questIds = state.quests.map(q => q.id);
      const uniqueQuestIds = new Set(questIds);
      expect(questIds.length).toBe(uniqueQuestIds.size);
    });
  });
});
