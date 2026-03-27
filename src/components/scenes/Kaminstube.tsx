/**
 * #1: UPDATES
 * - Added lore, interactable objects, and NPCs.
 * - Implemented quest logic for fixing the amp.
 * - Added dialogue branches for NPC interactions.
 * - Added cosmic_echo quest.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more questlines.
 * - Expand NPC dialogue.
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
import { ContactShadows, Sparkles } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function Kaminstube() {
  const flags = useStore((state) => state.flags);
  const setFlag = useStore((state) => state.setFlag);
  const addToInventory = useStore((state) => state.addToInventory);
  const addQuest = useStore((state) => state.addQuest);
  const completeQuest = useStore((state) => state.completeQuest);
  const hasItem = useStore((state) => state.hasItem);
  const setDialogue = useStore((state) => state.setDialogue);
  const increaseBandMood = useStore((state) => state.increaseBandMood);

  const pointLightRef = useRef<THREE.PointLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const tRef = useRef(0);

  useFrame((state, delta) => {
    if (flags.ampFixed) {
      // Dynamic lighting when the amp is fixed (show starts)
      tRef.current += delta || 0;
      const t = tRef.current;
      const beat = Math.abs(Math.sin(t * 4)); // Simple beat sync
      
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 4.5 + beat * 10;
        pointLightRef.current.color.setHSL((t * 0.5) % 1, 1, 0.5);
      }
      if (dirLightRef.current) {
        dirLightRef.current.intensity = 1.3 + beat * 2;
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#5b3a2a']} />
      <fog attach="fog" args={['#5a3e2f', 18, 82]} />
      <ambientLight intensity={0.92} />
      <hemisphereLight args={['#fff1dc', '#5a4038', 0.75]} />
      <pointLight ref={pointLightRef} position={[0, 5, -5]} intensity={4.5} color="#ffaa00" />
      <directionalLight ref={dirLightRef} position={[10, 10, 5]} intensity={1.3} color="#ff6a4a" />
      <pointLight position={[-9, 2.4, -3]} intensity={2.3} color="#ff7a3a" />
      <pointLight position={[9, 2.2, -1]} intensity={2.1} color="#ff9c4a" />
      <pointLight position={[0, 2.8, 3.6]} intensity={2} color="#fff2e1" />
      <pointLight position={[0, 3.2, -2.5]} intensity={1.9} color="#7f7dff" />
      
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#5a3f34" emissive="#2f1f1a" emissiveIntensity={0.34} metalness={0.22} roughness={0.76} />
        </mesh>
      </RigidBody>

      {/* Stage */}
      <RigidBody type="fixed" position={[0, 0.5, -6]}>
        <mesh receiveShadow>
          <boxGeometry args={[12, 1, 4]} />
          <meshStandardMaterial color="#1e232b" emissive="#0e141d" emissiveIntensity={0.28} metalness={0.48} roughness={0.65} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 5, -8]}>
        <mesh receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#6e4f45" emissive="#35211a" emissiveIntensity={0.36} metalness={0.2} roughness={0.72} />
        </mesh>
      </RigidBody>

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

      {/* Fireplace core */}
      <mesh position={[-11.5, 1.4, 2.2]}>
        <boxGeometry args={[2.1, 2.6, 1.2]} />
        <meshStandardMaterial color="#2a1a12" metalness={0.2} roughness={0.9} />
      </mesh>
      <mesh position={[-11.5, 2.9, 2.15]}>
        <boxGeometry args={[2.4, 0.22, 1.38]} />
        <meshStandardMaterial color="#6f4d34" emissive="#2e1f14" emissiveIntensity={0.26} roughness={0.76} />
      </mesh>
      <mesh position={[-11.5, 4.1, 2.2]}>
        <boxGeometry args={[1.1, 2.2, 0.9]} />
        <meshStandardMaterial color="#5b402e" emissive="#26190f" emissiveIntensity={0.2} roughness={0.82} />
      </mesh>
      <mesh position={[-11.5, 1.1, 2.75]}>
        <planeGeometry args={[1.3, 1.4]} />
        <meshBasicMaterial color="#ff7a2f" transparent opacity={0.7} />
      </mesh>
      <Sparkles count={45} scale={[1.2, 1.2, 1.2]} size={1.6} speed={0.6} color="#ffb36b" position={[-11.5, 1.8, 2.4]} />

      {/* Tables and stools */}
      {[
        [-6, 0.6, 1.5],
        [5.5, 0.6, 2],
        [9, 0.6, -3],
      ].map((pos, idx) => (
        <group key={`table-${idx}`} position={pos as [number, number, number]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 0.9, 0.15, 18]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#5f3a2f' : '#3f2f5f'} emissive={idx % 2 === 0 ? '#2c1712' : '#1b1230'} emissiveIntensity={0.22} />
          </mesh>
          <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.16, 0.9, 10]} />
            <meshStandardMaterial color="#241915" metalness={0.2} />
          </mesh>
          {[-0.85, 0.85].map((x) => (
            <mesh key={`stool-a-${x}`} position={[x, -0.55, 0.3]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.26, 0.6, 10]} />
              <meshStandardMaterial color="#3a2722" emissive="#1a100d" emissiveIntensity={0.14} roughness={0.85} />
            </mesh>
          ))}
          {[-0.85, 0.85].map((x) => (
            <mesh key={`stool-b-${x}`} position={[x, -0.55, -0.3]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.26, 0.6, 10]} />
              <meshStandardMaterial color="#3a2722" emissive="#1a100d" emissiveIntensity={0.14} roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
      {[[-6, 0.78, 1.3], [5.5, 0.78, 1.8], [9, 0.78, -3.2]].map((pos, idx) => (
        <group key={`mug-${idx}`} position={pos as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.14, 0.22, 14]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#f2d28d' : '#9dc8ff'} emissive={idx % 2 === 0 ? '#7f5c26' : '#3a5f87'} emissiveIntensity={0.34} roughness={0.62} />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <torusGeometry args={[0.05, 0.014, 8, 14]} />
            <meshStandardMaterial color="#f2e8d1" metalness={0.22} roughness={0.55} />
          </mesh>
        </group>
      ))}

      {/* Ceiling beams */}
      {[-10, -5, 0, 5, 10].map((x) => (
        <mesh key={`beam-${x}`} position={[x, 6.3, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.35, 15]} />
          <meshStandardMaterial color="#2b1d18" roughness={0.95} />
        </mesh>
      ))}
      {[-9, -3, 3, 9].map((x) => (
        <group key={`lamp-${x}`} position={[x, 5.8, -0.8]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.1, 8]} />
            <meshStandardMaterial color="#33251d" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.65, 0]} castShadow>
            <sphereGeometry args={[0.23, 14, 14]} />
            <meshStandardMaterial color="#ffc56f" emissive="#ffc56f" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}

      {/* Bar counter + bottle shelves */}
      <mesh position={[11.2, 1.05, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 2.1, 8.8]} />
        <meshStandardMaterial color="#5a2f1f" emissive="#2b140d" emissiveIntensity={0.28} metalness={0.2} roughness={0.8} />
      </mesh>
      {[2.6, 0.8, -1, -2.8].map((z, idx) => (
        <group key={`bar-tap-${idx}`} position={[10.34, 1.48, z]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
            <meshStandardMaterial color="#c3ccd6" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.16, 0.1, 0]}>
            <boxGeometry args={[0.24, 0.12, 0.08]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#ffd36e' : '#9d8cff'} emissive={idx % 2 === 0 ? '#a56e18' : '#5b4aa8'} emissiveIntensity={0.44} />
          </mesh>
        </group>
      ))}
      {[2.2, 1.3, 0.4].map((y, idx) => (
        <mesh key={`shelf-${idx}`} position={[10.35, y, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.08, 7.4]} />
          <meshStandardMaterial color="#714330" />
        </mesh>
      ))}
      {[-3, -1.5, 0, 1.5, 3].map((z) => (
        <mesh key={`bottle-${z}`} position={[10.15, 2.35, z]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.45, 10]} />
          <meshStandardMaterial color="#6b8f7f" emissive="#223a31" emissiveIntensity={0.35} />
        </mesh>
      ))}

      {/* Colored stained windows and stage monitors */}
      {[-9, -3, 3, 9].map((x, idx) => (
        <mesh key={`window-${x}`} position={[x, 4.1, -7.88]}>
          <planeGeometry args={[2.2, 2.4]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#ff9b4d' : '#7d5dff'} emissive={idx % 2 === 0 ? '#5a2d14' : '#24195f'} emissiveIntensity={0.45} transparent opacity={0.48} />
        </mesh>
      ))}
      {[-4.2, -1.2, 1.2, 4.2].map((x) => (
        <mesh key={`monitor-${x}`} position={[x, 0.62, -4.65]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.8, 0.9]} />
          <meshStandardMaterial color="#1f2430" emissive="#0f1a2b" emissiveIntensity={0.3} metalness={0.58} roughness={0.45} />
        </mesh>
      ))}

      {/* Stage drum kit and cable coils */}
      <group position={[0.2, 0.66, -5.55]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.72, 0.75, 0.8, 22]} />
          <meshStandardMaterial color="#344863" emissive="#1a2f49" emissiveIntensity={0.35} metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh position={[-0.95, 0.16, 0.2]} castShadow>
          <cylinderGeometry args={[0.36, 0.38, 0.46, 18]} />
          <meshStandardMaterial color="#3f5877" emissive="#1f3652" emissiveIntensity={0.32} metalness={0.5} roughness={0.42} />
        </mesh>
        <mesh position={[0.98, 0.18, 0.15]} castShadow>
          <cylinderGeometry args={[0.4, 0.42, 0.5, 18]} />
          <meshStandardMaterial color="#3f5877" emissive="#1f3652" emissiveIntensity={0.32} metalness={0.5} roughness={0.42} />
        </mesh>
        <mesh position={[-0.35, 0.74, -0.12]}>
          <cylinderGeometry args={[0.38, 0.38, 0.06, 20]} />
          <meshStandardMaterial color="#d8e0ea" metalness={0.92} roughness={0.14} />
        </mesh>
        <mesh position={[0.72, 0.94, -0.12]} rotation={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.46, 0.46, 0.05, 20]} />
          <meshStandardMaterial color="#f0d37c" emissive="#aa7a1f" emissiveIntensity={0.28} metalness={0.92} roughness={0.14} />
        </mesh>
      </group>
      {[-1.4, -0.6, 0.2, 1].map((x) => (
        <mesh key={`coil-${x}`} position={[x, 0.03, -3.85]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.03, 10, 24]} />
          <meshStandardMaterial color="#1d2330" metalness={0.55} roughness={0.4} />
        </mesh>
      ))}

      {/* Poster */}
      <mesh position={[4, 4, -7.9]}>
        <planeGeometry args={[3, 2]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <group position={[4, 4, -7.87]}>
        <mesh>
          <planeGeometry args={[2.6, 1.6]} />
          <meshStandardMaterial color="#4a1d12" emissive="#2b130c" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.46, 0.01]}>
          <planeGeometry args={[1.9, 0.18]} />
          <meshBasicMaterial color="#fdba74" />
        </mesh>
        <mesh position={[0, 0.02, 0.01]}>
          <planeGeometry args={[1.5, 0.22]} />
          <meshBasicMaterial color="#ffedd5" />
        </mesh>
        <mesh position={[0, -0.36, 0.01]}>
          <planeGeometry args={[1.7, 0.17]} />
          <meshBasicMaterial color="#fed7aa" />
        </mesh>
      </group>

      {/* Quest: Forgotten Lore */}
      {!flags.forgotten_lore && (
        <Interactable
          position={[-12, 0.5, 2]}
          emoji="📖"
          name="Flüsternder Kamin"
          onInteract={() => {
            setDialogue({
              text: 'Der Kamin flüstert in einer Sprache, die nach verbranntem Holz und alten Geheimnissen klingt. Er scheint etwas über die Geschichte der Kaminstube zu wissen.',
              options: [
                { 
                  text: 'Versuche, die Sprache zu deuten. [Diplomat]', 
                  requiredTrait: 'Diplomat',
                  action: () => {
                    setDialogue('Du verstehst das Flüstern! Es erzählt von einem versteckten Archiv unter der Bühne, das die wahren Ursprünge des Industrial Metal enthält. Du hast die Lore entschlüsselt.');
                    setFlag('forgotten_lore', true);
                    completeQuest('forgotten_lore');
                    increaseBandMood(20);
                  }
                },
                { text: 'Ignoriere das Flüstern.', action: () => setDialogue('Es ist nur das Knistern des Feuers.') }
              ]
            });
            addQuest('forgotten_lore', 'Entschlüssele die vergessene Lore in der Kaminstube');
          }}
        />
      )}

      {/* The Bartender */}
      <Interactable
        position={[-10, 0.5, -2]}
        emoji="🧔"
        name="Wirt"
        onInteract={() => {
          const currentState = useStore.getState();
          const bandMood = currentState.bandMood;
          const hasTalisman = currentState.hasItem('Industrie-Talisman');
          
          if (flags.wirtSecretItem) {
            setDialogue('Wirt: "Viel Erfolg beim Gig. Salzgitter wartet auf den Knall."');
            return;
          }

          if (hasTalisman && !flags.wirtSecretItem) {
            setDialogue({
              text: 'Wirt: "Das ist... der Talisman von 1982. Ich erkenne ihn sofort. Er war der Grund, warum wir die Gießerei schließen mussten. Hier, nimm das. Es gehört zum Set."',
              options: [
                { text: 'Was ist das?', action: () => {
                  setDialogue('Wirt: "Ein Altes Plektrum. Es ist aus dem Knochen einer verstummten Sirene geschnitzt. Es wird Matze helfen, das Verbotene Riff zu bändigen. Er wird es brauchen."');
                  addToInventory('Altes Plektrum');
                  setFlag('wirtSecretItem', true);
                  increaseBandMood(20);
                }}
              ]
            });
            return;
          }

          if (bandMood > 80) {
            setDialogue({
              text: 'Wirt: "Ich hab schon viele Bands hier gesehen, aber ihr... ihr habt den Schmerz und den Stahl im Blut. Die Bühne zittert bereits vor Vorfreude. Was wollt ihr wissen?"',
              options: [
                { text: 'Erzähl mir vom Gig 1982.', action: () => {
                  setDialogue('Wirt: "Es war laut. So laut, dass die Fenster in ganz Tangermünde zersprangen. Der Manager verschwand im Feedback. Manche sagen, er ist immer noch da draußen."');
                  increaseBandMood(10);
                }},
                { text: 'Wie kommen wir nach Salzgitter?', action: () => {
                  setDialogue('Wirt: "Folgt dem Lärm. Wenn die Realität dünn wird, seid ihr fast da."');
                }}
              ]
            });
          } else if (bandMood < 30) {
            setDialogue('Wirt: "Ihr seht aus, als hättet ihr gerade eure letzte Kassette im Regen verloren. Trinkt was, oder verschwindet. In der Kaminstube überleben nur die Harten."');
          } else {
            setDialogue({
              text: 'Wirt: "Willkommen in der Kaminstube. Hier wurde Industrial Metal erfunden, als ein Heizkessel explodierte und jemand dazu schrie. Was wollt ihr?"',
              options: [
                { text: 'Ein Bier, bitte.', action: () => {
                  if (hasItem('Bier')) {
                    setDialogue('Wirt: "Du hast doch schon eins! Trink das erst mal aus."');
                  } else {
                    setDialogue('Wirt: "Klar, hier. Das offizielle Schmiermittel für den Industrial-Motor."');
                    addToInventory('Bier');
                  }
                }},
                { text: 'Wer bist du?', action: () => setDialogue('Wirt: "Ich bin der Hüter der Stille, die nach dem Knall kommt. Und ich zapfe das beste Bier der Region."') }
              ]
            });
          }
        }}
      />

      {/* Characters & Objects */}
      <Interactable
        position={[-3, 2, -5]}
        emoji="🎸"
        name="Matze"
        isBandMember={true}
        idleType="headbang"
        onInteract={() => {
          if (!flags.ampFixed) {
            addQuest('amp', 'Repariere Matzes Amp mit einer Ersatzröhre');
            setDialogue('Matze: "Mein Amp hat den Geist aufgegeben! Er hat wohl zu viel von der 432Hz-Energie aus der Void Station abbekommen."');
          } else {
            setDialogue('Matze: "Der Amp läuft wieder! Er klingt jetzt so dreckig wie ein Fabrikgelände im Ruhrpott. Perfekt."');
          }
        }}
      />

      <Interactable
        position={[3, 2, -6]}
        emoji="🥁"
        name="Lars"
        isBandMember={true}
        idleType="tap"
        onInteract={() => {
          setDialogue('Lars: "Wusstest du, dass die Kaminstube früher eine echte Schmiede war? Der Rhythmus der Hämmer steckt noch in den Wänden. Ich spüre ihn!"');
        }}
      />

      <Interactable
        position={[0, 2, -4]}
        emoji="🎤"
        name="Marius"
        isBandMember={true}
        idleType="sway"
        onInteract={() => {
          if (!flags.ampFixed) {
            setDialogue('Marius: "Die Stille hier ist unerträglich. Sie erinnert mich an die Leere zwischen den Sternen. Wir müssen Lärm machen, Matze!"');
          } else {
            setDialogue('Marius: "Underground Metal Fest! Wir bringen euch den Sound der Maschinen und das Echo der Verzweiflung!"');
          }
        }}
      />

      {/* Items */}
      {!hasItem('Röhre') && (
        <Interactable
          position={[8, 0.5, 2]}
          emoji="🔌"
          name="Ersatzröhre"
          scale={0.6}
          onInteract={() => {
            addToInventory('Röhre');
            setDialogue('Du hast eine Ersatzröhre für den Amp gefunden!');
          }}
        />
      )}

      {/* The Amp Interaction */}
      {!flags.ampFixed && (
        <Interactable
          position={[-5, 1.5, -6]}
          emoji="📻"
          name="Kaputter Amp"
          scale={1.2}
          onInteract={() => {
            if (hasItem('Röhre')) {
              setFlag('ampFixed', true);
              completeQuest('amp');
              increaseBandMood(30);
              setDialogue('Du hast die Röhre ausgetauscht. Der Amp funktioniert wieder!');
            } else {
              setDialogue('Der Amp ist stumm. Eine Röhre scheint durchgebrannt zu sein.');
            }
          }}
        />
      )}

      {/* Lore: Broken Drum Machine */}
      <Interactable
        position={[-8, 0.5, 4]}
        emoji="🎹"
        name="Kaputter Drum-Computer"
        onInteract={() => {
          setDialogue('Ein alter TR-808, der aussieht, als wäre er in einem Hochofen geschmolzen. Er gibt nur noch ein rhythmisches Klacken von sich, das seltsam beruhigend wirkt. Lars: "Das ist das Herzstück der ersten NEUROTOXIC-Platte. Er ist gestorben, als wir versuchten, ihn an ein Atomkraftwerk anzuschließen."');
          increaseBandMood(10);
        }}
      />

      <Interactable
        position={[0, 0, 6]}
        emoji="🤘"
        name="Crowd"
        scale={2}
        onInteract={() => {
          setDialogue('Die Menge tobt! NEUROTOXIC! NEUROTOXIC!');
          increaseBandMood(5);
        }}
      />

      {/* Exit */}
      {flags.ampFixed && (
        <Interactable
          position={[0, 1, 4]}
          emoji="🚐"
          name="Tourbus (Nach Salzgitter)"
          scale={1.5}
          onInteract={() => {
            useStore.getState().setScene('salzgitter');
            setDialogue('Auf zur SZaturday 3 Riff Night in Salzgitter!');
          }}
        />
      )}

      <Player bounds={{ x: [-14, 14], z: [-7, 7] }} />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={10} />
    </>
  );
}
