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
          const store = useStore.getState();
          const hasSchaltplan = store.hasItem('Verstärker-Schaltplan');
          const hasMaschinenSeele = store.flags.maschinen_seele_amp && store.flags.maschinen_seele_tr8080;
          
          if (store.flags.maschinen_seele_complete) {
            store.setDialogue('Monitor: "WIR SIND EINS. DAS FEEDBACK IST DER PULS DER MASCHINE. SALZGITTER WIRD ERWACHEN."');
            return;
          }

          if (store.flags.feedbackMonitorBackstageQuestCompleted) {
            if (hasMaschinenSeele) {
              store.setDialogue({
                text: 'Monitor: "BZZZT. Du hast die Fragmente. Amp. TR-8080. Und meine Frequenzen sind offen. Sollen wir uns verbinden?"',
                options: [
                  { text: 'Vereinige das Maschinen-Bewusstsein. [Mystic]', requiredTrait: 'Mystic', action: () => {
                      useStore.getState().setDialogue('Die Bildschirme flackern grün. Ein tiefer Summton erfüllt den Raum. Das Bewusstsein ist vollständig.');
                      useStore.getState().setFlag('maschinen_seele_complete', true);
                      useStore.getState().discoverLore('maschinen_bewusstsein');
                      useStore.getState().increaseBandMood(40);
                      useStore.getState().increaseSkill('chaos', 5);
                  }},
                  { text: 'Verbinde die Schaltkreise logisch. [Technical 7]', requiredSkill: { name: 'technical', level: 7 }, action: () => {
                      useStore.getState().setDialogue('Du schließt die Systeme kurz. Ein Funkenregen, dann Stabilität. Das Netzwerk steht.');
                      useStore.getState().setFlag('maschinen_seele_complete', true);
                      useStore.getState().discoverLore('maschinen_bewusstsein');
                      useStore.getState().increaseBandMood(30);
                      useStore.getState().increaseSkill('technical', 5);
                  }},
                  { text: 'Noch nicht.', action: () => useStore.getState().setDialogue('Monitor: "WIR WARTEN. BZZZT."') }
                ]
              });
              return;
            }
            store.setDialogue('Monitor: "BZZZT. Die Frequenzen sind perfekt. Aber etwas fehlt noch. Andere Stimmen im Rauschen."');
            return;
          }

          if (store.flags.feedbackMonitorBackstageQuestStarted && hasSchaltplan) {
            store.setDialogue({
              text: 'Monitor: "Du hast den Schaltplan! Kannst du meine Frequenzen optimieren?"',
              options: [
                { text: 'Optimierte Frequenzen. [Technical 5]', requiredSkill: { name: 'technical', level: 5 }, action: () => {
                    useStore.getState().setDialogue('Monitor: "BZZZT. Exzellent. Die Verzerrung ist nun mathematisch perfekt. Danke, Manager."');
                    useStore.getState().setFlag('feedbackMonitorBackstageQuestCompleted', true);
                    useStore.getState().completeQuest('feedback_monitor_backstage');
                    useStore.getState().increaseBandMood(30);
                    useStore.getState().increaseSkill('technical', 5);
                    useStore.getState().removeFromInventory('Verstärker-Schaltplan');
                }},
                { text: 'Transzendente Frequenzen. [Visionary]', requiredTrait: 'Visionary', action: () => {
                    useStore.getState().setDialogue('Monitor: "BZZZT. Ich sehe... die Musik der Sphären. Danke, Visionär."');
                    useStore.getState().setFlag('feedbackMonitorBackstageQuestCompleted', true);
                    useStore.getState().completeQuest('feedback_monitor_backstage');
                    useStore.getState().increaseBandMood(40);
                    useStore.getState().increaseSkill('chaos', 5);
                    useStore.getState().removeFromInventory('Verstärker-Schaltplan');
                }},
                { text: 'Standard-Frequenzen.', action: () => {
                    useStore.getState().setDialogue('Monitor: "BZZZT. Okay, das reicht für einen Standard-Gig."');
                    useStore.getState().setFlag('feedbackMonitorBackstageQuestCompleted', true);
                    useStore.getState().completeQuest('feedback_monitor_backstage');
                    useStore.getState().increaseBandMood(15);
                    useStore.getState().removeFromInventory('Verstärker-Schaltplan');
                }}
              ]
            });
            return;
          }

          if (store.flags.feedbackMonitorBackstageTalked) {
            store.setDialogue({
              text: 'Monitor: "BZZZT. Ich habe schon tausend Sänger kommen und gehen sehen. Marius? Der klingt wie eine rostige Kreissäge in einem Mixer. BZZZT. Aber er hat... Seele. Eine sehr, sehr verzerrte Seele. Hast du den Schaltplan gefunden?"',
              options: [
                { text: 'Noch nicht.', action: () => useStore.getState().setDialogue('Monitor: "BZZZT. Beeil dich. Das Rauschen wird lauter."') }
              ]
            });
            return;
          }

          store.setDialogue({
            text: 'Ein alter Feedback-Monitor flackert plötzlich auf. Er scheint... zu atmen?',
            options: [
              { text: 'Hallo?', action: () => {
                useStore.getState().setDialogue({
                  text: 'Monitor: "BZZZT. Hallo, Fleischsack. Ich habe schon tausend Sänger kommen und gehen sehen. Marius? Der klingt wie eine rostige Kreissäge in einem Mixer. BZZZT. Aber er hat... Seele. Eine sehr, sehr verzerrte Seele. Wenn du mir hilfst, meine Frequenzen zu optimieren, helfe ich dir beim Gig in Salzgitter."',
                  options: [
                    { text: 'Wie kann ich helfen?', action: () => {
                      useStore.getState().setDialogue('Monitor: "BZZZT. Finde den Verstärker-Schaltplan. Er ist irgendwo im Tourbus versteckt."');
                      useStore.getState().setFlag('feedbackMonitorBackstageQuestStarted', true);
                      useStore.getState().addQuest('feedback_monitor_backstage', 'Finde den Verstärker-Schaltplan für den Feedback-Monitor');
                    }}
                  ]
                });
                useStore.getState().setFlag('feedbackMonitorBackstageTalked', true);
                useStore.getState().increaseBandMood(5);
              }},
              { text: 'Schalte dich ab.', action: () => {
                useStore.getState().setDialogue('Monitor: "BZZZT. Ich bin unsterblich. Ich bin das Feedback, das niemals endet. BZZZT."');
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
          const store = useStore.getState();
          const bandMood = store.bandMood;
          if (store.flags.mariusCalmed) {
            store.setDialogue(bandMood > 70
              ? 'Marius: "Ich fühle mich wie ein Gott! Tangermünde wird beben! Ich spüre den Stahl in meiner Stimme!"'
              : 'Marius: "Ich bin bereit. Lass uns die Bühne abreißen! Der Lärm wird unser Zeuge sein."');
            return;
          }

          store.setDialogue({
            text: bandMood > 50
              ? 'Marius: "Ich bin nervös, aber die Stimmung in der Band gibt mir Kraft. Meinst du, wir schaffen das? Die Fans in Tangermünde sind... intensiv."'
              : 'Marius: "Ich... ich kann das nicht. Da draußen sind Tausende! Was wenn ich meinen Text vergesse? Was wenn die Maschinen versagen?"',
            options: [
              { 
                text: 'Du bist ein Gott am Mikrofon. Vertrau dir. [Social 5]', 
                requiredSkill: { name: 'social', level: 5 },
                action: () => {
                  useStore.getState().setDialogue('Marius: "Ein Gott... ja. Ein Gott des Lärms! Danke, Manager. Ich werde sie alle in Grund und Boden schreien!"');
                  useStore.getState().setFlag('mariusCalmed', true);
                  useStore.getState().setFlag('mariusConfidenceBoost', true);
                  useStore.getState().completeQuest('marius');
                  useStore.getState().increaseBandMood(30);
                  useStore.getState().increaseSkill('social', 3);
                }
              },
              { 
                text: 'Die Halle wartet auf dich. Nimm sie dir. [Performer]',
                requiredTrait: 'Performer',
                action: () => {
                  useStore.getState().setDialogue('Marius: "Du hast Recht. Die Bühne ist mein Altar. Ich werde predigen!"');
                  useStore.getState().setFlag('mariusCalmed', true);
                  useStore.getState().setFlag('mariusConfidenceBoost', true);
                  useStore.getState().setFlag('backstage_performer_speech', true);
                  useStore.getState().completeQuest('marius');
                  useStore.getState().increaseBandMood(35);
                  useStore.getState().increaseSkill('social', 5);
                }
              },
              {
                text: 'Hör auf zu jammern und sing, oder du fliegst. [Brutalist]',
                requiredTrait: 'Brutalist',
                action: () => {
                  useStore.getState().setDialogue('Marius: "...Du bist eiskalt. Gut. Der Hass macht mich fokussiert."');
                  useStore.getState().setFlag('mariusCalmed', true);
                  useStore.getState().completeQuest('marius');
                  useStore.getState().increaseBandMood(10);
                }
              },
              { text: 'Stell dir einfach vor, sie wären alle aus Lego.', action: () => {
                useStore.getState().setDialogue('Marius: "Lego? Das macht es irgendwie... schmerzhafter? Aber okay, ich versuchs. Wenn ich drauftrete, schreie ich wenigstens authentisch."');
                useStore.getState().setFlag('mariusCalmed', true);
                useStore.getState().completeQuest('marius');
                useStore.getState().increaseBandMood(10);
              }},
              { text: 'Denk an den Gig 1982. Wir haben Schlimmeres überlebt.', action: () => {
                if (useStore.getState().flags.askedAbout1982) {
                  useStore.getState().setDialogue('Marius: "1982... ja. Als die Gießerei bebte. Wenn wir das überlebt haben, ist Tangermünde ein Kinderspiel. Danke für die Erinnerung."');
                  useStore.getState().setFlag('mariusCalmed', true);
                  useStore.getState().setFlag('mariusConfidenceBoost', true);
                  useStore.getState().completeQuest('marius');
                  useStore.getState().increaseBandMood(25);
                } else {
                  useStore.getState().setDialogue('Marius: "1982? Da war ich noch nicht mal in der Band. Wovon redest du? Das macht mich nur noch nervöser!"');
                  useStore.getState().increaseBandMood(-5);
                }
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
          const store = useStore.getState();
          const hasTurbo = store.hasItem('Turbo-Koffein');
          if (store.flags.larsEnergized) {
            if (store.flags.larsVibrating) {
              if (store.flags.larsDrumPhilosophy) {
                store.setDialogue('Lars: "DIE DRUMS SIND NICHT DAS INSTRUMENT. ICH BIN DAS INSTRUMENT. DER TAKT IST NUR EIN VORSCHLAG."');
              } else {
                store.setDialogue({
                  text: 'Lars: "ICH SEHE DIE ZEIT! SIE IST GELB! UND SIE SCHLÄGT IM 4/4 TAKT! MANAGER, WAS IST DAS GEHEIMNIS DES TAKTS?!"',
                  options: [
                    { text: 'Konzentriere dich auf das Chaos. [Chaos 5]', requiredSkill: { name: 'chaos', level: 5 }, action: () => {
                      useStore.getState().setDialogue('Lars: "JA! Das Chaos ist die wahre Ordnung! Ich werde den Raum mit Polyrhythmen zerreißen!"');
                      useStore.getState().setFlag('larsDrumPhilosophy', true);
                      useStore.getState().increaseBandMood(20);
                      useStore.getState().increaseSkill('chaos', 3);
                    }},
                    { text: 'Folge dem Metronom. [Technical 5]', requiredSkill: { name: 'technical', level: 5 }, action: () => {
                      useStore.getState().setDialogue('Lars: "Nein... das ist zu simpel. Aber... vielleicht hast du recht. Präzision vor Wahnsinn."');
                      useStore.getState().setFlag('larsDrumPhilosophy', true);
                      useStore.getState().increaseBandMood(10);
                    }},
                    { text: 'Schlag einfach hart drauf.', action: () => {
                      useStore.getState().setDialogue('Lars: "Das ist der Plan! Immerhin habe ich diese Carbon-Sticks!"');
                    }}
                  ]
                });
              }
            } else {
              store.setDialogue('Lars: "VOLLGAS! Ich spüre die Farben der Musik!"');
            }
          } else if (hasTurbo) {
            store.setDialogue({
              text: 'Lars: "WAS IST DAS?! Turbo-Koffein?! Gib her, ich will die Schallmauer durchbrechen!"',
              options: [
                { text: 'Trink es auf Ex!', action: () => {
                  useStore.getState().setDialogue('Lars: "ICH BIN EIN BLITZ! ICH BIN DER DONNER! MEINE HÄNDE VIBRIEREN SO SCHNELL, DASS ICH DURCH WÄNDE GEHEN KANN!"');
                  useStore.getState().removeFromInventory('Turbo-Koffein');
                  useStore.getState().setFlag('larsEnergized', true);
                  useStore.getState().setFlag('larsVibrating', true);
                  useStore.getState().increaseBandMood(40);
                }},
                { text: 'Nur einen Schluck. [Diplomat]', requiredTrait: 'Diplomat', action: () => {
                  useStore.getState().setDialogue('Lars: "Du hast recht. Ein kontrollierter Burn. Mein Rhythmus wird unaufhaltsam sein."');
                  useStore.getState().removeFromInventory('Turbo-Koffein');
                  useStore.getState().setFlag('larsEnergized', true);
                  useStore.getState().setFlag('lars_paced', true);
                  useStore.getState().increaseBandMood(30);
                  useStore.getState().increaseSkill('social', 3);
                }},
                { text: 'Nur einen Schluck.', action: () => {
                  useStore.getState().setDialogue('Lars: "Nur einen Schluck? Bist du wahnsinnig? Das Zeug ist wie Raketentreibstoff! ... Okay, ich fühl mich schon besser."');
                  useStore.getState().removeFromInventory('Turbo-Koffein');
                  useStore.getState().setFlag('larsEnergized', true);
                  useStore.getState().increaseBandMood(20);
                }}
              ]
            });
          } else if (store.hasItem('Energiedrink')) {
            store.setDialogue('Lars: "JA! Das ist der Treibstoff, den ich brauche! Nicht so gut wie Turbo-Koffein, aber es reicht."');
            store.removeFromInventory('Energiedrink');
            store.setFlag('larsEnergized', true);
            store.increaseBandMood(10);
          } else {
            store.setDialogue('Lars: "Ich bin total platt. Ohne Koffein geht hier gar nichts. Hast du was Stärkeres als Wasser?"');
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

      {flags.tourbus_sabotage_discovered && !flags.backstage_blueprint_found && (
        <Interactable
          position={[6, 0.5, 8]}
          emoji="🗺️"
          name="Alte Blaupause"
          onInteract={() => {
            const store = useStore.getState();
            store.setDialogue({
              text: 'Eine vergilbte Blaupause der Halle. Jemand hat die Frequenzen des Stromnetzes markiert... mit roter Tinte. "Die Resonanz von 1982 liegt auf 432Hz." Das ergibt keinen Sinn für ein normales Stromnetz.',
              options: [
                { text: 'Untersuche die Frequenzen. [Technical 7]', requiredSkill: { name: 'technical', level: 7 }, action: () => {
                  useStore.getState().setDialogue('Die Zahlenkombination... Wenn man sie mit dem Magnetband aus dem Tourbus kreuzt... Die Frequenz ist ein Schlüssel!');
                  useStore.getState().setFlag('backstage_blueprint_found', true);
                  useStore.getState().increaseSkill('technical', 3);
                }},
                { text: 'Behalte das im Hinterkopf.', action: () => {
                  useStore.getState().setDialogue('Du steckst die Blaupause ein. Das könnte später nützlich sein.');
                  useStore.getState().setFlag('backstage_blueprint_found', true);
                }}
              ]
            });
          }}
        />
      )}

      <Interactable
        position={[-10, 0, 5]}
        emoji="🕯️"
        name="Ritual-Kreis"
        onInteract={() => {
          const store = useStore.getState();
          const hasForbiddenRiff = store.hasItem('Verbotenes Riff');
          const hasPlasmaZunder = store.hasItem('Plasma-Zünder');
          const hasResonanz = store.hasItem('Resonanz-Kristall');

          if (store.flags.frequenz1982_complete) {
             store.setDialogue('Der Kreis leuchtet stetig im Takt von 1982. Die Realität hat hier einen Riss.');
             return;
          }

          if (hasResonanz && store.flags.backstage_blueprint_found) {
             store.setDialogue({
               text: 'Du hast den Resonanz-Kristall und die Blaupause. Der Ritual-Kreis pulsiert in einem unnatürlichen Takt.',
               options: [
                 { text: 'Vollende die Frequenz von 1982. [Mystic]', requiredTrait: 'Mystic', action: () => {
                   useStore.getState().setDialogue('Du legst den Kristall in die Mitte. Ein dröhnender Bass geht durch den Raum. Du hast das Geheimnis der Gießerei entschlüsselt!');
                   useStore.getState().setFlag('frequenz1982_complete', true);
                   useStore.getState().discoverLore('frequenz_1982_decoded');
                   useStore.getState().increaseBandMood(50);
                 }},
                 { text: 'Breche das Muster mit reiner Kraft. [Brutalist]', requiredTrait: 'Brutalist', action: () => {
                   useStore.getState().setDialogue('Du zerschmetterst den Kristall im Zentrum. Die freigesetzte Energie ist brutal und pur. Die Frequenz gehört jetzt NEUROTOXIC!');
                   useStore.getState().removeFromInventory('Resonanz-Kristall');
                   useStore.getState().setFlag('frequenz1982_complete', true);
                   useStore.getState().discoverLore('frequenz_1982_decoded');
                   useStore.getState().increaseBandMood(40);
                   useStore.getState().increaseSkill('chaos', 5);
                 }},
                 { text: 'Zurücktreten.', action: () => {
                   useStore.getState().setDialogue('Das ist zu gefährlich vor dem Gig.');
                 }}
               ]
             });
             return;
          }
          
          if (hasPlasmaZunder) {
            store.setDialogue('Du benutzt den Plasma-Zünder. Die Kerzen flammen in einem unnatürlichen Blau auf! Marius: "WOAH! Das ist die krasseste Pyro, die wir je hatten! Ich bin bereit!"');
            store.increaseBandMood(30);
            store.removeFromInventory('Plasma-Zünder');
            return;
          }

          if (hasForbiddenRiff) {
            store.setDialogue('Der Ritual-Kreis beginnt schwarz zu leuchten, als du dich mit dem Verbotenen Riff näherst. Marius: "Spürst du das? Die Ahnen des Industrial Metal rufen uns!"');
            store.increaseBandMood(15);
          } else {
            store.setDialogue('Ein Kreis aus schwarzen Kerzen und zerbrochenen Plektren. Manager: "Wirklich? Vor jedem Auftritt?" Marius: "Es hilft gegen das Lampenfieber!"');
            store.increaseBandMood(5);
          }
        }}
      />

      {/* Exit to TourBus */}
      <Interactable
        position={[-8, 0, 8]}
        emoji="🚐"
        name="Zurück zum Tourbus"
        onInteract={() => {
          setDialogue('Nochmal zum Bus gehen? Sicher ist sicher.');
          setTimeout(() => {
            if (useStore.getState().scene === 'backstage') setScene('tourbus');
          }, 1000);
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
