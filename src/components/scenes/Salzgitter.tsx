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
import type { DialogueOption } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import { ContactShadows } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function Salzgitter() {
  const setDialogue = useStore((state) => state.setDialogue);
  const addQuest = useStore((state) => state.addQuest);
  const completeQuest = useStore((state) => state.completeQuest);
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const flags = useStore((state) => state.flags);

  const spotLight1Ref = useRef<THREE.SpotLight>(null);
  const spotLight2Ref = useRef<THREE.SpotLight>(null);
  const spotLight3Ref = useRef<THREE.SpotLight>(null);
  const tRef = useRef(0);

  useFrame((state, delta) => {
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
      <spotLight ref={spotLight1Ref} position={[0, 10, -5]} angle={0.3} penumbra={1} intensity={10} color="#00ffcc" />
      <spotLight ref={spotLight2Ref} position={[-5, 10, -5]} angle={0.3} penumbra={1} intensity={10} color="#ff00cc" />
      <spotLight ref={spotLight3Ref} position={[5, 10, -5]} angle={0.3} penumbra={1} intensity={10} color="#ccff00" />
      <pointLight position={[-13, 3.2, -2]} intensity={2.8} color="#5b7dff" />
      <pointLight position={[13, 3.2, -2]} intensity={2.8} color="#ff4fb1" />
      <pointLight position={[0, 5.2, 4]} intensity={3.2} color="#f7f7ff" />
      <pointLight position={[0, 4.4, -1]} intensity={2.4} color="#5cf0ff" />
      
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#35465a" emissive="#162636" emissiveIntensity={0.34} metalness={0.35} roughness={0.74} />
        </mesh>
      </RigidBody>

      {/* Big Stage */}
      <RigidBody type="fixed" position={[0, 1, -8]}>
        <mesh receiveShadow>
          <boxGeometry args={[20, 2, 6]} />
          <meshStandardMaterial color="#3f4b5e" emissive="#1b2a40" emissiveIntensity={0.42} metalness={0.55} roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 10, -11]}>
        <mesh receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#0f151d" emissive="#060c14" emissiveIntensity={0.24} metalness={0.18} roughness={0.88} />
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
      {[-9.5, 9.5].map((x) => (
        <group key={`truss-${x}`} position={[x, 3, -8.8]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.45, 6, 0.45]} />
            <meshStandardMaterial color="#1a1d23" metalness={0.8} roughness={0.35} />
          </mesh>
          <mesh position={[0, 3.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.25, 0.45]} />
            <meshStandardMaterial color="#1d2027" metalness={0.8} roughness={0.3} />
          </mesh>
          {[-1.8, -0.6, 0.6, 1.8].map((y, idx) => (
            <mesh key={`truss-node-${x}-${idx}`} position={[0, y, 0.26]} castShadow>
              <sphereGeometry args={[0.08, 10, 10]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#78f8ff' : '#ff6ed3'} emissive={idx % 2 === 0 ? '#3bb7bf' : '#9a3b77'} emissiveIntensity={0.6} metalness={0.7} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* LED wall panels */}
      {[-12, -4, 4, 12].map((x, idx) => (
        <group key={`led-panel-${x}`} position={[x, 5.8, -10.75]}>
          <mesh>
            <planeGeometry args={[6.6, 4.3]} />
            <meshStandardMaterial color="#1a2030" emissive="#0e1730" emissiveIntensity={0.35} metalness={0.2} roughness={0.55} />
          </mesh>
          {[-1.4, -0.4, 0.6, 1.6].map((y, stripe) => (
            <mesh key={`led-strip-${idx}-${stripe}`} position={[0, y, 0.01]}>
              <planeGeometry args={[5.8, 0.22]} />
              <meshBasicMaterial color={stripe % 2 === 0 ? '#2dffe7' : '#ff58c6'} transparent opacity={0.74} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Crowd barricades */}
      {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
        <group key={`barrier-${x}`} position={[x, 0.6, 1.8]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.8, 1.2, 0.18]} />
            <meshStandardMaterial color="#222831" metalness={0.7} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[1.4, 0.2]} />
            <meshBasicMaterial color="#adff2f" />
          </mesh>
          <mesh position={[-0.55, -0.62, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.22, 0.18, 0.42]} />
            <meshStandardMaterial color="#8d99a8" metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh position={[0.55, -0.62, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.22, 0.18, 0.42]} />
            <meshStandardMaterial color="#8d99a8" metalness={0.82} roughness={0.22} />
          </mesh>
        </group>
      ))}

      {/* Front runway rails */}
      {[-13.5, 13.5].map((x, idx) => (
        <group key={`rail-${x}`} position={[x, 0.9, 0.3]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 1.8, 6.4]} />
            <meshStandardMaterial color="#273140" emissive="#121d2c" emissiveIntensity={0.25} metalness={0.72} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[0.15, 0.12, 6.6]} />
            <meshStandardMaterial color={idx === 0 ? '#5b7dff' : '#ff4fb1'} emissive={idx === 0 ? '#5b7dff' : '#ff4fb1'} emissiveIntensity={1} />
          </mesh>
        </group>
      ))}

      {/* Distant skyline silhouettes */}
      {[
        [-18, 2.5, -10.4, 2.4],
        [-14, 3.2, -10.3, 3.6],
        [-10, 2.2, -10.35, 2.1],
        [10, 2.7, -10.35, 2.8],
        [14, 3.6, -10.25, 4.2],
        [18, 2.4, -10.4, 2.3],
      ].map((entry, idx) => (
        <mesh key={`skyline-${idx}`} position={[entry[0], entry[1], entry[2]] as [number, number, number]}>
          <boxGeometry args={[1.8, entry[3], 0.3]} />
          <meshStandardMaterial color="#0a0d12" />
        </mesh>
      ))}

      {/* Stage interior details */}
      {[-7.5, -2.5, 2.5, 7.5].map((x) => (
        <group key={`speaker-stack-${x}`} position={[x, 1.5, -6.9]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 3, 1.2]} />
            <meshStandardMaterial color="#202733" emissive="#101a28" emissiveIntensity={0.34} metalness={0.6} roughness={0.46} />
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
            <meshStandardMaterial color="#10151f" metalness={0.4} roughness={0.82} transparent opacity={0.42} />
          </mesh>
          {[-0.72, 0.72].map((px) => (
            <mesh key={`speaker-edge-${x}-${px}`} position={[px, 0, 0.58]}>
              <boxGeometry args={[0.06, 2.9, 0.08]} />
              <meshStandardMaterial color="#aab6c4" metalness={0.85} roughness={0.24} />
            </mesh>
          ))}
        </group>
      ))}
      {[[-11, 0.65, -8.8], [11, 0.65, -8.8], [-11, 0.65, -6.2], [11, 0.65, -6.2]].map((pos, idx) => (
        <mesh key={`road-case-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.3, 1.1]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#2b2140' : '#1f3140'} emissive={idx % 2 === 0 ? '#19112c' : '#11212c'} emissiveIntensity={0.3} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {[[-11, 1.28, -8.8], [11, 1.28, -8.8], [-11, 1.28, -6.2], [11, 1.28, -6.2]].map((pos, idx) => (
        <mesh key={`road-case-lid-${idx}`} position={pos as [number, number, number]}>
          <boxGeometry args={[2.08, 0.08, 0.98]} />
          <meshStandardMaterial color="#aeb7c9" emissive="#56627e" emissiveIntensity={0.22} metalness={0.88} roughness={0.2} />
        </mesh>
      ))}

      {/* Drum riser, stairs and mics */}
      <mesh position={[0, 1.65, -8.4]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.6, 30]} />
        <meshStandardMaterial color="#2a3341" emissive="#121e2d" emissiveIntensity={0.34} metalness={0.56} roughness={0.42} />
      </mesh>
      {[-0.45, 0, 0.45].map((x, idx) => (
        <mesh key={`stage-stair-${idx}`} position={[x, 0.32 + idx * 0.18, -5.95]} castShadow receiveShadow>
          <boxGeometry args={[1.5 - idx * 0.3, 0.16, 0.35]} />
          <meshStandardMaterial color="#384255" emissive="#1b293f" emissiveIntensity={0.3} metalness={0.5} roughness={0.48} />
        </mesh>
      ))}
      {[-2.6, 0, 2.6].map((x) => (
        <group key={`mic-${x}`} position={[x, 1.05, -5.6]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.04, 0.05, 1.7, 10]} />
            <meshStandardMaterial color="#bcc7d5" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.86, 0.12]} rotation={[0.45, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.34, 10]} />
            <meshStandardMaterial color="#d8e1eb" metalness={0.88} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.02, 0.26]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#64f3ff" emissive="#64f3ff" emissiveIntensity={0.75} />
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
        <meshStandardMaterial color="#2dffe7" emissive="#2dffe7" emissiveIntensity={0.52} />
      </mesh>
      <mesh position={[0, 0.02, 4.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 0.28]} />
        <meshStandardMaterial color="#ff58c6" emissive="#ff58c6" emissiveIntensity={0.46} />
      </mesh>

      {/* Poster */}
      <mesh position={[-6, 5, -10.9]}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <group position={[-6, 5, -10.86]}>
        <mesh>
          <planeGeometry args={[3.6, 2.6]} />
          <meshStandardMaterial color="#3b185f" emissive="#1f0c35" emissiveIntensity={0.6} />
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
          const store = useStore.getState();
          const bandMood = store.bandMood;
          const hasForbiddenRiff = store.hasItem('Verbotenes Riff');
          const hasOldPick = store.hasItem('Altes Plektrum');
          const hasVoidPick = store.hasItem('Void-Plektrum');
          
          if (hasForbiddenRiff) {
            if (hasVoidPick && !store.flags.matzeRiffDialogueDone) {
              store.setDialogue({
                text: 'Matze: "Dieses Void-Plektrum... es pulsiert! Damit kann ich das Verbotene Riff in die 5. Dimension spielen. Das ist der ultimative Sound!"',
                options: [
                  {
                    text: 'Kanalisiere den Chaos-Faktor. [Chaos 10]',
                    requiredSkill: { name: 'chaos', level: 10 },
                    action: () => {
                      useStore.getState().setDialogue('Matze: "DU HAST RECHT! ICH WERDE DIE REALE WELT ZERREISSEN! DER LÄRM WIRD UNSER GOTT SEIN!"');
                      useStore.getState().increaseBandMood(70);
                      useStore.getState().increaseSkill('chaos', 5);
                      useStore.getState().setFlag('matzeRiffDialogueDone', true);
                    }
                  },
                  {
                    text: 'Optimiere die Saitenspannung. [Technical 10]',
                    requiredSkill: { name: 'technical', level: 10 },
                    action: () => {
                      useStore.getState().setDialogue('Matze: "Präzision im Chaos. Das ist die wahre Kunst. Jede Note wird ein chirurgischer Schnitt in die Stille."');
                      useStore.getState().increaseBandMood(60);
                      useStore.getState().increaseSkill('technical', 5);
                      useStore.getState().setFlag('matzeRiffDialogueDone', true);
                    }
                  },
                  { text: 'Viel Erfolg, Matze.', action: () => {
                    useStore.getState().setDialogue('Matze: "Danke, Boss. Wir sehen uns auf der anderen Seite."');
                    useStore.getState().increaseBandMood(20);
                    useStore.getState().setFlag('matzeRiffDialogueDone', true);
                  }}
                ]
              });
            } else if (hasOldPick && !store.flags.matzeRiffDialogueDone) {
              store.setDialogue({
                text: 'Matze: "Manager, mit diesem Alten Plektrum... ich kann das Verbotene Riff bändigen! Es fühlt sich an, als würde ich die Blitze selbst kontrollieren. Wir werden Geschichte schreiben!"',
                options: [
                  {
                    text: 'Kanalisiere den Chaos-Faktor. [Chaos 10]',
                    requiredSkill: { name: 'chaos', level: 10 },
                    action: () => {
                      useStore.getState().setDialogue('Matze: "DU HAST RECHT! ICH WERDE DIE REALE WELT ZERREISSEN! DER LÄRM WIRD UNSER GOTT SEIN!"');
                      useStore.getState().increaseBandMood(50);
                      useStore.getState().increaseSkill('chaos', 5);
                      useStore.getState().setFlag('matzeRiffDialogueDone', true);
                    }
                  },
                  {
                    text: 'Optimiere die Saitenspannung. [Technical 10]',
                    requiredSkill: { name: 'technical', level: 10 },
                    action: () => {
                      useStore.getState().setDialogue('Matze: "Präzision im Chaos. Das ist die wahre Kunst. Jede Note wird ein chirurgischer Schnitt in die Stille."');
                      useStore.getState().increaseBandMood(40);
                      useStore.getState().increaseSkill('technical', 5);
                      useStore.getState().setFlag('matzeRiffDialogueDone', true);
                    }
                  },
                  { text: 'Viel Erfolg, Matze.', action: () => {
                    useStore.getState().setDialogue('Matze: "Danke, Boss. Wir sehen uns auf der anderen Seite."');
                    useStore.getState().increaseBandMood(20);
                    useStore.getState().setFlag('matzeRiffDialogueDone', true);
                  }}
                ]
              });
            } else {
              store.setDialogue('Matze: "Manager, das Verbotene Riff... es brennt in meinen Fingern! Es ist schwer zu kontrollieren. Ich hoffe, ich zerreiße nicht die ganze Realität heute Abend!"');
            }
          } else if (store.flags.matzeDeepTalk && store.flags.wirtLegacy1982) {
             store.setDialogue({
                text: 'Matze: "Du hast die Wahrheit über 1982 herausgefunden, oder? Wir werden den Zyklus heute Nacht vollenden. Kein Manager wird geopfert, nur der reine Lärm bleibt."',
                options: [
                   { text: 'Die Frequenzen sind bereit. [Mystic]', requiredTrait: 'Mystic', action: () => {
                      useStore.getState().setDialogue('Matze: "Ich spüre es. Die Luft flirrt."');
                      if (useStore.getState().flags.backstageRitualPerformed) {
                         useStore.getState().increaseBandMood(40);
                         useStore.getState().setDialogue('Matze: "Unser Ritual hat die Frequenzen besiegelt. Wir sind unaufhaltsam!"');
                      } else {
                         useStore.getState().increaseBandMood(20);
                      }
                   }},
                   { text: 'Wir brechen den Fluch.', action: () => {
                      useStore.getState().setDialogue('Matze: "Mit jedem Akkord ein Stück mehr. Für den Metal!"');
                      useStore.getState().increaseBandMood(20);
                   }}
                ]
             });
          } else if (store.flags.matzeDeepTalk) {
            store.setDialogue({
              text: 'Matze: "Ich hab über das nachgedacht, was du über den Lärm gesagt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"',
              options: [
                {
                  text: 'Ich sehe die Muster. [Visionary]',
                  requiredTrait: 'Visionary',
                  action: () => {
                    useStore.getState().setDialogue('Matze: "Die Geometrie des Feedbacks... sie ist heute Abend perfekt. Wir werden eins mit der Frequenz."');
                    useStore.getState().increaseBandMood(40);
                    useStore.getState().increaseSkill('chaos', 5);
                  }
                },
                { text: 'Lass uns spielen.', action: () => {
                  useStore.getState().setDialogue('Matze: "Ja. Der Stahl wartet."');
                  useStore.getState().increaseBandMood(10);
                }}
              ]
            });
          } else if (store.flags.askedAbout1982) {
            store.setDialogue({
              text: 'Matze: "Ich hab über das nachgedacht, was du über 1982 gefragt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"',
              options: [
                { text: 'Für alle, die nicht mehr da sind.', action: () => {
                  useStore.getState().setDialogue('Matze: "Genau. Für den Lärm."');
                  useStore.getState().increaseBandMood(10);
                }},
                { text: 'Lass uns spielen.', action: () => {
                  useStore.getState().setDialogue('Matze: "Ja. Der Stahl wartet."');
                }}
              ]
            });
          } else if (bandMood > 80) {
            store.setDialogue('Matze: "Ich hab noch nie so eine Energie gespürt! Salzgitter wird brennen!"');
          } else {
            store.setDialogue('Matze: "SZaturday 3 Riff Night! Das wird der Wahnsinn!"');
          }
        }}
      />



      <Interactable
        position={[4, 3, -8]}
        emoji="🥁"
        name="Lars"
        isBandMember={true}
        idleType="tap"
        onInteract={() => {
          const store = useStore.getState();
          const bandMood = store.bandMood;

          if (store.flags.larsVibrating && store.flags.larsDrumPhilosophy) {
            if (store.flags.salzgitter_encore_unlocked) {
              store.setDialogue('Lars: "DER BEAT IST EWIG! ICH HABE BEREITS DIE MASCHINEN-SEELE ENTFESSELT! DER REST IST NUR NOCH LÄRM!"');
              return;
            }
            store.setDialogue({
              text: 'Lars: "ALLES IST ZU LANGSAM! DIE ZEIT, DER RAUM, DAS PUBLIKUM! ICH KANN DIE TAKTSTRICHE IN DER LUFT SEHEN! WAS SOLL ICH TUN, MANAGER?!"',
              options: [
                { text: 'Lars, entfessle die Maschinen-Seele! [Chaos 15]', requiredSkill: { name: 'chaos', level: 15 }, action: () => {
                  useStore.getState().setDialogue('Lars: "JAAAAAAAAA! DIE DRUMS BRENNEN! DIE REALITÄT KOCHT! DAS IST DER ULTIMATIVE BEAT!"');
                  useStore.getState().setFlag('salzgitter_encore_unlocked', true);
                  useStore.getState().increaseBandMood(40);
                  useStore.getState().increaseSkill('chaos', 5);
                }},
                { text: 'Fokussiere die kinetische Energie! [Technical 12]', requiredSkill: { name: 'technical', level: 12 }, action: () => {
                  useStore.getState().setDialogue('Lars: "100% EFFIZIENZ! KEIN MILLIMETER VERSCHWENDET! ICH BIN DER ROBOTER-GOTT DER SNARE!"');
                  useStore.getState().setFlag('salzgitter_encore_unlocked', true);
                  useStore.getState().increaseBandMood(40);
                  useStore.getState().increaseSkill('technical', 5);
                }},
                { text: 'Einfach durchatmen.', action: () => {
                  useStore.getState().setDialogue('Lars: "ATMEN IST FÜR FLEISCHSÄCKE! ABER OKAY!"');
                }}
              ]
            });
            return;
          }

          if (store.flags.lars_paced) {
             store.setDialogue('Lars: "Danke, dass du mich im Backstage gebremst hast. Meine Schläge sind jetzt... chirurgisch. Jeder Akzent sitzt wie ein Skalpell."');
             if (!store.flags.salzgitter_lars_paced_talked) {
                 store.setFlag('salzgitter_lars_paced_talked', true);
                 store.increaseBandMood(25);
             }
             return;
          }

          if (store.flags.larsRhythmPact && !store.flags.larsRhythmPactClaimed) {
             const options: DialogueOption[] = [];
             if (store.flags.larsVibrating) {
                options.push({ text: 'Hyperpowered Lars!', action: () => {
                   useStore.getState().setDialogue('Lars: "DER RHYTHMUS IST IN MIR EXPLODIERT! DER PAKT WIRD DIE REALITÄT ZERFETZEN!"');
                   useStore.getState().increaseBandMood(50);
                   useStore.getState().increaseSkill('chaos', 5);
                   useStore.getState().setFlag('larsRhythmPactClaimed', true);
                }});
             } else {
                options.push({ text: 'Lass uns die Realität zertrümmern.', action: () => {
                   useStore.getState().setDialogue('Lars: "Jeder Schlag ein Beben."');
                   useStore.getState().increaseBandMood(30);
                   useStore.getState().setFlag('larsRhythmPactClaimed', true);
                }});
             }
             store.setDialogue({
                text: 'Lars: "Der Pakt ist erfüllt, Manager. Der Rhythmus verlangt nach Auslassung!"',
                options
             });
             return;
          }

          if (store.flags.larsVibrating) {
            store.setDialogue({
              text: 'Lars: "ICH BIN DIE MASCHINE! MEIN HERZ IST EIN DIESELMOTOR! ICH SEHE DIE SOUNDWELLEN ALS PHYSISCHE OBJEKTE!"',
              options: [
                { 
                  text: 'Synchronisiere die Frequenz. [Technical 10]', 
                  requiredSkill: { name: 'technical', level: 10 },
                  action: () => {
                    useStore.getState().setDialogue('Lars: "SYNC_COMPLETE! ICH BIN JETZT EIN TEIL DES NETZWERKS! DER BEAT IST ABSOLUT!"');
                    useStore.getState().increaseBandMood(30);
                    useStore.getState().increaseSkill('technical', 5);
                  }
                },
                { text: 'Halt durch, Lars!', action: () => {
                  useStore.getState().setDialogue('Lars: "KEINE ZEIT FÜR PAUSEN! NUR NOCH LÄRM!"');
                }}
              ]
            });
            store.increaseBandMood(10);
          } else if (store.flags.larsDrumPhilosophy) {
            store.setDialogue('Lars: "Ich denke an den Zorn der Maschinen. Jeder Schlag ist ein Urteil. Salzgitter wird beben!"');
            store.increaseBandMood(5);
          } else if (bandMood > 70) {
            store.setDialogue('Lars: "MEIN HERZ SCHLÄGT IM TAKT DER MASCHINEN! ICH BIN BEREIT!"');
          } else {
            store.setDialogue('Lars: "Die Drums sind mikrofoniert. Ich bin bereit, alles zu geben!"');
          }
        }}
      />



      <Interactable
        position={[0, 3, -6]}
        emoji="🎤"
        name="Marius"
        isBandMember={true}
        idleType="sway"
        onInteract={() => {
          const store = useStore.getState();
          const bandMood = store.bandMood;
          const trait = store.trait;

          if (trait === 'Performer' && !store.flags.salzgitter_performer_talked) {
            store.setDialogue({
              text: 'Marius: "Manager, schau dir diese Menge an! Sie warten nur darauf, dass ich sie mit meiner Stimme in Ekstase versetze. Hast du ein paar Tipps für den perfekten Auftritt?"',
              options: [
                { text: 'Fokussiere dich auf die erste Reihe.', action: () => {
                  useStore.getState().setDialogue('Marius: "Gute Idee. Die erste Reihe ist der Anker für die gesamte Energie. Ich werde sie hypnotisieren!"');
                  useStore.getState().setFlag('salzgitter_performer_talked', true);
                  useStore.getState().increaseBandMood(30);
                  useStore.getState().increaseSkill('social', 5);
                }}
              ]
            });
            return;
          }

          if (store.flags.mariusEgoStrategy && store.flags.mariusConfidenceBoost && store.flags.egoContained && !store.flags.salzgitterBandUnited) {
             const bandReady = store.flags.matzeDeepTalk && store.flags.larsDrumPhilosophy && (store.flags.mariusCalmed || store.flags.mariusConfidenceBoost);
             store.setDialogue({
                text: 'Marius: "Du hast mich gerettet, Manager. Mein Ego, meine Angst... alles ist jetzt gebündelt in pure Energie. Wie stehen wir da?"',
                options: [
                   bandReady ? { text: 'Die Band ist vereint.', action: () => {
                      useStore.getState().setDialogue('Marius: "Wir sind eine Wand aus Lärm. Lasst uns die Welt niederreißen!"');
                      useStore.getState().setFlag('salzgitterBandUnited', true);
                      useStore.getState().addQuest('unite_band', 'Vereinige die Band vor dem Finale in Salzgitter');
                      useStore.getState().completeQuest('unite_band');
                      useStore.getState().increaseBandMood(30);
                   }} : { text: 'Wir geben unser Bestes.', action: () => {
                      useStore.getState().setDialogue('Marius: "Ja, wir werden alles geben."');
                   }}
                ]
             });
             return;
          }

          if (store.flags.mariusConfidenceBoost) {
            const options: DialogueOption[] = [
              {
                text: 'Kanalisiere den Zorn. [Chaos 10]',
                requiredSkill: { name: 'chaos', level: 10 },
                action: () => {
                  useStore.getState().setDialogue('Marius: "MEINE STIMME WIRD DEN STAHL ZUM SCHMELZEN BRINGEN! ICH BIN DER STURM!"');
                  useStore.getState().increaseBandMood(40);
                  useStore.getState().increaseSkill('chaos', 5);
                }
              },
              {
                text: 'Beruhige die Menge. [Social 10]',
                requiredSkill: { name: 'social', level: 10 },
                action: () => {
                  useStore.getState().setDialogue('Marius: "Sie werden uns aus der Hand fressen. Ich habe die absolute Kontrolle über ihre Seelen."');
                  useStore.getState().increaseBandMood(30);
                  useStore.getState().increaseSkill('social', 5);
                }
              },
              { text: 'Lass es raus!', action: () => {
                useStore.getState().setDialogue('Marius: "AAAAAAHHHHHHHH!!!!"');
              }}
            ];

            if (store.flags.egoContained && store.flags.bassist_contacted) {
               options.unshift({
                 text: 'Marius, der Bassist ist bei uns. Sing für ihn. [Social 12]',
                 requiredSkill: { name: 'social', level: 12 },
                 action: () => {
                   useStore.getState().setDialogue('Marius: "Ich spüre es. Eine tiefe, vibrierende Kraft. Ich singe nicht mehr für mich. Ich singe für die Ewigkeit!"');
                   useStore.getState().setFlag('salzgitter_true_ending', true);
                   useStore.getState().increaseBandMood(50);
                 }
               });
            } else if (store.flags.backstage_performer_speech) {
               options.unshift({
                 text: 'Du hast die erste Reihe. Jetzt nimm sie alle. [Performer]',
                 requiredTrait: 'Performer',
                 action: () => {
                   useStore.getState().setDialogue('Marius: "Ja. Jeder Einzelne hier wird mich spüren. Sie werden meine Frequenz atmen!"');
                   useStore.getState().increaseBandMood(30);
                   useStore.getState().increaseSkill('social', 5);
                 }
               });
            }

            store.setDialogue({
              text: 'Marius: "Manager, danke für den Zuspruch im Backstage. Ich fühle mich unbesiegbar. Die Fans werden meine Stimme noch in 100 Jahren hören!"',
              options
            });
            if (!store.flags.salzgitter_marius_greeted) {
              store.setFlag('salzgitter_marius_greeted', true);
              store.increaseBandMood(15);
            }
          } else if (bandMood > 90) {
            store.setDialogue('Marius: "Ich bin kein Mensch mehr... ich bin reiner Schall! DANKE FÜR ALLES, MANAGER!"');
          } else if (bandMood > 50) {
            store.setDialogue('Marius: "Danke, dass du uns als Manager hierher gebracht hast! NEUROTOXIC RULES!"');
          } else {
            store.setDialogue('Marius: "Ich bin nervös, aber wir ziehen das durch. Für den Metal!"');
          }
        }}
      />



      {/* Lore: Floating Bassist */}
      {flags.bassist_contacted && (
        <Interactable
          position={[0, 8, -5]}
          emoji="🎸"
          name="Schwebender Bassist"
          scale={1.5}
          onInteract={() => {
            const store = useStore.getState();
            if (store.flags.bassist_restored) {
               store.setDialogue('Bassist: "Ich bin bereit. Der Grundton schwingt in meinem Blut. Wir bringen die Gießerei zurück."');
               return;
            }

            const options: DialogueOption[] = [
               { text: 'Wir sehen uns auf der anderen Seite.', action: () => {
                 useStore.getState().setDialogue('Bassist: "Der Sound ist alles."');
               }}
            ];

            if (store.hasItem('Bassist-Saite')) {
               options.unshift({
                 text: 'Gib ihm die Bassist-Saite aus dem Echo. [Mystic]',
                 requiredTrait: 'Mystic',
                 action: () => {
                   useStore.getState().setDialogue('Bassist: "Das... das ist ein Teil von mir! Mein alter Rhythmus... ich erinnere mich!"');
                   useStore.getState().setFlag('bassist_restored', true);
                   useStore.getState().discoverLore('bassist_wahrheit');
                   useStore.getState().increaseBandMood(40);
                   useStore.getState().removeFromInventory('Bassist-Saite');
                 }
               });
            }

            if (store.hasItem('Resonanz-Kristall')) {
               options.unshift({
                 text: 'Nimm den Resonanz-Kristall. Vollende das Riff.',
                 action: () => {
                   useStore.getState().setDialogue('Bassist: "Der Kristall... er verbindet die Dimensionen. Ich setze ihn ein, wenn wir die letzte Note spielen. Danke, Manager."');
                   useStore.getState().setFlag('bassist_restored', true);
                   useStore.getState().discoverLore('bassist_wahrheit');
                   useStore.getState().increaseBandMood(30);
                   useStore.getState().removeFromInventory('Resonanz-Kristall');
                 }
               });
            }

            // Auto-restore via VoidStation contact only if player has no special items
            if (store.flags.voidBassistSpoken && store.quests.find(q => q.id === 'bassist_mystery' && q.completed) && !store.hasItem('Bassist-Saite') && !store.hasItem('Resonanz-Kristall')) {
               store.setDialogue('Bassist: "Du erinnerst dich an mich. Du hast die Frequenz verstanden. Ich segne diesen Gig mit der Kraft der 432 Hz."');
               store.increaseBandMood(30);
               store.setFlag('bassist_restored', true);
               return;
            }

            if (store.flags.voidBassistSpoken) {
               options.unshift({ text: 'Du erinnerst dich an mich.', action: () => {
                 useStore.getState().setDialogue('Bassist: "Ja... du hast mir in der Leere zugehört. Meine Töne gehören heute euch."');
                 useStore.getState().increaseBandMood(20);
               }});
            }

            store.setDialogue({
              text: 'Bassist: "Du hast mich gefunden. Hier, in der Frequenz. Danke. Sag der Band... der Sound war es wert."',
              options
            });
          }}
        />
      )}



      <Interactable
        position={[8, 0, 5]}
        emoji="🤩"
        name="Fan"
        onInteract={() => {
          const store = useStore.getState();
          const hasSignedSetlist = store.hasItem('Signierte Setliste');
          const hasTalisman = store.hasItem('Industrie-Talisman');

          if (store.flags.fanMovement) {
             store.setDialogue('Fan: "DIE BEWEGUNG IST GESTARTET! WIR SIND ALLE NEUROTOXIC!"');
             return;
          }

          if (hasTalisman) {
            store.setDialogue({
              text: 'Fan: "Ist das... ein echter Industrie-Talisman?! Den hab ich nur in den Legenden von 1982 gesehen!"',
              options: [
                { text: 'Ein Geschenk für dich.', action: () => {
                  useStore.getState().setDialogue('Fan: "Ich werde ihn in Ehren halten! Du bist der beste Manager der Welt! Ich spüre die pure Kraft des Stahls!"');
                  useStore.getState().removeFromInventory('Industrie-Talisman');
                  useStore.getState().increaseBandMood(40);
                }}
              ]
            });
            return;
          }

          if (hasSignedSetlist) {
            store.setDialogue({
              text: 'Fan: "OH MEIN GOTT! Eine signierte Setliste! Das ist der beste Tag meines Lebens! Darf ich dich umarmen?"',
              options: [
                { text: 'Klar, komm her!', action: () => {
                  useStore.getState().setDialogue('Fan: "Du riechst nach Erfolg und... altem Kaffee. Danke!"');
                  useStore.getState().removeFromInventory('Signierte Setliste');
                  useStore.getState().increaseBandMood(25);
                }},
                { text: 'Abstand halten, bitte.', action: () => {
                  useStore.getState().setDialogue('Fan: "Verstehe. Die Aura eines Managers ist zu stark. Danke für die Liste!"');
                  useStore.getState().removeFromInventory('Signierte Setliste');
                  useStore.getState().increaseBandMood(15);
                }}
              ]
            });
            return;
          }

          if (store.flags.backstage_performer_speech) {
            store.setDialogue('Fan: "DU! Du warst der, der den Backstage-Speech gegeben hat! Ich hab es durch die Wand gehört! Ihr seid Götter!"');
            if (!store.flags.salzgitter_fan_speech_heard) {
              store.setFlag('salzgitter_fan_speech_heard', true);
              store.increaseBandMood(5);
            }
            return;
          }

          if (store.flags.kaminstube_crowd_rallied) {
            store.setDialogue('Fan: "Tangermünde spricht noch immer über euch! Ihr seid Legenden! Bitte macht ein Foto mit mir!"');
            return;
          }

          const options: DialogueOption[] = [];

          options.push({ text: 'Folgt mir! [Performer]', requiredTrait: 'Performer', action: () => {
              useStore.getState().setDialogue('Du reißt die Arme hoch und beginnst einen Rhythmus. Der Fan stimmt ein, dann die Menge. Ein epischer Chor entsteht!');
              useStore.getState().setFlag('fanMovement', true);
              useStore.getState().addQuest('fan_movement', 'Starte eine Fan-Bewegung beim Konzert');
              useStore.getState().completeQuest('fan_movement');
              useStore.getState().increaseBandMood(35);
          }});
          options.push({ text: 'Lasst uns zusammen singen! [Social 8]', requiredSkill: { name: 'social', level: 8 }, action: () => {
              useStore.getState().setDialogue('Ein Chor aus hunderten Kehlen beginnt das Intro eures größten Hits zu singen. Die Energie ist greifbar!');
              useStore.getState().setFlag('fanMovement', true);
              useStore.getState().addQuest('fan_movement', 'Starte eine Fan-Bewegung beim Konzert');
              useStore.getState().completeQuest('fan_movement');
              useStore.getState().increaseBandMood(30);
          }});
          options.push({ text: 'Wir sind alle eins mit der Musik. [Diplomat]', requiredTrait: 'Diplomat', action: () => {
              useStore.getState().setDialogue('Der Fan weint vor Ergriffenheit. "Ja... wir sind eins!" Er reicht die Botschaft an die Menge weiter.');
              useStore.getState().setFlag('fanMovement', true);
              useStore.getState().addQuest('fan_movement', 'Starte eine Fan-Bewegung beim Konzert');
              useStore.getState().completeQuest('fan_movement');
              useStore.getState().increaseBandMood(25);
          }});

          if (!store.flags.gaveDiplomatSouvenir) {
            options.push({ text: 'Hier, ein Andenken. [Diplomat]', requiredTrait: 'Diplomat', action: () => {
              useStore.getState().setFlag('gaveDiplomatSouvenir', true);
              useStore.getState().setDialogue('Fan: "Wow, danke! Ein echtes Tour-Artefakt! Du bist ein Diplomat des Lärms!"');
              useStore.getState().increaseBandMood(20);
            }});
          }
          options.push(
             { text: 'Ich schau mal was ich tun kann.', action: () => useStore.getState().setDialogue('Fan: "Bitte beeil dich, ich steh hier schon seit 4 Uhr morgens!"') },
             { text: 'Wer bist du nochmal?', action: () => {
               useStore.getState().setDialogue('Fan: "Ich bin dein größter Albtraum... und dein treuester Fan!"');
               useStore.getState().increaseBandMood(-2);
             }}
          );
          store.setDialogue({
            text: 'Fan: "Ich liebe NEUROTOXIC! Hast du vielleicht ein Autogramm für mich? Oder ein Plektrum?"',
            options
          });
        }}
      />



      <Interactable
        position={[0, 1, 0]}
        emoji="🏆"
        name="Das Finale"
        scale={2}
        onInteract={() => {
          const store = useStore.getState();
          if (store.flags.salzgitter_finalized) {
            store.setDialogue('Die Bühne schweigt. Das Riff hallt noch immer nach. Es war das Größte, das je gespielt wurde.');
            return;
          }
          store.completeQuest('final');
          store.setFlag('salzgitter_finalized', true);

          // Calculate endings based on flags
          let endingsCount = 0;
          if (store.flags.salzgitterBandUnited) endingsCount++;
          if (store.flags.fanMovement) endingsCount++;
          if (store.flags.backstageRitualPerformed) endingsCount++;
          if (store.flags.wirtLegacy1982) endingsCount++;
          if (store.flags.voidBassistSpoken) endingsCount++;

          if (store.flags.salzgitter_true_ending && store.flags.bassist_restored && store.flags.maschinen_seele_complete) {
             store.setDialogue('Die Maschinen singen. Der Bassist schwingt im Grundton. Marius ist unantastbar. Der Manager hat nicht nur eine Tour gemanagt — er hat eine Frequenz wiederhergestellt, die seit 1982 verklungen war. NEUROTOXIC ist unsterblich. [TRUE ENDING]');
             store.increaseBandMood(100);
             // Discover remaining lore logically associated with true ending
             store.discoverLore('bassist_wahrheit');
             store.discoverLore('maschinen_bewusstsein');
             store.discoverLore('frequenz_1982_decoded');
          } else if (store.flags.salzgitter_encore_unlocked) {
             store.setDialogue('ZUGABE! Die Band spielt das Verbotene Riff! Lars zerschmettert die Snare, Matze lässt die Röhren glühen und Marius schreit die Halle in Grund und Boden. Die Realität bebt! [SECRET ENCORE]');
             store.increaseBandMood(50);
          } else if (endingsCount >= 4 || (store.flags.frequenz1982_complete && store.flags.mariusConfidenceBoost && store.bandMood > 70)) {
             let baseText = 'Die Frequenz von 1982 hat die Halle erfüllt. Der Sound war perfekt. Die Fans liegen sich heulend in den Armen. Ein meisterhafter Auftritt!';
             if (endingsCount >= 4) {
                 baseText += ' Der Zyklus von 1982 ist geschlossen. Die Band ist eine Einheit. Der Lärm ist rein.';
             }
             if (store.flags.fanMovement && store.flags.salzgitterBandUnited) {
                 baseText += ' Eine wahre Fan-Bewegung ist entstanden!';
             }
             store.setDialogue(baseText + ' [BEST ENDING]');
             store.increaseBandMood(70);
          } else if (endingsCount >= 2 || (store.bandMood > 70 && store.flags.mariusConfidenceBoost)) {
             store.setDialogue('Ein solider Gig. Die Fans jubeln. Marius hat die Kontrolle behalten und NEUROTOXIC ist zufrieden. Die Band hat einiges zusammen durchgestanden. Die Tour ist ein Erfolg! [GOOD ENDING]');
             store.increaseBandMood(50);
          } else {
             store.setDialogue('Du hast die Tour gemanagt. NEUROTOXIC hat gespielt. Es war... okay. Die Boxen haben überlebt, und das Bier war kalt. [STANDARD ENDING]');
             store.increaseBandMood(30);
          }
        }}
      />


      <Player bounds={{ x: [-18, 18], z: [-9, 9] }} />
      <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={30} blur={2} far={10} />
    </>
  );
}
