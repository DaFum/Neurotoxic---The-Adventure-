import { motion } from 'motion/react';
import { Play, RotateCcw, BookOpen, LogOut } from 'lucide-react';
import type { GameState } from '../../store';

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
  if (!isPaused) return null;

  return (
    <div
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
          onClick={() => setPaused(false)}
          className="group flex items-center justify-center gap-3 bg-toxic hover:bg-white text-black font-black py-4 text-sm uppercase tracking-[0.2em] transition-all brutal-border-toxic hover:translate-x-[-2px] hover:translate-y-[-2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <Play size={18} fill="currentColor" />
          RESUME_SESSION
        </button>

        <button
          onClick={() => {
            if (confirm('REBOOT_SYSTEM: Are you sure?')) {
              resetGame();
              setPaused(false);
            }
          }}
          className="flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold py-4 text-xs uppercase tracking-widest transition-colors border border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <RotateCcw size={18} />
          REBOOT_GAME
        </button>

        <button
          onClick={() => setShowLoreCodex(true)}
          className="flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold py-4 text-xs uppercase tracking-widest transition-colors border border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <BookOpen size={18} />
          LORE_CODEX ({discoveredLoreCount}/{totalLoreCount})
        </button>

        <button
          onClick={() => {
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
