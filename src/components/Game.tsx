/**
 * #1: UPDATES
 * - Integrated scene switching logic.
 * - Added trait selection system.
 * - Implemented keyboard controls for player movement.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more scenes.
 * - Refine menu UI.
 * - Add more traits and skills.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, Trait, Skills } from '../store';
import { Proberaum } from './scenes/Proberaum';
import { TourBus } from './scenes/TourBus';
import { Backstage } from './scenes/Backstage';
import { VoidStation } from './scenes/VoidStation';
import { Kaminstube } from './scenes/Kaminstube';
import { Salzgitter } from './scenes/Salzgitter';
import { WorldEvents } from './WorldEvents';
import { UI } from './UI';
import { VirtualJoystick } from './VirtualJoystick';
import { audio } from '../audio';

const STORAGE_KEY = 'neurotoxic-game-storage';

export function Game() {
  const scene = useStore((state) => state.scene);
  const trait = useStore((state) => state.trait);
  const setTrait = useStore((state) => state.setTrait);
  const setScene = useStore((state) => state.setScene);
  const resetGame = useStore((state) => state.resetGame);
  const isPaused = useStore((state) => state.isPaused);
  const setPaused = useStore((state) => state.setPaused);
  const [selectingTrait, setSelectingTrait] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  const traits: { id: Trait; desc: string; skills: { name: keyof Skills; val: number }[] }[] = [
    { id: 'Visionary', desc: 'Sieht Muster im Lärm. Schaltet tiefere Lore-Optionen frei.', skills: [{ name: 'chaos', val: 5 }] },
    { id: 'Technician', desc: 'Meister der Maschinen. Boni auf technische Reparaturen.', skills: [{ name: 'technical', val: 5 }] },
    { id: 'Brutalist', desc: 'Liebt die rohe Gewalt. Erhöht Band-Mood durch Aggression.', skills: [{ name: 'chaos', val: 3 }, { name: 'technical', val: 2 }] },
    { id: 'Diplomat', desc: 'Beruhigt erhitzte Gemüter. Boni auf soziale Interaktionen.', skills: [{ name: 'social', val: 5 }] },
    { id: 'Mystic', desc: 'Hat einen Draht zum Übernatürlichen. Spürt verborgene Frequenzen.', skills: [{ name: 'chaos', val: 2 }, { name: 'social', val: 3 }] },
    { id: 'Performer', desc: 'Die Bühne ist sein Zuhause. Boni auf charismatische Handlungen.', skills: [{ name: 'social', val: 5 }] },
    { id: 'Cynic', desc: 'Glaubt an nichts, hinterfragt alles. Erkennt Illusionen sofort.', skills: [{ name: 'technical', val: 2 }, { name: 'chaos', val: 3 }] },
  ];

  useEffect(() => {
    if (scene !== 'menu') {
      audio.startAmbient(scene as any);
    } else {
      audio.stopAmbient();
    }
  }, [scene]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHasSavedGame(false);
        return;
      }
      const parsed = JSON.parse(raw) as { state?: any } | null;
      const saved = parsed?.state;
      if (!saved) {
        setHasSavedGame(false);
        return;
      }

      const hasTrait = saved.trait !== null && saved.trait !== undefined;
      const hasInventory = Array.isArray(saved.inventory) && saved.inventory.length > 0;
      const hasCompletedQuest = Array.isArray(saved.quests) && saved.quests.some((q: any) => q?.completed);
      const hasLoreProgress = Array.isArray(saved.loreEntries) && saved.loreEntries.some((e: any) => e?.discovered);
      const hasMoodOrSkillProgress =
        saved.bandMood !== undefined && typeof saved.bandMood === 'number' && (
          saved.bandMood !== 20 ||
          saved.skills?.technical > 0 ||
          saved.skills?.social > 0 ||
          saved.skills?.chaos > 0
        );

      setHasSavedGame(Boolean(hasTrait || hasInventory || hasCompletedQuest || hasLoreProgress || hasMoodOrSkillProgress));
    } catch {
      setHasSavedGame(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && scene !== 'menu') {
        setPaused(!isPaused);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, scene]);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans">
      <WorldEvents />
      <UI />
      
      <AnimatePresence mode="wait">
        {scene === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-obsidian text-white overflow-hidden"
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-toxic)_0%,_transparent_70%)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-20 bg-toxic/20 -rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 2, y: -100, opacity: 0, skewX: -10 }}
                animate={{ scale: 1, y: 0, opacity: 1, skewX: -10 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="mb-2"
              >
                <h1 className="text-[15vw] leading-[0.8] text-toxic drop-shadow-[0_0_30px_rgba(173,255,47,0.4)]">
                  NEUROTOXIC
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 mb-16"
              >
                <div className="h-px w-24 bg-toxic/30" />
                <h2 className="text-2xl font-black tracking-[0.5em] text-zinc-500 uppercase italic">
                  Grind The Void
                </h2>
                <div className="h-px w-24 bg-toxic/30" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="max-w-xl text-center mb-16 px-6"
              >
                <p className="text-sm font-mono text-zinc-400 leading-relaxed uppercase tracking-wider">
                  System_Role: <span className="text-toxic">Band_Manager</span><br/>
                  Objective: <span className="text-zinc-200">Navigate the industrial wasteland. Repair the sonic weaponry. Ensure the ritual completion at Salzgitter.</span>
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                onClick={() => {
                  if (hasSavedGame) {
                    setShowSavePrompt(true);
                    return;
                  }
                  setSelectingTrait(true);
                }}
                className="group relative px-12 py-6 bg-toxic hover:bg-white text-black font-black text-2xl uppercase tracking-[0.3em] transition-all brutal-border-toxic hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#adff2f]"
              >
                Initialize_Tour
              </motion.button>
            </div>

            <AnimatePresence>
              {showSavePrompt && (
                <motion.div
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-2xl w-full bg-zinc-950 p-8 brutal-border-toxic"
                  >
                    <h3 className="text-3xl text-toxic font-black uppercase tracking-widest mb-5 border-b border-toxic/20 pb-4">
                      Save_Detected
                    </h3>
                    <p className="text-xs font-mono text-zinc-300 leading-relaxed uppercase tracking-wider mb-6">
                      Existing local save data found. Continue previous run or start a new game?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          setShowSavePrompt(false);
                          if (trait) {
                            audio.startMusic();
                            setScene('proberaum');
                          } else {
                            setSelectingTrait(true);
                          }
                        }}
                        className="group flex flex-col items-start p-6 bg-zinc-900 hover:bg-toxic border border-zinc-800 hover:border-toxic transition-all text-left"
                      >
                        <span className="text-2xl font-black text-zinc-100 group-hover:text-black uppercase mb-2">
                          Continue
                        </span>
                        <p className="text-xs font-mono text-zinc-500 group-hover:text-black/70 leading-relaxed">
                          Resume with your persisted trait, inventory and quest progress.
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          localStorage.removeItem(STORAGE_KEY);
                          resetGame();
                          setHasSavedGame(false);
                          setShowSavePrompt(false);
                          setSelectingTrait(true);
                        }}
                        className="group flex flex-col items-start p-6 bg-zinc-900 hover:bg-red-500 border border-zinc-800 hover:border-red-500 transition-all text-left"
                      >
                        <span className="text-2xl font-black text-zinc-100 group-hover:text-black uppercase mb-2">
                          New Game
                        </span>
                        <p className="text-xs font-mono text-zinc-500 group-hover:text-black/70 leading-relaxed">
                          Clear local save and reselect your trait from scratch.
                        </p>
                      </button>
                    </div>
                    <button
                      aria-label="Cancel save prompt"
                      onClick={() => setShowSavePrompt(false)}
                      className="mt-6 text-zinc-600 hover:text-toxic text-[10px] font-mono uppercase tracking-widest"
                    >
                      [ Cancel ]
                    </button>
                  </motion.div>
                </motion.div>
              )}
              {selectingTrait && (
                <motion.div 
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-4xl w-full bg-zinc-950 p-10 brutal-border-toxic"
                  >
                    <h3 className="text-4xl text-toxic font-black uppercase tracking-widest mb-8 border-b border-toxic/20 pb-4">
                      Select_Professional_Trait
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {traits.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTrait(t.id);
                            t.skills.forEach(s => useStore.getState().increaseSkill(s.name, s.val));
                            audio.startMusic();
                            setSelectingTrait(false);
                            setScene('proberaum');
                          }}
                          className="group flex flex-col items-start p-6 bg-zinc-900 hover:bg-toxic border border-zinc-800 hover:border-toxic transition-all text-left"
                        >
                          <span className="text-2xl font-black text-zinc-100 group-hover:text-black uppercase mb-2">
                            {t.id}
                          </span>
                          <p className="text-xs font-mono text-zinc-500 group-hover:text-black/70 leading-relaxed">
                            {t.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                    <button 
                      aria-label="Back to main terminal"
                      onClick={() => setSelectingTrait(false)}
                      className="mt-8 text-zinc-600 hover:text-toxic text-[10px] font-mono uppercase tracking-widest"
                    >
                      [ Back_To_Main_Terminal ]
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Corner Meta Info */}
            <div className="absolute bottom-8 left-8 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Build_v2.6.0_Stable<br/>
              Auth: oossiioo@gmail.com
            </div>
            <div className="absolute bottom-8 right-8 text-[10px] font-mono text-zinc-600 uppercase tracking-widest text-right">
              Terminal_Active<br/>
              Waiting_For_Input...
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={scene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
            style={{ touchAction: 'none' }}
          >
            <VirtualJoystick />
            <Canvas
              shadows
              camera={{ position: [0, 5, 10], fov: 50 }}
              onCreated={({ gl }) => {
                gl.toneMappingExposure = 1.7;
              }}
            >
              <KeyboardControls
                map={[
                  { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
                  { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
                  { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
                  { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
                ]}
              >
                <Suspense fallback={null}>
                  <Physics gravity={[0, -9.81, 0]} paused={isPaused}>
                    {scene === 'proberaum' && <Proberaum />}
                    {scene === 'tourbus' && <TourBus />}
                    {scene === 'backstage' && <Backstage />}
                    {scene === 'void_station' && <VoidStation />}
                    {scene === 'kaminstube' && <Kaminstube />}
                    {scene === 'salzgitter' && <Salzgitter />}
                  </Physics>
                </Suspense>
              </KeyboardControls>
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
