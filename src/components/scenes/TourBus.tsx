/**
 * #1: UPDATES
 * - Integrated "Talking Amp's Existential Crisis" quest in Proberaum.
 * - Integrated "Ghostly Roadie's Lost Recipe" quest in TourBus.
 * - Added Geister-Drink item combination.
 * - Added Rostiges Plektrum item.
 * - Added 'Technician' trait-exclusive interaction for broken amplifier.
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
import { Sparkles, Float, Text } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';

export function TourBus() {
  const setDialogue = useStore((state) => state.setDialogue);
  const setScene = useStore((state) => state.setScene);
  const bandMood = useStore((state) => state.bandMood);
  const flags = useStore((state) => state.flags);
  const setFlag = useStore((state) => state.setFlag);
  const addToInventory = useStore((state) => state.addToInventory);
  const removeFromInventory = useStore((state) => state.removeFromInventory);
  const hasItem = useStore((state) => state.hasItem);
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const addQuest = useStore((state) => state.addQuest);
  const completeQuest = useStore((state) => state.completeQuest);
  const exitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <color attach="background" args={['#4a3524']} />
      <fog attach="fog" args={['#5a4530', 16, 60]} />

      {/* Bus Interior Walls */}
      <mesh position={[0, 2, -5]}>
        <boxGeometry args={[12, 5, 0.5]} />
        <meshStandardMaterial color="#232a33" emissive="#111820" emissiveIntensity={0.22} metalness={0.35} roughness={0.72} />
      </mesh>
      <mesh position={[-6, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.5]} />
        <meshStandardMaterial color="#1e252e" emissive="#121921" emissiveIntensity={0.2} metalness={0.32} roughness={0.74} />
      </mesh>
      <mesh position={[6, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.5]} />
        <meshStandardMaterial color="#1e252e" emissive="#121921" emissiveIntensity={0.2} metalness={0.32} roughness={0.74} />
      </mesh>
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 10]} />
          <meshStandardMaterial color="#1a1d24" emissive="#0b0f16" emissiveIntensity={0.25} metalness={0.28} roughness={0.82} />
        </mesh>
      </RigidBody>
      <mesh position={[0, 4.3, 0]}>
        <boxGeometry args={[12, 0.3, 10]} />
        <meshStandardMaterial color="#2f3741" emissive="#151b22" emissiveIntensity={0.18} metalness={0.42} roughness={0.62} />
      </mesh>

      {/* Window strips */}
      {[-3.8, -1.2, 1.2, 3.8].map((z) => (
        <mesh key={`win-left-${z}`} position={[-5.74, 2.45, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.65, 1.1]} />
          <meshStandardMaterial color="#7fb7ff" emissive="#2d5f9d" emissiveIntensity={0.28} metalness={0.2} roughness={0.35} transparent opacity={0.72} />
        </mesh>
      ))}
      {[-3.8, -1.2, 1.2, 3.8].map((z) => (
        <mesh key={`win-right-${z}`} position={[5.74, 2.45, z]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.65, 1.1]} />
          <meshStandardMaterial color="#7fb7ff" emissive="#2d5f9d" emissiveIntensity={0.28} metalness={0.2} roughness={0.35} transparent opacity={0.72} />
        </mesh>
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.95} />
      <hemisphereLight args={['#fff1d9', '#574431', 0.7]} />
      <pointLight position={[0, 4, 0]} intensity={9.2} color="#ffaa00" />
      <spotLight position={[0, 4, 2]} angle={0.5} penumbra={1} intensity={17} color="#ffffff" />
      <pointLight position={[-4, 2.8, -1]} intensity={3.4} color="#ff5a3d" />
      <pointLight position={[4, 2.8, -1]} intensity={3.1} color="#2ac8ff" />
      <pointLight position={[0, 2.6, 2.2]} intensity={2.8} color="#f7f5ef" />
      <pointLight position={[0, 3.1, -2.4]} intensity={2.4} color="#ff66d2" />

      {/* Ceiling rail lights */}
      {[-4.5, -1.5, 1.5, 4.5].map((x) => (
        <mesh key={`bus-rail-${x}`} position={[x, 4.35, -0.3]}>
          <boxGeometry args={[1.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={1.5} />
        </mesh>
      ))}

      {/* Floor runner and side rails */}
      <mesh position={[0, -0.03, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 8.4]} />
        <meshStandardMaterial color="#2e1b18" emissive="#1a0d0b" emissiveIntensity={0.22} roughness={0.92} />
      </mesh>
      <mesh position={[-1.16, -0.015, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 8.4]} />
        <meshStandardMaterial color="#ff7b4a" emissive="#ff7b4a" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[1.16, -0.015, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 8.4]} />
        <meshStandardMaterial color="#57d3ff" emissive="#57d3ff" emissiveIntensity={0.55} />
      </mesh>

      {/* Seat blocks */}
      {[
        [-4, 0.5, 2.8],
        [-1.2, 0.5, 2.8],
        [1.6, 0.5, 2.8],
        [4.4, 0.5, 2.8],
      ].map((pos, idx) => (
        <mesh key={`seat-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 1.8]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#d36a3e' : '#3b8cc7'} emissive={idx % 2 === 0 ? '#7c2f1b' : '#1f4f78'} emissiveIntensity={0.4} metalness={0.15} roughness={0.76} />
        </mesh>
      ))}
      {[
        [-4, 1.18, 2.12],
        [-1.2, 1.18, 2.12],
        [1.6, 1.18, 2.12],
        [4.4, 1.18, 2.12],
      ].map((pos, idx) => (
        <mesh key={`seat-back-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[1.95, 1.1, 0.32]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#c65b34' : '#3380b5'} emissive={idx % 2 === 0 ? '#702914' : '#1b4465'} emissiveIntensity={0.38} metalness={0.18} roughness={0.7} />
        </mesh>
      ))}
      {[
        [-4, 1.75, 2.06],
        [-1.2, 1.75, 2.06],
        [1.6, 1.75, 2.06],
        [4.4, 1.75, 2.06],
      ].map((pos, idx) => (
        <mesh key={`seat-headrest-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.38, 0.26]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#f69b6f' : '#77baf1'} emissive={idx % 2 === 0 ? '#7d3a22' : '#2f6294'} emissiveIntensity={0.35} metalness={0.12} roughness={0.65} />
        </mesh>
      ))}
      {[[-4.78, -0.06, 2.2], [-3.22, -0.06, 2.2], [-4.78, -0.06, 3.38], [-3.22, -0.06, 3.38],
        [-1.98, -0.06, 2.2], [-0.42, -0.06, 2.2], [-1.98, -0.06, 3.38], [-0.42, -0.06, 3.38],
        [0.82, -0.06, 2.2], [2.38, -0.06, 2.2], [0.82, -0.06, 3.38], [2.38, -0.06, 3.38],
        [3.62, -0.06, 2.2], [5.18, -0.06, 2.2], [3.62, -0.06, 3.38], [5.18, -0.06, 3.38]].map((pos, idx) => (
        <mesh key={`seat-leg-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.35, 10]} />
          <meshStandardMaterial color="#aeb7c1" metalness={0.82} roughness={0.25} />
        </mesh>
      ))}

      {/* Driver cockpit + storage */}
      <mesh position={[0, 1.1, -4.4]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 1.1, 0.55]} />
        <meshStandardMaterial color="#29313a" emissive="#18222d" emissiveIntensity={0.3} metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[-1.2, 1.35, -4.05]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.34, 0.06, 12, 24]} />
        <meshStandardMaterial color="#23272d" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.62, -4.1]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.42, 0.22]} />
        <meshStandardMaterial color="#1f2935" emissive="#0f1d2b" emissiveIntensity={0.35} metalness={0.6} roughness={0.38} />
      </mesh>
      {[-0.9, 0, 0.9].map((x, idx) => (
        <mesh key={`dash-screen-${idx}`} position={[x, 1.67, -3.95]}>
          <planeGeometry args={[0.68, 0.22]} />
          <meshStandardMaterial color={idx === 1 ? '#9bff6d' : '#6ad3ff'} emissive={idx === 1 ? '#9bff6d' : '#6ad3ff'} emissiveIntensity={0.85} metalness={0.55} roughness={0.2} />
        </mesh>
      ))}
      {[-1.2, -0.4, 0.4, 1.2].map((x, idx) => (
        <mesh key={`dash-knob-${idx}`} position={[x, 1.42, -3.86]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 10]} />
          <meshStandardMaterial color="#dde4ee" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {[-5.2, -4.2, 4.2, 5.2].map((x) => (
        <mesh key={`bus-shelf-${x}`} position={[x, 2.8, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.5, 1.6]} />
          <meshStandardMaterial color="#3a2f24" emissive="#241910" emissiveIntensity={0.25} roughness={0.75} />
        </mesh>
      ))}

      {/* Overhead luggage rails and side cases */}
      {[-3.4, -1.2, 1.2, 3.4].map((z) => (
        <mesh key={`rack-left-${z}`} position={[-5.35, 3.35, z]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.2, 0.85]} />
          <meshStandardMaterial color="#303947" emissive="#1a2330" emissiveIntensity={0.24} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {[-3.4, -1.2, 1.2, 3.4].map((z) => (
        <mesh key={`rack-right-${z}`} position={[5.35, 3.35, z]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.2, 0.85]} />
          <meshStandardMaterial color="#303947" emissive="#1a2330" emissiveIntensity={0.24} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {[[-5.1, 0.55, -1.6], [5.1, 0.55, -1.6], [-5.1, 0.55, 1.2], [5.1, 0.55, 1.2]].map((pos, idx) => (
        <mesh key={`side-case-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.9, 1.1]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#3a2230' : '#223a34'} emissive={idx % 2 === 0 ? '#23121c' : '#14251f'} emissiveIntensity={0.28} metalness={0.42} roughness={0.56} />
        </mesh>
      ))}
      {[[-5.08, 1.08, -1.6], [5.08, 1.08, -1.6], [-5.08, 1.08, 1.2], [5.08, 1.08, 1.2]].map((pos, idx) => (
        <mesh key={`side-case-latch-${idx}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.1, 0.1, 0.24]} />
          <meshStandardMaterial color="#bfc9d6" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Grab handles and hanging straps */}
      {[-4.8, -2.4, 0, 2.4, 4.8].map((x) => (
        <mesh key={`grab-${x}`} position={[x, 4.12, -0.36]} castShadow>
          <torusGeometry args={[0.16, 0.03, 10, 20]} />
          <meshStandardMaterial color="#dbe3ed" metalness={0.86} roughness={0.24} />
        </mesh>
      ))}
      {[-3.6, -1.2, 1.2, 3.6].map((x) => (
        <group key={`strap-${x}`} position={[x, 4.1, 0.9]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.55, 8]} />
            <meshStandardMaterial color="#f0f4fa" metalness={0.35} roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <torusGeometry args={[0.08, 0.02, 8, 18]} />
            <meshStandardMaterial color="#f0f4fa" metalness={0.8} roughness={0.22} />
          </mesh>
        </group>
      ))}

      {/* Atmosphere */}
      <Sparkles count={20} scale={10} size={1} speed={0.5} opacity={0.2} />

      {/* Band Members in the Bus */}
      <Interactable
        position={[-3, 0, -2]}
        emoji="🎸"
        name="Matze"
        idleType="sway"
        onInteract={() => {
          if (hasItem('Repariertes Kabel')) {
            setDialogue({
              text: bandMood > 70 
                ? 'Matze: "Das Kabel ist perfekt! Ich fühle die pure Elektrizität!"'
                : 'Matze: "Danke fürs Reparieren. Jetzt kann ich endlich wieder Krach machen."',
              options: [
                { text: 'Lass uns die Bühne abreißen!', action: () => {
                    increaseBandMood(10);
                    completeQuest('cable');
                }}
              ]
            });
          } else if (bandMood < 30) {
            setDialogue('Matze: "Alter, ich hab so schlechte Laune. Die Tour fängt ja super an... und mein Kabel ist auch noch im Eimer."');
          } else {
            setDialogue({
              text: 'Matze: "Geht schon. Aber mein Kabel ist im Eimer. Hast du Klebeband?"',
              options: [
                { text: 'Ich suche danach.', action: () => {
                    setDialogue('Matze: "Beeil dich, ohne Kabel kein Metal."');
                    addQuest('cable', 'Repariere Matzes Kabel mit Klebeband und defektem Kabel');
                }},
                { text: 'Vielleicht ist es Schicksal.', action: () => {
                  setDialogue('Matze: "Schicksal? Das ist Sabotage! Such das Tape!"');
                  increaseBandMood(-5);
                }}
              ]
            });
          }
        }}
      />

      <Interactable
        position={[3, 0, -2]}
        emoji="🎤"
        name="Marius"
        idleType="headbang"
        onInteract={() => {
          const hasEgo = hasItem('Marius Ego');
          if (hasEgo) {
            setDialogue({
              text: 'Marius: "Ist das... mein Ego? Es fühlt sich so... klein an in deiner Tasche."',
              options: [
                { text: 'Es ist jetzt sicher.', action: () => {
                  setDialogue('Marius: "Danke. Ich fühle mich wieder... vollständig. Und hungrig."');
                  increaseBandMood(20);
                }},
                { text: 'Ich behalte es als Pfand.', action: () => {
                  setDialogue('Marius: "Du bist grausam, Manager. Aber irgendwie respektiere ich das."');
                  increaseBandMood(-10);
                }}
              ]
            });
          } else {
            const moodText = bandMood > 60 
              ? 'Marius: "Die Energie im Bus ist fantastisch! Tangermünde wird beben!"'
              : 'Marius: "Nächster Halt: Tangermünde! Bist du bereit für die Kaminstube?"';
            setDialogue(moodText);
          }
        }}
      />

      {/* Broken Amp - Technician Interaction */}
      {!flags.tourbusAmpTechnician && (
        <Interactable
          position={[4, 0.5, -3]}
          emoji="🎛️"
          name="Defekter Verstärker"
          onInteract={() => {
            const trait = useStore.getState().trait;
            if (trait === 'Technician') {
              setDialogue({
                text: 'Ein alter Röhrenverstärker, der nur noch brummt. Als Techniker siehst du sofort das Problem: Eine kalte Lötstelle an der Vorstufe.',
                options: [
                  { text: 'Repariere ihn schnell.', action: () => {
                    setDialogue('Mit geübten Handgriffen lötest du die Verbindung nach. Der Verstärker klingt jetzt klarer als je zuvor!');
                    setFlag('tourbusAmpTechnician', true);
                    increaseBandMood(20);
                    useStore.getState().increaseSkill('technical', 10);
                  }}
                ]
              });
            } else {
              setDialogue('Ein alter Röhrenverstärker. Er brummt nervtötend, aber du hast keine Ahnung, wie man das repariert.');
            }
          }}
        />
      )}

      {/* Bus Items */}
      {!hasItem('Klebeband') && !hasItem('Repariertes Kabel') && (
        <Interactable
          position={[-5, 0.5, 2]}
          emoji="🩹"
          name="Klebeband"
          onInteract={() => {
            addToInventory('Klebeband');
            setDialogue('Industrie-Klebeband. Hält alles zusammen: Kabel, Amps und die bröckelnde Psyche der Bandmitglieder.');
          }}
        />
      )}

      {!hasItem('Defektes Kabel') && !hasItem('Repariertes Kabel') && (
        <Interactable
          position={[5, 0.5, 2]}
          emoji="🔌"
          name="Defektes Kabel"
          onInteract={() => {
            addToInventory('Defektes Kabel');
            setDialogue('Ein defektes Gitarrenkabel. Es hat schon mehr Rückkopplungen gesehen als ein durchschnittlicher Fabrikarbeiter.');
          }}
        />
      )}

      <Interactable
        position={[0, 0.5, -3]}
        emoji="☕"
        name="Kaffee"
        onInteract={() => {
          addToInventory('Kaffee');
          setDialogue('Ein Becher schwarzer Kaffee. So schwarz wie die Seele eines Drummers nach einem 4-Stunden-Gig.');
        }}
      />

      {!hasItem('Energiedrink') && !hasItem('Turbo-Koffein') && !hasItem('Geister-Drink') && !(flags.ghostRecipeQuestCompleted && flags.larsEnergized) && (
        <Interactable
          position={[-1, 0.5, -3]}
          emoji="🥤"
          name="Energiedrink"
          onInteract={() => {
            addToInventory('Energiedrink');
            setDialogue('Ein "Liquid Thunder" Energiedrink. Enthält genug Taurin, um ein kleines Kraftwerk zu betreiben.');
          }}
        />
      )}

      {!hasItem('Bier') && (
        <Interactable
          position={[2, 0.5, 3]}
          emoji="🍺"
          name="Bier-Vorrat"
          onInteract={() => {
            addToInventory('Bier');
            setDialogue('Ein kühles Bier aus dem Bus-Kühlschrank. Das offizielle Schmiermittel für den Industrial-Motor.');
          }}
        />
      )}

      {/* Lore: Forgotten Notebook */}
      <Interactable
        position={[4, 0.5, 3]}
        emoji="📓"
        name="Vergessenes Notizbuch"
        onInteract={() => {
          setDialogue('Ein abgegriffenes Notizbuch mit dem Logo von NEUROTOXIC. Seite 42: "Der Sound muss weh tun. Wenn es nicht weh tut, ist es nur Musik. Wir brauchen mehr Feedback." Seite 43: "Marius hat sein Ego im Kühlschrank vergessen. Wieder einmal."');
          increaseBandMood(5);
        }}
      />

      {!hasItem('Rostiges Plektrum') && (
        <Interactable
          position={[-2, 0.5, 0]}
          emoji="🎸"
          name="Rostiges Plektrum"
          scale={0.5}
          onInteract={() => {
            addToInventory('Rostiges Plektrum');
            setDialogue('Ein rostiges Plektrum. Es scheint aus einer Zeit zu stammen, in der Metal noch aus reinem Eisen geschmiedet wurde.');
          }}
        />
      )}

      <Interactable
        position={[-4, 1, 3]}
        emoji="👻"
        name="Geist eines Roadies"
        onInteract={() => {
          const currentState = useStore.getState();
          const hasForbiddenRiff = currentState.hasItem('Verbotenes Riff');
          const hasTalisman = currentState.hasItem('Industrie-Talisman');
          const hasGeisterDrink = currentState.hasItem('Geister-Drink');
          
          if (hasGeisterDrink && !flags.ghostRecipeQuestCompleted) {
            setDialogue({
              text: 'Geist: "Ist das... der Geister-Drink? Mein altes Rezept! Ich spüre, wie meine Seele wieder... fest wird. Danke, Manager."',
              options: [
                { text: 'Prost!', action: () => {
                    removeFromInventory('Geister-Drink');
                    setFlag('ghostRecipeQuestCompleted', true);
                    completeQuest('ghost_recipe');
                    increaseBandMood(40);
                    useStore.getState().increaseSkill('social', 5);
                    setDialogue('Geist: "Du hast mir mehr gegeben als nur ein Getränk. Du hast mir ein Stück meiner Vergangenheit zurückgegeben. Hier, nimm diesen alten Verstärker-Schaltplan. Er könnte in Salzgitter nützlich sein."');
                    addToInventory('Verstärker-Schaltplan');
                }}
              ]
            });
            return;
          }

          if (flags.ghostRecipeQuestStarted && !hasGeisterDrink) {
            setDialogue('Geist: "Hast du den Geister-Drink schon gemixt? Turbo-Koffein und ein rostiges Plektrum... das ist die einzige Lösung."');
            return;
          }

          if (flags.ghostSecretRevealed) {
            setDialogue('Geist: "Du weißt jetzt, was zu tun ist. Der Stahl vergisst nie."');
            return;
          }

          if (flags.askedAbout1982 && !flags.ghostSecretRevealed) {
            setDialogue({
              text: 'Geist: "Du hast Matze nach 1982 gefragt... du bist neugierig. Das ist gefährlich. Willst du wirklich wissen, was mit dem Bassisten geschah?"',
              options: [
                { 
                  text: 'Erzähl mir alles. [Visionary]', 
                  requiredTrait: 'Visionary',
                  action: () => {
                    setDialogue('Geist: "Du siehst die Muster, nicht wahr? Er ist nicht einfach verschwunden. Er wurde Teil der Frequenz. Er ist jetzt der Lärm, den ihr in Salzgitter spielen werdet. Er wartet auf euch."');
                    setFlag('ghostSecretRevealed', true);
                    increaseBandMood(30);
                    useStore.getState().increaseSkill('chaos', 5);
                  }
                },
                { 
                  text: 'Analysiere die Anomalie. [Technical 7]', 
                  requiredSkill: { name: 'technical', level: 7 },
                  action: () => {
                    setDialogue('Geist: "Die Frequenzverschiebung war massiv. 1982 gab es einen Riss im Raum-Zeit-Gefüge der Gießerei. Er wurde in die Oberschwingungen gesaugt. Faszinierend, oder?"');
                    setFlag('ghostSecretRevealed', true);
                    increaseBandMood(25);
                    useStore.getState().increaseSkill('technical', 4);
                  }
                },
                { 
                  text: 'Beruhige den Geist. [Social 5]', 
                  requiredSkill: { name: 'social', level: 5 },
                  action: () => {
                    setDialogue('Geist: "Deine Stimme ist... beruhigend. Fast wie ein sanfter Chorus-Effekt. Na gut, ich erzähle es dir. Er ist jetzt Teil des Feedbacks. Er wartet in Salzgitter."');
                    setFlag('ghostSecretRevealed', true);
                    increaseBandMood(20);
                    useStore.getState().increaseSkill('social', 3);
                  }
                },
                { text: 'Erzähl mir alles.', action: () => {
                  setDialogue('Geist: "Er ist nicht einfach verschwunden. Er wurde Teil der Frequenz. Er ist jetzt der Lärm, den ihr in Salzgitter spielen werdet. Er wartet auf euch."');
                  setFlag('ghostSecretRevealed', true);
                  increaseBandMood(20);
                }},
                { text: 'Vielleicht später.', action: () => {
                  setDialogue('Geist: "Die Wahrheit wartet nicht. Aber der Lärm schon."');
                }}
              ]
            });
            return;
          }

          if (hasTalisman && !flags.ghostSecretRevealed) {
            setDialogue({
              text: 'Geist: "Dieser Talisman... er gehörte unserem alten Manager. Er ist bei dem Gig in der Gießerei 1982 spurlos verschwunden. Willst du wissen, was wirklich geschah?"',
              options: [
                { text: 'Erzähl mir die Wahrheit.', action: () => {
                  setDialogue('Geist: "Der Sound war so perfekt, dass er ein Tor öffnete. Er ist nicht verschwunden... er ist Teil des Feedbacks geworden. Er IST jetzt der Lärm. Wenn ihr in Salzgitter spielt, werdet ihr ihn hören."');
                  setFlag('ghostSecretRevealed', true);
                  increaseBandMood(20);
                }},
                { text: 'Manche Geheimnisse sollten begraben bleiben.', action: () => {
                  setDialogue('Geist: "Vielleicht hast du recht. Aber der Lärm findet immer einen Weg."');
                  increaseBandMood(5);
                }}
              ]
            });
            return;
          }

          if (hasForbiddenRiff) {
            setDialogue({
              text: 'Geist: "Du trägst das Verbotene Riff... Ich kann die Schreie der 80er hören. Es ist eine schwere Last. Bist du bereit, den Preis zu zahlen?"',
              options: [
                { text: 'Für den Metal tue ich alles.', action: () => {
                  setDialogue('Geist: "Ein mutiger Narr. Das Riff wird dich verändern. Aber der Gig wird unvergesslich."');
                  increaseBandMood(10);
                }},
                { text: 'Was für ein Preis?', action: () => {
                  setDialogue('Geist: "Deine Ohren werden bluten, dein Herz wird im Takt der Maschinen schlagen. Ein fairer Tausch."');
                }}
              ]
            });
          } else {
            setDialogue({
              text: 'Geist: "Ich hab die 80er überlebt, aber diese Tour... die wird euch vernichten. Was willst du wissen, Sterblicher?"',
              options: [
                { text: 'Wie überlebe ich?', action: () => {
                    setDialogue('Geist: "Hör niemals auf zu spielen. Wenn die Stille kommt, kommen sie. Die Schatten des Feedbacks."');
                    increaseBandMood(5);
                }},
                { text: 'Wo ist das beste Bier?', action: () => {
                    setDialogue('Geist: "In der Vergangenheit. Aber das im Kühlschrank tut es auch. Es schmeckt nach Reue."');
                    increaseBandMood(5);
                }},
                { text: 'Wer bist du eigentlich?', action: () => {
                    setDialogue('Geist: "Ich war derjenige, der die Kabel rollte, als die Welt noch aus Röhrenverstärkern bestand. Jetzt bin ich nur noch eine statische Entladung."');
                    increaseBandMood(5);
                }},
                { text: 'Kann ich dir irgendwie helfen?', action: () => {
                    setDialogue('Geist: "Ich sehne mich nach dem Geister-Drink. Er erinnert mich an die guten alten Zeiten. Wenn du ihn mir bringst, werde ich dir helfen."');
                    setFlag('ghostRecipeQuestStarted', true);
                    addQuest('ghost_recipe', 'Mixe den Geister-Drink für den Geist des Roadies');
                    increaseBandMood(5);
                }}
              ]
            });
          }
        }}
      />

      {!hasItem('Batterie') && (
        <Interactable
          position={[-3, 0.5, 4]}
          emoji="🔋"
          name="Batterie"
          scale={0.6}
          onInteract={() => {
            addToInventory('Batterie');
            setDialogue('Eine 9V-Batterie. Sieht noch voll aus.');
          }}
        />
      )}

      {/* Navigation */}
      <Interactable
        position={[0, 0.5, 4]}
        emoji="🚐"
        name="Zum Auftritt"
        onInteract={() => {
          if (hasItem('Repariertes Kabel')) {
            setDialogue('Auf gehts zum Gig! Nächster Halt: Backstage.');
            exitTimeoutRef.current = window.setTimeout(() => setScene('backstage'), 1000);
          } else {
            setDialogue('Wir können noch nicht los. Matze braucht erst ein funktionierendes Kabel.');
          }
        }}
      />

      {/* Decorative Bus Elements */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 3, -4.5]}>
          <boxGeometry args={[4, 1, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <Text
          position={[0, 3, -4.4]}
          fontSize={0.3}
          color="#00ff00"
          font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff"
        >
          NEUROTOXIC TOUR 2026
        </Text>
      </Float>

      <Player bounds={{ x: [-5.2, 5.2], z: [-4.6, 4.6] }} />
    </>
  );
}
