/**
 * #1: UPDATES
 * - Integrated "Talking Amp's Existential Crisis" quest in Proberaum.
 * - Integrated "Ghostly Roadie's Lost Recipe" quest in TourBus.
 * - Added Geister-Drink item combination.
 * - Added Rostiges Plektrum item.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Expand questlines with branching outcomes.
 * - Refine NPC dialogue and lore.
 * - Introduce scene-specific quests for remaining scenes.
 * - Integrate character traits/skills deeper into dialogue.
 * 
 * #3: ERRORS & SOLUTIONS
 * - Error: removeFromInventory not found in TourBus.tsx. Solution: Destructured removeFromInventory from useStore.
 */
/**
 * #1: UPDATES
 * - Enhanced dialogue system with visual feedback for locked options.
 * - Options now grey out and disable if requirements are not met.
 * - Added skill/trait requirement labels to locked options.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more complex dialogue branching.
 * - Implement more visual effects for dialogue.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import { type QuestStatus, useStore } from '../store';
import { canSelectOption, executeDialogueOption } from '../dialogueEngine';
import { Backpack, X, RotateCcw, Play, LogOut, CheckCircle2, Heart, Plus, Activity, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../audio';

const QUEST_STATUS_ORDER: Record<QuestStatus, number> = {
  active: 0,
  failed: 1,
  completed: 2,
};

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
  const inventory = useStore((state) => state.inventory);
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
  const [displayedText, setDisplayedText] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showLoreCodex, setShowLoreCodex] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const isResolvingRef = useRef(false);
  const [showHudPanels, setShowHudPanels] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth >= 1280
  ));
  const [isCompactViewport, setIsCompactViewport] = useState(() => (
    typeof window === 'undefined' ? false : window.innerWidth < 1280
  ));
  const [compactHudTab, setCompactHudTab] = useState<'status' | 'inventory' | 'quests'>('status');
  const hasSyncedViewportRef = useRef(false);

  const openQuestCount = useMemo(() => quests.filter((q) => q.status === 'active').length, [quests]);
  const visibleQuests = useMemo(() => {
    const shouldShowCompletedQuests = scene === 'salzgitter' || openQuestCount === 0;

    return quests
      .filter((quest) => shouldShowCompletedQuests || quest.status !== 'completed')
      .map((quest, index) => ({ quest, index }))
      .sort((a, b) => {
        const statusDiff = QUEST_STATUS_ORDER[a.quest.status] - QUEST_STATUS_ORDER[b.quest.status];
        if (statusDiff !== 0) return statusDiff;
        return a.index - b.index;
      })
      .map(({ quest }) => quest);
  }, [quests, scene, openQuestCount]);
  const inventoryStacks = useMemo(() => {
    const stackMap = new Map<string, number>();
    for (const item of inventory) {
      stackMap.set(item, (stackMap.get(item) ?? 0) + 1);
    }
    return Array.from(stackMap.entries()).map(([item, count]) => ({ item, count }));
  }, [inventory]);
  const selectedItemCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of selectedItems) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
    return counts;
  }, [selectedItems]);

  const discoveredLoreCount = useMemo(
    () => loreEntries.reduce((count, entry) => (entry.discovered ? count + 1 : count), 0),
    [loreEntries]
  );

  useEffect(() => {
    setSelectedItems((prev) => {
      const counts = new Map<string, number>();
      for (const item of inventory) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }

      const newSelected: string[] = [];
      for (const item of prev) {
        const available = counts.get(item) ?? 0;
        if (available > 0) {
          newSelected.push(item);
          counts.set(item, available - 1);
        }
      }

      if (newSelected.length !== prev.length) {
        return newSelected;
      }
      return prev;
    });
  }, [inventory]);
  const closeLoreBtnRef = useRef<HTMLButtonElement>(null);
  const loreCodexContainerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
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
      if (isPaused || showLoreCodex) return;
      if ((event.key === 'h' || event.key === 'H') && scene !== 'menu') {
        event.preventDefault();
        setShowHudPanels((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, isPaused, showLoreCodex]);

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

  useEffect(() => {
    isResolvingRef.current = false;
    setIsResolving(false);

    if (!dialogue) {
      setDisplayedText('');
      return;
    }
    
    let i = 0;
    setDisplayedText('');
    
    // Determine speed: urgency 1 (high) = fast, urgency 3 (low) = slow
    const baseDelay = dialogue.urgency === 1 ? 15 : dialogue.urgency === 3 ? 50 : 30;
    
      const interval = setInterval(() => {
        const char = dialogue.text[i];
        setDisplayedText((prev) => prev + char);
        
        // Play typing sound for non-space characters
        if (char !== ' ') {
          audio.playTypewriter();
        }
      
      i++;
      if (i >= dialogue.text.length) clearInterval(interval);
    }, baseDelay);
    
    return () => clearInterval(interval);
  }, [dialogue]);

  if (scene === 'menu') return null;

  const toggleItemSelection = (item: string, availableCount: number) => {
    setSelectedItems((prev) => {
      const selectedCount = prev.filter((entry) => entry === item).length;
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
      {/* Dynamic Glitch Overlay */}
      {glitchIntensity > 0 && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none">
          <motion.div
            animate={{
              opacity: [0.05, 0.15, 0.05],
              x: [-2, 2, -2],
              y: [-1, 1, -1],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-red-500/5 mix-blend-overlay"
            style={{
              filter: `contrast(${100 + glitchIntensity * 50}%) brightness(${100 + glitchIntensity * 20}%)`,
            }}
          />
          {glitchIntensity > 0.4 && (
            <motion.div
              animate={{
                clipPath: [
                  'inset(10% 0 80% 0)',
                  'inset(40% 0 40% 0)',
                  'inset(70% 0 10% 0)',
                  'inset(0% 0 0% 0)',
                ],
                x: [-10, 10, -5, 0],
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
              className="absolute inset-0 bg-cyan-500/5 mix-blend-screen"
            />
          )}
        </div>
      )}

      <div className={`absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-20 ${isCompactViewport ? 'w-[calc(100%-7rem)]' : 'w-[min(560px,calc(100%-9rem))]'}`}>
        <div className="bg-black/80 border border-toxic/30 px-3 py-2 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9px] md:text-[10px] font-mono uppercase tracking-wider">
            <span className="text-toxic font-bold">{sceneLabel}</span>
            <span className="text-zinc-400">Mood {bandMood}%</span>
            <span className="text-zinc-400">Open Quests {openQuestCount}</span>
            <span className="text-zinc-400">Inventory {inventory.length}</span>
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
                className={`h-8 text-[10px] font-black uppercase tracking-wider border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-inset ${
                  compactHudTab === 'status' ? 'border-toxic bg-toxic/20 text-toxic' : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                }`}
              >
                Status
              </button>
              <button
                onClick={() => setCompactHudTab('inventory')}
                className={`h-8 text-[10px] font-black uppercase tracking-wider border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-inset ${
                  compactHudTab === 'inventory' ? 'border-toxic bg-toxic/20 text-toxic' : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                }`}
              >
                Cargo
              </button>
              <button
                onClick={() => setCompactHudTab('quests')}
                className={`h-8 text-[10px] font-black uppercase tracking-wider border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-inset ${
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
                  {Array.from({ length: 20 }).map((_, i) => (
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
                {inventory.length === 0 ? (
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
                        className="w-full mt-1 bg-toxic hover:bg-toxic/80 text-black font-black py-2 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
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
            <div className="bg-black/90 p-4 brutal-border pointer-events-auto w-56 animate-reveal [animation-delay:100ms]">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <Heart size={12} className={bandMood > 50 ? "text-toxic" : "text-blood"} fill={bandMood > 50 ? "currentColor" : "none"} />
                  Band_Vibe
                </div>
                <span className="text-[10px] font-mono text-toxic">{bandMood}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 overflow-hidden flex gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
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
              {inventory.length === 0 ? (
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
                      className="w-full mt-2 bg-toxic hover:bg-toxic/80 text-black font-black py-2 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
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
        Joystick / WASD = Bewegen<br/>
        Tippen / Klick / E = Interagieren<br/>
        H = HUD ein/aus
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
      {isPaused && (
        <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="bg-black p-10 brutal-border-toxic flex flex-col gap-6 w-80 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-toxic animate-pulse" />
            <h2 className="text-4xl font-display text-toxic tracking-tighter text-center mb-6">SYSTEM_PAUSED</h2>
            
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
              LORE_CODEX ({discoveredLoreCount}/{loreEntries.length})
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

          {/* Lore Codex Overlay */}
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
                    <h2 id="lore-codex-title" className="text-2xl md:text-3xl font-display text-toxic tracking-tighter">LORE_CODEX</h2>
                    <p className="text-zinc-500 font-mono text-xs uppercase">Discovered Data: {discoveredLoreCount} / {loreEntries.length}</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-y-auto pr-2 md:pr-4 custom-scrollbar" tabIndex={0}>
                  {loreEntries.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`p-4 border ${entry.discovered ? 'border-toxic/50 bg-toxic/5' : 'border-zinc-800 bg-zinc-900/30'}`}
                    >
                      <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${entry.discovered ? 'text-toxic' : 'text-zinc-600'}`}>
                        {entry.discovered ? entry.title : '??? [ ENCRYPTED ]'}
                      </h3>
                      <p className={`text-xs font-mono leading-relaxed ${entry.discovered ? 'text-zinc-300 italic' : 'text-zinc-700 blur-[2px] select-none'}`}>
                        {entry.discovered ? entry.content : 'Datensatz beschädigt oder nicht gefunden. Synchronisation fehlgeschlagen.'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dialogue Box */}
      <AnimatePresence>
        {dialogue && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-black/95 brutal-border-toxic p-8 relative overflow-hidden"
            >
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-toxic" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-toxic" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-toxic" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-toxic" />

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-toxic/20 pb-2">
                  <span className="text-[10px] font-black text-toxic uppercase tracking-[0.4em]">Incoming_Transmission</span>
                  <button 
                    onClick={() => setDialogue(null)}
                    aria-label="Close transmission"
                    className="text-toxic hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xl font-bold leading-tight text-zinc-100 italic">
                  {displayedText}
                  <span className="inline-block w-2 h-5 bg-toxic ml-1 animate-pulse" />
                </p>

                {/* Branching Options */}
                {displayedText.length >= (dialogue?.text.length || 0) && dialogue?.options && (
                  <div className="flex flex-col gap-2 mt-4">
                    {dialogue.options.map((option, idx) => {
                      const skillReq = option.requiredSkill;
                      const traitReq = option.requiredTrait;
                      const questDeps = option.questDependencies;
                      const requiredItems = option.requiredItems;
                      const requiredFlags = option.requiredFlags;
                      const forbiddenFlags = option.forbiddenFlags;
                      const isLocked = !canSelectOption(option);

                      return (
                        <button
                          key={option.id || idx}
                          aria-disabled={isLocked || isResolving}
                          onClick={() => {
                            if (isLocked || isResolving || isResolvingRef.current) return;
                            isResolvingRef.current = true;
                            setIsResolving(true);
                            executeDialogueOption(option);
                            // isResolving is reset in the dialogue useEffect
                          }}
                          className={`group relative flex flex-col px-4 py-3 text-sm font-bold uppercase tracking-wider text-left border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic focus-visible:ring-inset ${
                            isLocked || isResolving
                            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed grayscale' 
                            : 'bg-zinc-900 hover:bg-toxic text-zinc-400 hover:text-black border-zinc-800 hover:border-toxic'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{`> ${option.text}`}</span>
                            {isLocked && <X size={14} className="text-blood" />}
                          </div>
                          
                          {(skillReq || traitReq || questDeps || requiredItems || requiredFlags || forbiddenFlags) && (
                            <div className={`text-[8px] mt-1 font-mono ${isLocked ? 'text-blood' : 'text-toxic/60 group-hover:text-black/60'}`}>
                              {skillReq && `[ REQ: ${skillReq.name.toUpperCase()} ${skillReq.level} ] `}
                              {traitReq && `[ REQ: ${traitReq.toUpperCase()} ] `}
                              {questDeps && questDeps.map((dep, depIdx) => {
                                if (typeof dep === 'string') {
                                  const questTitle = quests.find(q => q.id === dep)?.text || dep;
                                  return <span key={`dep-${depIdx}`}>[ REQ: QUEST COMPLETED: {questTitle} ] </span>
                                } else {
                                  const questTitle = quests.find(q => q.id === dep.id)?.text || dep.id;
                                  return <span key={`dep-${depIdx}`}>[ REQ: QUEST {dep.status.toUpperCase()}: {questTitle} ] </span>
                                }
                              })}
                              {requiredItems && requiredItems.map((item, itemIdx) => (
                                <span key={`req-item-${itemIdx}`}>[ REQ: ITEM: {item.toUpperCase()} ] </span>
                              ))}
                              {requiredFlags && requiredFlags.map((flag, flagIdx) => (
                                <span key={`req-flag-${flagIdx}`}>[ REQ: FLAG: {flag.toUpperCase()} ] </span>
                              ))}
                              {forbiddenFlags && forbiddenFlags.map((flag, flagIdx) => (
                                <span key={`forbid-flag-${flagIdx}`}>[ BLOCKED BY: FLAG: {flag.toUpperCase()} ] </span>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  {!dialogue?.options && (
                    <button
                      onClick={() => {
                        if (displayedText.length < (dialogue?.text.length || 0)) {
                          setDisplayedText(dialogue?.text || '');
                        } else {
                          setDialogue(null);
                        }
                      }}
                      className="bg-toxic/10 hover:bg-toxic text-toxic hover:text-black px-6 py-2 font-black uppercase tracking-[0.2em] text-[10px] transition-all border border-toxic/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
                    >
                      {displayedText.length < (dialogue?.text.length || 0) ? 'SKIP_DATA' : 'ACKNOWLEDGE'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
