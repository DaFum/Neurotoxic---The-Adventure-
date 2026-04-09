import { describe, it, expect, beforeEach, vi, afterEach, type MockInstance } from 'vitest';
import { useStore, migrateFlags } from './store';

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

  describe('migrateFlags', () => {
    it('should migrate ampFixed: true to ampRepaired: true and remove ampFixed', () => {
      const rawFlags = { ampFixed: true };
      const migrated = migrateFlags(rawFlags);
      expect(migrated.ampRepaired).toBe(true);
      expect(migrated).not.toHaveProperty('ampFixed');
    });

    it('should remove ampFixed if it is false without setting ampRepaired: true', () => {
      const rawFlags = { ampFixed: false };
      const migrated = migrateFlags(rawFlags);
      expect(migrated.ampRepaired).toBeUndefined(); // Assuming it wasn't there to begin with
      expect(migrated).not.toHaveProperty('ampFixed');
    });

    it('should not overwrite ampRepaired if it is already true and ampFixed is true', () => {
      const rawFlags = { ampFixed: true, ampRepaired: true };
      const migrated = migrateFlags(rawFlags);
      expect(migrated.ampRepaired).toBe(true);
      expect(migrated).not.toHaveProperty('ampFixed');
    });
  });

  describe('Dialogue Actions', () => {
    it('should trigger camera shake when visualEffect is "shake"', () => {
      const state = useStore.getState();
      const initialKick = state.cameraShakeKick;

      state.setDialogue({ text: 'Boom', visualEffect: 'shake' });

      const newState = useStore.getState();
      expect(newState.cameraShakeIntensity).toBe(0.5);
      expect(newState.cameraShakeKick).toBe(initialKick + 1);
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

  describe('Inventory', () => {
    it('removeFromInventory should only remove the first matching item when duplicates exist', () => {
      useStore.setState({ inventory: ['Bier', 'Bier', 'Bier'] });

      let currentState = useStore.getState();
      expect(currentState.inventory.filter(i => i === 'Bier').length).toBe(3);

      currentState.removeFromInventory('Bier');
      currentState = useStore.getState();

      expect(currentState.inventory.filter(i => i === 'Bier').length).toBe(2);
    });

    it('addToInventory should return false when pickup limit is reached', () => {
      const state = useStore.getState();

      expect(state.addToInventory('Bier')).toBe(true);
      expect(state.addToInventory('Bier')).toBe(true);
      expect(state.addToInventory('Bier')).toBe(false);

      const currentState = useStore.getState();
      expect(currentState.inventory.filter(i => i === 'Bier').length).toBe(2);
    });
  });

  describe('Band Mood Gain De-duplication', () => {
    it('should apply positive mood gain only once for the same source callsite', () => {
      const triggerSameSourceGain = () => useStore.getState().increaseBandMood(10, 'test_source');

      triggerSameSourceGain();
      triggerSameSourceGain();

      expect(useStore.getState().bandMood).toBe(30);
    });

    it('should still allow repeated negative mood deltas', () => {
      const triggerSameSourceLoss = () => useStore.getState().increaseBandMood(-5, 'test_source_loss');

      triggerSameSourceLoss();
      triggerSameSourceLoss();

      expect(useStore.getState().bandMood).toBe(10);
    });

    it('should NOT deduplicate positive mood gains when no explicit sourceId is provided (fallback logic removed)', () => {
      const triggerGainNoSource = () => useStore.getState().increaseBandMood(10);

      triggerGainNoSource();
      triggerGainNoSource();

      expect(useStore.getState().bandMood).toBe(40);
    });

    it('should allow repeated negative mood deltas when no explicit sourceId is provided', () => {
      const triggerLossNoSource = () => useStore.getState().increaseBandMood(-5);

      triggerLossNoSource();
      triggerLossNoSource();

      expect(useStore.getState().bandMood).toBe(10);
    });
  });

  describe('Quest Helpers', () => {
    let warnSpy: MockInstance;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });
    it('startQuestWithFlag should add an active quest and set a flag', () => {
      const state = useStore.getState();
      state.startQuestWithFlag('test_quest', 'Test description', 'mariusCalmed');

      const currentState = useStore.getState();
      expect(currentState.flags.mariusCalmed).toBe(true);
      const quest = currentState.quests.find(q => q.id === 'test_quest');
      expect(quest).toBeDefined();
      expect(quest?.status).toBe('active');
      expect(quest?.text).toBe('Test description');
    });

    it('startQuestWithFlag should update an existing quest to active and update text', () => {
      let state = useStore.getState();
      state.addQuest('test_quest_2', 'Old text');
      state.failQuest('test_quest_2');

      state = useStore.getState();
      expect(state.quests.find(q => q.id === 'test_quest_2')?.status).toBe('failed');

      state.startQuestWithFlag('test_quest_2', 'New text', 'mariusCalmed');

      state = useStore.getState();
      const quest = state.quests.find(q => q.id === 'test_quest_2');
      expect(quest?.status).toBe('active');
      expect(quest?.text).toBe('New text');
    });

    it('startQuestWithFlag should not reopen a completed quest and should update its text', () => {
      let state = useStore.getState();
      state.addQuest('test_quest_4', 'Old text');
      state.completeQuest('test_quest_4');

      state = useStore.getState();
      expect(state.quests.find(q => q.id === 'test_quest_4')?.status).toBe('completed');

      state.startQuestWithFlag('test_quest_4', 'New text', 'mariusCalmed');

      state = useStore.getState();
      const quest = state.quests.find(q => q.id === 'test_quest_4');
      expect(state.flags.mariusCalmed).toBe(true);
      expect(quest?.status).toBe('completed');
      expect(quest?.text).toBe('New text');
    });

    it('completeQuestWithFlag should complete an existing quest and set a flag', () => {
      let state = useStore.getState();
      state.addQuest('test_quest_3', 'Some text');

      state.completeQuestWithFlag('test_quest_3', 'mariusCalmed');

      state = useStore.getState();
      expect(state.flags.mariusCalmed).toBe(true);
      expect(state.quests.find(q => q.id === 'test_quest_3')?.status).toBe('completed');
    });

    it('completeQuestWithFlag should log a warning if quest is missing and no text is provided', () => {
      const state = useStore.getState();

      state.completeQuestWithFlag('missing_quest', 'mariusCalmed');
      expect(warnSpy).toHaveBeenCalledWith('Attempted to complete unregistered quest: missing_quest');
    });

    it('completeQuestWithFlag should backfill a completed quest entry when text is provided for a missing quest', () => {
      let state = useStore.getState();
      const initialQuestsLength = state.quests.length;

      state.completeQuestWithFlag('missing_quest_with_text', 'mariusCalmed', true, 'Backfill text');

      state = useStore.getState();
      expect(state.flags.mariusCalmed).toBe(true);
      expect(state.quests.length).toBe(initialQuestsLength + 1);
      const quest = state.quests.find(q => q.id === 'missing_quest_with_text');
      expect(quest).toBeDefined();
      expect(quest?.status).toBe('completed');
      expect(quest?.text).toBe('Backfill text');
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('completeQuest should log a warning if quest is missing and no text is provided', () => {
      const state = useStore.getState();

      state.completeQuest('missing_quest_2');
      expect(warnSpy).toHaveBeenCalledWith('Attempted to complete unregistered quest: missing_quest_2');
    });

    it('failQuest should log a warning if quest is missing and no text is provided', () => {
      const state = useStore.getState();

      state.failQuest('missing_quest_3');
      expect(warnSpy).toHaveBeenCalledWith('Attempted to fail unregistered quest: missing_quest_3');
    });
  });
});
