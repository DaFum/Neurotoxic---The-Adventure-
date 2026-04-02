/**
 * #1: UPDATES
 * - Added 'Mystic' trait-exclusive interaction for Kosmischer Tankwart.
 *
 * #2: NEXT STEPS & IDEAS
 * - Expand questlines with branching outcomes.
 * - Refine NPC dialogue and lore.
 * - Introduce scene-specific quests for remaining scenes.
 * - Integrate character traits/skills deeper into dialogue.
 *
 * #3: ERRORS & SOLUTIONS
 * - Error: Cannot find name 'addQuest'. Solution: Added addQuest to useStore destructuring.
 */
import { useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import {
  Float,
  Text,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sparkles,
  Stars,
} from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { SceneEnvironmentSetpieces } from './SceneEnvironmentSetpieces';
import { useShallow } from 'zustand/react/shallow';
import { audio } from '../../audio';
import {
  buildVoidBassistEncounterDialogue,
  buildVoidCosmicEchoDialogue,
  buildVoidDarkMatterPickupDialogue,
  buildVoidDetektorDialogue,
  buildVoidDiplomatenInterfaceDialogue,
  buildVoidEgoDialogue,
  buildVoidInschriftDialogue,
  buildVoidMagnetbandDialogue,
  buildVoidPortalDialogue,
  buildVoidTankwartDialogue,
  buildVoidTerminalDialogue,
} from '../../dialogues/voidstation';

/**
 * Renders the 3D scene environment and logic for VoidStation.
 * @returns The 3D group containing scene interactables, NPCs, and boundaries.
 */
export function VoidStation() {
  const canPickupItem = useStore((state) => state.canPickupItem);
  const setDialogue = useStore((state) => state.setDialogue);
  const setScene = useStore((state) => state.setScene);
  const flags = useStore(useShallow((state) => ({
    voidRefueled: state.flags.voidRefueled,
    egoContained: state.flags.egoContained,
    cosmic_echo: state.flags.cosmic_echo,
    bassist_clue_matze: state.flags.bassist_clue_matze,
    bassist_clue_ghost: state.flags.bassist_clue_ghost,
    bassist_contacted: state.flags.bassist_contacted
  })));
  const addQuest = useStore((state) => state.addQuest);
  const hasDunkleMaterie = useStore((state) => state.inventory.includes('Dunkle Materie'));
  const exitTimeoutRef = useRef<number | null>(null);

  const startAndFinishQuest = useStore((state) => state.startAndFinishQuest);

  // Register scene-specific quests when the player enters VoidStation.
  // On legacy saves the completion flags may already be true — use startAndFinishQuest
  // in that case so the quest lands as 'completed' rather than stuck as 'active'.
  useEffect(() => {
    const { flags } = useStore.getState();
    if (flags.voidRefueled) {
      startAndFinishQuest('void', 'Betanke den Van mit dunkler Materie');
    } else {
      addQuest('void', 'Betanke den Van mit dunkler Materie');
    }
    if (flags.egoContained) {
      startAndFinishQuest('ego', "Fange Marius' entflohenes Ego ein");
    } else {
      addQuest('ego', "Fange Marius' entflohenes Ego ein");
    }
  }, [addQuest, startAndFinishQuest]);

  useEffect(() => {
    audio.startAmbient('void_station');
    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <color attach="background" args={['#1a2340']} />
      <fogExp2 attach="fog" args={['#24345a', 0.01]} />
      <ambientLight intensity={0.72} />
      <hemisphereLight args={['#d8ebff', '#4a416a', 0.7]} />
      <pointLight position={[0, 10, 0]} intensity={3.9} color="#ff00ff" />
      <pointLight position={[5, 5, 5]} intensity={2.8} color="#00ffff" />
      <pointLight position={[-6, 5, -5]} intensity={2.5} color="#8a7dff" />
      <pointLight position={[0, 4, -7]} intensity={2.4} color="#7bff6d" />
      <Stars
        radius={140}
        depth={70}
        count={9000}
        factor={5}
        saturation={0}
        fade
        speed={0.8}
      />
      <Sparkles
        count={120}
        scale={[60, 20, 60]}
        size={2}
        speed={0.3}
        opacity={0.3}
        color="#7e5dff"
      />

      {/* Surreal Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshDistortMaterial
            color="#34255a"
            speed={2}
            distort={0.4}
            radius={1}
          />
        </mesh>
      </RigidBody>

      {/* Floating Obelisks */}
      <Float speed={5} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[-10, 5, -10]}>
          <boxGeometry args={[2, 10, 2]} />
          <meshStandardMaterial
            color="#adff2f"
            emissive="#adff2f"
            emissiveIntensity={2}
          />
        </mesh>
        {[-3.2, -1.6, 0, 1.6, 3.2].map((y, idx) => (
          <mesh
            key={`obelisk-ring-${idx}`}
            position={[-10, 5 + y, -10]}
            rotation={[Math.PI / 2, 0, idx * 0.2]}
          >
            <torusGeometry args={[1.55, 0.05, 12, 24]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#73ffe4' : '#ff71d7'}
              emissive={idx % 2 === 0 ? '#3ec5ad' : '#b24792'}
              emissiveIntensity={0.65}
              metalness={0.75}
              roughness={0.2}
            />
          </mesh>
        ))}
      </Float>
      <Float speed={4} rotationIntensity={3} floatIntensity={1}>
        <mesh position={[10, 3, -5]}>
          <octahedronGeometry args={[2]} />
          <MeshWobbleMaterial color="#ff00ff" speed={5} factor={2} />
        </mesh>
      </Float>

      {/* Orbiting crystals */}
      {[
        [-16, 1.6, -8],
        [-12, 2.1, 10],
        [12, 2.3, 10],
        [16, 1.8, -8],
        [0, 2.5, -16],
      ].map((pos, idx) => (
        <Float
          key={`crystal-${idx}`}
          speed={2 + idx * 0.2}
          rotationIntensity={1.6}
          floatIntensity={0.8}
        >
          <mesh position={pos as [number, number, number]}>
            <dodecahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#7a4dff' : '#36d7ff'}
              emissive={idx % 2 === 0 ? '#3f22a2' : '#10618c'}
              emissiveIntensity={0.8}
              metalness={0.45}
              roughness={0.35}
            />
          </mesh>
        </Float>
      ))}

      {/* Distant anomaly rings */}
      {[8, 14, 20].map((r, idx) => (
        <mesh
          key={`anomaly-ring-${r}`}
          position={[0, 6 + idx * 0.8, -12 - idx * 4]}
          rotation={[Math.PI / 2.2, 0, 0]}
        >
          <torusGeometry args={[r, 0.08, 16, 80]} />
          <meshBasicMaterial
            color={idx % 2 ? '#6ffff5' : '#ff49f2'}
            transparent
            opacity={0.22}
          />
        </mesh>
      ))}

      {/* Station interior modules */}
      {[
        [-14, 0.8, -2],
        [-10, 0.8, 3],
        [10, 0.8, 3],
        [14, 0.8, -2],
      ].map((pos, idx) => (
        <mesh
          key={`void-console-${idx}`}
          position={pos as [number, number, number]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2.8, 1.6, 1.4]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#5136a0' : '#2786b0'}
            emissive={idx % 2 === 0 ? '#7a54e1' : '#39b6e8'}
            emissiveIntensity={0.75}
            metalness={0.55}
            roughness={0.34}
          />
        </mesh>
      ))}
      {[
        [-14, 1.45, -1.2],
        [-10, 1.45, 3.8],
        [10, 1.45, 3.8],
        [14, 1.45, -1.2],
      ].map((pos, idx) => (
        <mesh
          key={`void-console-screen-${idx}`}
          position={pos as [number, number, number]}
        >
          <planeGeometry args={[1.8, 0.52]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#89c8ff' : '#8fffa5'}
            emissive={idx % 2 === 0 ? '#4d8cd9' : '#47b95c'}
            emissiveIntensity={0.95}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
      ))}
      {[
        [-13.1, 0.5, -1.2],
        [-10.9, 0.5, 3.8],
        [9.1, 0.5, 3.8],
        [13.1, 0.5, -1.2],
      ].map((pos, idx) => (
        <mesh
          key={`void-console-orb-${idx}`}
          position={pos as [number, number, number]}
        >
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#ff72d5' : '#74f4ff'}
            emissive={idx % 2 === 0 ? '#c14295' : '#44b8c3'}
            emissiveIntensity={0.85}
            metalness={0.72}
            roughness={0.18}
          />
        </mesh>
      ))}
      {[-12, -6, 0, 6, 12].map((x) => (
        <mesh key={`void-panel-${x}`} position={[x, 1.9, -1.3]}>
          <planeGeometry args={[1.2, 0.26]} />
          <meshBasicMaterial color="#57f5ff" transparent opacity={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.15, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 7.2, 48]} />
        <meshBasicMaterial color="#9f64ff" transparent opacity={0.2} />
      </mesh>
      {[
        [-15, 3.2, -3],
        [15, 3.2, -3],
        [-15, 3.2, 4],
        [15, 3.2, 4],
      ].map((pos, idx) => (
        <mesh
          key={`void-arch-${idx}`}
          position={pos as [number, number, number]}
          rotation={[0, idx < 2 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <torusGeometry args={[1.6, 0.18, 14, 36]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#ff4fd3' : '#5be8ff'}
            emissive={idx % 2 === 0 ? '#7a1f61' : '#1a617a'}
            emissiveIntensity={0.7}
            metalness={0.65}
            roughness={0.28}
          />
        </mesh>
      ))}

      {/* Conduit lines and floating shards */}
      {[-14, -7, 0, 7, 14].map((x, idx) => (
        <mesh
          key={`conduit-${x}`}
          position={[x, 0.06, -6.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.75, 0.04, 10, 28]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#7c8dff' : '#64ffd5'}
            emissive={idx % 2 === 0 ? '#4d58b7' : '#3cae93'}
            emissiveIntensity={0.55}
            metalness={0.72}
            roughness={0.24}
          />
        </mesh>
      ))}
      {[
        [-6, 2.8, -11],
        [-2, 3.4, -13],
        [2, 3.1, -13],
        [6, 2.7, -11],
      ].map((pos, idx) => (
        <Float
          key={`shard-${idx}`}
          speed={2.2 + idx * 0.2}
          rotationIntensity={2.4}
          floatIntensity={0.7}
        >
          <mesh position={pos as [number, number, number]}>
            <tetrahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#ff7ce2' : '#7efbff'}
              emissive={idx % 2 === 0 ? '#ae4f95' : '#47b8c2'}
              emissiveIntensity={0.82}
              metalness={0.68}
              roughness={0.18}
            />
          </mesh>
        </Float>
      ))}

      {/* The Cosmic Attendant */}
      <Interactable
        position={[0, 0, -5]}
        emoji="👁️"
        name="Kosmischer Tankwart"
        scale={2}
        onInteract={() => {
          useStore.getState().setDialogue(buildVoidTankwartDialogue());
        }}
      />

      {/* Lore Snippet: Floating Terminal */}
      <Interactable
        position={[-8, 2, -2]}
        emoji="📟"
        name="Altes Terminal"
        onInteract={() => {
          useStore.getState().setDialogue(buildVoidTerminalDialogue());
        }}
      />

      {/* Quest: Cosmic Echo */}
      {!flags.cosmic_echo && (
        <Interactable
          position={[-5, 2, 5]}
          emoji="🌌"
          name="Kosmisches Echo"
          onInteract={() => {
            useStore.getState().setDialogue(buildVoidCosmicEchoDialogue());
          }}
        />
      )}

      {flags.bassist_clue_matze &&
        flags.bassist_clue_ghost &&
        !flags.bassist_contacted && (
          <Interactable
            position={[-12, 4, 12]}
            emoji="👻"
            name="Schwebender Bassist"
            onInteract={() => {
              useStore
                .getState()
                .setDialogue(buildVoidBassistEncounterDialogue());
            }}
          />
        )}

      {/* Marius' Ego (Floating interaction) */}
      {!flags.egoContained && (
        <Interactable
          position={[5, 2, 0]}
          emoji="👑"
          name="Marius' Ego"
          scale={0.5}
          onInteract={() => {
            useStore.getState().setDialogue(buildVoidEgoDialogue());
          }}
        />
      )}

      {/* Item: Liquid Darkness */}
      {!hasDunkleMaterie && (
        <Interactable
          position={[-5, 0, 5]}
          emoji="🌑"
          name="Dunkle Materie"
          onInteract={() => {
            useStore
              .getState()
              .setDialogue(buildVoidDarkMatterPickupDialogue());
          }}
        />
      )}

      {/* Exit to Kaminstube */}
      <Interactable
        position={[0, 0, 10]}
        emoji="🌀"
        name="Realitäts-Portal"
        onInteract={() => {
          const state = useStore.getState();
          state.setDialogue(buildVoidPortalDialogue());
          if (state.flags.voidRefueled) {
            if (exitTimeoutRef.current !== null) {
              window.clearTimeout(exitTimeoutRef.current);
            }
            exitTimeoutRef.current = window.setTimeout(() => {
              if (useStore.getState().scene === 'void_station')
                setScene('kaminstube');
              exitTimeoutRef.current = null;
            }, 1000);
          }
        }}
      />

      {/* New Ambient Interactables */}
      <Interactable
        position={[-3, 1, -8]}
        emoji="🖥️"
        name="Diplomaten-Interface"
        onInteract={() => {
          useStore
            .getState()
            .setDialogue(buildVoidDiplomatenInterfaceDialogue());
        }}
      />

      <Interactable
        position={[3, 3, -3]}
        emoji="📼"
        name="Schwebende Magnetbänder"
        onInteract={() => {
          useStore.getState().setDialogue(buildVoidMagnetbandDialogue());
        }}
      />

      <Interactable
        position={[8, 0, -5]}
        emoji="📡"
        name="Frequenz-Detektor"
        onInteract={() => {
          useStore.getState().setDialogue(buildVoidDetektorDialogue());
        }}
      />

      <Interactable
        position={[-2, 2, 8]}
        emoji="⚠️"
        name="Verbotene Inschrift"
        onInteract={() => {
          useStore.getState().setDialogue(buildVoidInschriftDialogue());
        }}
      />

      <SceneEnvironmentSetpieces variant="void_station" />

      <Player bounds={{ x: [-20, 20], z: [-20, 20] }} />
    </>
  );
}
