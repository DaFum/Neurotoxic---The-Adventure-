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
            const store = useStore.getState();
            store.setDialogue({
              text: 'Der Kamin flüstert in einer Sprache, die nach verbranntem Holz und alten Geheimnissen klingt. Er scheint etwas über die Geschichte der Kaminstube zu wissen.',
              options: [
                {
                  text: 'Analysiere die Frequenz des Flüsterns. [Technical 7]',
                  requiredSkill: { name: 'technical', level: 7 },
                  action: () => {
                    useStore.getState().setDialogue('Das Knistern ist kein Zufall. Es ist ein Code. Ein thermischer Algorithmus, der die Geschichte der ersten Industrial-Gigs hier speichert.');
                    useStore.getState().setFlag('forgotten_lore', true);
                    useStore.getState().completeQuest('forgotten_lore');
                    useStore.getState().increaseBandMood(20);
                    useStore.getState().increaseSkill('technical', 3);
                  }
                },
                { 
                  text: 'Versuche, die Sprache zu deuten. [Diplomat]', 
                  requiredTrait: 'Diplomat',
                  action: () => {
                    useStore.getState().setDialogue('Du verstehst das Flüstern! Es erzählt von einem versteckten Archiv unter der Bühne, das die wahren Ursprünge des Industrial Metal enthält. Du hast die Lore entschlüsselt.');
                    useStore.getState().setFlag('forgotten_lore', true);
                    useStore.getState().completeQuest('forgotten_lore');
                    useStore.getState().increaseBandMood(20);
                  }
                },
                { text: 'Ignoriere das Flüstern.', action: () => useStore.getState().setDialogue('Es ist nur das Knistern des Feuers.') }
              ]
            });
            store.addQuest('forgotten_lore', 'Entschlüssele die vergessene Lore in der Kaminstube');
          }}
        />
      )}

      {/* The Bartender */}
      <Interactable
        position={[-10, 0.5, -2]}
        emoji="🧔"
        name="Wirt"
        onInteract={() => {
          const store = useStore.getState();
          const bandMood = store.bandMood;
          const hasTalisman = store.hasItem('Industrie-Talisman');
          
          if (store.flags.wirtSecretItem) {
            store.setDialogue('Wirt: "Viel Erfolg beim Gig. Salzgitter wartet auf den Knall."');
            return;
          }

          if (store.flags.kaminstube_wirt_betrayal) {
            store.setDialogue('Wirt: "Verschwinde. Der Lärm hat diese Stadt schon einmal ruiniert."');
            return;
          }

          if (store.flags.bassist_contacted && !store.flags.bassist_clue_wirt) {
            store.setDialogue({
              text: 'Wirt: "Ihr habt also den Bassisten gefunden... In der Frequenz. Ich wusste, dass er nicht einfach weggelaufen ist. Verdammt, ich schulde euch eine Erklärung."',
              options: [
                { text: 'Zwinge ihn zur Wahrheit. [Social 8]', requiredSkill: { name: 'social', level: 8 }, action: () => {
                  useStore.getState().setDialogue('Wirt: "Okay! Ich war es. Ich habe den Amp manipuliert, der ihn in die Leere riss. Der Sound war zu gefährlich. Es tut mir leid."');
                  useStore.getState().setFlag('bassist_clue_wirt', true);
                  useStore.getState().discoverLore('wirt_vergangenheit');
                  useStore.getState().increaseBandMood(20);
                  useStore.getState().increaseSkill('social', 5);
                }},
                { text: 'Drohe ihm mit dem Lärm. [Brutalist]', requiredTrait: 'Brutalist', action: () => {
                  useStore.getState().setDialogue('Wirt: "Nicht! Beschwöre nicht die Maschinen! Ich bekenne! Ich sabotierte den Gig 1982, um die Stadt zu schützen!"');
                  useStore.getState().setFlag('bassist_clue_wirt', true);
                  useStore.getState().discoverLore('wirt_vergangenheit');
                  useStore.getState().increaseBandMood(15);
                  useStore.getState().increaseSkill('chaos', 5);
                }},
                { text: 'Verzeihe ihm. [Diplomat]', requiredTrait: 'Diplomat', action: () => {
                  useStore.getState().setDialogue('Wirt: "Du hast ein weiches Herz für einen Manager. Ich wollte nur, dass Tangermünde sicher bleibt. Hier, zur Wiedergutmachung..."');
                  useStore.getState().setFlag('bassist_clue_wirt', true);
                  useStore.getState().addToInventory('Turbo-Koffein');
                  useStore.getState().increaseBandMood(30);
                }}
              ]
            });
            return;
          }

          if (hasTalisman && !store.flags.wirtSecretItem) {
            store.setDialogue({
              text: 'Wirt: "Das ist... der Talisman von 1982. Ich erkenne ihn sofort. Er war der Grund, warum wir die Gießerei schließen mussten. Hier, nimm das. Es gehört zum Set."',
              options: [
                { text: 'Was ist das?', action: () => {
                  useStore.getState().setDialogue('Wirt: "Ein Altes Plektrum. Es ist aus dem Knochen einer verstummten Sirene geschnitzt. Es wird Matze helfen, das Verbotene Riff zu bändigen. Er wird es brauchen."');
                  useStore.getState().addToInventory('Altes Plektrum');
                  useStore.getState().setFlag('wirtSecretItem', true);
                  useStore.getState().increaseBandMood(20);
                }}
              ]
            });
            return;
          }

          if (bandMood > 80) {
            store.setDialogue({
              text: 'Wirt: "Ich hab schon viele Bands hier gesehen, aber ihr... ihr habt den Schmerz und den Stahl im Blut. Die Bühne zittert bereits vor Vorfreude. Was wollt ihr wissen?"',
              options: [
                { text: 'Erzähl mir vom Gig 1982.', action: () => {
                  useStore.getState().setDialogue('Wirt: "Es war laut. So laut, dass die Fenster in ganz Tangermünde zersprangen. Der Manager verschwand im Feedback. Manche sagen, er ist immer noch da draußen."');
                  useStore.getState().increaseBandMood(10);
                }},
                { text: 'Wie kommen wir nach Salzgitter?', action: () => {
                  useStore.getState().setDialogue('Wirt: "Folgt dem Lärm. Wenn die Realität dünn wird, seid ihr fast da."');
                }}
              ]
            });
          } else if (bandMood < 30) {
            store.setDialogue('Wirt: "Ihr seht aus, als hättet ihr gerade eure letzte Kassette im Regen verloren. Trinkt was, oder verschwindet. In der Kaminstube überleben nur die Harten."');
          } else {
            store.setDialogue({
              text: 'Wirt: "Willkommen in der Kaminstube. Hier wurde Industrial Metal erfunden, als ein Heizkessel explodierte und jemand dazu schrie. Was wollt ihr?"',
              options: [
                { text: 'Ein Bier, bitte.', action: () => {
                  if (useStore.getState().hasItem('Bier')) {
                    useStore.getState().setDialogue('Wirt: "Du hast doch schon eins! Trink das erst mal aus."');
                  } else {
                    useStore.getState().setDialogue('Wirt: "Klar, hier. Das offizielle Schmiermittel für den Industrial-Motor."');
                    useStore.getState().addToInventory('Bier');
                  }
                }},
                { text: 'Wer bist du?', action: () => useStore.getState().setDialogue('Wirt: "Ich bin der Hüter der Stille, die nach dem Knall kommt. Und ich zapfe das beste Bier der Region."') }
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
          const store = useStore.getState();
          if (!store.flags.ampFixed) {
            store.addQuest('amp', 'Repariere Matzes Amp mit einer Ersatzröhre');
            store.setDialogue('Matze: "Mein Amp hat den Geist aufgegeben! Er hat wohl zu viel von der 432Hz-Energie aus der Void Station abbekommen."');
          } else {
            if (store.flags.tourbus_sabotage_discovered) {
               if (store.flags.tourbus_matze_confession) {
                 store.setDialogue('Matze: "Der Amp läuft... Ich spiele heute Abend nur für uns. Und für das Riff. Keine Angst, Manager."');
               } else {
                 store.setDialogue({
                   text: 'Matze: "Der Amp läuft. Manager... über die Sache im Tourbus. Ich habe das Kabel zerschnitten. Ich hatte Panik, dass wir wie 1982 enden."',
                   options: [
                     { text: 'Wir stehen das gemeinsam durch. [Diplomat]', requiredTrait: 'Diplomat', action: () => {
                       useStore.getState().setDialogue('Matze: "Danke. Ich werde dich nicht enttäuschen. Die Röhren glühen wieder."');
                       useStore.getState().setFlag('tourbus_matze_confession', true);
                       useStore.getState().completeQuest('tourbus_saboteur');
                       useStore.getState().increaseBandMood(30);
                     }},
                     { text: 'Kein Fehler mehr, oder du fliegst. [Brutalist]', requiredTrait: 'Brutalist', action: () => {
                       useStore.getState().setDialogue('Matze: "Verstanden. Nur noch Hass und Lärm."');
                       useStore.getState().setFlag('tourbus_matze_confession', true);
                       useStore.getState().completeQuest('tourbus_saboteur');
                       useStore.getState().increaseBandMood(15);
                     }}
                   ]
                 });
               }
            } else {
              store.setDialogue('Matze: "Der Amp läuft wieder! Er klingt jetzt so dreckig wie ein Fabrikgelände im Ruhrpott. Perfekt."');
            }
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
          const store = useStore.getState();
          if (store.flags.kaminstube_lars_talked) {
             store.setDialogue('Lars: "Die Schmiede ruft. Ich habe den Takt verinnerlicht."');
             return;
          }

          store.setDialogue({
            text: 'Lars: "Wusstest du, dass die Kaminstube früher eine echte Schmiede war? Der Rhythmus der Hämmer steckt noch in den Wänden. Ich spüre ihn!"',
            options: [
              { text: 'Dann spiel im Takt der Hämmer. [Technical 5]', requiredSkill: { name: 'technical', level: 5 }, action: () => {
                useStore.getState().setDialogue('Lars: "Genau! 120 BPM, hart auf die Snare. Die Akustik des Raumes wird die Schläge verdoppeln!"');
                useStore.getState().setFlag('kaminstube_lars_talked', true);
                useStore.getState().increaseBandMood(15);
                useStore.getState().increaseSkill('technical', 3);
              }},
              { text: 'Zerschmettere die Hämmer mit deinem Rhythmus. [Chaos 5]', requiredSkill: { name: 'chaos', level: 5 }, action: () => {
                useStore.getState().setDialogue('Lars: "JA! Ein Polyrhythmus, der die Architektur der Halle in Frage stellt!"');
                useStore.getState().setFlag('kaminstube_lars_talked', true);
                useStore.getState().increaseBandMood(20);
                useStore.getState().increaseSkill('chaos', 3);
              }},
              { text: 'Hauptsache du bleibst im Takt.', action: () => {
                useStore.getState().setFlag('kaminstube_lars_talked', true);
                useStore.getState().setDialogue('Lars: "Takt ist relativ. Aber okay, ich bemühe mich."');
              }}
            ]
          });
        }}
      />

      <Interactable
        position={[0, 2, -4]}
        emoji="🎤"
        name="Marius"
        isBandMember={true}
        idleType="sway"
        onInteract={() => {
          const store = useStore.getState();
          if (!store.flags.ampFixed) {
            store.setDialogue('Marius: "Die Stille hier ist unerträglich. Sie erinnert mich an die Leere zwischen den Sternen. Wir müssen Lärm machen, Matze!"');
          } else {
            if (store.flags.egoContained) {
               store.setDialogue('Marius: "Mein Ego brennt in mir! Ich werde diese Menge verschlingen und als Lärm wieder ausspucken! Salzgitter wird unser Altar sein!"');
            } else {
               store.setDialogue('Marius: "Underground Metal Fest! Wir bringen euch den Sound der Maschinen und das Echo der Verzweiflung!"');
            }
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
          const store = useStore.getState();
          if (store.flags.kaminstube_crowd_rallied) {
            store.setDialogue('Die Menge tobt! Tangermünde gehört uns!');
            return;
          }

          store.setDialogue({
            text: 'Die Menge wartet ungeduldig. Ein paar rufen nach einer Cover-Band. Wir müssen sie auf unsere Seite ziehen.',
            options: [
              { text: 'Ruft sie zur Ordnung. [Social 5]', requiredSkill: { name: 'social', level: 5 }, action: () => {
                useStore.getState().setDialogue('Manager: "Tangermünde! Seid ihr bereit für den Lärm?!" Die Menge brüllt zurück. Sie gehören uns.');
                useStore.getState().setFlag('kaminstube_crowd_rallied', true);
                useStore.getState().increaseBandMood(20);
                useStore.getState().increaseSkill('social', 3);
              }},
              { text: 'Startet mit einem dissonanten Feedback. [Chaos 7]', requiredSkill: { name: 'chaos', level: 7 }, action: () => {
                useStore.getState().setDialogue('Ein ohrenbetäubendes Fiepen zerschneidet die Stille. Die Cover-Band-Rufer verstummen in Schock. Der Rest der Halle rastet aus!');
                useStore.getState().setFlag('kaminstube_crowd_rallied', true);
                useStore.getState().increaseBandMood(25);
                useStore.getState().increaseSkill('chaos', 4);
              }},
              { text: 'Ignorieren und aufbauen.', action: () => {
                useStore.getState().setDialogue('Du ignorierst die Zwischenrufe. Die Musik wird für sich selbst sprechen.');
              }}
            ]
          });
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
