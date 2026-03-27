/**
 * #1: UPDATES
 * - Implemented interactive component with hover, range, and interaction logic.
 * - Added visual feedback for interaction and range.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more interaction types.
 * - Refine interaction UI.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useStore } from '../store';
import { audio } from '../audio';

interface InteractableProps {
  position: [number, number, number];
  emoji: string;
  name: string;
  onInteract: () => void;
  scale?: number;
  isBandMember?: boolean;
  idleType?: 'headbang' | 'tap' | 'sway';
}

export function Interactable({ position, emoji, name, onInteract, scale = 1, isBandMember = false, idleType = 'sway' }: InteractableProps) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [inRange, setInRange] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const isPaused = useStore((state) => state.isPaused);
  const bandMood = useStore((state) => state.bandMood);
  const setCameraShake = useStore((state) => state.setCameraShake);

  // ⚡ Bolt: Cache Vector3 instances to prevent memory allocations in the hot path
  const playerPosVec = useRef(new THREE.Vector3()).current;
  const targetPosVec = useRef(new THREE.Vector3(...position)).current;

  useFrame((state) => {
    if (isPaused) return;

    const playerPos = useStore.getState().playerPos;
    // ⚡ Bolt: Update cached vectors and use distanceToSquared to avoid Math.sqrt
    playerPosVec.set(playerPos[0], playerPos[1], playerPos[2]);
    const distSq = playerPosVec.distanceToSquared(targetPosVec);
    setInRange(distSq < 16.0); // 4.0 * 4.0 = 16.0

    if (ref.current) {
      const time = state.clock.elapsedTime;
      const moodFactor = 0.5 + (bandMood / 100);
      
      if (isBandMember) {
        if (idleType === 'headbang') {
          ref.current.rotation.x = Math.sin(time * 8 * moodFactor) * 0.15 * moodFactor;
        } else if (idleType === 'tap') {
          ref.current.position.y = position[1] + Math.abs(Math.sin(time * 4 * moodFactor)) * 0.1 * moodFactor;
        } else {
          ref.current.rotation.z = Math.sin(time * 4 * moodFactor) * 0.1 * moodFactor;
        }
      } else {
        ref.current.position.y = position[1] + Math.sin(time * 2) * 0.05;
      }
    }
  });

  const handleInteract = () => {
    if (inRange && !isPaused) {
      audio.playInteraction();
      setCameraShake(0.2);
      onInteract();
      setInteracted(true);
      setTimeout(() => setInteracted(false), 500);
    } else if (!isPaused) {
      useStore.getState().setDialogue('OUT_OF_RANGE: Move closer to target.');
    }
  };

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[0.75 * scale, 1 * scale, 0.5 * scale]} />
      <group ref={ref}>
        <Billboard follow={true}>
          <mesh
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              handleInteract();
            }}
          >
            <planeGeometry args={[1.5 * scale, 1.5 * scale]} />
            <meshStandardMaterial color="#fff" transparent opacity={0} />
            <Html transform distanceFactor={10} position={[0, 0, 0.1]} center>
              <div
                className={`text-6xl select-none transition-all duration-200 relative ${
                  hovered ? 'scale-110' : 'scale-100'
                } ${inRange && hovered ? 'cursor-pointer' : 'cursor-default'} ${
                  interacted ? 'animate-pulse text-toxic brightness-200' : ''
                }`}
                style={{ fontSize: `${scale * 4}rem` }}
              >
                {/* Glow effect when in range */}
                {inRange && (
                  <div className="absolute inset-0 bg-toxic/20 blur-2xl rounded-full -z-10 animate-pulse" />
                )}

                {emoji}

                {/* Industrial Glitch Effect on Interaction */}
                {interacted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-toxic absolute top-1/4 animate-bounce opacity-50" />
                    <div className="w-full h-1 bg-blood absolute bottom-1/4 animate-bounce opacity-50" />
                  </div>
                )}
              </div>

              {hovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap text-center bg-black/95 p-3 brutal-border-toxic z-10">
                  <div className="text-[10px] font-black text-toxic uppercase tracking-[0.2em] mb-1">
                    {name}
                  </div>
                  {inRange ? (
                    <div className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                      [ ACCESS_GRANTED: Click_To_Interact ]
                    </div>
                  ) : (
                    <div className="text-[8px] font-mono text-blood uppercase tracking-widest">
                      [ ACCESS_DENIED: Distance_Error ]
                    </div>
                  )}
                </div>
              )}
            </Html>
          </mesh>
        </Billboard>
      </group>
    </RigidBody>
  );
}
