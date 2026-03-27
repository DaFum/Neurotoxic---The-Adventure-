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
import { Float, Text, MeshDistortMaterial, MeshWobbleMaterial, Sparkles, Stars } from '@react-three/drei';
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
      <color attach="background" args={['#1a2340']} />
      <fogExp2 attach="fog" args={['#24345a', 0.01]} />
      <ambientLight intensity={0.72} />
      <hemisphereLight args={['#d8ebff', '#4a416a', 0.7]} />
      <pointLight position={[0, 10, 0]} intensity={3.9} color="#ff00ff" />
      <pointLight position={[5, 5, 5]} intensity={2.8} color="#00ffff" />
      <pointLight position={[-6, 5, -5]} intensity={2.5} color="#8a7dff" />
      <pointLight position={[0, 4, -7]} intensity={2.4} color="#7bff6d" />
      <Stars radius={140} depth={70} count={9000} factor={5} saturation={0} fade speed={0.8} />
      <Sparkles count={120} scale={[60, 20, 60]} size={2} speed={0.3} opacity={0.3} color="#7e5dff" />

      {/* Surreal Floor */}
      <RigidBody type="fixed">
        <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshDistortMaterial 
            color="#34255a" 
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
        {[-3.2, -1.6, 0, 1.6, 3.2].map((y, idx) => (
          <mesh key={`obelisk-ring-${idx}`} position={[-10, 5 + y, -10]} rotation={[Math.PI / 2, 0, idx * 0.2]}>
            <torusGeometry args={[1.55, 0.05, 12, 24]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#73ffe4' : '#ff71d7'} emissive={idx % 2 === 0 ? '#3ec5ad' : '#b24792'} emissiveIntensity={0.65} metalness={0.75} roughness={0.2} />
          </mesh>
        ))}
      </Float>
      <Float speed={4} rotationIntensity={3} floatIntensity={1}>
        <mesh position={[10, 3, -5]}>
          <octahedronGeometry args={[2]} />
          <MeshWobbleMaterial color="#ff00ff" speed={5} factor={2} />
        </mesh>
      </Float>

      {/* Orbiting crystals */}
      {[[-16, 1.6, -8], [-12, 2.1, 10], [12, 2.3, 10], [16, 1.8, -8], [0, 2.5, -16]].map((pos, idx) => (
        <Float key={`crystal-${idx}`} speed={2 + idx * 0.2} rotationIntensity={1.6} floatIntensity={0.8}>
          <mesh position={pos as [number, number, number]}>
            <dodecahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#7a4dff' : '#36d7ff'} emissive={idx % 2 === 0 ? '#3f22a2' : '#10618c'} emissiveIntensity={0.8} metalness={0.45} roughness={0.35} />
          </mesh>
        </Float>
      ))}

      {/* Distant anomaly rings */}
      {[8, 14, 20].map((r, idx) => (
        <mesh key={`anomaly-ring-${r}`} position={[0, 6 + idx * 0.8, -12 - idx * 4]} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[r, 0.08, 16, 80]} />
          <meshBasicMaterial color={idx % 2 ? '#6ffff5' : '#ff49f2'} transparent opacity={0.22} />
        </mesh>
      ))}

      {/* Station interior modules */}
      {[
        [-14, 0.8, -2],
        [-10, 0.8, 3],
        [10, 0.8, 3],
        [14, 0.8, -2],
      ].map((pos, idx) => (
        <mesh key={`void-console-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.6, 1.4]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#5136a0' : '#2786b0'} emissive={idx % 2 === 0 ? '#7a54e1' : '#39b6e8'} emissiveIntensity={0.75} metalness={0.55} roughness={0.34} />
        </mesh>
      ))}
      {[
        [-14, 1.45, -1.2],
        [-10, 1.45, 3.8],
        [10, 1.45, 3.8],
        [14, 1.45, -1.2],
      ].map((pos, idx) => (
        <mesh key={`void-console-screen-${idx}`} position={pos as [number, number, number]}>
          <planeGeometry args={[1.8, 0.52]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#89c8ff' : '#8fffa5'} emissive={idx % 2 === 0 ? '#4d8cd9' : '#47b95c'} emissiveIntensity={0.95} metalness={0.4} roughness={0.2} />
        </mesh>
      ))}
      {[
        [-13.1, 0.5, -1.2],
        [-10.9, 0.5, 3.8],
        [9.1, 0.5, 3.8],
        [13.1, 0.5, -1.2],
      ].map((pos, idx) => (
        <mesh key={`void-console-orb-${idx}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#ff72d5' : '#74f4ff'} emissive={idx % 2 === 0 ? '#c14295' : '#44b8c3'} emissiveIntensity={0.85} metalness={0.72} roughness={0.18} />
        </mesh>
      ))}
      {[-12, -6, 0, 6, 12].map((x) => (
        <mesh key={`void-panel-${x}`} position={[x, 1.9, -1.3]}>
          <planeGeometry args={[1.2, 0.26]} />
          <meshBasicMaterial color="#57f5ff" transparent opacity={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.15, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 7.2, 48]} />
        <meshBasicMaterial color="#9f64ff" transparent opacity={0.2} />
      </mesh>
      {[[-15, 3.2, -3], [15, 3.2, -3], [-15, 3.2, 4], [15, 3.2, 4]].map((pos, idx) => (
        <mesh key={`void-arch-${idx}`} position={pos as [number, number, number]} rotation={[0, idx < 2 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <torusGeometry args={[1.6, 0.18, 14, 36]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#ff4fd3' : '#5be8ff'} emissive={idx % 2 === 0 ? '#7a1f61' : '#1a617a'} emissiveIntensity={0.7} metalness={0.65} roughness={0.28} />
        </mesh>
      ))}

      {/* Conduit lines and floating shards */}
      {[-14, -7, 0, 7, 14].map((x, idx) => (
        <mesh key={`conduit-${x}`} position={[x, 0.06, -6.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.75, 0.04, 10, 28]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#7c8dff' : '#64ffd5'} emissive={idx % 2 === 0 ? '#4d58b7' : '#3cae93'} emissiveIntensity={0.55} metalness={0.72} roughness={0.24} />
        </mesh>
      ))}
      {[[-6, 2.8, -11], [-2, 3.4, -13], [2, 3.1, -13], [6, 2.7, -11]].map((pos, idx) => (
        <Float key={`shard-${idx}`} speed={2.2 + idx * 0.2} rotationIntensity={2.4} floatIntensity={0.7}>
          <mesh position={pos as [number, number, number]}>
            <tetrahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#ff7ce2' : '#7efbff'} emissive={idx % 2 === 0 ? '#ae4f95' : '#47b8c2'} emissiveIntensity={0.82} metalness={0.68} roughness={0.18} />
          </mesh>
        </Float>
      ))}

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
            setDialogue({
              text: 'Tankwart: "Ah, die Essenz des Nichts. Dunkle Materie ist der Treibstoff der Träume, die wir nie zu träumen wagten. Soll ich den Van mit 440Hz-Vibrationen oder 432Hz-Heilfrequenzen betanken?"',
              options: [
                { text: '440Hz - Standard Industrial Power.', action: () => {
                  setDialogue('Tankwart: "Eine solide Wahl. Der Lärm wird mächtig sein und die Wände der Realität einreißen."');
                  setFlag('voidRefueled', true);
                  completeQuest('void');
                  increaseBandMood(25);
                }},
                { text: '432Hz - Wir wollen die Chakren der Fans öffnen.', action: () => {
                  setDialogue('Tankwart: "Interessant. Die Fans werden verwirrt sein, aber ihre Seelen werden im Takt des Universums schwingen."');
                  setFlag('voidRefueled', true);
                  completeQuest('void');
                  increaseBandMood(10);
                }}
              ]
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

      {/* Marius' Ego (Floating interaction) */}
      {!flags.egoContained && (
        <Interactable
          position={[5, 2, 0]}
          emoji="👑"
          name="Marius' Ego"
          scale={0.5}
          onInteract={() => {
            const trait = useStore.getState().trait;
            const skills = useStore.getState().skills;

            const egoActionWrapper = (originalAction: () => void) => () => {
              discoverLore('ego_philosophy');
              originalAction();
            };

            setDialogue({
              text: 'Marius\' Ego: "Ich bin das Zentrum des Universums! Ohne mich wäre dieser Gig nur ein Haufen rostiger Nägel. Warum sollte ich zurück in diesen winzigen Körper?"',
              options: [
                { 
                  text: 'Du bist die Vision, die uns leitet. [Visionary]', 
                  requiredTrait: 'Visionary',
                  action: egoActionWrapper(() => {
                    setDialogue('Marius\' Ego: "Endlich jemand, der meine wahre Bedeutung versteht! Die Vision ist zu groß für die Leere. Ich kehre zurück, um die Welt zu erleuchten."');
                    addToInventory('Marius Ego');
                    setFlag('egoContained', true);
                    completeQuest('ego');
                    increaseBandMood(30);
                    useStore.getState().increaseSkill('chaos', 5);
                  })
                },
                { 
                  text: 'Deine Resonanzfrequenz ist instabil. [Technical 8]', 
                  requiredSkill: { name: 'technical', level: 8 },
                  action: egoActionWrapper(() => {
                    setDialogue('Marius\' Ego: "Instabil?! Ich bin die perfekte Schwingung! ... Warte, du hast recht. Die Entropie hier draußen zersetzt meine Brillanz. Schnell, fang mich ein!"');
                    addToInventory('Marius Ego');
                    setFlag('egoContained', true);
                    completeQuest('ego');
                    increaseBandMood(20);
                    useStore.getState().increaseSkill('technical', 5);
                  })
                },
                { 
                  text: 'Die Fans brauchen dich. [Social 8]', 
                  requiredSkill: { name: 'social', level: 8 },
                  action: egoActionWrapper(() => {
                    setDialogue('Marius\' Ego: "Die Fans... ja. Meine Anbetung ist hier draußen so... abstrakt. Ich brauche den Schweiß und die Tränen der ersten Reihe. Bring mich zurück!"');
                    addToInventory('Marius Ego');
                    setFlag('egoContained', true);
                    completeQuest('ego');
                    increaseBandMood(25);
                    useStore.getState().increaseSkill('social', 5);
                  })
                },
                { 
                  text: 'Komm einfach mit, du aufgeblasene Kugel.', 
                  action: egoActionWrapper(() => {
                    setDialogue('Marius\' Ego: "Wie unhöflich! Aber die Leere ist langweilig. Na gut, aber ich erwarte eine Sonderbehandlung im Tourbus."');
                    addToInventory('Marius Ego');
                    setFlag('egoContained', true);
                    completeQuest('ego');
                    increaseBandMood(10);
                  })
                }
              ]
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
        name="Gesplittertes Schaltpult"
        onInteract={() => {
          setDialogue({
            text: 'Ein zerstörtes Schaltpult. Die Bildschirme flackern mit Code-Zeilen, die wie Musiknoten aussehen.',
            options: [
              {
                text: 'Tiefer graben.',
                action: () => {
                  discoverLore('schaltpult_record');
                  setDialogue('Du findest einen Eintrag über die Station als kosmisches Musikarchiv. Jeder Akkord ist hier für die Ewigkeit gespeichert.');
                }
              },
              {
                text: 'Verlassen.',
                action: () => {
                  setDialogue('Du lässt das Terminal in Ruhe.');
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
