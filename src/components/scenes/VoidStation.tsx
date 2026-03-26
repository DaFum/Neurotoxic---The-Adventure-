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
                }}
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

            setDialogue({
              text: 'Marius\' Ego: "Ich bin das Zentrum des Universums! Ohne mich wäre dieser Gig nur ein Haufen rostiger Nägel. Warum sollte ich zurück in diesen winzigen Körper?"',
              options: [
                { 
                  text: 'Du bist die Vision, die uns leitet. [Visionary]', 
                  requiredTrait: 'Visionary',
                  action: () => {
                    setDialogue('Marius\' Ego: "Endlich jemand, der meine wahre Bedeutung versteht! Die Vision ist zu groß für die Leere. Ich kehre zurück, um die Welt zu erleuchten."');
                    addToInventory('Marius Ego');
                    setFlag('egoContained', true);
                    completeQuest('ego');
                    increaseBandMood(30);
                    useStore.getState().increaseSkill('chaos', 5);
                  }
                },
                { 
                  text: 'Deine Resonanzfrequenz ist instabil. [Technical 8]', 
                  requiredSkill: { name: 'technical', level: 8 },
                  action: () => {
                    setDialogue('Marius\' Ego: "Instabil?! Ich bin die perfekte Schwingung! ... Warte, du hast recht. Die Entropie hier draußen zersetzt meine Brillanz. Schnell, fang mich ein!"');
                    addToInventory('Marius Ego');
                    setFlag('egoContained', true);
                    completeQuest('ego');
                    increaseBandMood(20);
                    useStore.getState().increaseSkill('technical', 5);
                  }
                },
                { 
                  text: 'Die Fans brauchen dich. [Social 8]', 
                  requiredSkill: { name: 'social', level: 8 },
                  action: () => {
                    setDialogue('Marius\' Ego: "Die Fans... ja. Meine Anbetung ist hier draußen so... abstrakt. Ich brauche den Schweiß und die Tränen der ersten Reihe. Bring mich zurück!"');
                    addToInventory('Marius Ego');
                    setFlag('egoContained', true);
                    completeQuest('ego');
                    increaseBandMood(25);
                    useStore.getState().increaseSkill('social', 5);
                  }
                },
                { 
                  text: 'Komm einfach mit, du aufgeblasene Kugel.', 
                  action: () => {
                    setDialogue('Marius\' Ego: "Wie unhöflich! Aber die Leere ist langweilig. Na gut, aber ich erwarte eine Sonderbehandlung im Tourbus."');
                    addToInventory('Marius Ego');
                    setFlag('egoContained', true);
                    completeQuest('ego');
                    increaseBandMood(10);
                  }
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

      <Player bounds={{ x: [-20, 20], z: [-20, 20] }} />
    </>
  );
}
