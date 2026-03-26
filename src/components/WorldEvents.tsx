/**
 * #1: UPDATES
 * - Integrated music tempo control based on band mood.
 * - Added occasional camera shake for high band mood.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more world events based on game state.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import { useEffect } from 'react';
import { useStore } from '../store';
import { audio } from '../audio';

export function WorldEvents() {
  const bandMood = useStore((state) => state.bandMood);
  const setCameraShake = useStore((state) => state.setCameraShake);

  useEffect(() => {
    // Update music tempo based on mood
    // 250ms (120 BPM) at 0 mood -> 150ms (200 BPM) at 100 mood
    const newTempo = 250 - (bandMood * 1);
    audio.setTempo(newTempo);

    // Occasional random camera shake if mood is high
    if (bandMood > 70) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setCameraShake(0.3);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [bandMood]);

  return null;
}
