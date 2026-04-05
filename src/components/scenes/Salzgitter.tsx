/**
 * #1: UPDATES
 * - Added NPCs (Matze, Lars, Marius, Fan) with complex dialogue branches.
 * - Integrated character traits/skills into dialogue options.
 * - Added quest completion logic.
 * - Added 'Performer' trait-exclusive interaction for Marius.
 *
 * #2: NEXT STEPS & IDEAS
 * - Add more branching quest outcomes.
 * - Expand lore.
 *
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import { ContactShadows } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { SceneEnvironmentSetpieces } from './SceneEnvironmentSetpieces';
import {
  buildSalzgitterBassistDialogue,
  buildSalzgitterFanDialogue,
  buildSalzgitterFinaleDialogue,
  buildSalzgitterLarsDialogue,
  buildSalzgitterMariusDialogue,
  buildSalzgitterMatzeDialogue,
} from '../../dialogues/salzgitter';

const TRUSS_X_POSITIONS = [-9.5, 9.5] as const;
const SPEAKER_EDGE_X_OFFSETS = [-0.72, 0.72] as const;
const TRUSS_NODE_Y_POSITIONS = [-1.8, -0.6, 0.6, 1.8] as const;
const LED_PANEL_X_POSITIONS = [-12, -4, 4, 12] as const;
const LED_STRIP_Y_POSITIONS = [-1.4, -0.4, 0.6, 1.6] as const;
const BARRIER_X_POSITIONS = [-12, -8, -4, 0, 4, 8, 12] as const;
const RUNWAY_RAIL_X_POSITIONS = [-13.5, 13.5] as const;
const SKYLINE_DATA = [
  [-18, 2.5, -10.4, 2.4],
  [-14, 3.2, -10.3, 3.6],
  [-10, 2.2, -10.35, 2.1],
  [10, 2.7, -10.35, 2.8],
  [14, 3.6, -10.25, 4.2],
  [18, 2.4, -10.4, 2.3],
] as const;
const SPEAKER_STACK_X_POSITIONS = [-7.5, -2.5, 2.5, 7.5] as const;
const ROAD_CASE_POSITIONS = [
  [-11, 0.65, -8.8],
  [11, 0.65, -8.8],
  [-11, 0.65, -6.2],
  [11, 0.65, -6.2],
] as const;
const ROAD_CASE_LID_POSITIONS = [
  [-11, 1.28, -8.8],
  [11, 1.28, -8.8],
  [-11, 1.28, -6.2],
  [11, 1.28, -6.2],
] as const;
const STAGE_STAIR_DATA = [-0.45, 0, 0.45] as const;
const MIC_X_POSITIONS = [-2.6, 0, 2.6] as const;

/**
 * Renders the 3D scene environment and logic for Salzgitter.
 * @returns The 3D group containing scene interactables, NPCs, and boundaries.
 */
export function Salzgitter() {
  const bassist_contacted = useStore((state) => state.flags.bassist_contacted);

  const spotLight1Ref = useRef<THREE.SpotLight>(null);
  const spotLight2Ref = useRef<THREE.SpotLight>(null);
  const spotLight3Ref = useRef<THREE.SpotLight>(null);
  const tRef = useRef(0);

  useFrame((_state, delta) => {
    tRef.current += delta || 0;
    const t = tRef.current;
    const beat = Math.abs(Math.sin(t * 4)); // Simple beat sync

    if (spotLight1Ref.current) {
      spotLight1Ref.current.intensity = 10 + beat * 18;
      spotLight1Ref.current.position.x = Math.sin(t * 2) * 2;
    }
    if (spotLight2Ref.current) {
      spotLight2Ref.current.intensity = 10 + beat * 15;
      spotLight2Ref.current.position.x = -5 + Math.cos(t * 1.5) * 2;
    }
    if (spotLight3Ref.current) {
      spotLight3Ref.current.intensity = 10 + beat * 15;
      spotLight3Ref.current.position.x = 5 + Math.sin(t * 2.5) * 2;
    }
  });

  return (
    <>
      <color attach="background" args={['#2d3650']} />
      <fog attach="fog" args={['#2b3550', 26, 120]} />
      <ambientLight intensity={0.95} />
      <hemisphereLight args={['#edf7ff', '#3a4260', 0.75]} />
      <directionalLight position={[0, 11, 8]} intensity={1} color="#fff5ef" />
      <spotLight
        ref={spotLight1Ref}
        position={[0, 10, -5]}
        angle={0.3}
        penumbra={1}
        intensity={10}
        color="#00ffcc"
      />
      <spotLight
        ref={spotLight2Ref}
        position={[-5, 10, -5]}
        angle={0.3}
        penumbra={1}
        intensity={10}
        color="#ff00cc"
      />
      <spotLight
        ref={spotLight3Ref}
        position={[5, 10, -5]}
        angle={0.3}
        penumbra={1}
        intensity={10}
        color="#ccff00"
      />
      <pointLight position={[-13, 3.2, -2]} intensity={2.8} color="#5b7dff" />
      <pointLight position={[13, 3.2, -2]} intensity={2.8} color="#ff4fb1" />
      <pointLight position={[0, 5.2, 4]} intensity={3.2} color="#f7f7ff" />
      <pointLight position={[0, 4.4, -1]} intensity={2.4} color="#5cf0ff" />

      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial
            color="#35465a"
            emissive="#162636"
            emissiveIntensity={0.34}
            metalness={0.35}
            roughness={0.74}
          />
        </mesh>
      </RigidBody>

      {/* Big Stage */}
      <RigidBody type="fixed" position={[0, 1, -8]}>
        <mesh receiveShadow>
          <boxGeometry args={[20, 2, 6]} />
          <meshStandardMaterial
            color="#3f4b5e"
            emissive="#1b2a40"
            emissiveIntensity={0.42}
            metalness={0.55}
            roughness={0.5}
          />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 10, -11]}>
        <mesh receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial
            color="#0f151d"
            emissive="#060c14"
            emissiveIntensity={0.24}
            metalness={0.18}
            roughness={0.88}
          />
        </mesh>
      </RigidBody>

      {/* Invisible Walls for bounds */}
      <RigidBody type="fixed" position={[-20, 10, 0]}>
        <boxGeometry args={[1, 20, 20]} />
      </RigidBody>
      <RigidBody type="fixed" position={[20, 10, 0]}>
        <boxGeometry args={[1, 20, 20]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 10, 10]}>
        <boxGeometry args={[40, 20, 1]} />
      </RigidBody>

      {/* Stage trusses */}
      {TRUSS_X_POSITIONS.map((x) => (
        <group key={`truss-${x}`} position={[x, 3, -8.8]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.45, 6, 0.45]} />
            <meshStandardMaterial
              color="#1a1d23"
              metalness={0.8}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0, 3.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.25, 0.45]} />
            <meshStandardMaterial
              color="#1d2027"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          {TRUSS_NODE_Y_POSITIONS.map((y, idx) => (
            <mesh
              key={`truss-node-${x}-${idx}`}
              position={[0, y, 0.26]}
              castShadow
            >
              <sphereGeometry args={[0.08, 10, 10]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#78f8ff' : '#ff6ed3'}
                emissive={idx % 2 === 0 ? '#3bb7bf' : '#9a3b77'}
                emissiveIntensity={0.6}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* LED wall panels */}
      {LED_PANEL_X_POSITIONS.map((x, idx) => (
        <group key={`led-panel-${x}`} position={[x, 5.8, -10.75]}>
          <mesh>
            <planeGeometry args={[6.6, 4.3]} />
            <meshStandardMaterial
              color="#1a2030"
              emissive="#0e1730"
              emissiveIntensity={0.35}
              metalness={0.2}
              roughness={0.55}
            />
          </mesh>
          {LED_STRIP_Y_POSITIONS.map((y, stripe) => (
            <mesh key={`led-strip-${idx}-${stripe}`} position={[0, y, 0.01]}>
              <planeGeometry args={[5.8, 0.22]} />
              <meshBasicMaterial
                color={stripe % 2 === 0 ? '#2dffe7' : '#ff58c6'}
                transparent
                opacity={0.74}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Crowd barricades */}
      {BARRIER_X_POSITIONS.map((x) => (
        <group key={`barrier-${x}`} position={[x, 0.6, 1.8]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.8, 1.2, 0.18]} />
            <meshStandardMaterial
              color="#222831"
              metalness={0.7}
              roughness={0.45}
            />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[1.4, 0.2]} />
            <meshBasicMaterial color="#adff2f" />
          </mesh>
          <mesh position={[-0.55, -0.62, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.22, 0.18, 0.42]} />
            <meshStandardMaterial
              color="#8d99a8"
              metalness={0.82}
              roughness={0.22}
            />
          </mesh>
          <mesh position={[0.55, -0.62, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.22, 0.18, 0.42]} />
            <meshStandardMaterial
              color="#8d99a8"
              metalness={0.82}
              roughness={0.22}
            />
          </mesh>
        </group>
      ))}

      {/* Front runway rails */}
      {RUNWAY_RAIL_X_POSITIONS.map((x, idx) => (
        <group key={`rail-${x}`} position={[x, 0.9, 0.3]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 1.8, 6.4]} />
            <meshStandardMaterial
              color="#273140"
              emissive="#121d2c"
              emissiveIntensity={0.25}
              metalness={0.72}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[0.15, 0.12, 6.6]} />
            <meshStandardMaterial
              color={idx === 0 ? '#5b7dff' : '#ff4fb1'}
              emissive={idx === 0 ? '#5b7dff' : '#ff4fb1'}
              emissiveIntensity={1}
            />
          </mesh>
        </group>
      ))}

      {/* Distant skyline silhouettes */}
      {SKYLINE_DATA.map((entry, idx) => (
        <mesh
          key={`skyline-${idx}`}
          position={[entry[0], entry[1], entry[2]] as unknown as [number, number, number]}
        >
          <boxGeometry args={[1.8, entry[3], 0.3]} />
          <meshStandardMaterial color="#0a0d12" />
        </mesh>
      ))}

      {/* Stage interior details */}
      {SPEAKER_STACK_X_POSITIONS.map((x) => (
        <group key={`speaker-stack-${x}`} position={[x, 1.5, -6.9]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 3, 1.2]} />
            <meshStandardMaterial
              color="#202733"
              emissive="#101a28"
              emissiveIntensity={0.34}
              metalness={0.6}
              roughness={0.46}
            />
          </mesh>
          <mesh position={[0, 0.7, 0.61]}>
            <circleGeometry args={[0.45, 20]} />
            <meshBasicMaterial color="#5affcf" />
          </mesh>
          <mesh position={[0, -0.55, 0.61]}>
            <circleGeometry args={[0.58, 20]} />
            <meshBasicMaterial color="#5affcf" />
          </mesh>
          <mesh position={[0, 0.06, 0.61]}>
            <planeGeometry args={[1.64, 2.62]} />
            <meshStandardMaterial
              color="#10151f"
              metalness={0.4}
              roughness={0.82}
              transparent
              opacity={0.42}
            />
          </mesh>
          {SPEAKER_EDGE_X_OFFSETS.map((px) => (
            <mesh key={`speaker-edge-${x}-${px}`} position={[px, 0, 0.58]}>
              <boxGeometry args={[0.06, 2.9, 0.08]} />
              <meshStandardMaterial
                color="#aab6c4"
                metalness={0.85}
                roughness={0.24}
              />
            </mesh>
          ))}
        </group>
      ))}
      {ROAD_CASE_POSITIONS.map((pos, idx) => (
        <mesh
          key={`road-case-${idx}`}
          position={pos as unknown as [number, number, number]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2.2, 1.3, 1.1]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#2b2140' : '#1f3140'}
            emissive={idx % 2 === 0 ? '#19112c' : '#11212c'}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      {ROAD_CASE_LID_POSITIONS.map((pos, idx) => (
        <mesh
          key={`road-case-lid-${idx}`}
          position={pos as unknown as [number, number, number]}
        >
          <boxGeometry args={[2.08, 0.08, 0.98]} />
          <meshStandardMaterial
            color="#aeb7c9"
            emissive="#56627e"
            emissiveIntensity={0.22}
            metalness={0.88}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Drum riser, stairs and mics */}
      <mesh position={[0, 1.65, -8.4]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.6, 30]} />
        <meshStandardMaterial
          color="#2a3341"
          emissive="#121e2d"
          emissiveIntensity={0.34}
          metalness={0.56}
          roughness={0.42}
        />
      </mesh>
      {STAGE_STAIR_DATA.map((x, idx) => (
        <mesh
          key={`stage-stair-${idx}`}
          position={[x, 0.32 + idx * 0.18, -5.95]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.5 - idx * 0.3, 0.16, 0.35]} />
          <meshStandardMaterial
            color="#384255"
            emissive="#1b293f"
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.48}
          />
        </mesh>
      ))}
      {MIC_X_POSITIONS.map((x) => (
        <group key={`mic-${x}`} position={[x, 1.05, -5.6]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.04, 0.05, 1.7, 10]} />
            <meshStandardMaterial
              color="#bcc7d5"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.86, 0.12]} rotation={[0.45, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.34, 10]} />
            <meshStandardMaterial
              color="#d8e1eb"
              metalness={0.88}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 1.02, 0.26]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial
              color="#64f3ff"
              emissive="#64f3ff"
              emissiveIntensity={0.75}
            />
          </mesh>
        </group>
      ))}

      {/* Ambient floor glow for finale stage */}
      <mesh position={[0, 0.03, -4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.5, 7, 48]} />
        <meshBasicMaterial color="#2dffe7" transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, 0.02, 2.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 0.35]} />
        <meshStandardMaterial
          color="#2dffe7"
          emissive="#2dffe7"
          emissiveIntensity={0.52}
        />
      </mesh>
      <mesh position={[0, 0.02, 4.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 0.28]} />
        <meshStandardMaterial
          color="#ff58c6"
          emissive="#ff58c6"
          emissiveIntensity={0.46}
        />
      </mesh>

      {/* Poster */}
      <mesh position={[-6, 5, -10.9]}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <group position={[-6, 5, -10.86]}>
        <mesh>
          <planeGeometry args={[3.6, 2.6]} />
          <meshStandardMaterial
            color="#3b185f"
            emissive="#1f0c35"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, 0.95, 0.01]}>
          <planeGeometry args={[1.7, 0.2]} />
          <meshBasicMaterial color="#c4b5fd" />
        </mesh>
        <mesh position={[0, 0.4, 0.01]}>
          <planeGeometry args={[2.2, 0.28]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
        <mesh position={[0, -0.18, 0.01]}>
          <planeGeometry args={[1.8, 0.2]} />
          <meshBasicMaterial color="#e9d5ff" />
        </mesh>
        <mesh position={[0, -0.78, 0.01]}>
          <planeGeometry args={[1.45, 0.13]} />
          <meshBasicMaterial color="#ddd6fe" />
        </mesh>
      </group>

      {/* Characters & Objects */}

      <Interactable
        position={[-4, 3, -7]}
        emoji="🎸"
        name="Matze"
        isBandMember={true}
        idleType="headbang"
        onInteract={() => {
          useStore.getState().setDialogue(buildSalzgitterMatzeDialogue());
        }}
      />

      <Interactable
        position={[4, 3, -8]}
        emoji="🥁"
        name="Lars"
        isBandMember={true}
        idleType="tap"
        onInteract={() => {
          useStore.getState().setDialogue(buildSalzgitterLarsDialogue());
        }}
      />

      <Interactable
        position={[0, 3, -6]}
        emoji="🎤"
        name="Marius"
        isBandMember={true}
        idleType="sway"
        onInteract={() => {
          useStore.getState().setDialogue(buildSalzgitterMariusDialogue());
        }}
      />

      {/* Lore: Floating Bassist */}
      {bassist_contacted && (
        <Interactable
          position={[0, 8, -5]}
          emoji="🎸"
          name="Schwebender Bassist"
          scale={1.5}
          onInteract={() => {
            useStore.getState().setDialogue(buildSalzgitterBassistDialogue());
          }}
        />
      )}

      <Interactable
        position={[8, 0, 5]}
        emoji="🤩"
        name="Fan"
        onInteract={() => {
          useStore.getState().setDialogue(buildSalzgitterFanDialogue());
        }}
      />

      <Interactable
        position={[0, 1, 0]}
        emoji="🏆"
        name="Das Finale"
        scale={2}
        onInteract={() => {
          useStore.getState().setDialogue(buildSalzgitterFinaleDialogue());
        }}
      />

      <SceneEnvironmentSetpieces variant="salzgitter" />

      <Player bounds={{ x: [-18, 18], z: [-9, 9] }} />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={30}
        blur={2}
        far={10}
      />
    </>
  );
}
