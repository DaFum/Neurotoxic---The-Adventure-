import { createContext, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useStore } from '../store';

interface InteractableInfo {
  distance: number;
  trigger: () => void;
}

interface KeyboardInteractionContextValue {
  register: (id: string, getInfo: () => InteractableInfo | null) => void;
  unregister: (id: string) => void;
}

const KeyboardInteractionContext = createContext<KeyboardInteractionContextValue | null>(null);

/**
 * React component that renders the KeyboardInteractionProvider UI element or 3D scene entity.
 * @param props - Required configuration parameter.
 * @returns Output from the function/method.
 */
export function KeyboardInteractionProvider({ children }: { children: ReactNode }) {
  const registryRef = useRef(new Map<string, () => InteractableInfo | null>());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key !== 'e' && event.key !== 'E') || event.repeat) return;

      const { isPaused, dialogue } = useStore.getState();
      if (isPaused || dialogue) return;

      let closest: InteractableInfo | null = null;
      for (const getInfo of registryRef.current.values()) {
        const info = getInfo();
        if (info && (!closest || info.distance < closest.distance)) {
          closest = info;
        }
      }

      if (!closest) return;
      event.preventDefault();
      closest.trigger();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = useRef<KeyboardInteractionContextValue>({
    register: (id, getInfo) => registryRef.current.set(id, getInfo),
    unregister: (id) => registryRef.current.delete(id),
  }).current;

  return (
    <KeyboardInteractionContext.Provider value={value}>
      {children}
    </KeyboardInteractionContext.Provider>
  );
}

/**
 * React hook providing state and logic for KeyboardInteraction.
 * @returns Output from the function/method.
 */
export function useKeyboardInteraction() {
  const ctx = useContext(KeyboardInteractionContext);
  if (!ctx) throw new Error('useKeyboardInteraction must be used within KeyboardInteractionProvider');
  return ctx;
}
