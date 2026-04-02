import { Suspense, useEffect, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { WorldEvents } from './WorldEvents';
import { UI } from './UI';
import { VirtualJoystick } from './VirtualJoystick';
import { audio } from '../audio';
import { KeyboardInteractionProvider } from './KeyboardInteractionManager';
import { MainMenu } from './MainMenu';

// ⚡ Bolt Optimization: Lazy load heavy 3D scene components to reduce initial bundle size
// and speed up initial application load time.
const Proberaum = lazy(() => import('./scenes/Proberaum').then(module => ({ default: module.Proberaum })));
const TourBus = lazy(() => import('./scenes/TourBus').then(module => ({ default: module.TourBus })));
const Backstage = lazy(() => import('./scenes/Backstage').then(module => ({ default: module.Backstage })));
const VoidStation = lazy(() => import('./scenes/VoidStation').then(module => ({ default: module.VoidStation })));
const Kaminstube = lazy(() => import('./scenes/Kaminstube').then(module => ({ default: module.Kaminstube })));
const Salzgitter = lazy(() => import('./scenes/Salzgitter').then(module => ({ default: module.Salzgitter })));

/**
 * The main 3D Game component that sets up the Canvas, physics engine, and scene routing.
 * It handles the rendering of the active scene environment and the player character.
 * @returns The 3D Canvas containing the active game world.
 */
export function Game() {
  const scene = useStore((state) => state.scene);
  const isPaused = useStore((state) => state.isPaused);
  const setPaused = useStore((state) => state.setPaused);

  useEffect(() => {
    if (scene !== 'menu') {
      audio.startAmbient(scene as any);
    } else {
      audio.stopAmbient();
    }
  }, [scene]);

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
    <KeyboardInteractionProvider>
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans">
      <WorldEvents />
      <UI />
      
      <AnimatePresence mode="wait">
        {scene === 'menu' ? (
          <MainMenu key="menu" />
        ) : (
          <motion.div
            key="in-game"
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
    </KeyboardInteractionProvider>
  );
}
