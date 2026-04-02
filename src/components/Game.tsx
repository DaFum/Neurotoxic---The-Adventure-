import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { Proberaum } from './scenes/Proberaum';
import { TourBus } from './scenes/TourBus';
import { Backstage } from './scenes/Backstage';
import { VoidStation } from './scenes/VoidStation';
import { Kaminstube } from './scenes/Kaminstube';
import { Salzgitter } from './scenes/Salzgitter';
import { WorldEvents } from './WorldEvents';
import { UI } from './UI';
import { VirtualJoystick } from './VirtualJoystick';
import { audio, isAmbientScene } from '../audio';
import { KeyboardInteractionProvider } from './KeyboardInteractionManager';
import { MainMenu } from './MainMenu';

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
    if (scene !== 'menu' && isAmbientScene(scene)) {
      audio.startAmbient(scene);
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
