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
  setActive: (id: string, active: boolean) => void;
}

const KeyboardInteractionContext = createContext<KeyboardInteractionContextValue | null>(null);

/**
 * KeyboardInteractionProvider manages keyboard interactions for registered interactable elements.
 * It listens for the 'E' key and triggers the closest interactable component within range.
 * @param props - The props for the provider component.
 * @param props.children - Child components that may use the keyboard interaction context.
 * @returns The Context Provider that wraps the child components.
 */
export function KeyboardInteractionProvider({ children }: { children: ReactNode }) {
  const registryRef = useRef(new Map<string, () => InteractableInfo | null>());
  const activeSetRef = useRef(new Set<string>());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key !== 'e' && event.key !== 'E') || event.repeat) return;

      const { isPaused, dialogue } = useStore.getState();
      if (isPaused || dialogue) return;

      let closest: InteractableInfo | null = null;
      for (const id of activeSetRef.current) {
        const getInfo = registryRef.current.get(id);
        if (!getInfo) continue;
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
    unregister: (id) => {
      registryRef.current.delete(id);
      activeSetRef.current.delete(id);
    },
    setActive: (id, active) => {
      if (active) {
        activeSetRef.current.add(id);
      } else {
        activeSetRef.current.delete(id);
      }
    },
  }).current;

  return (
    <KeyboardInteractionContext.Provider value={value}>
      {children}
    </KeyboardInteractionContext.Provider>
  );
}

/**
 * Provides access to the keyboard interaction registry.
 * It allows components to register, unregister, or set the active state of interactable elements.
 * @returns An object with `register`, `unregister`, and `setActive` methods.
 * @throws {Error} Throws if called outside of a KeyboardInteractionProvider.
 */
export function useKeyboardInteraction() {
  const ctx = useContext(KeyboardInteractionContext);
  if (!ctx) throw new Error('useKeyboardInteraction must be used within KeyboardInteractionProvider');
  return ctx;
}
