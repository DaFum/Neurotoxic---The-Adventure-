import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { GameState, Quest, QuestStatus, Flag, Skills, LoreEntry } from './store/types';
import { createCoreSlice } from './store/slices/coreSlice';
import { createInventorySlice } from './store/slices/inventorySlice';
import { createQuestSlice } from './store/slices/questSlice';
import { createDialogueSlice } from './store/slices/dialogueSlice';
import { createLoreSlice } from './store/slices/loreSlice';

export * from './store/types';
export * from './store/initialState';

export const STORAGE_KEY = 'neurotoxic-game-storage';

export const migrateFlags = (rawFlags: Record<string, boolean>): Record<string, boolean> => {
  const flags = { ...rawFlags };
  if ('ampFixed' in flags) {
    if (flags.ampFixed && !flags.ampRepaired) {
      flags.ampRepaired = true;
    }
    delete flags.ampFixed;
  }
  return flags;
};

const migrateLegacyFeedbackMonitorFlag = (flags: Record<Flag, boolean>): Record<Flag, boolean> => {
  const newFlags = { ...flags };
  if (newFlags.feedbackMonitorQuestStarted) {
    newFlags.feedbackMonitorBackstageTalked = true;
    newFlags.feedbackMonitorBackstageQuestStarted = true;
    if (newFlags.feedbackMonitorQuestCompleted) {
      newFlags.feedbackMonitorBackstageQuestCompleted = true;
      newFlags.feedbackMonitorQuestCompleted = false;
    }
    newFlags.feedbackMonitorQuestStarted = false;
  }
  return newFlags;
};

export const migrateLegacyQuests = (quests: Quest[]): Quest[] => {
  let fixCableQuestIndex = -1;
  let cableQuestIndex = -1;

  const len = quests.length;
  for (let i = 0; i < len; i++) {
    const id = quests[i].id;
    if (id === 'fix_cable' && fixCableQuestIndex === -1) {
      fixCableQuestIndex = i;
    } else if (id === 'cable' && cableQuestIndex === -1) {
      cableQuestIndex = i;
    }
    if (fixCableQuestIndex !== -1 && cableQuestIndex !== -1) break;
  }

  if (fixCableQuestIndex === -1) return quests;

  const fixCableQuest = quests[fixCableQuestIndex];

  if (cableQuestIndex !== -1) {
    const cableQuest = quests[cableQuestIndex];
    const statusPriority: Record<QuestStatus, number> = { completed: 3, active: 2, failed: 1 };
    const mergedStatus =
      statusPriority[fixCableQuest.status] > statusPriority[cableQuest.status]
        ? fixCableQuest.status
        : cableQuest.status;

    // ⚡ Bolt Optimization: Use a single loop to avoid intermediate array allocations
    const len = quests.length;
    const updatedQuests: Quest[] = [];
    for (let i = 0; i < len; i++) {
      const q = quests[i];
      if (q.id !== 'fix_cable') {
        // Only spread (creating a new object) if the status actually changes, preserving object identity otherwise
        updatedQuests.push(
          q.id === 'cable' && q.status !== mergedStatus ? { ...q, status: mergedStatus } : q,
        );
      }
    }
    return updatedQuests;
  }

  const updatedQuests = [...quests];
  updatedQuests[fixCableQuestIndex] = { ...fixCableQuest, id: 'cable' };
  return updatedQuests;
};

export const useStore = create<GameState>()(
  persist(
    (...a) => ({
      ...createCoreSlice(...a),
      ...createInventorySlice(...a),
      ...createQuestSlice(...a),
      ...createDialogueSlice(...a),
      ...createLoreSlice(...a),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        inventory: state.inventory,
        itemPickupCounts: state.itemPickupCounts,
        flags: state.flags,
        quests: state.quests,
        bandMood: state.bandMood,
        bandMoodGainClaims: state.bandMoodGainClaims,
        loreEntries: state.loreEntries,
        trait: state.trait,
        skills: state.skills,
      }),
      merge: (persistedState: unknown, currentState: GameState) => {
        const typedPersistedState =
          persistedState !== null && typeof persistedState === 'object'
            ? (persistedState as Partial<GameState>)
            : {};

        const persistedQuests = Array.isArray(typedPersistedState.quests)
          ? typedPersistedState.quests
          : [];
        const persistedLore = Array.isArray(typedPersistedState.loreEntries)
          ? typedPersistedState.loreEntries
          : [];
        const rawPersistedFlags =
          typedPersistedState.flags !== null && typeof typedPersistedState.flags === 'object'
            ? (typedPersistedState.flags as Record<string, boolean>)
            : {};

        const persistedFlags = migrateFlags(rawPersistedFlags);
        const persistedPickupCounts =
          typedPersistedState.itemPickupCounts !== null &&
          typeof typedPersistedState.itemPickupCounts === 'object'
            ? (typedPersistedState.itemPickupCounts as Record<string, number>)
            : {};
        const persistedInventory = Array.isArray(typedPersistedState.inventory)
          ? typedPersistedState.inventory
          : [];

        const normalizeQuestStatus = (status: unknown, completed: unknown): QuestStatus => {
          if (status === 'active' || status === 'completed' || status === 'failed') return status;
          return completed === true ? 'completed' : 'active';
        };

        const persistedQuestsMap = new Map<string, unknown>();
        for (const pq of persistedQuests) {
          if (pq !== null && typeof pq === 'object' && 'id' in pq && typeof pq.id === 'string') {
            persistedQuestsMap.set(pq.id, pq);
          }
        }

        // ⚡ Bolt Optimization: Use a standard for loop to pre-allocate merged array
        // instead of mapping. Also optimize Set creation for currentQuestIds to avoid
        // temporary arrays created by `.map()`.
        const mergedQuests = new Array<Quest>(currentState.quests.length);
        const currentQuestIds = new Set<string>();
        for (let i = 0; i < currentState.quests.length; i++) {
          const q = currentState.quests[i];
          currentQuestIds.add(q.id);
          const persistedQuest = persistedQuestsMap.get(q.id);
          if (!persistedQuest) {
            mergedQuests[i] = q;
          } else {
            const pq = persistedQuest as unknown as {
              id: string;
              text: string;
              status?: unknown;
              completed?: unknown;
            };
            mergedQuests[i] = {
              ...q,
              status: normalizeQuestStatus(pq.status, pq.completed),
            };
          }
        }

        const dynamicQuests: Quest[] = [];
        for (const pq of persistedQuestsMap.values()) {
          if (pq !== null && typeof pq === 'object') {
            const p = pq as Record<string, unknown>;
            if (
              typeof p.id === 'string' &&
              typeof p.text === 'string' &&
              !currentQuestIds.has(p.id)
            ) {
              dynamicQuests.push({
                id: p.id as string,
                text: p.text as string,
                status: normalizeQuestStatus(p.status, p.completed),
              });
            }
          }
        }

        const allQuests = [...mergedQuests, ...dynamicQuests];

        const persistedLoreMap = new Map<string, Record<string, unknown>>();
        for (const pe of persistedLore) {
          if (pe !== null && typeof pe === 'object' && 'id' in pe && typeof pe.id === 'string') {
            persistedLoreMap.set(pe.id, pe as unknown as Record<string, unknown>);
          }
        }

        const mergedLoreEntries: LoreEntry[] = new Array<LoreEntry>(
          currentState.loreEntries.length,
        );
        for (let i = 0; i < currentState.loreEntries.length; i++) {
          const e = currentState.loreEntries[i];
          const persistedEntry = persistedLoreMap.get(e.id);
          mergedLoreEntries[i] = persistedEntry
            ? { ...e, discovered: persistedEntry.discovered === true }
            : e;
        }

        const sanitizedInventory: string[] = [];
        const inventoryCounts: Record<string, number> = Object.create(null);
        for (let i = 0; i < persistedInventory.length; i++) {
          const item = persistedInventory[i];
          if (typeof item === 'string') {
            sanitizedInventory.push(item);
            inventoryCounts[item] = (inventoryCounts[item] ?? 0) + 1;
          }
        }

        const mergedPickupCounts: Record<string, number> = Object.create(null);
        for (const [item, value] of Object.entries(persistedPickupCounts)) {
          if (
            typeof item === 'string' &&
            typeof value === 'number' &&
            Number.isFinite(value) &&
            value >= 0
          ) {
            mergedPickupCounts[item] = value;
          }
        }
        for (const [item, count] of Object.entries(inventoryCounts)) {
          mergedPickupCounts[item] = Math.max(mergedPickupCounts[item] ?? 0, count);
        }

        return {
          ...currentState,
          scene: currentState.scene,
          playerPos: currentState.playerPos,
          cameraShakeIntensity: currentState.cameraShakeIntensity,
          cameraShakeKick: currentState.cameraShakeKick,
          inventory: sanitizedInventory,
          inventoryCounts,
          quests: allQuests,
          loreEntries: mergedLoreEntries,
          itemPickupCounts: mergedPickupCounts,
          flags: {
            ...currentState.flags,
            ...persistedFlags,
          },
          ...(typedPersistedState.bandMoodGainClaims !== null &&
            typeof typedPersistedState.bandMoodGainClaims === 'object' && {
              bandMoodGainClaims: typedPersistedState.bandMoodGainClaims as Record<string, boolean>,
            }),
          ...(typeof typedPersistedState.bandMood === 'number' && {
            bandMood: typedPersistedState.bandMood,
          }),
          ...((typeof typedPersistedState.trait === 'string' ||
            typedPersistedState.trait === null) && { trait: typedPersistedState.trait }),
          ...(typedPersistedState.skills !== null &&
            typeof typedPersistedState.skills === 'object' && {
              skills: typedPersistedState.skills as Skills,
            }),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (
            !state.flags.legacyLoreMigrated ||
            state.flags.feedbackMonitorQuestStarted ||
            state.quests.some((q) => q.id === 'fix_cable')
          ) {
            setTimeout(() => {
              useStore.setState((currentState) => {
                const newEntries = [...currentState.loreEntries];
                let migratedLore = false;

                const migrateEntry = (id: string) => {
                  const idx = newEntries.findIndex((e) => e.id === id);
                  if (idx !== -1 && !newEntries[idx].discovered) {
                    newEntries[idx] = { ...newEntries[idx], discovered: true };
                    migratedLore = true;
                  }
                };

                if (!currentState.flags.legacyLoreMigrated) {
                  if (currentState.flags.posterLoreRead) migrateEntry('poster_lore');
                  if (currentState.flags.forbiddenRiffFound) migrateEntry('forbidden_riff');
                  if (currentState.flags.egoContained) migrateEntry('ego_philosophy');
                  if (currentState.flags.tankwartPhilosophy) migrateEntry('tankwart_truth');
                  if (currentState.flags.cosmic_echo) migrateEntry('cosmic_echo_decoded');
                }

                const newFlags = migrateLegacyFeedbackMonitorFlag(currentState.flags);
                newFlags.legacyLoreMigrated = true;

                const updatedQuests = migrateLegacyQuests(currentState.quests);
                const hasQuestChanges = updatedQuests !== currentState.quests;

                return {
                  loreEntries: migratedLore ? newEntries : currentState.loreEntries,
                  flags: newFlags,
                  ...(hasQuestChanges && { quests: updatedQuests }),
                };
              });
            }, 0);
          }
        }
      },
    },
  ),
);
