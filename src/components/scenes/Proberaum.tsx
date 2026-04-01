/**
 * #1: UPDATES
 * - Integrated "Talking Amp's Existential Crisis" quest in Proberaum.
 * - Integrated "Ghostly Roadie's Lost Recipe" quest in TourBus.
 * - Added Geister-Drink item combination.
 * - Added Rostiges Plektrum item.
 * - Added 'Cynic' trait-exclusive interaction for Matze.
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
import { useStore } from '../../store';
import type { DialogueOption } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import {
  buildProberaumMatzeDialogue,
  buildProberaumLarsDialogue,
  buildProberaumMariusDialogue,
  buildProberaumWallCracksDialogue,
  buildProberaumPuddleDialogue,
  buildProberaumAmpDialogue,
  buildProberaumDrumMachineDialogue,
  buildProberaumMonitorDialogue,
} from '../../dialogues/proberaum';
import { ContactShadows, Sparkles } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { SceneEnvironmentSetpieces } from './SceneEnvironmentSetpieces';
import { useEffect, useRef } from 'react';

/**
 * Renders the 3D scene environment and logic for Proberaum.
 * @returns The 3D group containing scene interactables, NPCs, and boundaries.
 */
export function Proberaum() {
  const flags = useStore((state) => state.flags);
  const setFlag = useStore((state) => state.setFlag);
  const addToInventory = useStore((state) => state.addToInventory);
  const canPickupItem = useStore((state) => state.canPickupItem);
  const completeQuest = useStore((state) => state.completeQuest);
  const hasItem = useStore((state) => state.hasItem);
  const inventory = useStore((state) => state.inventory);
  const quests = useStore((state) => state.quests);
  const setDialogue = useStore((state) => state.setDialogue);
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const addQuest = useStore((state) => state.addQuest);
  const bandMood = useStore((state) => state.bandMood);
  const removeFromInventory = useStore((state) => state.removeFromInventory);
  const discoverLore = useStore((state) => state.discoverLore);
  const feedbackMonitorQuestCompleted =
    quests.find((quest) => quest.id === 'feedback_monitor')?.status ===
      'completed' || flags.feedbackMonitorQuestCompleted;
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
      <color attach="background" args={['#3a4557']} />
      <fog attach="fog" args={['#3a485a', 22, 90]} />
      <ambientLight intensity={1.05} />
      <hemisphereLight args={['#eef6ff', '#3e4a58', 0.9]} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.75}
        color="#fff4e8"
      />
      <pointLight position={[-8, 5, -4]} intensity={3.1} color="#7cff6b" />
      <pointLight position={[8, 4, 2]} intensity={2.8} color="#3aa7ff" />
      <pointLight position={[0, 3.2, 5]} intensity={2.4} color="#ffffff" />
      <pointLight position={[0, 4.2, -5]} intensity={2.2} color="#ff68d6" />

      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial
            color="#4a5968"
            emissive="#273240"
            emissiveIntensity={0.34}
            metalness={0.35}
            roughness={0.66}
          />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 5, -7.5]}>
        <mesh receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial
            color="#556474"
            emissive="#28394a"
            emissiveIntensity={0.3}
            metalness={0.28}
            roughness={0.68}
          />
        </mesh>
      </RigidBody>

      {/* Acoustic wall panels */}
      {[-11, -5.5, 0, 5.5, 11].map((x, idx) => (
        <mesh key={`acoustic-${x}`} position={[x, 3.9, -7.36]}>
          <planeGeometry args={[3.9, 2.3]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#2d3640' : '#3a2b36'}
            emissive={idx % 2 === 0 ? '#151f29' : '#21131d'}
            emissiveIntensity={0.24}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Invisible Walls for bounds */}
      <RigidBody type="fixed" position={[-15, 5, 0]}>
        <boxGeometry args={[1, 10, 15]} />
      </RigidBody>
      <RigidBody type="fixed" position={[15, 5, 0]}>
        <boxGeometry args={[1, 10, 15]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 5, 7.5]}>
        <boxGeometry args={[30, 10, 1]} />
      </RigidBody>

      {/* Overhead neon bars */}
      {[-10, -5, 0, 5, 10].map((x) => (
        <mesh key={`neon-${x}`} position={[x, 6.8, -1]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[2.8, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#1dff8b"
            emissive="#0eff6a"
            emissiveIntensity={1.8}
          />
        </mesh>
      ))}

      {/* Industrial clutter */}
      {[
        { pos: [-12, 0.6, 5], rot: 0.2 },
        { pos: [11, 0.6, 4], rot: -0.25 },
        { pos: [6, 0.6, -6], rot: 0.12 },
      ].map((crate, idx) => (
        <group
          key={`crate-${idx}`}
          position={crate.pos as [number, number, number]}
          rotation={[0, crate.rot, 0]}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.2, 1.2]} />
            <meshStandardMaterial
              color="#4b4037"
              emissive="#231a13"
              emissiveIntensity={0.22}
              metalness={0.35}
              roughness={0.72}
            />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[1.18, 0.08, 1]} />
            <meshStandardMaterial
              color="#9f8a6f"
              emissive="#5d4f3f"
              emissiveIntensity={0.25}
              metalness={0.42}
              roughness={0.4}
            />
          </mesh>
          {[-0.64, 0.64].map((x) => (
            <mesh key={`crate-handle-${idx}-${x}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.08, 0.44, 0.72]} />
              <meshStandardMaterial
                color="#b8c3d1"
                metalness={0.85}
                roughness={0.22}
              />
            </mesh>
          ))}
          {[-0.45, 0.45].map((x) => (
            <mesh
              key={`crate-wheel-l-${idx}-${x}`}
              position={[x, -0.62, -0.46]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
              <meshStandardMaterial
                color="#1b2129"
                metalness={0.6}
                roughness={0.45}
              />
            </mesh>
          ))}
          {[-0.45, 0.45].map((x) => (
            <mesh
              key={`crate-wheel-r-${idx}-${x}`}
              position={[x, -0.62, 0.46]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
              <meshStandardMaterial
                color="#1b2129"
                metalness={0.6}
                roughness={0.45}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Side utility racks */}
      {[
        [-13.1, 1.4, -4],
        [13.1, 1.4, -4],
        [-13.1, 1.4, 1.5],
        [13.1, 1.4, 1.5],
      ].map((pos, idx) => (
        <group
          key={`utility-rack-${idx}`}
          position={pos as [number, number, number]}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 2.8, 2.4]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#41566d' : '#654a61'}
              emissive={idx % 2 === 0 ? '#23364c' : '#39263a'}
              emissiveIntensity={0.4}
              metalness={0.55}
              roughness={0.4}
            />
          </mesh>
          {[-0.5, 0, 0.5].map((y) => (
            <mesh key={`rack-vent-${idx}-${y}`} position={[0.46, y, 0]}>
              <planeGeometry args={[0.24, 0.36]} />
              <meshStandardMaterial
                color="#9de8ff"
                emissive="#62d2ff"
                emissiveIntensity={0.65}
                metalness={0.3}
                roughness={0.35}
              />
            </mesh>
          ))}
          <mesh position={[-0.46, -1.12, 0]}>
            <planeGeometry args={[0.2, 0.42]} />
            <meshStandardMaterial
              color="#ff7bd4"
              emissive="#ff7bd4"
              emissiveIntensity={0.6}
              metalness={0.3}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}

      {/* Cable trenches / floor strips */}
      {[-6, -2, 2, 6].map((z, idx) => (
        <mesh
          key={`strip-${z}`}
          position={[0, 0.02, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[18, 0.28]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#2dffe7' : '#ff67c0'}
            emissive={idx % 2 === 0 ? '#2dffe7' : '#ff67c0'}
            emissiveIntensity={0.45}
            metalness={0.65}
            roughness={0.45}
          />
        </mesh>
      ))}

      {/* Rehearsal gear */}
      {[
        [-2, 0.45, -3.8],
        [2.4, 0.45, -3.6],
        [0.2, 0.45, -4.2],
      ].map((pos, idx) => (
        <group
          key={`amp-stack-${idx}`}
          position={pos as [number, number, number]}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.9, 0.9]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#4f6c8a' : '#8a4f79'}
              emissive={idx % 2 === 0 ? '#2c517a' : '#6a2c58'}
              emissiveIntensity={0.4}
              metalness={0.55}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0, 0.2, 0.46]}>
            <circleGeometry args={[0.22, 18]} />
            <meshStandardMaterial
              color="#d5f8ff"
              emissive="#98e9ff"
              emissiveIntensity={0.55}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -0.22, 0.46]}>
            <circleGeometry args={[0.3, 18]} />
            <meshStandardMaterial
              color="#d5f8ff"
              emissive="#98e9ff"
              emissiveIntensity={0.5}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.22, -3.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.14, 20]} />
        <meshStandardMaterial
          color="#233338"
          emissive="#163035"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[0, 0.54, -3.42]} castShadow receiveShadow>
        <cylinderGeometry args={[0.56, 0.62, 0.52, 22]} />
        <meshStandardMaterial
          color="#456585"
          emissive="#243d57"
          emissiveIntensity={0.34}
          metalness={0.46}
          roughness={0.36}
        />
      </mesh>
      <mesh position={[-0.82, 0.56, -3.52]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.38, 18]} />
        <meshStandardMaterial
          color="#4d6f92"
          emissive="#2b4768"
          emissiveIntensity={0.3}
          metalness={0.44}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0.82, 0.56, -3.52]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.38, 18]} />
        <meshStandardMaterial
          color="#4d6f92"
          emissive="#2b4768"
          emissiveIntensity={0.3}
          metalness={0.44}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0.35, 0.95, -3.6]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 18]} />
        <meshStandardMaterial
          color="#dbe5ef"
          metalness={0.9}
          roughness={0.14}
        />
      </mesh>
      {[-0.5, 0, 0.5].map((x) => (
        <mesh
          key={`mic-stand-${x}`}
          position={[x, 0.72, -3.0]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.03, 0.05, 1.4, 10]} />
          <meshStandardMaterial
            color="#6bd4ff"
            emissive="#2ea0cc"
            emissiveIntensity={0.45}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
      ))}

      {/* Pedalboards and cable reels */}
      {[
        [-1.4, 0.08, -2.5],
        [1.2, 0.08, -2.45],
        [0, 0.08, -2.2],
      ].map((pos, idx) => (
        <group
          key={`pedalboard-${idx}`}
          position={pos as [number, number, number]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <mesh>
            <planeGeometry args={[0.95, 0.42]} />
            <meshStandardMaterial
              color="#232a35"
              emissive="#101826"
              emissiveIntensity={0.34}
              metalness={0.62}
              roughness={0.3}
            />
          </mesh>
          {[-0.28, 0, 0.28].map((x, n) => (
            <mesh key={`pedal-switch-${idx}-${n}`} position={[x, 0, 0.01]}>
              <boxGeometry args={[0.16, 0.14, 0.04]} />
              <meshStandardMaterial
                color={n % 2 === 0 ? '#5bf2ff' : '#ff79d1'}
                emissive={n % 2 === 0 ? '#2f9ea7' : '#a6367b'}
                emissiveIntensity={0.6}
                metalness={0.72}
                roughness={0.22}
              />
            </mesh>
          ))}
        </group>
      ))}
      {[-2.6, -1.6, -0.6, 0.4, 1.4, 2.4].map((x, idx) => (
        <mesh
          key={`cable-reel-${idx}`}
          position={[x, 0.03, -1.9]}
          rotation={[-Math.PI / 2, idx * 0.25, 0]}
        >
          <torusGeometry args={[0.22, 0.03, 9, 20]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#1f2733' : '#2f1f33'}
            metalness={0.58}
            roughness={0.38}
          />
        </mesh>
      ))}

      {/* Overhead hanging lamps */}
      {[-9, -3, 3, 9].map((x, idx) => (
        <group key={`lamp-${x}`} position={[x, 5.9, -1.8]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
            <meshStandardMaterial
              color="#2f3b44"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -0.62, 0]} castShadow>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#9bff74' : '#58b8ff'}
              emissive={idx % 2 === 0 ? '#9bff74' : '#58b8ff'}
              emissiveIntensity={1.25}
            />
          </mesh>
        </group>
      ))}

      {/* Poster */}
      <mesh position={[-5, 3, -7.4]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <group position={[-5, 3, -7.37]}>
        <mesh>
          <planeGeometry args={[1.7, 2.7]} />
          <meshStandardMaterial color="#16181b" />
        </mesh>
        {[
          { y: 0.95, w: 0.75, c: '#ef4444' },
          { y: 0.45, w: 1.2, c: '#d4d4d8' },
          { y: 0.0, w: 1.0, c: '#d4d4d8' },
          { y: -0.45, w: 1.15, c: '#d4d4d8' },
        ].map((line, idx) => (
          <mesh key={`poster-line-${idx}`} position={[0, line.y, 0.01]}>
            <planeGeometry args={[line.w, 0.17]} />
            <meshBasicMaterial color={line.c} />
          </mesh>
        ))}
      </group>

      {/* Water Puddle */}
      {!flags.waterCleaned && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 2]}
          receiveShadow
        >
          <circleGeometry args={[3, 32]} />
          <meshStandardMaterial
            color="#00aaff"
            transparent
            opacity={0.5}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      )}

      {/* Lore: Torn Tour Poster */}
      <Interactable
        position={[-5, 3, -7.4]}
        emoji="📜"
        name="Zerrissenes Plakat"
        onInteract={() => {
          if (!flags.posterLoreRead) {
            setDialogue(
              'Ein altes, zerrissenes Plakat von der "Machine Hell" Tour 1999. Es ist mit schwarzem Edding überkritzelt: "DER RHYTHMUS IST DER KÄFIG. DIE FREQUENZ IST DER SCHLÜSSEL." Manager: "Das war das Jahr, als Lars versuchte, ein Schlagzeug aus alten Ölfässern und einem Presslufthammer zu bauen. Die Nachbarn haben uns damals fast angezeigt, weil die Frequenzen die Fensterscheiben im ganzen Block zum Bersten brachten."'
            );
            setFlag('posterLoreRead', true);
            discoverLore('poster_lore');
            increaseBandMood(5);
          } else {
            setDialogue(
              'Das Plakat erinnert dich an die chaotischen Anfänge. Der Edding-Spruch scheint sich bei jedem Hinsehen leicht zu verändern.'
            );
          }
        }}
      />

      {/* Characters & Objects */}
      <Interactable
        position={[-5, 1, -2]}
        emoji="🎸"
        name="Matze"
        isBandMember={true}
        idleType="headbang"
        onInteract={() => {
          useStore.getState().setDialogue(buildProberaumMatzeDialogue());
        }}
      />

      <Interactable
        position={[4, 1, -3]}
        emoji="🥁"
        name="Lars"
        isBandMember={true}
        idleType="tap"
        onInteract={() => {
          useStore.getState().setDialogue(buildProberaumLarsDialogue());
        }}
      />

      <Interactable
        position={[6, 1, 1]}
        emoji="🎤"
        name="Marius"
        isBandMember={true}
        idleType="sway"
        onInteract={() => {
          useStore.getState().setDialogue(buildProberaumMariusDialogue());
        }}
      />

      {/* Items */}
      {flags.waterCleaned && !flags.frequenz1982_proberaum && (
        <Interactable
          position={[10, 2, -7]}
          emoji="🔍"
          name="Risse in der Wand"
          onInteract={() => {
            useStore.getState().setDialogue(buildProberaumWallCracksDialogue());
          }}
        />
      )}

      {canPickupItem('Mop') && !inventory.includes('Mop') && (
        <Interactable
          position={[-8, 0.5, 3]}
          emoji="🧹"
          name="Wischmopp"
          scale={0.8}
          onInteract={() => {
            addToInventory('Mop');
            setDialogue(
              'Der Wischmopp der Vorsehung. Er hat schon unzählige Bierpfützen und Tränen gescheiterter Bassisten aufgesaugt.'
            );
          }}
        />
      )}

      {canPickupItem('Autoschlüssel') &&
        !inventory.includes('Autoschlüssel') && (
          <Interactable
            position={[-10, 0.5, -4]}
            emoji="🔑"
            name="Autoschlüssel"
            scale={0.6}
            onInteract={() => {
              addToInventory('Autoschlüssel');
              completeQuest('keys');
              increaseBandMood(10);
              setDialogue(
                'Die Schlüssel zum "Schwarzen Sarg", eurem treuen Tourbus. Er läuft mit Diesel und purer Verzweiflung.'
              );
            }}
          />
        )}

      {!flags.gaveBeerToMarius &&
        canPickupItem('Bier') &&
        !inventory.includes('Bier') && (
          <Interactable
            position={[8, 0.5, -5]}
            emoji="🍺"
            name="Kühles Bier"
            scale={0.6}
            onInteract={() => {
              addToInventory('Bier');
              setDialogue('Ein kühles Bier für Marius!');
            }}
          />
        )}

      {/* The Puddle Interaction */}
      {!flags.waterCleaned && (
        <Interactable
          position={[0, 0.5, 2]}
          emoji="💧"
          name="Mysteriöse Pfütze"
          scale={1.5}
          onInteract={() => {
            const store = useStore.getState();
            if (store.hasItem('Mop')) {
              store.completeQuestWithFlag('water', 'waterCleaned');
              store.increaseBandMood(20);
              store.setDialogue(
                'Du hast das Wasser aufgewischt! Es war kein normales Wasser, sondern das Kondensat von 40 Jahren Industrial-Geschichte.'
              );
            } else {
              store.setDialogue(buildProberaumPuddleDialogue());
              store.startQuestWithFlag(
                'water',
                'Wische die Wasserlache im Proberaum auf',
                'waterCleaned',
                false
              );
            }
          }}
        />
      )}

      {/* Absurd Elements */}
      <Interactable
        position={[-12, 1, -5]}
        emoji="🔊"
        name="Sprechender Amp"
        onInteract={() => {
          useStore.getState().setDialogue(buildProberaumAmpDialogue());
        }}
      />

      {!flags.forbiddenRiffFound && (
        <Interactable
          position={[12, 0.5, 5]}
          emoji="🎸"
          name="Das Verbotene Riff"
          scale={0.5}
          onInteract={() => {
            setDialogue(
              'Du hast das Verbotene Riff gefunden. Es vibriert in einer Frequenz, die Hunde zum Weinen bringt.'
            );
            addToInventory('Verbotenes Riff');
            setFlag('forbiddenRiffFound', true);
            discoverLore('forbidden_riff');
            increaseBandMood(15);
          }}
        />
      )}

      {canPickupItem('Lötkolben') && !inventory.includes('Lötkolben') && (
        <Interactable
          position={[8, 0.5, -1]}
          emoji="🛠️"
          name="Lötkolben"
          scale={0.6}
          onInteract={() => {
            addToInventory('Lötkolben');
            setDialogue('Ein alter Lötkolben. Nicht sicher, aber effektiv.');
          }}
        />
      )}

      {canPickupItem('Schrottmetall') &&
        !inventory.includes('Schrottmetall') && (
          <Interactable
            position={[10, 0.5, -2]}
            emoji="🔩"
            name="Schrottmetall"
            scale={0.7}
            onInteract={() => {
              addToInventory('Schrottmetall');
              setDialogue(
                'Ein Stück verrostetes Schrottmetall. Riecht nach... Industrial.'
              );
            }}
          />
        )}

      {canPickupItem('Batterie') && !inventory.includes('Batterie') && (
        <Interactable
          position={[-12, 0.5, 4]}
          emoji="🔋"
          name="Alte Batterie"
          scale={0.5}
          onInteract={() => {
            addToInventory('Batterie');
            setDialogue(
              'Eine fast leere Batterie. Sie summt leise in einer unheilvollen Frequenz.'
            );
          }}
        />
      )}

      {canPickupItem('Quanten-Kabel') &&
        !inventory.includes('Quanten-Kabel') &&
        !feedbackMonitorQuestCompleted && (
          <Interactable
            position={[-10, 0.5, 5]}
            emoji="🔌"
            name="Quanten-Kabel"
            scale={0.5}
            onInteract={() => {
              addToInventory('Quanten-Kabel');
              setDialogue(
                'Du hast ein Quanten-Kabel gefunden. Es scheint in mehreren Dimensionen gleichzeitig zu existieren.'
              );
            }}
          />
        )}

      {/* Absurd NPC: Talking Drum Machine */}
      <Interactable
        position={[2, 0.5, -4]}
        emoji="🎛️"
        name="TR-8080 Drum Machine"
        onInteract={() => {
          useStore.getState().setDialogue(buildProberaumDrumMachineDialogue());
        }}
      />

      {/* Absurd NPC: Talking Feedback Monitor */}
      {!feedbackMonitorQuestCompleted && (
        <Interactable
          position={[-6, 0.5, 5]}
          emoji="🎚️"
          name="Feedback-Monitor"
          onInteract={() => {
            useStore.getState().setDialogue(buildProberaumMonitorDialogue());
          }}
        />
      )}

      {/* Exit */}
      {flags.waterCleaned && flags.gaveBeerToMarius && (
        <Interactable
          position={[0, 1, -6]}
          emoji="🚪"
          name="Zum Tourbus"
          scale={1.2}
          onInteract={() => {
            if (hasItem('Autoschlüssel')) {
              setDialogue('Auf in den Tourbus! Nächster Halt: Tangermünde.');
              if (exitTimeoutRef.current !== null) {
                window.clearTimeout(exitTimeoutRef.current);
              }
              exitTimeoutRef.current = window.setTimeout(() => {
                const store = useStore.getState();
                if (store.scene === 'proberaum') {
                  store.addQuest(
                    'cable',
                    'Repariere Matzes Kabel mit Klebeband und defektem Kabel'
                  );
                  store.setScene('tourbus');
                }
                exitTimeoutRef.current = null;
              }, 1000);
            } else {
              setDialogue(
                'Wir können noch nicht losfahren. Wo sind die Autoschlüssel für den Van?'
              );
            }
          }}
        />
      )}

      <SceneEnvironmentSetpieces variant="proberaum" />

      <Player bounds={{ x: [-14, 14], z: [-7, 7] }} />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={10}
      />
      {/* Dust Particles */}
      <Sparkles
        count={100}
        scale={20}
        size={1.5}
        speed={0.5}
        opacity={0.2}
        color="#fff"
      />
    </>
  );
}
