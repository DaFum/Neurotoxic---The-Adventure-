import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';

const Proberaum = React.lazy(() =>
  import('./scenes/Proberaum').then((m) => ({ default: m.Proberaum })),
);
const TourBus = React.lazy(() => import('./scenes/TourBus').then((m) => ({ default: m.TourBus })));
const Backstage = React.lazy(() =>
  import('./scenes/Backstage').then((m) => ({ default: m.Backstage })),
);
const VoidStation = React.lazy(() =>
  import('./scenes/VoidStation').then((m) => ({ default: m.VoidStation })),
);
const Kaminstube = React.lazy(() =>
  import('./scenes/Kaminstube').then((m) => ({ default: m.Kaminstube })),
);
const Salzgitter = React.lazy(() =>
  import('./scenes/Salzgitter').then((m) => ({ default: m.Salzgitter })),
);

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
    return () => audio.stopAmbient();
  }, [scene]);

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
                dpr={[1, 1.5]}
                shadows
                gl={{ powerPreference: 'high-performance' }}
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
