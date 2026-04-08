import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { type LoreEntry } from '../../store';

interface LoreCodexProps {
  showLoreCodex: boolean;
  setShowLoreCodex: (show: boolean) => void;
  loreEntries: LoreEntry[];
  discoveredLoreCount: number;
}

export function LoreCodex({
  showLoreCodex,
  setShowLoreCodex,
  loreEntries,
  discoveredLoreCount,
}: LoreCodexProps) {
  const closeLoreBtnRef = useRef<HTMLButtonElement>(null);
  const loreCodexContainerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (showLoreCodex) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
      if (closeLoreBtnRef.current) {
        closeLoreBtnRef.current.focus();
      }
    } else {
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
        previouslyFocusedElementRef.current = null;
      }
    }
  }, [showLoreCodex]);

  const handleLoreCodexKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
      setShowLoreCodex(false);
      return;
    }

    if (e.key === 'Tab') {
      if (!loreCodexContainerRef.current) return;
      const focusableElements = loreCodexContainerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {showLoreCodex && (
        <motion.div
          ref={loreCodexContainerRef}
          onKeyDown={handleLoreCodexKeyDown}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="absolute inset-0 bg-black/95 z-50 flex flex-col p-4 md:p-8 pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lore-codex-title"
        >
          <div className="flex justify-between items-center mb-4 md:mb-8 border-b border-toxic/30 pb-4">
            <div>
              <h2
                id="lore-codex-title"
                className="text-2xl md:text-3xl font-display text-toxic tracking-tighter"
              >
                LORE_CODEX
              </h2>
              <p className="text-zinc-500 font-mono text-xs uppercase">
                Discovered Data: {discoveredLoreCount} / {loreEntries.length}
              </p>
            </div>
            <button
              ref={closeLoreBtnRef}
              onClick={() => setShowLoreCodex(false)}
              aria-label="Close lore codex"
              className="p-2 border border-toxic/30 text-toxic hover:bg-toxic hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-toxic"
            >
              <X size={24} />
            </button>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-y-auto pr-2 md:pr-4 custom-scrollbar"
            tabIndex={0}
            role="region"
            aria-label="Lore Entries"
          >
            {loreEntries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`p-4 border ${
                  entry.discovered
                    ? 'border-toxic/50 bg-toxic/5'
                    : 'border-zinc-800 bg-zinc-900/30'
                }`}
              >
                <h3
                  className={`text-sm font-bold uppercase tracking-widest mb-2 ${
                    entry.discovered ? 'text-toxic' : 'text-zinc-600'
                  }`}
                >
                  {entry.discovered ? entry.title : '??? [ ENCRYPTED ]'}
                </h3>
                <p
                  className={`text-xs font-mono leading-relaxed ${
                    entry.discovered
                      ? 'text-zinc-300 italic'
                      : 'text-zinc-700 blur-[2px] select-none'
                  }`}
                >
                  {entry.discovered
                    ? entry.content
                    : 'Datensatz beschädigt oder nicht gefunden. Synchronisation fehlgeschlagen.'}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
