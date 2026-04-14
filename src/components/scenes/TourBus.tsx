/**
 * #1: UPDATES
 * - Integrated "Talking Amp's Existential Crisis" quest in Proberaum.
 * - Integrated "Ghostly Roadie's Lost Recipe" quest in TourBus.
 * - Added Geister-Drink item combination.
 * - Added Rostiges Plektrum item.
 * - Added 'Technician' trait-exclusive interaction for broken amplifier.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Expand questlines with branching outcomes.
 * - Refine NPC dialogue and lore.
 * - Introduce scene-specific quests for remaining scenes.
 * - Integrate character traits/skills deeper into dialogue.
 */
import { useStore } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import {
  buildTourbusMatzeDialogue,
  buildTourbusMariusDialogue,
  buildTourbusAmpDialogue,
  buildTourbusHiddenStashDialogue,
  buildTourbusGhostDialogue,
  buildTourbusBandMeetingDialogue
} from '../../dialogues/tourbus';
import { Sparkles, Float, Text } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { SceneEnvironmentSetpieces } from './SceneEnvironmentSetpieces';
import { useShallow } from 'zustand/react/shallow';

const MATZE_POSITION: [number, number, number] = [-3, 1, -2];
const MARIUS_POSITION: [number, number, number] = [3, 1, -2];
const WINDOW_Z_POSITIONS: ReadonlyArray<number> = [-3.8, -1.2, 1.2, 3.8];
const CEILING_RAIL_X_POSITIONS: ReadonlyArray<number> = [-4.5, -1.5, 1.5, 4.5];
const SEAT_BLOCK_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-4, 0.5, 2.8],
  [-1.2, 0.5, 2.8],
  [1.6, 0.5, 2.8],
  [4.4, 0.5, 2.8],
];
const SEAT_BACK_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-4, 1.18, 2.12],
  [-1.2, 1.18, 2.12],
  [1.6, 1.18, 2.12],
  [4.4, 1.18, 2.12],
];
const SEAT_HEADREST_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-4, 1.75, 2.06],
  [-1.2, 1.75, 2.06],
  [1.6, 1.75, 2.06],
  [4.4, 1.75, 2.06],
];
const SEAT_LEG_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-4.78, -0.06, 2.2], [-3.22, -0.06, 2.2], [-4.78, -0.06, 3.38], [-3.22, -0.06, 3.38],
  [-1.98, -0.06, 2.2], [-0.42, -0.06, 2.2], [-1.98, -0.06, 3.38], [-0.42, -0.06, 3.38],
  [0.82, -0.06, 2.2], [2.38, -0.06, 2.2], [0.82, -0.06, 3.38], [2.38, -0.06, 3.38],
  [3.62, -0.06, 2.2], [5.18, -0.06, 2.2], [3.62, -0.06, 3.38], [5.18, -0.06, 3.38],
];
const DASH_SCREEN_X_POSITIONS: ReadonlyArray<number> = [-0.9, 0, 0.9];
const DASH_KNOB_X_POSITIONS: ReadonlyArray<number> = [-1.2, -0.4, 0.4, 1.2];
const BUS_SHELF_X_POSITIONS: ReadonlyArray<number> = [-5.2, -4.2, 4.2, 5.2];
const LUGGAGE_RACK_Z_POSITIONS: ReadonlyArray<number> = [-3.4, -1.2, 1.2, 3.4];
const SIDE_CASE_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-5.1, 0.55, -1.6], [5.1, 0.55, -1.6], [-5.1, 0.55, 1.2], [5.1, 0.55, 1.2],
];
const SIDE_CASE_LATCH_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-5.08, 1.08, -1.6], [5.08, 1.08, -1.6], [-5.08, 1.08, 1.2], [5.08, 1.08, 1.2],
];
const GRAB_HANDLE_X_POSITIONS: ReadonlyArray<number> = [-4.8, -2.4, 0, 2.4, 4.8];
const STRAP_X_POSITIONS: ReadonlyArray<number> = [-3.6, -1.2, 1.2, 3.6];

/**
 * Renders the 3D scene environment and logic for TourBus.
 * @returns The 3D group containing scene interactables, NPCs, and boundaries.
 */
export function TourBus() {
  const setDialogue = useStore((state) => state.setDialogue);
  const flags = useStore(useShallow((state) => ({
    tourbusBandMeeting: state.flags.tourbusBandMeeting,
    tourbus_sabotage_discovered: state.flags.tourbus_sabotage_discovered,
    tourbusAmpTechnician: state.flags.tourbusAmpTechnician,
    tourbusCoffeeCollected: state.flags.tourbusCoffeeCollected,
    tourbusEnergyDrinkCollected: state.flags.tourbusEnergyDrinkCollected,
    tourbusBeerCollected: state.flags.tourbusBeerCollected,
    rostigesPlektrumCollected: state.flags.rostigesPlektrumCollected
  })));
  const setFlag = useStore((state) => state.setFlag);
  const addToInventory = useStore((state) => state.addToInventory);
  const canPickupItem = useStore((state) => state.canPickupItem);
  const inventoryIncludes = useStore(useShallow((state) => ({
    Klebeband: !!state.inventoryCounts['Klebeband'],
    'Repariertes Kabel': !!state.inventoryCounts['Repariertes Kabel'],
    'Defektes Kabel': !!state.inventoryCounts['Defektes Kabel'],
    Kaffee: !!state.inventoryCounts['Kaffee'],
    Energiedrink: !!state.inventoryCounts['Energiedrink'],
    Bier: !!state.inventoryCounts['Bier'],
    Batterie: !!state.inventoryCounts['Batterie']
  })));
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const exitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <color attach="background" args={['#4a3524']} />
      <fog attach="fog" args={['#5a4530', 16, 60]} />

      {/* Bus Interior Walls */}
      <mesh position={[0, 2, -5]}>
        <boxGeometry args={[12, 5, 0.5]} />
        <meshStandardMaterial color="#232a33" emissive="#111820" emissiveIntensity={0.22} metalness={0.35} roughness={0.72} />
      </mesh>
      <mesh position={[-6, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.5]} />
        <meshStandardMaterial color="#1e252e" emissive="#121921" emissiveIntensity={0.2} metalness={0.32} roughness={0.74} />
      </mesh>
      <mesh position={[6, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.5]} />
        <meshStandardMaterial color="#1e252e" emissive="#121921" emissiveIntensity={0.2} metalness={0.32} roughness={0.74} />
      </mesh>
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 10]} />
          <meshStandardMaterial color="#1a1d24" emissive="#0b0f16" emissiveIntensity={0.25} metalness={0.28} roughness={0.82} />
        </mesh>
      </RigidBody>
      <mesh position={[0, 4.3, 0]}>
        <boxGeometry args={[12, 0.3, 10]} />
        <meshStandardMaterial color="#2f3741" emissive="#151b22" emissiveIntensity={0.18} metalness={0.42} roughness={0.62} />
      </mesh>

      {/* Window strips */}
      {WINDOW_Z_POSITIONS.map((z) => (
        <mesh key={`win-left-${z}`} position={[-5.74, 2.45, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.65, 1.1]} />
          <meshStandardMaterial color="#7fb7ff" emissive="#2d5f9d" emissiveIntensity={0.28} metalness={0.2} roughness={0.35} transparent opacity={0.72} />
        </mesh>
      ))}
      {WINDOW_Z_POSITIONS.map((z) => (
        <mesh key={`win-right-${z}`} position={[5.74, 2.45, z]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.65, 1.1]} />
          <meshStandardMaterial color="#7fb7ff" emissive="#2d5f9d" emissiveIntensity={0.28} metalness={0.2} roughness={0.35} transparent opacity={0.72} />
        </mesh>
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.95} />
      <hemisphereLight args={['#fff1d9', '#574431', 0.7]} />
      <pointLight position={[0, 4, 0]} intensity={9.2} color="#ffaa00" />
      <spotLight position={[0, 4, 2]} angle={0.5} penumbra={1} intensity={17} color="#ffffff" />
      <pointLight position={[-4, 2.8, -1]} intensity={3.4} color="#ff5a3d" />
      <pointLight position={[4, 2.8, -1]} intensity={3.1} color="#2ac8ff" />
      <pointLight position={[0, 2.6, 2.2]} intensity={2.8} color="#f7f5ef" />
      <pointLight position={[0, 3.1, -2.4]} intensity={2.4} color="#ff66d2" />

      {/* Ceiling rail lights */}
      {CEILING_RAIL_X_POSITIONS.map((x) => (
        <mesh key={`bus-rail-${x}`} position={[x, 4.35, -0.3]}>
          <boxGeometry args={[1.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={1.5} />
        </mesh>
      ))}

      {/* Floor runner and side rails */}
      <mesh position={[0, -0.03, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 8.4]} />
        <meshStandardMaterial color="#2e1b18" emissive="#1a0d0b" emissiveIntensity={0.22} roughness={0.92} />
      </mesh>
      <mesh position={[-1.16, -0.015, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 8.4]} />
        <meshStandardMaterial color="#ff7b4a" emissive="#ff7b4a" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[1.16, -0.015, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 8.4]} />
        <meshStandardMaterial color="#57d3ff" emissive="#57d3ff" emissiveIntensity={0.55} />
      </mesh>

      {/* Seat blocks */}
      {SEAT_BLOCK_POSITIONS.map((pos, idx) => (
        <mesh key={`seat-${idx}`} position={pos} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 1.8]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#d36a3e' : '#3b8cc7'} emissive={idx % 2 === 0 ? '#7c2f1b' : '#1f4f78'} emissiveIntensity={0.4} metalness={0.15} roughness={0.76} />
        </mesh>
      ))}
      {SEAT_BACK_POSITIONS.map((pos, idx) => (
        <mesh key={`seat-back-${idx}`} position={pos} castShadow receiveShadow>
          <boxGeometry args={[1.95, 1.1, 0.32]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#c65b34' : '#3380b5'} emissive={idx % 2 === 0 ? '#702914' : '#1b4465'} emissiveIntensity={0.38} metalness={0.18} roughness={0.7} />
        </mesh>
      ))}
      {SEAT_HEADREST_POSITIONS.map((pos, idx) => (
        <mesh key={`seat-headrest-${idx}`} position={pos} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.38, 0.26]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#f69b6f' : '#77baf1'} emissive={idx % 2 === 0 ? '#7d3a22' : '#2f6294'} emissiveIntensity={0.35} metalness={0.12} roughness={0.65} />
        </mesh>
      ))}
      {SEAT_LEG_POSITIONS.map((pos, idx) => (
        <mesh key={`seat-leg-${idx}`} position={pos} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.35, 10]} />
          <meshStandardMaterial color="#aeb7c1" metalness={0.82} roughness={0.25} />
        </mesh>
      ))}

      {/* Driver cockpit + storage */}
      <mesh position={[0, 1.1, -4.4]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 1.1, 0.55]} />
        <meshStandardMaterial color="#29313a" emissive="#18222d" emissiveIntensity={0.3} metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[-1.2, 1.35, -4.05]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.34, 0.06, 12, 24]} />
        <meshStandardMaterial color="#23272d" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.62, -4.1]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.42, 0.22]} />
        <meshStandardMaterial color="#1f2935" emissive="#0f1d2b" emissiveIntensity={0.35} metalness={0.6} roughness={0.38} />
      </mesh>
      {DASH_SCREEN_X_POSITIONS.map((x, idx) => (
        <mesh key={`dash-screen-${idx}`} position={[x, 1.67, -3.95]}>
          <planeGeometry args={[0.68, 0.22]} />
          <meshStandardMaterial color={idx === 1 ? '#9bff6d' : '#6ad3ff'} emissive={idx === 1 ? '#9bff6d' : '#6ad3ff'} emissiveIntensity={0.85} metalness={0.55} roughness={0.2} />
        </mesh>
      ))}
      {DASH_KNOB_X_POSITIONS.map((x, idx) => (
        <mesh key={`dash-knob-${idx}`} position={[x, 1.42, -3.86]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 10]} />
          <meshStandardMaterial color="#dde4ee" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {BUS_SHELF_X_POSITIONS.map((x) => (
        <mesh key={`bus-shelf-${x}`} position={[x, 2.8, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.5, 1.6]} />
          <meshStandardMaterial color="#3a2f24" emissive="#241910" emissiveIntensity={0.25} roughness={0.75} />
        </mesh>
      ))}

      {/* Overhead luggage rails and side cases */}
      {LUGGAGE_RACK_Z_POSITIONS.map((z) => (
        <mesh key={`rack-left-${z}`} position={[-5.35, 3.35, z]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.2, 0.85]} />
          <meshStandardMaterial color="#303947" emissive="#1a2330" emissiveIntensity={0.24} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {LUGGAGE_RACK_Z_POSITIONS.map((z) => (
        <mesh key={`rack-right-${z}`} position={[5.35, 3.35, z]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.2, 0.85]} />
          <meshStandardMaterial color="#303947" emissive="#1a2330" emissiveIntensity={0.24} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {SIDE_CASE_POSITIONS.map((pos, idx) => (
        <mesh key={`side-case-${idx}`} position={pos} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.9, 1.1]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#3a2230' : '#223a34'} emissive={idx % 2 === 0 ? '#23121c' : '#14251f'} emissiveIntensity={0.28} metalness={0.42} roughness={0.56} />
        </mesh>
      ))}
      {SIDE_CASE_LATCH_POSITIONS.map((pos, idx) => (
        <mesh key={`side-case-latch-${idx}`} position={pos}>
          <boxGeometry args={[0.1, 0.1, 0.24]} />
          <meshStandardMaterial color="#bfc9d6" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Grab handles and hanging straps */}
      {GRAB_HANDLE_X_POSITIONS.map((x) => (
        <mesh key={`grab-${x}`} position={[x, 4.12, -0.36]} castShadow>
          <torusGeometry args={[0.16, 0.03, 10, 20]} />
          <meshStandardMaterial color="#dbe3ed" metalness={0.86} roughness={0.24} />
        </mesh>
      ))}
      {STRAP_X_POSITIONS.map((x) => (
        <group key={`strap-${x}`} position={[x, 4.1, 0.9]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.55, 8]} />
            <meshStandardMaterial color="#f0f4fa" metalness={0.35} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <torusGeometry args={[0.08, 0.02, 8, 18]} />
            <meshStandardMaterial color="#f0f4fa" metalness={0.8} roughness={0.22} />
          </mesh>
        </group>
      ))}

      {/* Atmosphere */}
      <Sparkles count={20} scale={10} size={1} speed={0.5} opacity={0.2} />

      {/* Band Members in the Bus */}
      <Interactable
        position={MATZE_POSITION}
        emoji="🎸"
        name="Matze"
        appearance={{ isBandMember: true, idleType: 'sway' }}
        onInteract={() => {
          useStore.getState().setDialogue(buildTourbusMatzeDialogue());
        }}
      />

      <Interactable
        position={MARIUS_POSITION}
        emoji="🎤"
        name="Marius"
        appearance={{ isBandMember: true, idleType: 'headbang' }}
        onInteract={() => {
          const store = useStore.getState();
          store.setDialogue(buildTourbusMariusDialogue());
        }}
      />


      {/* Band Meeting Interactable */}
      {!flags.tourbusBandMeeting && flags.tourbus_sabotage_discovered && (
        <Interactable
          position={[0, 0.5, 0]}
          emoji="📢"
          name="Band-Besprechung"
          onInteract={() => {
            useStore.getState().setDialogue(buildTourbusBandMeetingDialogue());
          }}
        />
      )}

      {/* Broken Amp - Technician Interaction */}
      {!flags.tourbusAmpTechnician && (
        <Interactable
          position={[4, 0.5, -3]}
          emoji="🎛️"
          name="Defekter Verstärker"
          onInteract={() => {
            useStore.getState().setDialogue(buildTourbusAmpDialogue());
          }}
        />
      )}

      {/* Bus Items */}
      {canPickupItem('Klebeband') && !inventoryIncludes['Klebeband'] && !inventoryIncludes['Repariertes Kabel'] && (
        <Interactable
          position={[-5, 0.5, 2]}
          emoji="🩹"
          name="Klebeband"
          onInteract={() => {
            addToInventory('Klebeband');
            setDialogue('Industrie-Klebeband. Hält alles zusammen: Kabel, Amps und die bröckelnde Psyche der Bandmitglieder.');
          }}
        />
      )}

      {canPickupItem('Defektes Kabel') && !inventoryIncludes['Defektes Kabel'] && !inventoryIncludes['Repariertes Kabel'] && (
        <Interactable
          position={[5, 0.5, 2]}
          emoji="🔌"
          name="Defektes Kabel"
          onInteract={() => {
            addToInventory('Defektes Kabel');
            setDialogue('Ein defektes Gitarrenkabel. Es hat schon mehr Rückkopplungen gesehen als ein durchschnittlicher Fabrikarbeiter.');
          }}
        />
      )}

      {!flags.tourbusCoffeeCollected && canPickupItem('Kaffee') && !inventoryIncludes['Kaffee'] && (
        <Interactable
          position={[0, 0.5, -3]}
          emoji="☕"
          name="Kaffee"
          onInteract={() => {
            addToInventory('Kaffee');
            setFlag('tourbusCoffeeCollected', true);
            setDialogue('Ein Becher schwarzer Kaffee. So schwarz wie die Seele eines Drummers nach einem 4-Stunden-Gig.');
          }}
        />
      )}

      {!flags.tourbusEnergyDrinkCollected && canPickupItem('Energiedrink') && !inventoryIncludes['Energiedrink'] && (
        <Interactable
          position={[-1, 0.5, -3]}
          emoji="🥤"
          name="Energiedrink"
          onInteract={() => {
            addToInventory('Energiedrink');
            setFlag('tourbusEnergyDrinkCollected', true);
            setDialogue('Ein "Liquid Thunder" Energiedrink. Enthält genug Taurin, um ein kleines Kraftwerk zu betreiben.');
          }}
        />
      )}

      {!flags.tourbusBeerCollected && canPickupItem('Bier') && !inventoryIncludes['Bier'] && (
        <Interactable
          position={[2, 0.5, 3]}
          emoji="🍺"
          name="Bier-Vorrat"
          onInteract={() => {
            addToInventory('Bier');
            setFlag('tourbusBeerCollected', true);
            setDialogue('Ein kühles Bier aus dem Bus-Kühlschrank. Das offizielle Schmiermittel für den Industrial-Motor.');
          }}
        />
      )}

      {/* Lore: Forgotten Notebook */}
      <Interactable
        position={[4, 0.5, 3]}
        emoji="📓"
        name="Vergessenes Notizbuch"
        onInteract={() => {
          setDialogue('Ein abgegriffenes Notizbuch mit dem Logo von NEUROTOXIC. Seite 42: "Der Sound muss weh tun. Wenn es nicht weh tut, ist es nur Musik. Wir brauchen mehr Feedback." Seite 43: "Marius hat sein Ego im Kühlschrank vergessen. Wieder einmal."');
          increaseBandMood(5, 'id_1f0c8904');
        }}
      />

      {!flags.rostigesPlektrumCollected && (
        <Interactable
          position={[-2, 0.5, 0]}
          emoji="🎸"
          name="Rostiges Plektrum"
          scale={0.5}
          onInteract={() => {
            addToInventory('Rostiges Plektrum');
            setFlag('rostigesPlektrumCollected', true);
            setDialogue('Ein rostiges Plektrum. Es scheint aus einer Zeit zu stammen, in der Metal noch aus reinem Eisen geschmiedet wurde.');
          }}
        />
      )}

      <Interactable
        position={[-4, 1, 3]}
        emoji="👻"
        name="Geist eines Roadies"
        onInteract={() => {
          useStore.getState().setDialogue(buildTourbusGhostDialogue());
        }}
      />

      {flags.tourbus_sabotage_discovered && (
        <Interactable
          position={[-4, 0.5, -4]}
          emoji="📦"
          name="Verstecktes Fach"
          onInteract={() => {
            useStore.getState().setDialogue(buildTourbusHiddenStashDialogue());
          }}
        />
      )}

      {canPickupItem('Batterie') && !inventoryIncludes['Batterie'] && (
        <Interactable
          position={[-3, 0.5, 4]}
          emoji="🔋"
          name="Batterie"
          scale={0.6}
          onInteract={() => {
            addToInventory('Batterie');
            setDialogue('Eine 9V-Batterie. Sieht noch voll aus.');
          }}
        />
      )}

      {/* Navigation */}
      <Interactable
        position={[0, 0.5, 4]}
        emoji="🚐"
        name="Zum Auftritt"
        onInteract={() => {
          if (useStore.getState().hasItem('Repariertes Kabel') || useStore.getState().flags.cableFixed) {
            setDialogue('Auf gehts zum Gig! Nächster Halt: Backstage.');
            if (exitTimeoutRef.current !== null) {
              window.clearTimeout(exitTimeoutRef.current);
            }
            exitTimeoutRef.current = window.setTimeout(() => {
              if (useStore.getState().scene === 'tourbus') {
                useStore.getState().setScene('backstage');
              }
              exitTimeoutRef.current = null;
            }, 1000);
          } else {
            setDialogue('Wir können noch nicht los. Matze braucht erst ein funktionierendes Kabel.');
          }
        }}
      />

      <Interactable
        position={[-5, 0.5, 4]}
        emoji="🔙"
        name="Zurück zum Proberaum"
        onInteract={() => {
          setDialogue('Vielleicht haben wir was vergessen...');
          if (exitTimeoutRef.current !== null) {
            window.clearTimeout(exitTimeoutRef.current);
          }
          exitTimeoutRef.current = window.setTimeout(() => {
            if (useStore.getState().scene === 'tourbus') {
              useStore.getState().setScene('proberaum');
            }
            exitTimeoutRef.current = null;
          }, 1000);
        }}
      />

      {/* Decorative Bus Elements */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 3, -4.5]}>
          <boxGeometry args={[4, 1, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <Text
          position={[0, 3, -4.4]}
          fontSize={0.3}
          color="#00ff00"
          font="/fonts/pressstart2p-v16.ttf"
        >
          NEUROTOXIC TOUR 2026
        </Text>
      </Float>

      <SceneEnvironmentSetpieces variant="tourbus" />

      <Player bounds={{ x: [-5.2, 5.2], z: [-4.6, 4.6] }} />
    </>
  );
}
