/**
 * #1: UPDATES
 * - Integrated "Talking Amp's Existential Crisis" quest in Proberaum.
 * - Integrated "Ghostly Roadie's Lost Recipe" quest in TourBus.
 * - Added Geister-Drink item combination.
 * - Added Rostiges Plektrum item.
 * - Added "Feedback-Monitor Decoding" quest in Backstage.
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
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import { Environment, Stars, Float, Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function Backstage() {
  const addToInventory = useStore((state) => state.addToInventory);
  const setDialogue = useStore((state) => state.setDialogue);
  const setScene = useStore((state) => state.setScene);
  const flags = useStore((state) => state.flags);
  const setFlag = useStore((state) => state.setFlag);
  const completeQuest = useStore((state) => state.completeQuest);
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const hasItem = useStore((state) => state.hasItem);
  const removeFromInventory = useStore((state) => state.removeFromInventory);
  const skills = useStore((state) => state.skills);
  const trait = useStore((state) => state.trait);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={1.5} color="#adff2f" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="night" />

      {/* Floor */}
      <RigidBody type="fixed">
        <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed">
        <mesh position={[0, 5, -10]}>
          <boxGeometry args={[30, 10, 1]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
        <mesh position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[20, 10, 1]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
        <mesh position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[20, 10, 1]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
      </RigidBody>

      {/* Backstage Elements */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 6, -9.4]}
          fontSize={1.5}
          color="#adff2f"
          font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff"
        >
          BACKSTAGE_ZONE
        </Text>
      </Float>

      {/* Absurd NPC: Sentient Feedback Monitor */}
      <Interactable
        position={[-6, 0.5, 4]}
        emoji="📺"
        name="Feedback-Monitor"
        onInteract={() => {
          const hasSchaltplan = hasItem('Verstärker-Schaltplan');
          
          if (flags.feedbackMonitorQuestCompleted) {
            setDialogue('Monitor: "BZZZT. Die Frequenzen sind perfekt. Danke, Manager."');
            return;
          }

          if (flags.feedbackMonitorQuestStarted && hasSchaltplan) {
            setDialogue({
              text: 'Monitor: "Du hast den Schaltplan! Kannst du meine Frequenzen optimieren?"',
              options: [
                { text: 'Optimierte Frequenzen. [Technical 5]', requiredSkill: { name: 'technical', level: 5 }, action: () => {
                    setDialogue('Monitor: "BZZZT. Exzellent. Die Verzerrung ist nun mathematisch perfekt. Danke, Manager."');
                    setFlag('feedbackMonitorQuestCompleted', true);
                    completeQuest('feedback_monitor');
                    increaseBandMood(30);
                    useStore.getState().increaseSkill('technical', 5);
                    removeFromInventory('Verstärker-Schaltplan');
                }},
                { text: 'Transzendente Frequenzen. [Visionary]', requiredTrait: 'Visionary', action: () => {
                    setDialogue('Monitor: "BZZZT. Ich sehe... die Musik der Sphären. Danke, Visionär."');
                    setFlag('feedbackMonitorQuestCompleted', true);
                    completeQuest('feedback_monitor');
                    increaseBandMood(40);
                    useStore.getState().increaseSkill('chaos', 5);
                    removeFromInventory('Verstärker-Schaltplan');
                }},
                { text: 'Standard-Frequenzen.', action: () => {
                    setDialogue('Monitor: "BZZZT. Okay, das reicht für einen Standard-Gig."');
                    setFlag('feedbackMonitorQuestCompleted', true);
                    completeQuest('feedback_monitor');
                    increaseBandMood(15);
                    removeFromInventory('Verstärker-Schaltplan');
                }}
              ]
            });
            return;
          }

          if (flags.feedbackMonitorTalked) {
            setDialogue({
              text: 'Monitor: "BZZZT. Ich habe schon tausend Sänger kommen und gehen sehen. Marius? Der klingt wie eine rostige Kreissäge in einem Mixer. BZZZT. Aber er hat... Seele. Eine sehr, sehr verzerrte Seele. Hast du den Schaltplan gefunden?"',
              options: [
                { text: 'Noch nicht.', action: () => setDialogue('Monitor: "BZZZT. Beeil dich. Das Rauschen wird lauter."') }
              ]
            });
            return;
          }

          setDialogue({
            text: 'Ein alter Feedback-Monitor flackert plötzlich auf. Er scheint... zu atmen?',
            options: [
              { text: 'Hallo?', action: () => {
                setDialogue({
                  text: 'Monitor: "BZZZT. Hallo, Fleischsack. Ich habe schon tausend Sänger kommen und gehen sehen. Marius? Der klingt wie eine rostige Kreissäge in einem Mixer. BZZZT. Aber er hat... Seele. Eine sehr, sehr verzerrte Seele. Wenn du mir hilfst, meine Frequenzen zu optimieren, helfe ich dir beim Gig in Salzgitter."',
                  options: [
                    { text: 'Wie kann ich helfen?', action: () => {
                      setDialogue('Monitor: "BZZZT. Finde den Verstärker-Schaltplan. Er ist irgendwo im Tourbus versteckt."');
                      setFlag('feedbackMonitorTalked', true);
                      setFlag('feedbackMonitorQuestStarted', true);
                      useStore.getState().addQuest('feedback_monitor', 'Finde den Verstärker-Schaltplan für den Feedback-Monitor');
                    }}
                  ]
                });
                setFlag('feedbackMonitorTalked', true);
                increaseBandMood(5);
              }},
              { text: 'Schalte dich ab.', action: () => {
                setDialogue('Monitor: "BZZZT. Ich bin unsterblich. Ich bin das Feedback, das niemals endet. BZZZT."');
              }}
            ]
          });
        }}
      />

      {/* Marius - Lampenfieber */}
      <Interactable
        position={[-4, 0, -5]}
        emoji="😰"
        name="Marius"
        isBandMember={true}
        idleType="sway"
        onInteract={() => {
          const bandMood = useStore.getState().bandMood;
          if (flags.mariusCalmed) {
            setDialogue(bandMood > 70 
              ? 'Marius: "Ich fühle mich wie ein Gott! Tangermünde wird beben! Ich spüre den Stahl in meiner Stimme!"'
              : 'Marius: "Ich bin bereit. Lass uns die Bühne abreißen! Der Lärm wird unser Zeuge sein."');
            return;
          }

          setDialogue({
            text: bandMood > 50
              ? 'Marius: "Ich bin nervös, aber die Stimmung in der Band gibt mir Kraft. Meinst du, wir schaffen das? Die Fans in Tangermünde sind... intensiv."'
              : 'Marius: "Ich... ich kann das nicht. Da draußen sind Tausende! Was wenn ich meinen Text vergesse? Was wenn die Maschinen versagen?"',
            options: [
              { 
                text: 'Du bist ein Gott am Mikrofon. Vertrau dir. [Social 5]', 
                requiredSkill: { name: 'social', level: 5 },
                action: () => {
                  setDialogue('Marius: "Ein Gott... ja. Ein Gott des Lärms! Danke, Manager. Ich werde sie alle in Grund und Boden schreien!"');
                  setFlag('mariusCalmed', true);
                  setFlag('mariusConfidenceBoost', true);
                  completeQuest('marius');
                  increaseBandMood(30);
                  useStore.getState().increaseSkill('social', 3);
                }
              },
              { 
                text: 'Ich sehe deine Vision. [Visionary]', 
                requiredTrait: 'Visionary',
                action: () => {
                  setDialogue('Marius: "Du siehst sie auch?! Die Reinheit des Schreiens... Du bist anders als die anderen Manager. Lass uns Geschichte schreiben."');
                  setFlag('mariusCalmed', true);
                  setFlag('mariusConfidenceBoost', true);
                  completeQuest('marius');
                  increaseBandMood(35);
                  useStore.getState().increaseSkill('chaos', 3);
                }
              },
              { text: 'Stell dir einfach vor, sie wären alle aus Lego.', action: () => {
                setDialogue('Marius: "Lego? Das macht es irgendwie... schmerzhafter? Aber okay, ich versuchs. Wenn ich drauftrete, schreie ich wenigstens authentisch."');
                setFlag('mariusCalmed', true);
                completeQuest('marius');
                increaseBandMood(10);
              }},
              { text: 'Denk an den Gig 1982. Wir haben Schlimmeres überlebt.', action: () => {
                if (flags.askedAbout1982) {
                  setDialogue('Marius: "1982... ja. Als die Gießerei bebte. Wenn wir das überlebt haben, ist Tangermünde ein Kinderspiel. Danke für die Erinnerung."');
                  setFlag('mariusCalmed', true);
                  setFlag('mariusConfidenceBoost', true);
                  completeQuest('marius');
                  increaseBandMood(25);
                } else {
                  setDialogue('Marius: "1982? Da war ich noch nicht mal in der Band. Wovon redest du? Das macht mich nur noch nervöser!"');
                  increaseBandMood(-5);
                }
              }},
              { text: 'Wenn du versagst, verkaufe ich dein Equipment.', action: () => {
                setDialogue('Marius: "WAS?! Du Monster! Mein Vintage-Mikrofon?! Okay, ich geh ja schon. Aus purem Trotz und Angst um mein Gear!"');
                setFlag('mariusCalmed', true);
                completeQuest('marius');
                increaseBandMood(-5);
              }}
            ]
          });
        }}
      />

      {/* Lars - Needs Energy */}
      <Interactable
        position={[4, 0, -5]}
        emoji="🥁"
        name="Lars"
        isBandMember={true}
        idleType="tap"
        onInteract={() => {
          const hasTurbo = hasItem('Turbo-Koffein');
          if (flags.larsEnergized) {
            setDialogue(flags.larsVibrating 
              ? 'Lars: "ICH SEHE DIE ZEIT! SIE IST GELB! UND SIE SCHLÄGT IM 4/4 TAKT!"'
              : 'Lars: "VOLLGAS! Ich spüre die Farben der Musik!"');
          } else if (hasTurbo) {
            setDialogue({
              text: 'Lars: "WAS IST DAS?! Turbo-Koffein?! Gib her, ich will die Schallmauer durchbrechen!"',
              options: [
                { text: 'Trink es auf Ex!', action: () => {
                  setDialogue('Lars: "ICH BIN EIN BLITZ! ICH BIN DER DONNER! MEINE HÄNDE VIBRIEREN SO SCHNELL, DASS ICH DURCH WÄNDE GEHEN KANN!"');
                  removeFromInventory('Turbo-Koffein');
                  setFlag('larsEnergized', true);
                  setFlag('larsVibrating', true);
                  increaseBandMood(40);
                }},
                { text: 'Nur einen Schluck.', action: () => {
                  setDialogue('Lars: "Nur einen Schluck? Bist du wahnsinnig? Das Zeug ist wie Raketentreibstoff! ... Okay, ich fühl mich schon besser."');
                  removeFromInventory('Turbo-Koffein');
                  setFlag('larsEnergized', true);
                  increaseBandMood(20);
                }}
              ]
            });
          } else if (hasItem('Energiedrink')) {
            setDialogue('Lars: "JA! Das ist der Treibstoff, den ich brauche! Nicht so gut wie Turbo-Koffein, aber es reicht."');
            setFlag('larsEnergized', true);
            increaseBandMood(10);
          } else {
            setDialogue('Lars: "Ich bin total platt. Ohne Koffein geht hier gar nichts. Hast du was Stärkeres als Wasser?"');
          }
        }}
      />

      {/* Items */}
      {!flags.setlistFound && (
        <Interactable
          position={[0, 0, -2]}
          emoji="📜"
          name="Setliste"
          onInteract={() => {
            addToInventory('Setliste');
            setFlag('setlistFound', true);
            completeQuest('setlist');
            setDialogue('Du hast die Setliste gefunden. Die Reihenfolge der Songs ist... gewagt.');
          }}
        />
      )}

      <Interactable
        position={[-8, 0, 2]}
        emoji="🥤"
        name="Energiedrink"
        onInteract={() => {
          addToInventory('Energiedrink');
          setDialogue('Ein "Liquid Thunder" Energiedrink. Enthält genug Taurin, um ein kleines Kraftwerk zu betreiben.');
        }}
      />

      <Interactable
        position={[8, 0, 2]}
        emoji="🖊️"
        name="Stift"
        onInteract={() => {
          addToInventory('Stift');
          setDialogue('Ein wasserfester Edding. Perfekt für Autogramme auf verschwitzten T-Shirts oder um "NEUROTOXIC" auf fremde Tourbusse zu schreiben.');
        }}
      />

      {!hasItem('Lötkolben') && (
        <Interactable
          position={[12, 0, -5]}
          emoji="🔌"
          name="Lötkolben"
          scale={0.8}
          onInteract={() => {
            addToInventory('Lötkolben');
            setDialogue('Ein heißer Lötkolben. Vorsicht, nicht die Finger verbrennen!');
          }}
        />
      )}

      <Interactable
        position={[-10, 0, 5]}
        emoji="🕯️"
        name="Ritual-Kreis"
        onInteract={() => {
          const hasForbiddenRiff = hasItem('Verbotenes Riff');
          const hasPlasmaZunder = hasItem('Plasma-Zünder');
          
          if (hasPlasmaZunder) {
            setDialogue('Du benutzt den Plasma-Zünder. Die Kerzen flammen in einem unnatürlichen Blau auf! Marius: "WOAH! Das ist die krasseste Pyro, die wir je hatten! Ich bin bereit!"');
            increaseBandMood(30);
            removeFromInventory('Plasma-Zünder');
            return;
          }

          if (hasForbiddenRiff) {
            setDialogue('Der Ritual-Kreis beginnt schwarz zu leuchten, als du dich mit dem Verbotenen Riff näherst. Marius: "Spürst du das? Die Ahnen des Industrial Metal rufen uns!"');
            increaseBandMood(15);
          } else {
            setDialogue('Ein Kreis aus schwarzen Kerzen und zerbrochenen Plektren. Manager: "Wirklich? Vor jedem Auftritt?" Marius: "Es hilft gegen das Lampenfieber!"');
            increaseBandMood(5);
          }
        }}
      />

      {/* Exit to VoidStation */}
      <Interactable
        position={[0, 0, 8]}
        emoji="🌀"
        name="Zur Realitäts-Grenze"
        onInteract={() => {
          if (flags.mariusCalmed && flags.setlistFound) {
            setDialogue('Die Welt beginnt zu flimmern. Wir verlassen die bekannte Realität.');
            setScene('void_station');
          } else {
            setDialogue('Wir können noch nicht raus. Marius braucht Hilfe und die Setliste fehlt!');
          }
        }}
      />

      <Player bounds={{ x: [-14, 14], z: [-9, 9] }} />
    </>
  );
}
