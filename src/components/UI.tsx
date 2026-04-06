/**
 * #1: UPDATES
 * - Integrated "Talking Amp's Existential Crisis" quest in Proberaum.
 * - Integrated "Ghostly Roadie's Lost Recipe" quest in TourBus.
 * - Added Geister-Drink item combination.
 * - Added Rostiges Plektrum item.
 * - Enhanced dialogue system with visual feedback for locked options.
 * - Options now grey out and disable if requirements are not met.
 * - Added skill/trait requirement labels to locked options.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Expand questlines with branching outcomes.
 * - Refine NPC dialogue and lore.
 * - Introduce scene-specific quests for remaining scenes.
 * - Integrate character traits/skills deeper into dialogue.
 * - Add more complex dialogue branching and visual effects.
 * 
 * #3: ERRORS & SOLUTIONS
 * - Error: removeFromInventory not found in TourBus.tsx. Solution: Destructured removeFromInventory from useStore.
 */
import { type QuestStatus, type Quest, useStore } from '../store';
import { canSelectOption, executeDialogueOption } from '../dialogueEngine';
import { Backpack, X, RotateCcw, Play, LogOut, CheckCircle2, Heart, Plus, Activity, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { GlitchOverlay } from './ui/GlitchOverlay';
import { PauseMenu } from './ui/PauseMenu';
import { LoreCodex } from './ui/LoreCodex';
import { DialogueBox } from './ui/DialogueBox';

const QUEST_STATUS_ORDER: Record<QuestStatus, number> = {
  active: 0,
  failed: 1,
  completed: 2,
};

const METER_SEGMENTS: ReadonlyArray<number> = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

const getQuestStatusMeta = (status: QuestStatus) => {
  if (status === 'active') {
    return {
      label: 'ACTIVE',
      textClass: 'text-zinc-300',
      dotClass: 'border-zinc-600',
      badgeClass: 'border-zinc-600 text-zinc-300',
      crossedOut: false,
    };
  }

  if (status === 'failed') {
    return {
      label: 'FAILED',
      textClass: 'text-blood/70',
      dotClass: 'bg-blood border-blood',
      badgeClass: 'border-blood/70 text-blood/80',
      crossedOut: true,
    };
  }

  return {
    label: 'DONE',
    textClass: 'text-toxic/40',
    dotClass: 'bg-toxic border-toxic',
    badgeClass: 'border-toxic/60 text-toxic/70',
    crossedOut: true,
  };
};

/**
 * Renders the 2D overlay user interface for the game.
 * Manages dialogue boxes, inventory screens, trait selection, lore menu, and notifications.
 * @returns A 2D DOM tree overlaying the 3D canvas.
 */
export function UI() {
  const dialogue = useStore((state) => state.dialogue);
  const setDialogue = useStore((state) => state.setDialogue);
  const inventoryCounts = useStore((state) => state.inventoryCounts);
  const combineItems = useStore((state) => state.combineItems);
  const quests = useStore((state) => state.quests);
  const bandMood = useStore((state) => state.bandMood);
  const scene = useStore((state) => state.scene);
  const setScene = useStore((state) => state.setScene);
  const resetGame = useStore((state) => state.resetGame);
  const isPaused = useStore((state) => state.isPaused);
  const setPaused = useStore((state) => state.setPaused);
  const trait = useStore((state) => state.trait);
  const skills = useStore((state) => state.skills);
  const loreEntries = useStore((state) => state.loreEntries);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showLoreCodex, setShowLoreCodex] = useState(false);
  const [showHudPanels, setShowHudPanels] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth >= 1280
  ));
  const [isCompactViewport, setIsCompactViewport] = useState(() => (
    typeof window === 'undefined' ? false : window.innerWidth < 1280
  ));
  const [compactHudTab, setCompactHudTab] = useState<'status' | 'inventory' | 'quests'>('status');
  const hasSyncedViewportRef = useRef(false);

  const openQuestCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < quests.length; i++) {
      if (quests[i].status === 'active') {
        count++;
      }
    }
    return count;
  }, [quests]);
  const visibleQuests = useMemo(() => {
    const shouldShowCompletedQuests = scene === 'salzgitter' || openQuestCount === 0;

    // ⚡ Bolt Optimization: Use a single for loop to filter and retain original index,
    // avoiding chained array methods that allocate multiple intermediate arrays
    const filtered: { quest: Quest; index: number }[] = [];
    for (let i = 0; i < quests.length; i++) {
      const quest = quests[i];
      if (shouldShowCompletedQuests || quest.status !== 'completed') {
        filtered.push({ quest, index: i });
      }
    }

    return filtered
      .sort((a, b) => {
        const statusDiff = QUEST_STATUS_ORDER[a.quest.status] - QUEST_STATUS_ORDER[b.quest.status];
        if (statusDiff !== 0) return statusDiff;
        return a.index - b.index;
      })
      .map(({ quest }) => quest);
  }, [quests, scene, openQuestCount]);
  const { inventoryStacks, inventoryTotalCount } = useMemo(() => {
    const stacks = [];
    let totalCount = 0;
    for (const item in inventoryCounts) {
      const count = inventoryCounts[item];
      stacks.push({ item, count });
      totalCount += count;
    }
    return { inventoryStacks: stacks, inventoryTotalCount: totalCount };
  }, [inventoryCounts]);
  const selectedItemCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of selectedItems) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
    return counts;
  }, [selectedItems]);

  const questDictionary = useMemo(() => {
    const dict = new Map<string, string>();
    for (const q of quests) {
      if (q.id !== undefined) dict.set(q.id, q.text);
    }
    return dict;
  }, [quests]);

  const discoveredLoreCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < loreEntries.length; i++) {
      if (loreEntries[i].discovered) {
        count++;
      }
    }
    return count;
  }, [loreEntries]);

  useEffect(() => {
    setSelectedItems((prev) => {
      if (prev.length === 0) return prev;

      let changed = false;
      const newSelected: string[] = [];
      const usedCounts: Record<string, number> = Object.create(null);

      for (const item of prev) {
        const used = usedCounts[item] ?? 0;
        const available = inventoryCounts[item] ?? 0;
        if (used < available) {
          newSelected.push(item);
          usedCounts[item] = used + 1;
        } else {
          changed = true;
        }
      }

      return changed ? newSelected : prev;
    });
  }, [inventoryCounts]);
  const sceneLabel = scene === 'proberaum'
    ? 'PROBERAUM_01'
    : scene === 'tourbus'
      ? 'VAN_INTERIOR'
      : scene === 'backstage'
        ? 'BACKSTAGE_ZONE'
        : scene === 'void_station'
          ? 'VOID_STATION_440HZ'
          : scene === 'kaminstube'
            ? 'TANGERMÜNDE_STUBE'
            : 'SALZGITTER_RIFF';

  useEffect(() => {
    if (!isPaused) {
      setShowLoreCodex(false);
    }
  }, [isPaused]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 1279px)');
    const syncHudMode = (matches: boolean) => {
      setIsCompactViewport(matches);
      if (!hasSyncedViewportRef.current) {
        setShowHudPanels(!matches);
        hasSyncedViewportRef.current = true;
      }
    };

    syncHudMode(mediaQuery.matches);

    const handleViewportChange = (event: MediaQueryListEvent) => {
      syncHudMode(event.matches);
    };

    mediaQuery.addEventListener('change', handleViewportChange);
    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === 'Escape' && scene !== 'menu') {
        event.preventDefault();
        if (showLoreCodex) {
          setShowLoreCodex(false);
        } else {
          setPaused(!isPaused);
        }
        return;
      }
      if (isPaused || showLoreCodex) return;
      if ((event.key === 'h' || event.key === 'H') && scene !== 'menu') {
        event.preventDefault();
        setShowHudPanels((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, isPaused, showLoreCodex, setPaused, setShowLoreCodex]);

  if (scene === 'menu') return null;

  const toggleItemSelection = (item: string, availableCount: number) => {
    setSelectedItems((prev) => {
      // ⚡ Bolt Optimization: Use a standard for loop instead of reduce to avoid intermediate allocations and function call overhead
      let selectedCount = 0;
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] === item) selectedCount++;
      }
      const totalSelected = prev.length;

      if (selectedCount === 0) {
        if (totalSelected >= 2) return prev;
        return [...prev, item];
      }

      if (selectedCount === 1 && availableCount > 1 && totalSelected < 2) {
        return [...prev, item];
      }

      const removeIndex = prev.indexOf(item);
      if (removeIndex === -1) return prev;

      const next = [...prev];
      next.splice(removeIndex, 1);
      return next;
    });
  };

  const handleCombine = () => {
    if (selectedItems.length === 2) {
      const success = combineItems(selectedItems[0], selectedItems[1]);
      if (success) {
        setDialogue(`Erfolg! Du hast ${selectedItems[0]} und ${selectedItems[1]} kombiniert.`);
        setSelectedItems([]);
      } else {
        setDialogue('Diese Gegenstände lassen sich nicht kombinieren.');
        setSelectedItems([]);
      }
    }
  };

  const glitchIntensity = Math.max(0, (bandMood - 70) / 30) + (scene === 'void_station' ? 0.3 : 0);

  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10 ${bandMood > 85 ? 'animate-pulse brightness-125' : ''} ${bandMood > 90 ? 'animate-glitch' : ''}`}>
      <GlitchOverlay glitchIntensity={glitchIntensity} />

      <div className={`absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-20 ${isCompactViewport ? 'w-[calc(100%-7rem)]' : 'w-[min(560px,calc(100%-9rem))]'}`}>
        <div className="bg-black/80 border border-toxic/30 px-3 py-2 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9px] md:text-[10px] font-mono uppercase tracking-wider">
            <span className="text-toxic font-bold">{sceneLabel}</span>
            <span className="text-zinc-400">Mood {bandMood}%</span>
            <span className="text-zinc-400">Open Quests {openQuestCount}</span>
            <span className="text-zinc-400">Inventory {inventoryTotalCount}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowHudPanels((prev) => !prev)}
        className="absolute top-4 right-4 bg-black/70 border border-zinc-700 hover:border-toxic text-zinc-400 hover:text-toxic px-3 h-11 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors pointer-events-auto z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Toggle HUD panels"
        aria-pressed={showHudPanels}
      >
        {showHudPanels ? <EyeOff size={14} /> : <Eye size={14} />}
        {isCompactViewport ? (showHudPanels ? 'HUD ON' : 'HUD OFF') : 'HUD'}
      </button>

      {/* Top Bar */}
      {showHudPanels && isCompactViewport && (
        <div className="absolute top-20 left-3 right-3 pointer-events-none z-20">
          <div className="bg-black/90 border border-toxic/30 p-2 pointer-events-auto">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCompactHudTab('status')}
                className={`h-8 text-[10px] font-black uppercase tracking-wider border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  compactHudTab === 'status' ? 'border-toxic bg-toxic/20 text-toxic' : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                }`}
              >
                Status
              </button>
              <button
                onClick={() => setCompactHudTab('inventory')}
                className={`h-8 text-[10px] font-black uppercase tracking-wider border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  compactHudTab === 'inventory' ? 'border-toxic bg-toxic/20 text-toxic' : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                }`}
              >
                Cargo
              </button>
              <button
                onClick={() => setCompactHudTab('quests')}
                className={`h-8 text-[10px] font-black uppercase tracking-wider border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  compactHudTab === 'quests' ? 'border-toxic bg-toxic/20 text-toxic' : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                }`}
              >
                Quests
              </button>
            </div>

            {compactHudTab === 'status' && (
              <div className="mt-2 bg-black/80 border border-zinc-800 p-3">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                  <span className="text-toxic font-bold">{sceneLabel}</span>
                  <span className="text-zinc-400">Mood {bandMood}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-zinc-900 overflow-hidden flex gap-0.5">
                  {METER_SEGMENTS.map((i) => (
                    <div
                      key={i}
                      className={`h-full w-full ${(i / 20) * 100 < bandMood ? (bandMood > 70 ? 'bg-toxic' : bandMood > 40 ? 'bg-yellow-500' : 'bg-blood') : 'bg-zinc-800'}`}
                    />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="text-zinc-500">TRAIT</div>
                  <div className="text-right text-toxic font-black uppercase">{trait || 'NONE'}</div>
                  <div className="text-zinc-500">TECHNICAL</div>
                  <div className="text-right text-zinc-200">{skills.technical}</div>
                  <div className="text-zinc-500">SOCIAL</div>
                  <div className="text-right text-zinc-200">{skills.social}</div>
                  <div className="text-zinc-500">CHAOS</div>
                  <div className="text-right text-zinc-200">{skills.chaos}</div>
                </div>
              </div>
            )}

            {compactHudTab === 'inventory' && (
              <div className="mt-2 bg-black/80 border border-zinc-800 p-3 max-h-[34vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                  <Backpack size={14} />
                  Cargo_Manifest
                </div>
                {inventoryStacks.length === 0 ? (
                  <div className="text-[10px] text-zinc-600 font-mono uppercase">No assets detected</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      {inventoryStacks.map(({ item, count }) => {
                        const selectedCount = selectedItemCounts.get(item) ?? 0;
                        return (
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            key={item}
                            onClick={() => toggleItemSelection(item, count)}
                            aria-pressed={selectedCount > 0}
                            className={`px-2 py-2 text-[10px] font-bold uppercase tracking-tighter transition-all border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic ${
                              selectedCount > 0
                                ? 'bg-toxic/10 border-toxic text-toxic shadow-[0_0_10px_rgba(173,255,47,0.2)]'
                                : 'bg-zinc-900/50 border-zinc-700 text-zinc-400'
                            }`}
                          >
                            {count > 1 ? `${item} x${count}` : item}
                            {selectedCount > 0 ? ` [${selectedCount}/2]` : ''}
                          </motion.button>
                        );
                      })}
                    </div>
                    {selectedItems.length === 2 && (
                      <button
                        onClick={handleCombine}
                        className="w-full mt-1 bg-toxic hover:bg-toxic/80 text-black font-black py-2 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <Plus size={14} />
                        Execute_Merge
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {compactHudTab === 'quests' && (
              <div className="mt-2 bg-black/80 border border-zinc-800 p-3 max-h-[34vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                  <CheckCircle2 size={14} />
                  Mission_Objectives
                </div>
                <div className="flex flex-col gap-3">
                  {visibleQuests.length === 0 ? (
                    <div className="text-[10px] text-zinc-600 font-mono uppercase">No mission objectives logged</div>
                  ) : (
                    visibleQuests.map((quest) => {
                      const statusMeta = getQuestStatusMeta(quest.status);
                      return (
                        <div key={quest.id} className={`flex items-start gap-2 text-[10px] font-mono leading-tight ${statusMeta.textClass}`}>
                          <div className={`mt-0.5 shrink-0 w-2 h-2 border ${statusMeta.dotClass}`} />
                          <div className="flex-1 min-w-0">
                            <span className={`inline-flex items-center border px-1 py-0.5 text-[8px] font-black uppercase tracking-widest ${statusMeta.badgeClass}`}>
                              {statusMeta.label}
                            </span>
                            <div className={`mt-1 ${statusMeta.crossedOut ? 'line-through' : ''}`}>{quest.text}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isCompactViewport && (
        <div className="flex justify-between items-start">
          {showHudPanels && (
          <div className="flex flex-col gap-6">
            <div className="bg-black/90 p-5 brutal-border-toxic pointer-events-auto flex flex-col gap-3 animate-reveal">
              <div>
                <h1 className="text-4xl text-toxic leading-none mb-1">
                  NEUROTOXIC
                </h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">
                  Industrial Management Interface // v2.6
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-toxic/80 bg-toxic/5 px-2 py-1 border border-toxic/20">
                  <span className="animate-pulse">●</span>
                  LOCATION: {sceneLabel}
                </div>
              </div>
            </div>

            {/* Band Mood Meter */}
            <div
              className="bg-black/90 p-4 brutal-border pointer-events-auto w-56 animate-reveal [animation-delay:100ms]"
              role="progressbar"
              aria-valuenow={bandMood}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Band Vibe"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <Heart size={12} className={bandMood > 50 ? "text-toxic" : "text-blood"} fill={bandMood > 50 ? "currentColor" : "none"} />
                  Band_Vibe
                </div>
                <span className="text-[10px] font-mono text-toxic">{bandMood}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 overflow-hidden flex gap-0.5">
                {METER_SEGMENTS.map((i) => (
                  <div
                    key={i}
                    className={`h-full w-full transition-colors duration-500 ${
                      (i / 20) * 100 < bandMood
                        ? (bandMood > 70 ? 'bg-toxic' : bandMood > 40 ? 'bg-yellow-500' : 'bg-blood')
                        : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* System Status Panel (New) */}
            <div className="bg-black/90 p-3 brutal-border pointer-events-auto w-56 animate-reveal [animation-delay:150ms] border-l-toxic">
              <div className="text-[8px] font-mono text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Activity size={10} />
                Manager_Profile
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">TRAIT:</span>
                  <span className="text-toxic font-black uppercase tracking-widest">{trait || 'NONE'}</span>
                </div>
                <div className="h-px bg-zinc-800 w-full" />
                <div className="grid grid-cols-1 gap-1">
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-zinc-500">TECHNICAL:</span>
                    <span className="text-zinc-200">{skills.technical}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-zinc-500">SOCIAL:</span>
                    <span className="text-zinc-200">{skills.social}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-zinc-500">CHAOS:</span>
                    <span className="text-zinc-200">{skills.chaos}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status Panel (Original) */}
            <div className="bg-black/90 p-3 brutal-border pointer-events-auto w-56 animate-reveal [animation-delay:180ms] border-l-toxic">
              <div className="text-[8px] font-mono text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <Activity size={10} />
                System_Telemetry
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">SONIC_OUTPUT:</span>
                  <span className="text-toxic">{bandMood * 12}db</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">SYNC_RATE:</span>
                  <span className="text-toxic">{(bandMood * 0.98).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">STRESS_LEVEL:</span>
                  <span className={bandMood > 80 ? "text-blood animate-pulse" : "text-zinc-400"}>
                    {bandMood > 80 ? 'CRITICAL' : bandMood > 50 ? 'STABLE' : 'LOW'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Inventory & Quests */}
          {showHudPanels && (
          <div className="flex flex-col gap-6 items-end">
            {/* Inventory */}
            <div className="bg-black/90 p-4 brutal-border pointer-events-auto flex flex-col items-end min-w-[240px] animate-reveal [animation-delay:200ms]">
              <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-800 w-full pb-2">
                <Backpack size={14} />
                Cargo_Manifest
              </div>
              {inventoryStacks.length === 0 ? (
                <div className="text-[10px] text-zinc-600 font-mono uppercase">No assets detected</div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  <div className="grid grid-cols-2 gap-2">
                    {inventoryStacks.map(({ item, count }) => {
                      const selectedCount = selectedItemCounts.get(item) ?? 0;
                      return (
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        key={item}
                        onClick={() => toggleItemSelection(item, count)}
                        aria-pressed={selectedCount > 0}
                        className={`px-3 py-2 text-[10px] font-bold uppercase tracking-tighter transition-all border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic ${
                          selectedCount > 0
                          ? 'bg-toxic/10 border-toxic text-toxic shadow-[0_0_10px_rgba(173,255,47,0.2)]'
                          : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-500'
                        }`}
                      >
                        {count > 1 ? `${item} x${count}` : item}
                        {selectedCount > 0 ? ` [${selectedCount}/2]` : ''}
                      </motion.button>
                    )})}
                  </div>
                  {selectedItems.length === 2 && (
                    <button
                      onClick={handleCombine}
                      className="w-full mt-2 bg-toxic hover:bg-toxic/80 text-black font-black py-2 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <Plus size={14} />
                      Execute_Merge
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quest Log */}
            <div className="bg-black/90 p-4 brutal-border pointer-events-auto flex flex-col items-end min-w-[240px] animate-reveal [animation-delay:300ms]">
              <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-800 w-full pb-2">
                <CheckCircle2 size={14} />
                Mission_Objectives
              </div>
              <div className="flex flex-col gap-3 w-full">
                {visibleQuests.length === 0 ? (
                  <div className="text-[10px] text-zinc-600 font-mono uppercase">No mission objectives logged</div>
                ) : (
                  visibleQuests.map((quest) => {
                    const statusMeta = getQuestStatusMeta(quest.status);
                    return (
                      <div key={quest.id} className={`flex items-start gap-3 text-[10px] font-mono leading-tight ${statusMeta.textClass}`}>
                        <div className={`mt-0.5 shrink-0 w-2 h-2 border ${statusMeta.dotClass}`} />
                        <div className="flex-1 min-w-0">
                          <span className={`inline-flex items-center border px-1 py-0.5 text-[8px] font-black uppercase tracking-widest ${statusMeta.badgeClass}`}>
                            {statusMeta.label}
                          </span>
                          <div className={`mt-1 ${statusMeta.crossedOut ? 'line-through' : ''}`}>{quest.text}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Controls Hint */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white/70 px-3 py-2 rounded text-xs font-mono pointer-events-none select-none">
        <span className="text-toxic font-bold">Joystick / WASD</span> = Bewegen<br/>
        <span className="text-toxic font-bold">Tippen / Klick / E</span> = Interagieren<br/>
        <span className="text-toxic font-bold">H</span> = HUD ein/aus<br/>
        <span className="text-toxic font-bold">ESC</span> = Pause
      </div>

      {/* Touch-accessible Pause Button */}
      <button
        onClick={() => setPaused(!isPaused)}
        className="absolute bottom-4 right-4 bg-black/70 border border-zinc-700 hover:border-toxic text-zinc-400 hover:text-toxic w-11 h-11 flex items-center justify-center text-lg font-black transition-colors pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Toggle pause menu"
        aria-pressed={isPaused}
        style={{ touchAction: 'none' }}
      >
        ⏸
      </button>

      {/* Pause Menu */}
      <PauseMenu
        isPaused={isPaused}
        setPaused={setPaused}
        resetGame={resetGame}
        setScene={setScene}
        setShowLoreCodex={setShowLoreCodex}
        discoveredLoreCount={discoveredLoreCount}
        totalLoreCount={loreEntries.length}
      />
      {isPaused && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <LoreCodex
            showLoreCodex={showLoreCodex}
            setShowLoreCodex={setShowLoreCodex}
            loreEntries={loreEntries}
            discoveredLoreCount={discoveredLoreCount}
          />
        </div>
      )}

      {/* Dialogue Box */}
      <DialogueBox
        dialogue={dialogue}
        setDialogue={setDialogue}
        questDictionary={questDictionary}
      />
    </div>
  );
}
