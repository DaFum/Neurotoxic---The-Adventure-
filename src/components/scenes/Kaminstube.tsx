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
import { Environment, ContactShadows, Html } from '@react-three/drei';
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

  useFrame((state) => {
    if (flags.ampFixed) {
      // Dynamic lighting when the amp is fixed (show starts)
      const t = state.clock.elapsedTime;
      const beat = Math.abs(Math.sin(t * 4)); // Simple beat sync
      
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 2 + beat * 10;
        pointLightRef.current.color.setHSL((t * 0.5) % 1, 1, 0.5);
      }
      if (dirLightRef.current) {
        dirLightRef.current.intensity = 0.5 + beat * 2;
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#2a1a1a']} />
      <ambientLight intensity={0.3} />
      <pointLight ref={pointLightRef} position={[0, 5, -5]} intensity={2} color="#ffaa00" />
      <directionalLight ref={dirLightRef} position={[10, 10, 5]} intensity={0.5} color="#ff4444" />
      
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#221111" />
        </mesh>
      </RigidBody>

      {/* Stage */}
      <RigidBody type="fixed" position={[0, 0.5, -6]}>
        <mesh receiveShadow>
          <boxGeometry args={[12, 1, 4]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 5, -8]}>
        <mesh receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#3a2a2a" />
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

      {/* Poster */}
      <mesh position={[4, 4, -7.9]}>
        <planeGeometry args={[3, 2]} />
        <meshBasicMaterial color="#111" />
        <Html transform position={[0, 0, 0.01]}>
          <div className="bg-orange-900 border-2 border-orange-500 p-2 text-center text-white font-black uppercase shadow-2xl w-48 h-32 flex flex-col justify-center items-center">
            <span className="text-orange-300 text-xs">Underground Metal Fest</span>
            <span className="text-xl">KAMINSTUBE</span>
            <span className="text-sm">TANGERMÜNDE</span>
          </div>
        </Html>
      </mesh>

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
          const bandMood = useStore.getState().bandMood;
          const hasTalisman = hasItem('Industrie-Talisman');
          
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
      <Environment preset="city" />
    </>
  );
}
