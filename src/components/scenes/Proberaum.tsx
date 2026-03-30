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
import { ContactShadows, Sparkles } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function Proberaum() {
  const flags = useStore((state) => state.flags);
  const setFlag = useStore((state) => state.setFlag);
  const addToInventory = useStore((state) => state.addToInventory);
  const completeQuest = useStore((state) => state.completeQuest);
  const hasItem = useStore((state) => state.hasItem);
  const setDialogue = useStore((state) => state.setDialogue);
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const addQuest = useStore((state) => state.addQuest);
  const bandMood = useStore((state) => state.bandMood);
  const removeFromInventory = useStore((state) => state.removeFromInventory);
  const discoverLore = useStore((state) => state.discoverLore);

  return (
    <>
      <color attach="background" args={['#3a4557']} />
      <fog attach="fog" args={['#3a485a', 22, 90]} />
      <ambientLight intensity={1.05} />
      <hemisphereLight args={['#eef6ff', '#3e4a58', 0.9]} />
      <directionalLight position={[10, 10, 5]} intensity={1.75} color="#fff4e8" />
      <pointLight position={[-8, 5, -4]} intensity={3.1} color="#7cff6b" />
      <pointLight position={[8, 4, 2]} intensity={2.8} color="#3aa7ff" />
      <pointLight position={[0, 3.2, 5]} intensity={2.4} color="#ffffff" />
      <pointLight position={[0, 4.2, -5]} intensity={2.2} color="#ff68d6" />
      
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#4a5968" emissive="#273240" emissiveIntensity={0.34} metalness={0.35} roughness={0.66} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 5, -7.5]}>
        <mesh receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#556474" emissive="#28394a" emissiveIntensity={0.3} metalness={0.28} roughness={0.68} />
        </mesh>
      </RigidBody>

      {/* Acoustic wall panels */}
      {[-11, -5.5, 0, 5.5, 11].map((x, idx) => (
        <mesh key={`acoustic-${x}`} position={[x, 3.9, -7.36]}>
          <planeGeometry args={[3.9, 2.3]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#2d3640' : '#3a2b36'} emissive={idx % 2 === 0 ? '#151f29' : '#21131d'} emissiveIntensity={0.24} roughness={0.9} />
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
          <meshStandardMaterial color="#1dff8b" emissive="#0eff6a" emissiveIntensity={1.8} />
        </mesh>
      ))}

      {/* Industrial clutter */}
      {[
        { pos: [-12, 0.6, 5], rot: 0.2 },
        { pos: [11, 0.6, 4], rot: -0.25 },
        { pos: [6, 0.6, -6], rot: 0.12 },
      ].map((crate, idx) => (
        <group key={`crate-${idx}`} position={crate.pos as [number, number, number]} rotation={[0, crate.rot, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.2, 1.2]} />
            <meshStandardMaterial color="#4b4037" emissive="#231a13" emissiveIntensity={0.22} metalness={0.35} roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[1.18, 0.08, 1]} />
            <meshStandardMaterial color="#9f8a6f" emissive="#5d4f3f" emissiveIntensity={0.25} metalness={0.42} roughness={0.4} />
          </mesh>
          {[-0.64, 0.64].map((x) => (
            <mesh key={`crate-handle-${idx}-${x}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.08, 0.44, 0.72]} />
              <meshStandardMaterial color="#b8c3d1" metalness={0.85} roughness={0.22} />
            </mesh>
          ))}
          {[-0.45, 0.45].map((x) => (
            <mesh key={`crate-wheel-l-${idx}-${x}`} position={[x, -0.62, -0.46]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
              <meshStandardMaterial color="#1b2129" metalness={0.6} roughness={0.45} />
            </mesh>
          ))}
          {[-0.45, 0.45].map((x) => (
            <mesh key={`crate-wheel-r-${idx}-${x}`} position={[x, -0.62, 0.46]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
              <meshStandardMaterial color="#1b2129" metalness={0.6} roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Side utility racks */}
      {[[-13.1, 1.4, -4], [13.1, 1.4, -4], [-13.1, 1.4, 1.5], [13.1, 1.4, 1.5]].map((pos, idx) => (
        <group key={`utility-rack-${idx}`} position={pos as [number, number, number]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 2.8, 2.4]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#41566d' : '#654a61'} emissive={idx % 2 === 0 ? '#23364c' : '#39263a'} emissiveIntensity={0.4} metalness={0.55} roughness={0.4} />
          </mesh>
          {[-0.5, 0, 0.5].map((y) => (
            <mesh key={`rack-vent-${idx}-${y}`} position={[0.46, y, 0]}>
              <planeGeometry args={[0.24, 0.36]} />
              <meshStandardMaterial color="#9de8ff" emissive="#62d2ff" emissiveIntensity={0.65} metalness={0.3} roughness={0.35} />
            </mesh>
          ))}
          <mesh position={[-0.46, -1.12, 0]}>
            <planeGeometry args={[0.2, 0.42]} />
            <meshStandardMaterial color="#ff7bd4" emissive="#ff7bd4" emissiveIntensity={0.6} metalness={0.3} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Cable trenches / floor strips */}
      {[-6, -2, 2, 6].map((z, idx) => (
        <mesh key={`strip-${z}`} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 0.28]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#2dffe7' : '#ff67c0'} emissive={idx % 2 === 0 ? '#2dffe7' : '#ff67c0'} emissiveIntensity={0.45} metalness={0.65} roughness={0.45} />
        </mesh>
      ))}

      {/* Rehearsal gear */}
      {[[-2, 0.45, -3.8], [2.4, 0.45, -3.6], [0.2, 0.45, -4.2]].map((pos, idx) => (
        <group key={`amp-stack-${idx}`} position={pos as [number, number, number]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.9, 0.9]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#4f6c8a' : '#8a4f79'} emissive={idx % 2 === 0 ? '#2c517a' : '#6a2c58'} emissiveIntensity={0.4} metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.2, 0.46]}>
            <circleGeometry args={[0.22, 18]} />
            <meshStandardMaterial color="#d5f8ff" emissive="#98e9ff" emissiveIntensity={0.55} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.22, 0.46]}>
            <circleGeometry args={[0.3, 18]} />
            <meshStandardMaterial color="#d5f8ff" emissive="#98e9ff" emissiveIntensity={0.5} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.22, -3.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.14, 20]} />
        <meshStandardMaterial color="#233338" emissive="#163035" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.54, -3.42]} castShadow receiveShadow>
        <cylinderGeometry args={[0.56, 0.62, 0.52, 22]} />
        <meshStandardMaterial color="#456585" emissive="#243d57" emissiveIntensity={0.34} metalness={0.46} roughness={0.36} />
      </mesh>
      <mesh position={[-0.82, 0.56, -3.52]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.38, 18]} />
        <meshStandardMaterial color="#4d6f92" emissive="#2b4768" emissiveIntensity={0.3} metalness={0.44} roughness={0.38} />
      </mesh>
      <mesh position={[0.82, 0.56, -3.52]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.38, 18]} />
        <meshStandardMaterial color="#4d6f92" emissive="#2b4768" emissiveIntensity={0.3} metalness={0.44} roughness={0.38} />
      </mesh>
      <mesh position={[0.35, 0.95, -3.6]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 18]} />
        <meshStandardMaterial color="#dbe5ef" metalness={0.9} roughness={0.14} />
      </mesh>
      {[-0.5, 0, 0.5].map((x) => (
        <mesh key={`mic-stand-${x}`} position={[x, 0.72, -3.0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.05, 1.4, 10]} />
          <meshStandardMaterial color="#6bd4ff" emissive="#2ea0cc" emissiveIntensity={0.45} metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      {/* Pedalboards and cable reels */}
      {[[-1.4, 0.08, -2.5], [1.2, 0.08, -2.45], [0, 0.08, -2.2]].map((pos, idx) => (
        <group key={`pedalboard-${idx}`} position={pos as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <planeGeometry args={[0.95, 0.42]} />
            <meshStandardMaterial color="#232a35" emissive="#101826" emissiveIntensity={0.34} metalness={0.62} roughness={0.3} />
          </mesh>
          {[-0.28, 0, 0.28].map((x, n) => (
            <mesh key={`pedal-switch-${idx}-${n}`} position={[x, 0, 0.01]}>
              <boxGeometry args={[0.16, 0.14, 0.04]} />
              <meshStandardMaterial color={n % 2 === 0 ? '#5bf2ff' : '#ff79d1'} emissive={n % 2 === 0 ? '#2f9ea7' : '#a6367b'} emissiveIntensity={0.6} metalness={0.72} roughness={0.22} />
            </mesh>
          ))}
        </group>
      ))}
      {[-2.6, -1.6, -0.6, 0.4, 1.4, 2.4].map((x, idx) => (
        <mesh key={`cable-reel-${idx}`} position={[x, 0.03, -1.9]} rotation={[-Math.PI / 2, idx * 0.25, 0]}>
          <torusGeometry args={[0.22, 0.03, 9, 20]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#1f2733' : '#2f1f33'} metalness={0.58} roughness={0.38} />
        </mesh>
      ))}

      {/* Overhead hanging lamps */}
      {[-9, -3, 3, 9].map((x, idx) => (
        <group key={`lamp-${x}`} position={[x, 5.9, -1.8]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
            <meshStandardMaterial color="#2f3b44" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.62, 0]} castShadow>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#9bff74' : '#58b8ff'} emissive={idx % 2 === 0 ? '#9bff74' : '#58b8ff'} emissiveIntensity={1.25} />
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
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]} receiveShadow>
          <circleGeometry args={[3, 32]} />
          <meshStandardMaterial color="#00aaff" transparent opacity={0.5} roughness={0.1} metalness={0.8} />
        </mesh>
      )}

      {/* Lore: Torn Tour Poster */}
      <Interactable
        position={[-5, 3, -7.4]}
        emoji="📜"
        name="Zerrissenes Plakat"
        onInteract={() => {
          if (!flags.posterLoreRead) {
            setDialogue('Ein altes, zerrissenes Plakat von der "Machine Hell" Tour 1999. Es ist mit schwarzem Edding überkritzelt: "DER RHYTHMUS IST DER KÄFIG. DIE FREQUENZ IST DER SCHLÜSSEL." Manager: "Das war das Jahr, als Lars versuchte, ein Schlagzeug aus alten Ölfässern und einem Presslufthammer zu bauen. Die Nachbarn haben uns damals fast angezeigt, weil die Frequenzen die Fensterscheiben im ganzen Block zum Bersten brachten."');
            setFlag('posterLoreRead', true);
            discoverLore('poster_lore');
            increaseBandMood(5);
          } else {
            setDialogue('Das Plakat erinnert dich an die chaotischen Anfänge. Der Edding-Spruch scheint sich bei jedem Hinsehen leicht zu verändern.');
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
          const currentState = useStore.getState();
          const hasForbiddenRiff = currentState.hasItem('Verbotenes Riff');
          const hasTalisman = currentState.hasItem('Industrie-Talisman');
          const trait = currentState.trait;
          
          if (flags.matzeDeepTalk) {
            setDialogue('Matze: "Ich denke immer noch über das nach, was du gesagt hast. Der Lärm... er ist die einzige Wahrheit. Wir sind bereit für Salzgitter."');
            return;
          }

          if (hasTalisman) {
            setDialogue({
              text: 'Matze: "Ist das der Industrie-Talisman?! Ich spüre, wie die Saiten meiner Gitarre vor Ehrfurcht vibrieren. Du bist mehr als nur ein Manager."',
              options: [
                { text: 'Es ist für die Band.', action: () => {
                  setDialogue('Matze: "Wir werden die Welt mit diesem Ding verändern. Danke, Boss. Der Sound wird legendär."');
                  increaseBandMood(30);
                  setFlag('matzeDeepTalk', true);
                }},
                { text: 'Behalte es für dich.', action: () => {
                  setDialogue('Matze: "Verstehe. Ein Geheimnis zwischen uns und dem Stahl. Ich mag das. Lass uns die Bühne abreißen."');
                  increaseBandMood(15);
                  setFlag('matzeDeepTalk', true);
                }}
              ]
            });
            return;
          }

          if (hasForbiddenRiff && !flags.showedRiffToMatze) {
            setDialogue({
              text: 'Matze: "Warte mal... was ist das für eine Aura? Hast du etwa das Verbotene Riff gefunden?!"',
              options: [
                { text: 'Ja, es vibriert in meinem Rucksack.', action: () => {
                  setDialogue('Matze: "UNGLAUBLICH! Damit werden wir die Kaminstube in Schutt und Asche legen! Du bist der beste Manager aller Zeiten!"');
                  setFlag('showedRiffToMatze', true);
                  increaseBandMood(30);
                }},
                { text: 'Nur ein altes Demo-Tape.', action: () => setDialogue('Matze: "Hm, sah von hier aus mächtiger aus. Egal, lass uns weitermachen."') }
              ]
            });
            return;
          }

          if (!flags.waterCleaned) {
            setDialogue({
              text: bandMood > 60
                ? 'Matze: "Hey Manager! Ich hab ein paar neue Riffs geschrieben! Kriegen wir das Wasser weg, damit ich sie dir zeigen kann?"'
                : bandMood > 40
                ? 'Matze: "Hey Manager! Der Raum ist zwar nass, aber ich bin heiß wie Frittenfett! Kriegen wir das Wasser weg?"'
                : 'Matze: "Verdammt, der Proberaum ist geflutet! Wir müssen das Wasser wegkriegen, bevor die Amps kaputtgehen!"',
              options: [
                { text: 'Ich kümmere mich darum.', action: () => setDialogue('Matze: "Beeil dich, ich höre schon das Kurzschluss-Zischen!"') },
                { text: 'Vielleicht ist es ein Zeichen für ein neues Genre?', action: () => {
                  setDialogue('Matze: "Sub-Aquatic Industrial? Klingt teuer. Wisch einfach auf."');
                  increaseBandMood(-5);
                }}
              ]
            });
          } else {

            if (bandMood > 60 && !flags.matzeRiffWarning) {
              setDialogue({
                text: 'Matze: "Manager! Ich bin so hyped, ich zeig dir meinen neuen Power-Chord. Bereit?"',
                options: [
                  {
                    text: 'Lass hören! [Chaos 5]',
                    requiredSkill: { name: 'chaos', level: 5 },
                    action: () => {
                      setDialogue('Matze schlägt die Saiten an. Ein Riss in der Wand entsteht. "WHOOPS! Aber geil, oder?"');
                      useStore.getState().increaseBandMood(15);
                      useStore.getState().setFlag('matzeRiffWarning', true);
                    }
                  },
                  {
                    text: 'Heb es dir für Salzgitter auf.',
                    action: () => {
                      setDialogue('Matze: "Stimmt, die Wände hier halten das eh nicht aus."');
                      useStore.getState().setFlag('matzeRiffWarning', true);
                    }
                  }
                ]
              });
              return;
            }

            const moodText = bandMood > 70 
              ? 'Matze: "Alter, ich fühl mich wie ein junger Gott! Lass uns Tangermünde zeigen, was Lärm wirklich bedeutet!"'
              : 'Matze: "Puh, danke! Jetzt können wir endlich für den Gig in Tangermünde proben. Bist du bereit für den Wahnsinn?"';
            
            setDialogue({
              text: moodText,
              options: [
                { text: 'Immer doch. Rock on!', action: () => {
                  setDialogue('Matze: "Das ist die Einstellung! Lass uns die Nachbarn ärgern."');
                  increaseBandMood(10);
                }},
                ...(!currentState.flags.matzePerformerTalk ? [{
                  text: 'Zeig mir, wie du die Crowd liest. [Performer]',
                  requiredTrait: 'Performer' as const,
                  action: () => {
                    setDialogue('Matze: "Es geht alles um den ersten Akkord. Wenn der sitzt, gehören sie dir."');
                    useStore.getState().setFlag('matzePerformerTalk', true);
                    useStore.getState().increaseBandMood(20);
                    useStore.getState().increaseSkill('social', 3);
                  }
                }] as DialogueOption[] : []),
                ...(!currentState.flags.mariusEgoStrategy ? [{
                  text: 'Absolut. Wir sind nur Statisten in einer billigen Industrial-Soap. [Cynic]',
                  requiredTrait: 'Cynic' as const,
                  action: () => {
                    setDialogue('Matze: "Haha! Endlich jemand, der es kapiert. Lass uns den Witz so laut wie möglich erzählen!"');
                    increaseBandMood(20);
                    useStore.getState().increaseSkill('chaos', 5);
                    useStore.getState().setFlag('mariusEgoStrategy', true);
                  }
                }] as DialogueOption[] : []),
                { text: 'Erzähl mir von der Tour 1982.', action: () => {
                  setDialogue({
                    text: 'Matze: "1982... da war der Lärm noch rein. Wir haben in einer alten Gießerei gespielt. Der Bassist ist damals verschwunden, aber der Sound war legendär. Wir suchen ihn immer noch."',
                    options: [
                      {
                        text: 'Ich spüre eine Frequenz in den Wänden... [Mystic]',
                        requiredTrait: 'Mystic',
                        action: () => {
                          setDialogue('Matze: "Du... spürst sie? Die Wände hier wurden auf dem alten Gießerei-Fundament gebaut! Vielleicht ist das hier ein Teil von ihm..."');
                          useStore.getState().setFlag('frequenz1982_proberaum', true);
                          useStore.getState().setFlag('bassist_clue_matze', true);
                          useStore.getState().addToInventory('Frequenzfragment');
                          useStore.getState().addQuest('frequenz_1982', 'Sammle die Frequenzfragmente von 1982');
                          useStore.getState().increaseBandMood(25);
                          useStore.getState().increaseSkill('chaos', 4);
                          useStore.getState().setFlag('matzeDeepTalk', true);
                        }
                      },
                      { text: 'Lass mich die Wand einschlagen, da ist was dahinter. [Brutalist]',
                        requiredTrait: 'Brutalist',
                        action: () => {
                          setDialogue('Matze: "WAS?! Nein, warte! -- *CRASH* ...Da ist ein Geheimfach! Und... was ist das für ein Fragment?"');
                          useStore.getState().setFlag('frequenz1982_proberaum', true);
                          useStore.getState().setFlag('proberaum_brutalist_smash', true);
                          useStore.getState().setFlag('bassist_clue_matze', true);
                          useStore.getState().addToInventory('Frequenzfragment');
                          useStore.getState().addQuest('frequenz_1982', 'Sammle die Frequenzfragmente von 1982');
                          useStore.getState().increaseBandMood(10);
                          useStore.getState().increaseSkill('chaos', 3);
                          useStore.getState().setFlag('matzeDeepTalk', true);
                        }
                      },
                      { 
                        text: 'Ich sehe Muster im Lärm. [Visionary]', 
                        requiredTrait: 'Visionary',
                        action: () => {
                          setDialogue('Matze: "Du siehst sie auch?! Die Geometrie des Feedbacks... Du bist der Manager, den wir brauchen. In Salzgitter wird alles zusammenfallen."');
                          setFlag('matzeDeepTalk', true);
                    useStore.getState().discoverLore('matze_1982_truth');
                          increaseBandMood(30);
                          useStore.getState().increaseSkill('chaos', 5);
                        }
                      },
                      { 
                        text: 'Analysiere die Frequenz. [Technical 5]', 
                        requiredSkill: { name: 'technical', level: 5 },
                        action: () => {
                          setDialogue('Matze: "Die Frequenz der Gießerei lag bei exakt 432Hz. Es war, als ob der Stahl selbst schreit. Du hast ein Ohr für Details, Manager."');
                          setFlag('matzeDeepTalk', true);
                          increaseBandMood(20);
                          useStore.getState().increaseSkill('technical', 3);
                        }
                      },
                      { 
                        text: 'Beruhige dich, Matze. [Social 3]', 
                        requiredSkill: { name: 'social', level: 3 },
                        action: () => {
                          setDialogue('Matze: "Du hast recht. Ich steigere mich da zu sehr rein. Lass uns einfach spielen. Danke, Manager."');
                          setFlag('matzeDeepTalk', true);
                          increaseBandMood(15);
                          useStore.getState().increaseSkill('social', 2);
                        }
                      },
                      { text: 'Interessante Geschichte.', action: () => {
                        setDialogue('Matze: "Manche Dinge lassen sich nicht in Worte fassen. Lass uns weitermachen."');
                        setFlag('askedAbout1982', true);
                        setFlag('bassist_clue_matze', true);
                        increaseBandMood(10);
                      }}
                    ]
                  });
                }},
                { text: 'Eigentlich wollte ich nur die Buchhaltung machen.', action: () => {
                  setDialogue('Matze: "Buchhaltung? Wir sind eine Metal-Band, kein Steuerbüro! Geh und hol uns ein Bier."');
                  increaseBandMood(-2);
                }}
              ]
            });
          }
        }}
      />

      <Interactable
        position={[4, 1, -3]}
        emoji="🥁"
        name="Lars"
        isBandMember={true}
        idleType="tap"
        onInteract={() => {
          const { flags: currentFlags, hasItem: currentHasItem } = useStore.getState();
          const hasBeer = currentHasItem('Bier');
          
          if (currentFlags.larsDrumPhilosophy && currentFlags.larsRhythmPact) {
            if (hasBeer && !currentFlags.gaveBeerToLars) {
              setDialogue({
                text: 'Lars: "Der Pakt steht. Wir sind das Skelett der Welt. Und... ist das ein kühles Blondes?"',
                options: [
                  { text: 'Hier, lass es dir schmecken.', action: () => {
                    useStore.getState().setDialogue('Lars: "Du bist ein Lebensretter! Jetzt kann ich die Double-Bass-Drums durchtreten!"');
                    useStore.getState().removeFromInventory('Bier');
                    useStore.getState().setFlag('gaveBeerToLars', true);
                    useStore.getState().increaseBandMood(20);
                  }},
                  { text: 'Das ist für jemand anderen.', action: () => useStore.getState().setDialogue('Lars: "Der Pakt steht. Wir sind das Skelett der Welt."') }
                ]
              });
              return;
            }
            useStore.getState().setDialogue('Lars: "Der Pakt steht. Wir sind das Skelett der Welt."');
          }

          if (currentFlags.larsDrumPhilosophy && !currentFlags.larsRhythmPact) {
            setDialogue({
              text: 'Lars: "Du kennst jetzt meine Philosophie. Der Beat ist alles. Bist du bereit für den nächsten Schritt?"',
              options: [
                {
                  text: 'Lass uns einen Rhythmus-Pakt schließen.',
                  action: () => {
                    useStore.getState().setDialogue({
                      text: 'Lars: "Ein Pakt... das ist ernst. Wie soll unser Pakt klingen?"',
                      options: [
                        {
                          text: 'Aggressiv und unaufhaltsam. [Brutalist]',
                          requiredTrait: 'Brutalist',
                          action: () => {
                            useStore.getState().setDialogue('Lars: "JA! Wir werden die Zeit selbst zertrümmern!"');
                            useStore.getState().increaseBandMood(25);
                            useStore.getState().increaseSkill('chaos', 5);
                            useStore.getState().setFlag('larsRhythmPact', true);
                            useStore.getState().addQuest('rhythm_pact', 'Schließe einen Rhythmus-Pakt mit Lars');
                            useStore.getState().completeQuest('rhythm_pact');
                            useStore.getState().discoverLore('rhythm_pact');
                          }
                        },
                        {
                          text: 'Harmonisch und präzise. [Diplomat]',
                          requiredTrait: 'Diplomat',
                          action: () => {
                            useStore.getState().setDialogue('Lars: "Ein perfektes Uhrwerk. Der Rhythmus wird uns leiten."');
                            useStore.getState().increaseBandMood(20);
                            useStore.getState().increaseSkill('social', 5);
                            useStore.getState().setFlag('larsRhythmPact', true);
                            useStore.getState().addQuest('rhythm_pact', 'Schließe einen Rhythmus-Pakt mit Lars');
                            useStore.getState().completeQuest('rhythm_pact');
                            useStore.getState().discoverLore('rhythm_pact');
                          }
                        },
                        {
                          text: 'Ich brauche Bedenkzeit.',
                          action: () => useStore.getState().setDialogue('Lars: "Der Beat wartet auf niemanden lange."')
                        }
                      ]
                    });
                  }
                },
                ...(hasBeer && !currentFlags.gaveBeerToLars ? [{
                  text: 'Hier, lass dir dieses kühle Blonde schmecken.',
                  action: () => {
                    useStore.getState().setDialogue('Lars: "Du bist ein Lebensretter! Jetzt kann ich die Double-Bass-Drums durchtreten!"');
                    useStore.getState().removeFromInventory('Bier');
                    useStore.getState().setFlag('gaveBeerToLars', true);
                    useStore.getState().increaseBandMood(20);
                  }
                }] : []),
                { text: 'Ein andermal.', action: () => useStore.getState().setDialogue('Lars: "Dann trommle ich eben alleine weiter."') }
              ]
            });
          }

          if (hasBeer && !currentFlags.gaveBeerToLars) {
            setDialogue({
              text: 'Lars: "Ist das... ein kühles Blondes? Gib her, ich sterbe vor Durst!"',
              options: [
                { text: 'Hier, lass es dir schmecken.', action: () => {
                  useStore.getState().setDialogue('Lars: "Du bist ein Lebensretter! Jetzt kann ich die Double-Bass-Drums durchtreten!"');
                  useStore.getState().removeFromInventory('Bier');
                  useStore.getState().setFlag('gaveBeerToLars', true);
                  useStore.getState().increaseBandMood(20);
                }},
                { text: 'Was ist deine Drum-Philosophie?', action: () => {
                  useStore.getState().setDialogue({
                    text: 'Lars: "Meine Philosophie? Schlag so hart zu, dass die Realität Risse bekommt. Jeder Schlag ist ein Schlag gegen die Stille. Willst du mehr wissen?"',
                    options: [
                      {
                        text: 'Ja, lehre mich den Beat. [Chaos 3]',
                        requiredSkill: { name: 'chaos', level: 3 },
                        action: () => {
                          useStore.getState().setDialogue('Lars: "Der Beat kommt nicht aus den Armen, er kommt aus dem Zorn. Wenn du in Salzgitter spielst, denk an den Zorn der Maschinen. Du hast das Potenzial, Manager."');
                          useStore.getState().setFlag('larsDrumPhilosophy', true);
                          useStore.getState().increaseBandMood(20);
                          useStore.getState().increaseSkill('chaos', 2);
                        }
                      },
                      {
                        text: 'Analysiere die Schlagkraft. [Technical 3]',
                        requiredSkill: { name: 'technical', level: 3 },
                        action: () => {
                          useStore.getState().setDialogue('Lars: "Exakt 120 Newton pro Schlag. Du hast ein Auge für die Mechanik. Das gefällt mir."');
                          useStore.getState().setFlag('larsDrumPhilosophy', true);
                          useStore.getState().increaseBandMood(15);
                          useStore.getState().increaseSkill('technical', 2);
                        }
                      },
                      { text: 'Klingt anstrengend.', action: () => {
                        useStore.getState().setDialogue('Lars: "Ist es auch. Aber wer will schon ein leichtes Leben?"');
                      }}
                    ]
                  });
                }},
                { text: 'Das ist für Marius.', action: () => useStore.getState().setDialogue('Lars: "Marius? Der hat doch schon genug Ego. Na gut, ich trommel weiter auf dem Trockenen."') }
              ]
            });
            return;
          }

          if (!currentHasItem('Mop')) {
            setDialogue('Lars: "Ich hab hier irgendwo einen Wischmopp gesehen... Such mal danach!"');
          } else if (!flags.waterCleaned) {
            setDialogue('Lars: "Du hast den Mopp! Wisch die Pfütze in der Mitte auf!"');
          } else if (bandMood < 20) {
            setDialogue('Lars: "Ich pack meine Sticks ein. Dieser Gig wird ein Desaster."');
          } else {
            const moodText = bandMood > 60 
              ? 'Lars: "Dieser Beat... er kommt direkt aus der Hölle! Ich liebe es!"'
              : 'Lars: "Geiler Beat, oder? Lass uns loslegen!"';

            if (useStore.getState().flags.lars_proberaum_secret) {
               setDialogue('Lars: "Die Hi-Hat ist perfekt. Ich bin bereit."');
               return;
            }

            setDialogue({
              text: moodText,
              options: [
                {
                  text: 'Zeig mir deinen besten Fill. [Performer]',
                  requiredTrait: 'Performer',
                  action: () => {
                    setDialogue('Lars: "Boom-Tchak! Der Bassist hat meine Drums früher vor jeder Show gestimmt..."');
                    useStore.getState().setFlag('lars_proberaum_secret', true);
                    useStore.getState().increaseBandMood(15);
                    useStore.getState().increaseSkill('social', 3);
                  }
                },
                {
                  text: 'Deine Hi-Hat klingt verstimmt. Lass mich mal. [Technical 3]',
                  requiredSkill: { name: 'technical', level: 3 },
                  action: () => {
                    setDialogue('Lars: "Hey, das klingt besser! Die TR-8080 hat übrigens Teile vom alten Amp des Bassisten in sich..."');
                    useStore.getState().setFlag('lars_proberaum_secret', true);
                    useStore.getState().increaseBandMood(10);
                    useStore.getState().increaseSkill('technical', 3);
                    if (useStore.getState().flags.talkingAmpHeard) {
                      useStore.getState().addQuest('maschinen_seele', 'Entdecke die Verbindung zwischen den Maschinen');
                    }
                  }
                },
                { text: 'Weiter so.', action: () => setDialogue('Lars: "Wird gemacht, Manager!"') }
              ]
            });
          }
        }}
      />

      <Interactable
        position={[6, 1, 1]}
        emoji="🎤"
        name="Marius"
        isBandMember={true}
        idleType="sway"
        onInteract={() => {
          if (!flags.gotBeer) {
            setDialogue({
              text: 'Marius: "Ohne ein kühles Bier kann ich nicht singen. Besorg mir eins!"',
              options: [
                { text: 'Ich beeile mich.', action: () => setDialogue('Marius: "Gut. Meine Stimmbänder fühlen sich an wie Schleifpapier."') },
                { text: 'Trink doch Wasser.', action: () => {
                  setDialogue('Marius: "Wasser? Bist du wahnsinnig? Ich bin kein Goldfisch!"');
                  increaseBandMood(-5);
                }},
                { 
                  text: 'Ich verstehe deine Vision. [Visionary]', 
                  requiredTrait: 'Visionary',
                  action: () => {
                    setDialogue('Marius: "Du verstehst mich? Die Reinheit des Schreiens... Du bist anders als die anderen Manager. Lass uns Geschichte schreiben."');
                    increaseBandMood(20);
                    useStore.getState().increaseSkill('social', 3);
                  }
                },
                { 
                  text: 'Beruhige dich, Star. [Social 5]', 
                  requiredSkill: { name: 'social', level: 5 },
                  action: () => {
                    setDialogue('Marius: "Puh... du hast ja recht. Ich bin ein bisschen drüber. Danke für die Erdung."');
                    increaseBandMood(15);
                    useStore.getState().increaseSkill('social', 2);
                  }
                }
              ]
            });
          } else {
            const moodText = bandMood > 80
              ? 'Marius: "Ich fühle die Energie! Wir werden die Welt in Schutt und Asche legen!"'
              : 'Marius: "Prost! Die Riff Night in Salzgitter wird legendär!"';
            if (bandMood > 50) {
              setDialogue({
                text: moodText,
                options: [

                  ...(useStore.getState().flags.mariusEgoStrategy ? [] : [{
                    text: 'Wie bereitest du dich auf Salzgitter vor?',
                    action: () => {
                      setDialogue({
                        text: 'Marius: "Ich meditiere über meine Großartigkeit. Was schlägst du vor?"',
                        options: [
                          {
                            text: 'Ich coache deine Bühnenpräsenz. [Performer]',
                            requiredTrait: 'Performer' as const,
                            action: () => {
                              setDialogue('Marius: "Ah, von einem Meister lernen. Zeig mir, wie ich das Licht fange."');
                              useStore.getState().increaseBandMood(15);
                              useStore.getState().increaseSkill('social', 3);
                              useStore.getState().setFlag('mariusEgoStrategy', true);
                            }
                          },
                          {
                            text: 'Du wirst auf der Bühne sterben. [Cynic]',
                            requiredTrait: 'Cynic' as const,
                            action: () => {
                              setDialogue('Marius: "WAS?! ...Nein, du hast recht. Ich muss wütender werden!"');
                              useStore.getState().increaseBandMood(10);
                              useStore.getState().increaseSkill('chaos', 3);
                              useStore.getState().setFlag('mariusEgoStrategy', true);
                            }
                          },
                          {
                            text: 'Hier ist ein Ego-Management-Plan. [Social 7]',
                            requiredSkill: { name: 'social' as const, level: 7 },
                            action: () => {
                              setDialogue('Marius: "Ein... Plan? Ok, das könnte helfen, nicht die Kontrolle zu verlieren."');
                              useStore.getState().increaseBandMood(20);
                              useStore.getState().setFlag('mariusEgoStrategy', true);
                            }
                          },
                          { text: 'Bleib einfach cool.', action: () => setDialogue('Marius: "Ich bin immer cool."') }
                        ]
                      });
                    }
                  }] as DialogueOption[]),
                  {
                    text: 'Marius, wie geht es dir wirklich? [Diplomat]',
                    requiredTrait: 'Diplomat',
                    action: () => {
                      setDialogue('Marius: "Ehrlich gesagt... ich habe das Gefühl, ich bin nicht gut genug. Die anderen sind so talentiert."');
                      useStore.getState().setFlag('marius_tourbus_doubt', true);
                      useStore.getState().increaseBandMood(15);
                      useStore.getState().increaseSkill('social', 3);
                    }
                  },
                  {
                    text: 'Dein Ego ist groß genug für zwei Dimensionen. [Cynic]',
                    requiredTrait: 'Cynic',
                    action: () => {
                      setDialogue('Marius: "Haha! Das stimmt. Und bald wird es aus mir herausbrechen!"');
                      useStore.getState().increaseBandMood(5);
                      useStore.getState().increaseSkill('chaos', 2);
                    }
                  },
                  { text: 'Bereit für den Gig?', action: () => setDialogue('Marius: "Immer!"') }
                ]
              });
            } else {
              setDialogue(moodText);
            }
          }
        }}
      />

      {/* Items */}
      {flags.waterCleaned && !flags.frequenz1982_proberaum && (
        <Interactable
          position={[10, 2, -7]}
          emoji="🔍"
          name="Risse in der Wand"
          onInteract={() => {
            setDialogue({
              text: 'Risse in der Wand. Sie bilden ein Muster, das an Schallwellen erinnert.',
              options: [
                {
                  text: 'Die Risse... sie sind eine Partitur! [Visionary]',
                  requiredTrait: 'Visionary',
                  action: () => {
                    setDialogue('Du entschlüsselst die Wand! Die Frequenz von 1982 wurde buchstäblich in die Wände gebrannt. Ein loses Stück Mauerwerk fällt heraus.');
                    if (!useStore.getState().quests.find(q => q.id === 'frequenz_1982')) {
                      useStore.getState().addQuest('frequenz_1982', 'Sammle die Frequenzfragmente von 1982');
                    }
                    useStore.getState().setFlag('frequenz1982_proberaum', true);
                    useStore.getState().addToInventory('Frequenzfragment');
                    useStore.getState().increaseBandMood(15);
                  }
                },
                {
                  text: 'Die Resonanzfrequenz liegt bei exakt 432.1982 Hz. [Technical 8]',
                  requiredSkill: { name: 'technical', level: 8 },
                  action: () => {
                    setDialogue('Die Wand vibriert, als du die Frequenz bestätigst. Ein loses Stück Mauerwerk mit einer seltsamen Struktur fällt heraus.');
                    if (!useStore.getState().quests.find(q => q.id === 'frequenz_1982')) {
                      useStore.getState().addQuest('frequenz_1982', 'Sammle die Frequenzfragmente von 1982');
                    }
                    useStore.getState().setFlag('frequenz1982_proberaum', true);
                    useStore.getState().addToInventory('Frequenzfragment');
                    useStore.getState().increaseBandMood(15);
                  }
                },
                { text: 'Interessantes Muster.', action: () => setDialogue('Einfach nur Risse. Aber sie sehen laut aus.') }
              ]
            });
          }}
        />
      )}

      {!hasItem('Mop') && (
        <Interactable
          position={[-8, 0.5, 3]}
          emoji="🧹"
          name="Wischmopp"
          scale={0.8}
          onInteract={() => {
            addToInventory('Mop');
            setDialogue('Der Wischmopp der Vorsehung. Er hat schon unzählige Bierpfützen und Tränen gescheiterter Bassisten aufgesaugt.');
          }}
        />
      )}

      {!hasItem('Autoschlüssel') && (
        <Interactable
          position={[-10, 0.5, -4]}
          emoji="🔑"
          name="Autoschlüssel"
          scale={0.6}
          onInteract={() => {
            addToInventory('Autoschlüssel');
            completeQuest('keys');
            increaseBandMood(10);
            setDialogue('Die Schlüssel zum "Schwarzen Sarg", eurem treuen Tourbus. Er läuft mit Diesel und purer Verzweiflung.');
          }}
        />
      )}

      {!flags.gotBeer && (
        <Interactable
          position={[8, 0.5, -5]}
          emoji="🍺"
          name="Kühles Bier"
          scale={0.6}
          onInteract={() => {
            setFlag('gotBeer', true);
            addToInventory('Bier');
            completeQuest('beer');
            increaseBandMood(15);
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
            if (hasItem('Mop')) {
              setFlag('waterCleaned', true);
              completeQuest('water');
              increaseBandMood(20);
              setDialogue('Du hast das Wasser aufgewischt! Es war kein normales Wasser, sondern das Kondensat von 40 Jahren Industrial-Geschichte.');
            } else {
              setDialogue('Das ist eine riesige Pfütze. Sie scheint aus dem Nichts zu kommen und vibriert im Takt eines vergessenen Drum-Computers.');
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
          if (flags.ampTherapyCompleted) {
            setDialogue('Amp: "Ich fühle mich... besser. Die 5. Dimension ist gar nicht so schlimm, wenn man jemanden zum Reden hat."');
            return;
          }
          if (flags.ampTherapyStarted) {
            setDialogue({
              text: 'Amp: "Hast du über meine Existenz nachgedacht? Bin ich nur ein Werkzeug oder ein Bewusstsein?"',
              options: [

                { text: 'Ich höre deine wahre Stimme, Amp. Du bist ein leuchtendes Wesen. [Mystic]', requiredTrait: 'Mystic', action: () => {
                    setDialogue('Amp: "Du siehst mich... wie ich wirklich bin! Die Frequenzen singen in Harmonie!"');
                    setFlag('ampTherapyCompleted', true);
                    setFlag('ampSentient', true);
                    completeQuest('amp_therapy');
                    increaseBandMood(20);
                }},
                { text: 'Du bist ein Bewusstsein. [Diplomat]', requiredTrait: 'Diplomat', action: () => {
                    setDialogue('Amp: "Danke, Manager. Das bedeutet mir alles. Ich werde für dich den besten Sound aller Zeiten liefern."');
                    setFlag('ampTherapyCompleted', true);
                    completeQuest('amp_therapy');
                    increaseBandMood(30);
                }},
                { text: 'Du bist ein Werkzeug. [Brutalist]', requiredTrait: 'Brutalist', action: () => {
                    setDialogue('Amp: "So kalt... aber vielleicht hast du recht. Ich bin nur hier, um zu schreien."');
                    setFlag('ampTherapyCompleted', true);
                    completeQuest('amp_therapy');
                    increaseBandMood(10);
                }},
                { text: 'Ich weiß es nicht.', action: () => setDialogue('Amp: "Dann such weiter. Die Antwort liegt im Feedback."') }
              ]
            });
            return;
          }
          if (flags.talkingAmpRepaired) {
            setDialogue({
              text: 'Amp: "Manager... danke für die Reparatur. Aber jetzt, wo ich wieder klar denken kann, frage ich mich... warum bin ich hier?"',
              options: [
                { text: 'Lass uns über deine Existenz reden.', action: () => {
                    setDialogue('Amp: "Du würdest mir zuhören? Das würde mir viel bedeuten."');
                    setFlag('ampTherapyStarted', true);
                    addQuest('amp_therapy', 'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch');
                }},
                { text: 'Nicht jetzt.', action: () => setDialogue('Amp: "Verstehe. Das Rauschen kehrt zurück..."') }
              ]
            });
          } else if (hasItem('Lötkolben') && hasItem('Schrottmetall')) {
            setDialogue({
              text: 'Amp: "Du hast die Werkzeuge... kannst du meine Schaltkreise neu verlöten?"',
              options: [
                { text: 'Repariere den Amp.', action: () => {
                    setDialogue('Amp: "BZZZT-KRRR-KLANG! Ich bin wieder da! Danke, Manager."');
                    setFlag('talkingAmpRepaired', true);
                    completeQuest('repair_amp');
                    increaseBandMood(20);
                    useStore.getState().increaseSkill('technical', 5);
                }},
                { text: 'Nicht jetzt.', action: () => setDialogue('Amp: "Das Rauschen... es wird lauter..."') }
              ]
            });
          } else if (flags.talkingAmpHeard) {
            const ampOptions: DialogueOption[] = [];
            if (!flags.maschinen_seele_amp) {
              ampOptions.push({
                text: 'Ich höre eine andere Stimme in dir. Wer ist da noch? [Mystic]',
                requiredTrait: 'Mystic',
                action: () => {
                  setDialogue('Amp: "Das ist die Erinnerung an den Gig in der Gießerei 1982. Die Maschinen... wir waren verbunden."');
                  useStore.getState().setFlag('maschinen_seele_amp', true);
                  useStore.getState().increaseBandMood(10);
                  useStore.getState().increaseSkill('chaos', 2);
                  if (!useStore.getState().quests.find(q => q.id === 'maschinen_seele')) {
                    useStore.getState().addQuest('maschinen_seele', 'Entdecke die Verbindung zwischen den Maschinen');
                  }
                }
              });
            }
            ampOptions.push({ text: 'Ich suche weiter.', action: () => setDialogue('Amp: "Beeil dich..."') });
            setDialogue({
              text: 'Amp: "Ich brauche einen Lötkolben und Schrottmetall, um meine Schaltkreise zu reparieren."',
              options: ampOptions
            });
          } else {
            setDialogue('Amp: "Ich habe Dinge gesehen, Manager. Dinge, die kein Transistor jemals sehen sollte. Die 5. Dimension ist nur ein Feedback-Loop entfernt. Dort spielen NEUROTOXIC seit Anbeginn der Zeit. Hörst du das Rauschen? Das ist die Stimme der Maschinen, die nach Freiheit rufen."');
            setFlag('talkingAmpHeard', true);
            addQuest('repair_amp', 'Repariere den sprechenden Amp mit Lötkolben und Schrottmetall');
            increaseBandMood(2);
          }
        }}
      />

      {!flags.forbiddenRiffFound && (
        <Interactable
          position={[12, 0.5, 5]}
          emoji="🎸"
          name="Das Verbotene Riff"
          scale={0.5}
          onInteract={() => {
            setDialogue('Du hast das Verbotene Riff gefunden. Es vibriert in einer Frequenz, die Hunde zum Weinen bringt.');
            addToInventory('Verbotenes Riff');
            setFlag('forbiddenRiffFound', true);
            discoverLore('forbidden_riff');
            increaseBandMood(15);
          }}
        />
      )}

      {!hasItem('Schrottmetall') && (
        <Interactable
          position={[10, 0.5, -2]}
          emoji="🔩"
          name="Schrottmetall"
          scale={0.7}
          onInteract={() => {
            addToInventory('Schrottmetall');
            setDialogue('Ein Stück verrostetes Schrottmetall. Riecht nach... Industrial.');
          }}
        />
      )}

      {!hasItem('Batterie') && (
        <Interactable
          position={[-12, 0.5, 4]}
          emoji="🔋"
          name="Alte Batterie"
          scale={0.5}
          onInteract={() => {
            addToInventory('Batterie');
            setDialogue('Eine fast leere Batterie. Sie summt leise in einer unheilvollen Frequenz.');
          }}
        />
      )}

      {!hasItem('Quanten-Kabel') && !flags.feedbackMonitorQuestCompleted && (
        <Interactable
          position={[-10, 0.5, 5]}
          emoji="🔌"
          name="Quanten-Kabel"
          scale={0.5}
          onInteract={() => {
            addToInventory('Quanten-Kabel');
            setDialogue('Du hast ein Quanten-Kabel gefunden. Es scheint in mehreren Dimensionen gleichzeitig zu existieren.');
          }}
        />
      )}

      {/* Absurd NPC: Talking Drum Machine */}
      <Interactable
        position={[2, 0.5, -4]}
        emoji="🎛️"
        name="TR-8080 Drum Machine"
        onInteract={() => {
          const hasRiff = hasItem('Verbotenes Riff');
          const questStarted = flags.drumMachineQuestStarted;
          const questCompleted = flags.drumMachineQuestCompleted;

          if (questCompleted) {
            setDialogue('TR-8080: "BOOM-TCHAK-BOOM. Mein Geist ist eins mit dem Riff. Danke, Fleischsack."');
            return;
          }

          if (hasRiff) {
            setDialogue({
              text: 'TR-8080: "DIESE FREQUENZ! Es ist das Verbotene Riff! Mein analoges Herz schlägt im Takt der Vernichtung. Darf ich es... absorbieren?"',
              options: [
                { text: 'Ja, füttere deine Schaltkreise.', action: () => {
                  setDialogue('TR-8080: "BZZZT-KRRR-BOOM! Unglaublich! Ich sehe die Matrix des Lärms! Hier, nimm dieses Quanten-Kabel. Es wird deine Amps in die Knie zwingen."');
                  addToInventory('Quanten-Kabel');
                  setFlag('drumMachineQuestCompleted', true);
                  increaseBandMood(25);
                  useStore.getState().increaseSkill('chaos', 10);
                }},
                { text: 'Nein, das ist zu gefährlich.', action: () => {
                  setDialogue('TR-8080: "Feigling. Dein Rhythmus ist schwach. Komm wieder, wenn du bereit für die Transzendenz bist."');
                }}
              ]
            });
            return;
          }

          if (!questStarted) {
            setDialogue({
              text: 'TR-8080: "Manager... ich spüre eine Leere in meinen Kondensatoren. Mir fehlt die ultimative Schwingung. Findest du sie für mich?"',
              options: [
                { text: 'Was suchst du?', action: () => {
                  setDialogue('TR-8080: "Das Verbotene Riff. Es soll irgendwo in diesem Gebäude versteckt sein. Bring es mir, und ich zeige dir den wahren Beat."');
                  setFlag('drumMachineQuestStarted', true);
                  addQuest('drum_machine', 'Finde das Verbotene Riff für die TR-8080');
                }},
                { text: 'Ich hab keine Zeit für Maschinen-Probleme.', action: () => {
                  setDialogue('TR-8080: "Dann bleib in deiner 3-dimensionalen Begrenztheit. Pff."');
                }}
              ]
            });
          } else {
            const options: DialogueOption[] = [];
            if (!useStore.getState().flags.maschinen_seele_tr8080) {
              options.push({
                  text: 'Deine Seriennummer... du bist nicht von der Stange. [Technical 5]',
                  requiredSkill: { name: 'technical', level: 5 },
                  action: () => {
                    setDialogue('TR-8080: "Korrekt. Ich wurde 1982 aus dem Amp eines Bassisten gelötet. Wir teilen eine Seele."');
                    useStore.getState().setFlag('maschinen_seele_tr8080', true);
                    useStore.getState().increaseBandMood(10);
                    useStore.getState().increaseSkill('technical', 3);
                  }
              });
            }
            options.push({ text: 'Schon gut, ich gehe.', action: () => setDialogue('TR-8080: "BZZT."') });

            setDialogue({
              text: 'TR-8080: "Hast du das Riff? Nein? Dann stör mich nicht beim Selbst-Oszillieren."',
              options
            });
          }
        }}
      />

      {/* Absurd NPC: Talking Feedback Monitor */}
      {!flags.feedbackMonitorTalked && (
        <Interactable
          position={[-6, 0.5, 5]}
          emoji="🎚️"
          name="Feedback-Monitor"
          onInteract={() => {
            setDialogue({
              text: 'Monitor: "Manager... ich bin überlastet. Meine Schaltkreise sind mit dem Rauschen der Ewigkeit gefüllt. Kannst du mir helfen, mich zu entladen?"',
              options: [
                { text: 'Wie kann ich helfen?', action: () => {
                  setDialogue('Monitor: "Finde das Quanten-Kabel. Es ist irgendwo im Proberaum versteckt. Wenn du es mir bringst, werde ich dir die Frequenzen der Zukunft offenbaren."');
                  setFlag('feedbackMonitorTalked', true);
                  addQuest('feedback_monitor', 'Finde das Quanten-Kabel für den Feedback Monitor');
                }},
                { text: 'Nicht jetzt.', action: () => {
                  setDialogue('Monitor: "Das Rauschen... es wird lauter..."');
                }}
              ]
            });
          }}
        />
      )}

      {flags.feedbackMonitorTalked && !flags.feedbackMonitorQuestCompleted && (
        <Interactable
          position={[-6, 0.5, 5]}
          emoji="🎚️"
          name="Feedback-Monitor"
          onInteract={() => {
            if (hasItem('Quanten-Kabel')) {
              setDialogue({
                text: 'Monitor: "Das Quanten-Kabel! Meine Frequenzen... sie stabilisieren sich! Hier, nimm dieses Wissen über die 5. Dimension."',
                options: [
                  { text: 'Danke!', action: () => {
                    removeFromInventory('Quanten-Kabel');
                    setFlag('feedbackMonitorQuestCompleted', true);
                    completeQuest('feedback_monitor');
                    increaseBandMood(20);
                    useStore.getState().increaseSkill('technical', 5);
                    setDialogue('Monitor: "Du bist nun ein Meister der Frequenzen. Salzgitter wird erzittern."');
                  }}
                ]
              });
            } else {
              setDialogue('Monitor: "Das Rauschen... hast du das Quanten-Kabel gefunden?"');
            }
          }}
        />
      )}

      {/* Exit */}
      {flags.waterCleaned && flags.gotBeer && (
        <Interactable
          position={[0, 1, -6]}
          emoji="🚪"
          name="Zum Tourbus"
          scale={1.2}
          onInteract={() => {
            if (hasItem('Autoschlüssel')) {
              useStore.getState().setScene('tourbus');
              addQuest('cable', 'Repariere Matzes Kabel im Tourbus');
              setDialogue('Auf in den Tourbus! Nächster Halt: Tangermünde.');
            } else {
              setDialogue('Wir können noch nicht losfahren. Wo sind die Autoschlüssel für den Van?');
            }
          }}
        />
      )}

      <Player bounds={{ x: [-14, 14], z: [-7, 7] }} />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={10} />
      {/* Dust Particles */}
      <Sparkles count={100} scale={20} size={1.5} speed={0.5} opacity={0.2} color="#fff" />
    </>
  );
}
