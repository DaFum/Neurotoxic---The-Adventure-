import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, BookOpen, LogOut, Check, X } from 'lucide-react';
import type { GameState } from '../../store';
import { audio } from '../../audio';

interface PauseMenuProps {
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  resetGame: () => void;
  setScene: GameState['setScene'];
  setShowLoreCodex: (show: boolean) => void;
  discoveredLoreCount: number;
  totalLoreCount: number;
}

export function PauseMenu({
  isPaused,
  setPaused,
  resetGame,
  setScene,
  setShowLoreCodex,
  discoveredLoreCount,
  totalLoreCount,
}: PauseMenuProps) {
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const pauseMenuContainerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const [showRebootConfirm, setShowRebootConfirm] = useState(false);
  const rebootButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isPaused) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
      if (initialFocusRef.current) {
        initialFocusRef.current.focus();
      }
    } else {
      setShowRebootConfirm(false);
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
        previouslyFocusedElementRef.current = null;
      }
    }
  }, [isPaused]);

  const wasRebootConfirmShownRef = useRef(false);

  useEffect(() => {
    if (showRebootConfirm) {
      if (cancelButtonRef.current) {
        cancelButtonRef.current.focus();
      }
      wasRebootConfirmShownRef.current = true;
    } else if (wasRebootConfirmShownRef.current) {
      if (rebootButtonRef.current) {
        rebootButtonRef.current.focus();
      }
      wasRebootConfirmShownRef.current = false;
    }
  }, [showRebootConfirm]);

  const handlePauseMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
      if (showRebootConfirm) {
        setShowRebootConfirm(false);
      } else {
        setPaused(false);
      }
      return;
    }

    if (e.key === 'Tab') {
      if (!pauseMenuContainerRef.current) return;
      const focusableElements = pauseMenuContainerRef.current.querySelectorAll<HTMLElement>(
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

  if (!isPaused) return null;

  return (
    <div
      ref={pauseMenuContainerRef}
      onKeyDown={handlePauseMenuKeyDown}
      className="absolute inset-0 bg-obsidian/80 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="system-paused-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        className="bg-black p-10 brutal-border-toxic flex flex-col gap-6 w-80 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-toxic animate-pulse" />
        <h2
          id="system-paused-title"
          className="text-4xl font-display text-toxic tracking-tighter text-center mb-6"
        >
          SYSTEM_PAUSED
        </h2>

        <button
          ref={initialFocusRef}
          onClick={() => setPaused(false)}
          className="group flex items-center justify-center gap-3 bg-toxic hover:bg-white text-black font-black py-4 text-sm uppercase tracking-[0.2em] transition-all brutal-border-toxic hover:translate-x-[-2px] hover:translate-y-[-2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <Play size={18} fill="currentColor" />
          RESUME_SESSION
        </button>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {showRebootConfirm ? 'REBOOT_SYSTEM: Are you sure?' : ''}
        </div>

        {showRebootConfirm ? (
          <div className="flex flex-col gap-2 p-3 bg-zinc-900 border border-zinc-800">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-center mb-2">
              REBOOT_SYSTEM: Are you sure?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  audio.stopAmbient();
                  resetGame();
                  setShowRebootConfirm(false);
                }}
                className="flex items-center justify-center gap-2 bg-toxic hover:bg-white text-black font-black py-2 text-[10px] uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <Check size={14} />
                CONFIRM
              </button>
              <button
                ref={cancelButtonRef}
                autoFocus
                onClick={() => setShowRebootConfirm(false)}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 text-[10px] uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <X size={14} />
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button
            ref={rebootButtonRef}
            onClick={() => setShowRebootConfirm(true)}
            className="flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold py-4 text-xs uppercase tracking-widest transition-colors border border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <RotateCcw size={18} />
            REBOOT_GAME
          </button>
        )}

        <button
          onClick={() => setShowLoreCodex(true)}
          className="flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold py-4 text-xs uppercase tracking-widest transition-colors border border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <BookOpen size={18} />
          LORE_CODEX ({discoveredLoreCount}/{totalLoreCount})
        </button>

        <button
          onClick={() => {
            audio.stopAmbient();
            setScene('menu');
            setPaused(false);
          }}
          className="flex items-center justify-center gap-3 bg-blood/20 hover:bg-blood text-blood hover:text-white font-bold py-4 text-xs uppercase tracking-widest transition-colors border border-blood/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blood focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <LogOut size={18} />
          TERMINATE_PROCESS
        </button>
      </motion.div>
    </div>
  );
}
