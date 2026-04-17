import { StateCreator } from 'zustand';
import { GameState, Scene, Trait, Skills, Flag } from '../types';
import { initialState } from '../initialState';

export interface CoreSlice {
  scene: Scene;
  setScene: (scene: Scene) => void;
  trait: Trait | null;
  setTrait: (trait: Trait) => void;
  skills: Skills;
  increaseSkill: (skill: keyof Skills, amount: number) => void;
  flags: Record<Flag, boolean>;
  setFlag: (flag: Flag, value: boolean) => void;
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  resetGame: () => void;
}

export const createCoreSlice: StateCreator<GameState, [], [], CoreSlice> = (set) => ({
  scene: initialState.scene,
  setScene: (scene) => set({ scene, playerPos: [0, 1, 0], dialogue: null }),
  trait: initialState.trait,
  setTrait: (trait) => set({ trait }),
  skills: initialState.skills,
  increaseSkill: (skill, amount) =>
    set((state) => ({
      skills: { ...state.skills, [skill]: state.skills[skill] + amount },
    })),
  flags: initialState.flags,
  setFlag: (flag, value) => set((state) => ({ flags: { ...state.flags, [flag]: value } })),
  playerPos: initialState.playerPos,
  setPlayerPos: (playerPos) =>
    set((state) => {
      // ⚡ Bolt Optimization: Prevent unnecessary re-renders by returning same state if position hasn't changed
      if (
        state.playerPos[0] === playerPos[0] &&
        state.playerPos[1] === playerPos[1] &&
        state.playerPos[2] === playerPos[2]
      ) {
        return state;
      }
      return { playerPos };
    }),
  isPaused: initialState.isPaused,
  setPaused: (isPaused) => set({ isPaused }),
  resetGame: () => set(initialState),
});
