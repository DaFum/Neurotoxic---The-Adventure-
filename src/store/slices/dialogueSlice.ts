import { StateCreator } from 'zustand';
import { GameState, Dialogue } from '../types';
import { initialState } from '../initialState';
import { audio } from '../../audio';

export interface DialogueSlice {
  dialogue: Dialogue | null;
  setDialogue: (dialogue: Dialogue | string | null) => void;
  bandMood: number;
  increaseBandMood: (amount: number, sourceId?: string) => void;
  bandMoodGainClaims: Record<string, boolean>;
  cameraShakeIntensity: number;
  cameraShakeKick: number;
  setCameraShake: (intensity: number) => void;
}

export const createDialogueSlice: StateCreator<
  GameState,
  [],
  [],
  DialogueSlice
> = (set, get) => ({
  dialogue: initialState.dialogue,
  bandMood: initialState.bandMood,
  bandMoodGainClaims: initialState.bandMoodGainClaims,
  cameraShakeIntensity: initialState.cameraShakeIntensity,
  cameraShakeKick: initialState.cameraShakeKick,
  setDialogue: (dialogue) => {
    if (dialogue) audio.playInteract();
    if (typeof dialogue === 'string') {
      set({ dialogue: { text: dialogue } });
    } else {
      set({ dialogue });
      if (dialogue?.visualEffect === 'shake') {
        get().setCameraShake(0.5);
      }
    }
  },
  increaseBandMood: (amount, sourceId) =>
    set((state) => {
      const nextMood = Math.max(0, Math.min(100, state.bandMood + amount));

      if (amount > 0) {
        if (!sourceId && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
          console.warn(
            `increaseBandMood called with a positive amount (${amount}) but no sourceId. This will allow infinite farming of this reward.`
          );
        }
        if (sourceId && state.bandMoodGainClaims[sourceId]) {
          return state;
        }
        if (sourceId) {
          return {
            bandMood: nextMood,
            bandMoodGainClaims: {
              ...state.bandMoodGainClaims,
              [sourceId]: true,
            },
          };
        }
      }

      return { bandMood: nextMood };
    }),
  setCameraShake: (cameraShakeIntensity) => set((state) => ({ cameraShakeIntensity, cameraShakeKick: state.cameraShakeKick + 1 })),
});
