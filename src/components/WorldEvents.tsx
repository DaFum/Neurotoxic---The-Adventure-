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
import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { audio } from '../audio';
import { secureRandom } from '../utils/math';

/**
 * A headless component that manages global background events and timers.
 * Handles tasks like periodically ticking down the band's mood over time.
 * @returns Null, as this component only performs side effects.
 */
export function WorldEvents() {
  const bandMood = useStore((state) => state.bandMood);
  const setCameraShake = useStore((state) => state.setCameraShake);
  const lastTempoRef = useRef<number | null>(null);

  useEffect(() => {
    // Mood-driven tempo with clamping and step threshold to avoid jittery restarts.
    const targetTempo = Math.round(Math.max(150, Math.min(250, 250 - bandMood)));
    if (lastTempoRef.current === null || Math.abs(lastTempoRef.current - targetTempo) >= 3) {
      audio.setTempo(targetTempo);
      lastTempoRef.current = targetTempo;
    }

    // Occasional random camera shake if mood is high, stronger at higher mood.
    if (bandMood > 70) {
      const interval = setInterval(() => {
        if (secureRandom() > 0.7) {
          const intensity = 0.12 + ((bandMood - 70) / 30) * 0.28;
          setCameraShake(Math.min(0.45, intensity));
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [bandMood]);

  return null;
}
