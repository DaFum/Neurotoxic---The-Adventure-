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
import { useStore } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import { Environment, Float, Text, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function VoidStation() {
  const addToInventory = useStore((state) => state.addToInventory);
  const setDialogue = useStore((state) => state.setDialogue);
  const setScene = useStore((state) => state.setScene);
  const flags = useStore((state) => state.flags);
  const setFlag = useStore((state) => state.setFlag);
  const addQuest = useStore((state) => state.addQuest);
  const completeQuest = useStore((state) => state.completeQuest);
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const hasItem = useStore((state) => state.hasItem);
  const discoverLore = useStore((state) => state.discoverLore);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#ff00ff" />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
      <Environment preset="night" />

      {/* Surreal Floor */}
      <RigidBody type="fixed">
        <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshDistortMaterial 
            color="#050505" 
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
          <meshStandardMaterial color="#adff2f" emissive="#adff2f" emissiveIntensity={2} />
        </mesh>
      </Float>
      <Float speed={4} rotationIntensity={3} floatIntensity={1}>
        <mesh position={[10, 3, -5]}>
          <octahedronGeometry args={[2]} />
          <MeshWobbleMaterial color="#ff00ff" speed={5} factor={2} />
        </mesh>
      </Float>

      {/* The Cosmic Attendant */}
      <Interactable
        position={[0, 0, -5]}
        emoji="👁️"
        name="Kosmischer Tankwart"
        scale={2}
        onInteract={() => {
          const bandMood = useStore.getState().bandMood;
          const hasForbiddenRiff = hasItem('Verbotenes Riff');
          const hasTalisman = hasItem('Industrie-Talisman');
          const trait = useStore.getState().trait;

          if (flags.tankwartPhilosophy) {
            setDialogue('Tankwart: "Die Zeit ist nur ein Loop in einem kaputten Tape-Deck. Spielt weiter."');
            return;
          }

          if (trait === 'Mystic') {
            setDialogue({
              text: 'Tankwart: "Deine Aura... sie schwingt in Frequenzen, die ich seit Äonen nicht mehr gespürt habe. Du bist ein Wanderer zwischen den Welten. Was suchst du in der Leere?"',
              options: [
                { text: 'Ich suche die Wahrheit.', action: () => {
                  setDialogue('Tankwart: "Die Wahrheit ist ein Riff, das niemals endet. Hier, nimm diesen Splitter der Leere. Er wird dir helfen, das Verbotene Riff zu verstehen."');
                  addToInventory('Splitter der Leere');
                  setFlag('tankwartPhilosophy', true);
                  increaseBandMood(30);
                }}
              ]
            });
            return;
          }

          if (hasTalisman && !flags.tankwartPhilosophy) {
            setDialogue({
              text: 'Tankwart: "Dieser Talisman... er ist ein Fragment der Ur-Maschine. Er vibriert mit der Frequenz der Schöpfung. Willst du die Wahrheit über den Lärm hören?"',
              options: [
                { text: 'Ja, lehre mich.', action: () => {
                  discoverLore('tankwart_truth');
                  setDialogue('Tankwart: "Lärm ist nicht das Chaos. Lärm ist die Ordnung, die wir noch nicht verstehen. Jedes Feedback ist ein Gebet an die Leere. In Salzgitter werdet ihr die Antwort finden."');
                  setFlag('tankwartPhilosophy', true);
                  increaseBandMood(20);
                }},
                { text: 'Ich will nur den Gig spielen.', action: () => {
                  setDialogue('Tankwart: "So begrenzt. Aber okay. Die Leere braucht auch Handwerker."');
                  increaseBandMood(5);
                }}
              ]
            });
            return;
          }

          if (hasForbiddenRiff && !flags.tankwartReactedToRiff) {
            setDialogue({
              text: 'Tankwart: "Dieses Riff... es ist der Schlüssel zum Ende der Zeit. Es wurde vor Äonen von den ersten Maschinen-Göttern in den Stahl geätzt. Bist du bereit für die Konsequenzen?"',
              options: [
                { text: 'Ich bin bereit.', action: () => {
                  setDialogue('Tankwart: "Spielt es laut, spielt es stolz. Die Leere wartet auf diesen Akkord. Er wird die Sterne zum Erlöschen bringen."');
                  setFlag('tankwartReactedToRiff', true);
                  increaseBandMood(15);
                }},
                { text: 'Was für Konsequenzen?', action: () => {
                  setDialogue('Tankwart: "Die Realität wird sich biegen, die Fans werden zu Schatten. Ein kleiner Preis für den perfekten Gig."');
                }}
              ]
            });
            return;
          }

          if (flags.voidRefueled) {
            setDialogue(bandMood > 60 
              ? 'Tankwart: "Eure Aura strahlt heller als eine Supernova. Der Gig wird die Galaxie erschüttern. Die Kaminstube ist bereit für die Transzendenz."'
              : 'Tankwart: "Die Leere ist gesättigt. Eure Reise durch den Lärm kann fortgesetzt werden. Vergesst nicht: Stille ist der Feind."');
          } else if (hasItem('Dunkle Materie')) {
            const hasKristall = useStore.getState().hasItem('Resonanz-Kristall');
            const options = [
              { text: '440Hz - Standard Industrial Power.', action: () => {
                useStore.getState().setDialogue('Tankwart: "Eine solide Wahl. Der Lärm wird mächtig sein und die Wände der Realität einreißen."');
                useStore.getState().removeFromInventory('Dunkle Materie');
                useStore.getState().setFlag('voidRefueled', true);
                useStore.getState().completeQuest('void');
                useStore.getState().increaseBandMood(25);
              }},
              { text: '432Hz - Wir wollen die Chakren der Fans öffnen.', action: () => {
                useStore.getState().setDialogue('Tankwart: "Interessant. Die Fans werden verwirrt sein, aber ihre Seelen werden im Takt des Universums schwingen."');
                useStore.getState().removeFromInventory('Dunkle Materie');
                useStore.getState().setFlag('voidRefueled', true);
                useStore.getState().completeQuest('void');
                useStore.getState().increaseBandMood(10);
              }}
            ];

            if (hasKristall) {
              const mysticOption: any = { text: 'Betanke ihn mit der Frequenz des Resonanz-Kristalls. [Mystic]', requiredTrait: 'Mystic', action: () => {
                useStore.getState().setDialogue('Tankwart: "Die Frequenz von 1982... Du hast sie gefunden! Der Van wird nicht fahren, er wird DURCH die Realität schneiden. Salzgitter wird niemals wieder dasselbe sein."');
                useStore.getState().removeFromInventory('Dunkle Materie');
                useStore.getState().setFlag('voidRefueled', true);
                useStore.getState().setFlag('tankwart_fuel_quest_started', true); // Reusing as a marker for the special fuel
                useStore.getState().completeQuest('void');
                useStore.getState().increaseBandMood(40);
              }};
              options.push(mysticOption);
            }

            useStore.getState().setDialogue({
              text: 'Tankwart: "Ah, die Essenz des Nichts. Dunkle Materie ist der Treibstoff der Träume, die wir nie zu träumen wagten. Soll ich den Van mit 440Hz-Vibrationen oder 432Hz-Heilfrequenzen betanken?"',
              options: options as any[]
            });
          } else {
            setDialogue({
              text: bandMood < 30 
                ? 'Tankwart: "Eure Seelen sind so leer wie mein Tank. Findet Dunkle Materie, bevor ihr in der Bedeutungslosigkeit verblasst. Diese Station existiert nur für jene mit wahrem Lärm im Herzen."'
                : 'Tankwart: "Willkommen an der Station zwischen den Takten. Hier wird die Zeit gedehnt und der Schall zur Materie. Der Van benötigt Dunkle Materie, um die Realität zu durchbrechen. Was suchst du hier wirklich?"',
              options: [
                { text: 'Nur Treibstoff für den Gig.', action: () => setDialogue('Tankwart: "So pragmatisch. Sucht in den Ecken der Existenz, wo das Licht sich krümmt."') },
                { text: 'Die Antwort auf das ultimative Riff.', action: () => {
                  setDialogue('Tankwart: "Das Riff ist in dir... und in der Pfütze im Proberaum, die seit 1982 niemals getrocknet ist."');
                  increaseBandMood(5);
                }},
                {
                  text: 'Das kosmische Echo hat mir etwas gezeigt. [cosmic_echo complete]',
                  questDependencies: ['cosmic_echo'],
                  action: () => {
                    discoverLore('cosmic_echo_decoded');
                    setDialogue('Tankwart: "Das Echo... du hast es entschlüsselt. Dann weißt du, was in Salzgitter passieren wird. Die Koordinaten sind nicht nur ein Ort — sie sind ein Zeitpunkt. Ihr spielt am Ende aller Dinge."');
                    increaseBandMood(15);
                    setFlag('tankwartPhilosophy', true);
                  }
                }
              ]
            });
          }
        }}
      />

      {/* Lore Snippet: Floating Terminal */}
      <Interactable
        position={[-8, 2, -2]}
        emoji="📟"
        name="Altes Terminal"
        onInteract={() => {
          discoverLore('void_1982');
          setDialogue('Ein flackerndes Terminal zeigt Logbucheinträge einer vergessenen Tour von 1982. Log: "Tag 44. Der Bassist ist in die 4. Dimension gefallen. Der Sound ist jetzt viel klarer. Wir haben die Kaminstube erreicht. Die Fans bestehen aus reinem Feedback."');
          increaseBandMood(5);
        }}
      />

      {/* Quest: Cosmic Echo */}
      {!flags.cosmic_echo && (
        <Interactable
          position={[-5, 2, 5]}
          emoji="🌌"
          name="Kosmisches Echo"
          onInteract={() => {
            setDialogue({
              text: 'Du hörst ein Flüstern aus der Leere. Es klingt wie eine alte NEUROTOXIC-Aufnahme, die rückwärts abgespielt wird.',
              options: [
                { 
                  text: 'Versuche, die Nachricht zu entschlüsseln. [Visionary]', 
                  requiredTrait: 'Visionary',
                  action: () => {
                    discoverLore('cosmic_echo_decoded');
                    setDialogue('Du erkennst ein Muster in der Verzerrung. Es ist ein Koordinaten-Code für Salzgitter! Du hast das Echo entschlüsselt.');
                    setFlag('cosmic_echo', true);
                    completeQuest('cosmic_echo');
                    increaseBandMood(20);
                  }
                },
                { text: 'Ignoriere das Flüstern.', action: () => setDialogue('Es ist nur das Rauschen der Leere.') }
              ]
            });
            addQuest('cosmic_echo', 'Untersuche das kosmische Echo in der Void Station');
          }}
        />
      )}

      {flags.bassist_clue_matze && flags.bassist_clue_ghost && !flags.bassist_contacted && (
        <Interactable
          position={[-12, 4, 12]}
          emoji="👻"
          name="Schwebender Bassist"
          onInteract={() => {
            const store = useStore.getState();
            store.setDialogue({
              text: 'Eine geisterhafte Gestalt zupft an einem vier-saitigen Instrument aus purer Energie. Bassist: "Die Frequenz... sie ist hier so laut. Ich kann nicht zurück."',
              options: [
                { text: 'Die Band braucht dich. [Social 8]', requiredSkill: { name: 'social', level: 8 }, action: () => {
                  useStore.getState().setDialogue('Bassist: "Sie brauchen mich? Nach all der Zeit? Ich... ich spüre den Groove wieder. Sag ihnen, ich bin bereit. Für das eine, wahre Riff."');
                  useStore.getState().setFlag('bassist_contacted', true);
                  useStore.getState().increaseBandMood(40);
                  useStore.getState().discoverLore('bassist_wahrheit');
                  useStore.getState().increaseSkill('social', 3);
                }},
                { text: 'Du hängst in einer Rückkopplungsschleife fest. [Technical 10]', requiredSkill: { name: 'technical', level: 10 }, action: () => {
                  useStore.getState().setDialogue('Du justierst die Phasenverschiebung in der Umgebung des Bassisten. Bassist: "Die Dissonanz ist weg! Ich höre den Grundton wieder! Wir sehen uns in Salzgitter!"');
                  useStore.getState().setFlag('bassist_contacted', true);
                  useStore.getState().increaseBandMood(50);
                  useStore.getState().discoverLore('bassist_wahrheit');
                  useStore.getState().increaseSkill('technical', 3);
                }},
                { text: 'Lass dich von der Leere tragen. [Mystic]', requiredTrait: 'Mystic', action: () => {
                  useStore.getState().setDialogue('Bassist: "Du hast recht. Ich muss nicht in den Körper zurück, ich muss nur in den Song zurück. Der Bass ist überall."');
                  useStore.getState().setFlag('bassist_contacted', true);
                  useStore.getState().increaseBandMood(40);
                  useStore.getState().discoverLore('bassist_wahrheit');
                  useStore.getState().increaseSkill('chaos', 3);
                }},
                { text: 'Ich lass dich besser in Ruhe.', action: () => {
                  useStore.getState().setDialogue('Bassist: "Die Frequenzen... so viele Frequenzen..."');
                }}
              ]
            });
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
            const store = useStore.getState();

            const egoActionWrapper = (originalAction: () => void) => () => {
              useStore.getState().discoverLore('ego_philosophy');
              originalAction();
            };

            const options = [
              {
                text: 'Du bist die Vision, die uns leitet. [Visionary]',
                requiredTrait: 'Visionary',
                action: egoActionWrapper(() => {
                  useStore.getState().setDialogue('Marius\' Ego: "Endlich jemand, der meine wahre Bedeutung versteht! Die Vision ist zu groß für die Leere. Ich kehre zurück, um die Welt zu erleuchten."');
                  useStore.getState().addToInventory('Marius Ego');
                  useStore.getState().setFlag('egoContained', true);
                  useStore.getState().completeQuest('ego');
                  useStore.getState().increaseBandMood(30);
                  useStore.getState().increaseSkill('chaos', 5);
                })
              },
              {
                text: 'Deine Resonanzfrequenz ist instabil. [Technical 8]',
                requiredSkill: { name: 'technical', level: 8 },
                action: egoActionWrapper(() => {
                  useStore.getState().setDialogue('Marius\' Ego: "Instabil?! Ich bin die perfekte Schwingung! ... Warte, du hast recht. Die Entropie hier draußen zersetzt meine Brillanz. Schnell, fang mich ein!"');
                  useStore.getState().addToInventory('Marius Ego');
                  useStore.getState().setFlag('egoContained', true);
                  useStore.getState().completeQuest('ego');
                  useStore.getState().increaseBandMood(20);
                  useStore.getState().increaseSkill('technical', 5);
                })
              },
              {
                text: 'Die Fans brauchen dich. [Social 8]',
                requiredSkill: { name: 'social', level: 8 },
                action: egoActionWrapper(() => {
                  useStore.getState().setDialogue('Marius\' Ego: "Die Fans... ja. Meine Anbetung ist hier draußen so... abstrakt. Ich brauche den Schweiß und die Tränen der ersten Reihe. Bring mich zurück!"');
                  useStore.getState().addToInventory('Marius Ego');
                  useStore.getState().setFlag('egoContained', true);
                  useStore.getState().completeQuest('ego');
                  useStore.getState().increaseBandMood(25);
                  useStore.getState().increaseSkill('social', 5);
                })
              },
              {
                text: 'Komm einfach mit, du aufgeblasene Kugel.',
                action: egoActionWrapper(() => {
                  useStore.getState().setDialogue('Marius\' Ego: "Wie unhöflich! Aber die Leere ist langweilig. Na gut, aber ich erwarte eine Sonderbehandlung im Tourbus."');
                  useStore.getState().addToInventory('Marius Ego');
                  useStore.getState().setFlag('egoContained', true);
                  useStore.getState().completeQuest('ego');
                  useStore.getState().increaseBandMood(10);
                })
              }
            ];

            if (store.flags.marius_tourbus_doubt) {
               options.unshift({
                 text: 'Marius glaubt nicht mehr an sich. Du musst ihn retten. [Diplomat]',
                 requiredTrait: 'Diplomat',
                 action: egoActionWrapper(() => {
                   useStore.getState().setDialogue('Marius\' Ego: "Was?! Dieser weinerliche Fleischsack verzweifelt ohne mich?! Das kann ich nicht zulassen! Ich bin der Gott des Lärms, nicht der Gott des Jammers! Fang mich ein, schnell!"');
                   useStore.getState().addToInventory('Marius Ego');
                   useStore.getState().setFlag('egoContained', true);
                   useStore.getState().setFlag('mariusConfidenceBoost', true);
                   useStore.getState().completeQuest('ego');
                   useStore.getState().increaseBandMood(40);
                   useStore.getState().increaseSkill('social', 5);
                 })
               });
            }

            store.setDialogue({
              text: 'Marius\' Ego: "Ich bin das Zentrum des Universums! Ohne mich wäre dieser Gig nur ein Haufen rostiger Nägel. Warum sollte ich zurück in diesen winzigen Körper?"',
              options: options as any[]
            });
          }}
        />
      )}

      {/* Item: Liquid Darkness */}
      {!hasItem('Dunkle Materie') && (
        <Interactable
          position={[-5, 0, 5]}
          emoji="🌑"
          name="Dunkle Materie"
          onInteract={() => {
            addToInventory('Dunkle Materie');
            setDialogue('Du hast einen Klumpen Dunkle Materie aufgehoben. Er saugt das Licht aus deiner Umgebung.');
          }}
        />
      )}

      {/* Exit to Kaminstube */}
      <Interactable
        position={[0, 0, 10]}
        emoji="🌀"
        name="Realitäts-Portal"
        onInteract={() => {
          if (flags.voidRefueled) {
            setDialogue('Das Portal stabilisiert sich. Nächster Halt: Die Kaminstube... oder was davon übrig ist.');
            setScene('kaminstube');
          } else {
            setDialogue('Das Portal ist instabil. Wir brauchen den Treibstoff!');
          }
        }}
      />

      {/* New Ambient Interactables */}
      <Interactable
        position={[-3, 1, -8]}
        emoji="🖥️"
        name="Diplomaten-Interface"
        onInteract={() => {
          const store = useStore.getState();
          store.setDialogue({
            text: 'Ein beschädigtes Terminal, das als Übersetzer für die Entitäten der Leere dient. Es wartet auf Input.',
            options: [
              store.flags.void_diplomat_negotiation
              ? {
                  text: 'Status prüfen.',
                  action: () => {
                    useStore.getState().setDialogue('Die Verhandlung ist abgeschlossen. Die Leere hat zugestimmt, die Akkorde von Salzgitter nicht zu verschlingen.');
                  }
                }
              : {
                  text: 'Verhandle mit der Leere. [Diplomat]',
                  requiredTrait: 'Diplomat',
                  action: () => {
                    useStore.getState().discoverLore('schaltpult_record');
                    useStore.getState().setFlag('void_diplomat_negotiation', true);
                    useStore.getState().setDialogue('Du triffst eine Vereinbarung mit den abstrakten Mächten dieses Ortes. Der Gig in Salzgitter wird durch das Gefüge der Raumzeit geschützt.');
                    useStore.getState().increaseBandMood(30);
                    useStore.getState().increaseSkill('social', 5);
                  }
                },
              {
                text: 'Verlassen.',
                action: () => {
                  useStore.getState().setDialogue('Du lässt das Terminal in Ruhe.');
                }
              }
            ]
          });
        }}
      />

      <Interactable
        position={[3, 3, -3]}
        emoji="📼"
        name="Schwebende Magnetbänder"
        onInteract={() => {
          setDialogue({
            text: 'Mehrere Magnetbänder schweben schwerelos umher. Sie sind mit "1982 SESSION" beschriftet. Ein leises Riff ist zu hören.',
            options: [
              flags.magnetbandPlayed
              ? {
                  text: 'Ein Band abspielen.',
                  action: () => {
                    setDialogue('Du lauschst der Aufnahme erneut. Die Leere hallt weiter nach.');
                  }
                }
              : {
                  text: 'Ein Band abspielen. [Technical 5]',
                  requiredSkill: { name: 'technical', level: 5 },
                  action: () => {
                    discoverLore('magnetband_session');
                    setFlag('magnetbandPlayed', true);
                    setDialogue('Du bastelst ein Abspielgerät aus dem Nichts. Du hörst den Moment, als die Leere sich öffnete.');
                    increaseBandMood(10);
                    useStore.getState().increaseSkill('technical', 3);
                  }
                },
              {
                text: 'Bänder schweben lassen.',
                action: () => setDialogue('Manche Sessions sollten besser ungespielt bleiben.')
              }
            ]
          });
        }}
      />

      <Interactable
        position={[8, 0, -5]}
        emoji="📡"
        name="Frequenz-Detektor"
        onInteract={() => {
          if (!flags.frequenzDetektorRead) {
            setFlag('frequenzDetektorRead', true);
            discoverLore('frequenz_anomaly');
          }
          setDialogue({
            text: 'Ein seltsames Gerät piept rhythmisch. Es warnt vor einer "Resonanz-Anomalie".',
            options: [
              flags.frequenzCalibrated
              ? {
                  text: 'Gerät kalibrieren.',
                  action: () => {
                    setDialogue('Das Gerät ist bereits optimal kalibriert. Die Station atmet im Hintergrund weiter.');
                  }
                }
              : {
                  text: 'Gerät kalibrieren. [Technical 6]',
                  requiredSkill: { name: 'technical', level: 6 },
                  action: () => {
                    setFlag('frequenzCalibrated', true);
                    setDialogue('Du justierst die Antennen. Die Anzeige offenbart: Die gesamte Station atmet. Sie ist am Leben.');
                    increaseBandMood(15);
                    useStore.getState().increaseSkill('technical', 4);
                  }
                },
              {
                text: 'In Ruhe lassen.',
                action: () => setDialogue('Das Piepsen ist nervig, aber ungefährlich.')
              }
            ]
          });
        }}
      />

      <Interactable
        position={[-2, 2, 8]}
        emoji="⚠️"
        name="Verbotene Inschrift"
        onInteract={() => {
          setDialogue({
            text: 'Eine blutrote, phosphoreszierende Inschrift schwebt in der Luft. Die Buchstaben winden sich wie Würmer.',
            options: [
              flags.inschriftDecoded
              ? {
                  text: 'Erneut lesen.',
                  action: () => {
                    setDialogue('Du verinnerlichst die Warnung vor der finalen Kadenz in Salzgitter erneut.');
                  }
                }
              : {
                  text: 'Vollständig entschlüsseln. [cosmic_echo complete]',
                  questDependencies: ['cosmic_echo'],
                  action: () => {
                    discoverLore('inschrift_warning');
                    setFlag('inschriftDecoded', true);
                    setDialogue('Die Inschrift warnt vor einer Kadenz, die die Stille für immer töten wird. Salzgitter ist der Katalysator.');
                    increaseBandMood(20);
                  }
                },
              {
                text: 'Nur den Anfang lesen.',
                action: () => setDialogue('Du liest die ersten Worte, aber der Rest ist zu verschlüsselt.')
              }
            ]
          });
        }}
      />

      <Player bounds={{ x: [-20, 20], z: [-20, 20] }} />
    </>
  );
}
