import { StateCreator } from 'zustand';
import { GameState, Quest, QuestStatus, Flag } from '../types';
import { initialState } from '../initialState';

export interface QuestSlice {
  quests: Quest[];
  addQuest: (id: string, text: string) => void;
  completeQuest: (id: string, text?: string) => void;
  failQuest: (id: string, text?: string) => void;
  startAndFinishQuest: (id: string, text: string) => void;
  startQuestWithFlag: (id: string, text: string, flag: Flag, flagValue?: boolean) => void;
  completeQuestWithFlag: (id: string, flag: Flag, flagValue?: boolean, text?: string) => void;
}

export const createQuestSlice: StateCreator<GameState, [], [], QuestSlice> = (set) => ({
  quests: initialState.quests,
  addQuest: (id, text) =>
    set((state) => {
      const index = state.quests.findIndex((q) => q.id === id);
      if (index !== -1) {
        if (state.quests[index].text === text) return state;
        const newQuests = [...state.quests];
        newQuests[index] = { ...newQuests[index], text };
        return { quests: newQuests };
      }
      return {
        quests: [...state.quests, { id, text, status: 'active' as QuestStatus }],
      };
    }),
  completeQuest: (id, text) =>
    set((state) => {
      const index = state.quests.findIndex((q) => q.id === id);
      if (index === -1) {
        if (text) {
          return {
            quests: [...state.quests, { id, text, status: 'completed' as QuestStatus }],
          };
        }
        console.warn(`Attempted to complete unregistered quest: ${id}`);
        return state;
      }
      if (state.quests[index].status === 'completed') return state;
      const newQuests = [...state.quests];
      newQuests[index] = { ...newQuests[index], status: 'completed' as QuestStatus };
      return { quests: newQuests };
    }),
  failQuest: (id, text) =>
    set((state) => {
      const index = state.quests.findIndex((q) => q.id === id);
      if (index === -1) {
        if (text) {
          return {
            quests: [...state.quests, { id, text, status: 'failed' as QuestStatus }],
          };
        }
        console.warn(`Attempted to fail unregistered quest: ${id}`);
        return state;
      }
      if (state.quests[index].status === 'failed') return state;
      const newQuests = [...state.quests];
      newQuests[index] = { ...newQuests[index], status: 'failed' as QuestStatus };
      return { quests: newQuests };
    }),
  startQuestWithFlag: (id, text, flag, flagValue = true) =>
    set((state) => {
      const index = state.quests.findIndex((q) => q.id === id);
      if (index !== -1) {
        const quest = state.quests[index];
        const nextStatus = (quest.status === 'completed' ? 'completed' : 'active') as QuestStatus;
        const questChanged = quest.text !== text || quest.status !== nextStatus;
        const flagChanged = state.flags[flag] !== flagValue;
        if (!questChanged && !flagChanged) return state;

        const newQuests = questChanged ? [...state.quests] : state.quests;
        if (questChanged) newQuests[index] = { ...quest, text, status: nextStatus };

        return {
          ...(questChanged && { quests: newQuests }),
          ...(flagChanged && { flags: { ...state.flags, [flag]: flagValue } }),
        };
      }
      return {
        quests: [...state.quests, { id, text, status: 'active' as QuestStatus }],
        flags: { ...state.flags, [flag]: flagValue },
      };
    }),
  completeQuestWithFlag: (id, flag, flagValue = true, text) =>
    set((state) => {
      const index = state.quests.findIndex((q) => q.id === id);
      if (index === -1) {
        if (text) {
          return {
            quests: [...state.quests, { id, text, status: 'completed' as QuestStatus }],
            flags: { ...state.flags, [flag]: flagValue },
          };
        }
        console.warn(`Attempted to complete unregistered quest: ${id}`);
        return state.flags[flag] !== flagValue
          ? { flags: { ...state.flags, [flag]: flagValue } }
          : state;
      }
      const quest = state.quests[index];
      const statusChanged = quest.status !== 'completed';
      const flagChanged = state.flags[flag] !== flagValue;
      if (!statusChanged && !flagChanged) return state;

      const newQuests = statusChanged ? [...state.quests] : state.quests;
      if (statusChanged) newQuests[index] = { ...quest, status: 'completed' as QuestStatus };

      return {
        ...(statusChanged && { quests: newQuests }),
        ...(flagChanged && { flags: { ...state.flags, [flag]: flagValue } }),
      };
    }),
  startAndFinishQuest: (id, text) =>
    set((state) => {
      const index = state.quests.findIndex((q) => q.id === id);
      if (index !== -1) {
        if (state.quests[index].status === 'active') {
          const newQuests = [...state.quests];
          newQuests[index] = { ...newQuests[index], status: 'completed' as QuestStatus };
          return { quests: newQuests };
        }
        return state;
      }
      return {
        quests: [...state.quests, { id, text, status: 'completed' as QuestStatus }],
      };
    }),
});
