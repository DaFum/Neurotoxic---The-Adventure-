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
import { Stars, Float, Text, Sparkles } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';

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
      <color attach="background" args={['#2a3340']} />
      <fog attach="fog" args={['#2f3947', 24, 95]} />
      <ambientLight intensity={0.9} />
      <hemisphereLight args={['#eef6ff', '#334052', 0.72]} />
      <directionalLight position={[0, 9, 7]} intensity={1.05} color="#fff5ea" />
      <pointLight position={[0, 5, 0]} intensity={2.9} color="#adff2f" />
      <pointLight position={[-10, 3, -4]} intensity={2.3} color="#6eff9d" />
      <pointLight position={[10, 3, -4]} intensity={2.3} color="#8c6eff" />
      <pointLight position={[0, 4, 6]} intensity={2.1} color="#ff68d2" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={80} scale={[28, 10, 22]} size={1.2} speed={0.35} opacity={0.25} color="#c3ff86" />

      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial color="#3e4a58" emissive="#1d2835" emissiveIntensity={0.34} metalness={0.35} roughness={0.76} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed">
        <mesh position={[0, 5, -10]}>
          <boxGeometry args={[30, 10, 1]} />
          <meshStandardMaterial color="#344253" emissive="#172434" emissiveIntensity={0.32} metalness={0.28} roughness={0.7} />
        </mesh>
        <mesh position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[20, 10, 1]} />
          <meshStandardMaterial color="#303d4d" emissive="#162230" emissiveIntensity={0.3} metalness={0.28} roughness={0.72} />
        </mesh>
        <mesh position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[20, 10, 1]} />
          <meshStandardMaterial color="#303d4d" emissive="#162230" emissiveIntensity={0.3} metalness={0.28} roughness={0.72} />
        </mesh>
      </RigidBody>

      {/* Stage tape and runway lines */}
      {[-6, -3, 0, 3, 6].map((x) => (
        <mesh key={`tape-${x}`} position={[x, -0.48, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.22, 13]} />
          <meshStandardMaterial color="#d4ff3d" emissive="#d4ff3d" emissiveIntensity={0.45} />
        </mesh>
      ))}
      <mesh position={[0, -0.49, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 0.25]} />
        <meshStandardMaterial color="#ff7b5f" emissive="#ff7b5f" emissiveIntensity={0.38} />
      </mesh>

      {/* Makeup mirrors with bulbs */}
      {[[-14.2, 2.7, -4], [14.2, 2.7, -4]].map((pos, idx) => (
        <group key={`mirror-${idx}`} position={pos as [number, number, number]} rotation={[0, idx === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[3.2, 2.2]} />
            <meshStandardMaterial color="#1f2d38" emissive="#33566f" emissiveIntensity={0.36} metalness={0.25} roughness={0.48} />
          </mesh>
          {[-1.25, -0.62, 0, 0.62, 1.25].map((x) => (
            <mesh key={`bulb-top-${idx}-${x}`} position={[x, 1.2, 0.05]}>
              <sphereGeometry args={[0.11, 10, 10]} />
              <meshStandardMaterial color="#fff3bf" emissive="#fff3bf" emissiveIntensity={1.5} />
            </mesh>
          ))}
          {[-1.25, -0.62, 0, 0.62, 1.25].map((x) => (
            <mesh key={`bulb-bottom-${idx}-${x}`} position={[x, -1.2, 0.05]}>
              <sphereGeometry args={[0.11, 10, 10]} />
              <meshStandardMaterial color="#fff3bf" emissive="#fff3bf" emissiveIntensity={1.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Truss lights */}
      {[-12, -6, 0, 6, 12].map((x) => (
        <group key={`truss-${x}`} position={[x, 7.2, -6]}>
          <mesh>
            <boxGeometry args={[1.8, 0.14, 0.14]} />
            <meshStandardMaterial color="#20242b" metalness={0.75} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#adff2f" emissive="#adff2f" emissiveIntensity={1.8} />
          </mesh>
        </group>
      ))}

      {/* Backstage interior props */}
      {[-11, -7, -3, 1, 5, 9].map((x) => (
        <mesh key={`flightcase-${x}`} position={[x, 0.55, -2.2]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.1, 1]} />
          <meshStandardMaterial color="#2a3440" emissive="#182531" emissiveIntensity={0.35} metalness={0.75} roughness={0.28} />
        </mesh>
      ))}
      {[-11, -7, -3, 1, 5, 9].map((x, idx) => (
        <group key={`flightcase-detail-${x}`} position={[x, 0.55, -2.2]}>
          <mesh position={[0, 0.48, 0]}>
            <boxGeometry args={[1.46, 0.08, 0.86]} />
            <meshStandardMaterial color="#7f8fa3" emissive="#3c4d61" emissiveIntensity={0.25} metalness={0.85} roughness={0.2} />
          </mesh>
          {[-0.72, 0.72].map((px) => (
            <mesh key={`flightcase-edge-${idx}-${px}`} position={[px, 0, 0]}>
              <boxGeometry args={[0.08, 0.9, 0.92]} />
              <meshStandardMaterial color="#aeb8c5" metalness={0.9} roughness={0.22} />
            </mesh>
          ))}
          {[-0.45, 0.45].map((px) => (
            <mesh key={`flightcase-wheel-l-${idx}-${px}`} position={[px, -0.58, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
              <meshStandardMaterial color="#1a2128" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
          {[-0.45, 0.45].map((px) => (
            <mesh key={`flightcase-wheel-r-${idx}-${px}`} position={[px, -0.58, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
              <meshStandardMaterial color="#1a2128" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 3.8, -9.4]}>
        <planeGeometry args={[26, 5.8]} />
        <meshStandardMaterial color="#1b0f17" emissive="#2b1025" emissiveIntensity={0.45} />
      </mesh>
      {[-9, -3, 3, 9].map((x) => (
        <mesh key={`rack-${x}`} position={[x, 1.6, 6.8]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 3.2, 0.7]} />
          <meshStandardMaterial color="#28303a" emissive="#121c2a" emissiveIntensity={0.32} metalness={0.55} roughness={0.5} />
        </mesh>
      ))}
      {[-9, -3, 3, 9].map((x, idx) => (
        <group key={`rack-detail-${x}`} position={[x, 1.6, 6.8]}>
          {[0.95, 0.25, -0.45].map((y, row) => (
            <mesh key={`rack-screen-${idx}-${row}`} position={[0, y, 0.36]}>
              <planeGeometry args={[1.8, 0.45]} />
              <meshStandardMaterial color={row % 2 === 0 ? '#66e6ff' : '#b2ff6a'} emissive={row % 2 === 0 ? '#3ebed8' : '#6ea637'} emissiveIntensity={0.75} metalness={0.45} roughness={0.25} />
            </mesh>
          ))}
          {[-0.7, 0.7].map((px) => (
            <mesh key={`rack-post-${idx}-${px}`} position={[px, 0, 0.35]}>
              <boxGeometry args={[0.08, 2.9, 0.08]} />
              <meshStandardMaterial color="#bbc4cf" metalness={0.88} roughness={0.22} />
            </mesh>
          ))}
        </group>
      ))}
      {[-10, -6, 6, 10].map((x) => (
        <mesh key={`stack-${x}`} position={[x, 1.7, -7.3]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 3.4, 1.4]} />
          <meshStandardMaterial color="#3a2a1c" emissive="#23180f" emissiveIntensity={0.24} metalness={0.4} roughness={0.58} />
        </mesh>
      ))}
      {[[-12.5, 0.55, 2.8], [12.5, 0.55, 2.8], [-12.5, 0.55, -0.2], [12.5, 0.55, -0.2]].map((pos, idx) => (
        <mesh key={`sofa-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.1, 2.2]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#2a3a52' : '#4b2936'} emissive={idx % 2 === 0 ? '#162236' : '#2c1520'} emissiveIntensity={0.28} roughness={0.74} />
        </mesh>
      ))}

      {/* Dressing desks and stage gear */}
      {[[-12.9, 1.05, -4], [12.9, 1.05, -4]].map((pos, idx) => (
        <group key={`desk-${idx}`} position={pos as [number, number, number]} rotation={[0, idx === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.16, 1.1]} />
            <meshStandardMaterial color="#6f4c36" emissive="#362418" emissiveIntensity={0.3} roughness={0.72} />
          </mesh>
          {[-1.3, 1.3].map((x) => (
            <mesh key={`desk-leg-${idx}-${x}`} position={[x, -0.48, 0.4]} castShadow receiveShadow>
              <boxGeometry args={[0.16, 1, 0.16]} />
              <meshStandardMaterial color="#b7c1cf" metalness={0.86} roughness={0.22} />
            </mesh>
          ))}
          {[-1.3, 1.3].map((x) => (
            <mesh key={`desk-leg-back-${idx}-${x}`} position={[x, -0.48, -0.4]} castShadow receiveShadow>
              <boxGeometry args={[0.16, 1, 0.16]} />
              <meshStandardMaterial color="#b7c1cf" metalness={0.86} roughness={0.22} />
            </mesh>
          ))}
          {[-0.9, -0.3, 0.3, 0.9].map((x, n) => (
            <mesh key={`desk-item-${idx}-${n}`} position={[x, 0.15, 0]} castShadow>
              <boxGeometry args={[0.22, 0.08, 0.12]} />
              <meshStandardMaterial color={n % 2 === 0 ? '#ff79d3' : '#72d8ff'} emissive={n % 2 === 0 ? '#a9357f' : '#2c7fab'} emissiveIntensity={0.5} metalness={0.55} roughness={0.35} />
            </mesh>
          ))}
        </group>
      ))}
      {[[-7, 0.7, 0.9], [-5.4, 0.7, 0.6], [5.6, 0.7, 0.8], [7.2, 0.7, 0.5]].map((pos, idx) => (
        <group key={`amp-rack-${idx}`} position={pos as [number, number, number]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.4, 0.9]} />
            <meshStandardMaterial color="#314257" emissive="#17283d" emissiveIntensity={0.36} metalness={0.58} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.26, 0.46]}>
            <planeGeometry args={[0.86, 0.22]} />
            <meshStandardMaterial color="#88ff70" emissive="#88ff70" emissiveIntensity={0.75} />
          </mesh>
          <mesh position={[0, -0.2, 0.46]}>
            <planeGeometry args={[0.86, 0.22]} />
            <meshStandardMaterial color="#6ac8ff" emissive="#6ac8ff" emissiveIntensity={0.72} />
          </mesh>
        </group>
      ))}

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
          const hasSchaltplan = useStore.getState().hasItem('Verstärker-Schaltplan');
          
          if (flags.feedbackMonitorBackstageQuestCompleted) {
            setDialogue('Monitor: "BZZZT. Die Frequenzen sind perfekt. Danke, Manager."');
            return;
          }

          if (flags.feedbackMonitorBackstageQuestStarted && hasSchaltplan) {
            setDialogue({
              text: 'Monitor: "Du hast den Schaltplan! Kannst du meine Frequenzen optimieren?"',
              options: [
                { text: 'Optimierte Frequenzen. [Technical 5]', requiredSkill: { name: 'technical', level: 5 }, action: () => {
                    setDialogue('Monitor: "BZZZT. Exzellent. Die Verzerrung ist nun mathematisch perfekt. Danke, Manager."');
                    setFlag('feedbackMonitorBackstageQuestCompleted', true);
                    completeQuest('feedback_monitor_backstage');
                    increaseBandMood(30);
                    useStore.getState().increaseSkill('technical', 5);
                    removeFromInventory('Verstärker-Schaltplan');
                }},
                { text: 'Transzendente Frequenzen. [Visionary]', requiredTrait: 'Visionary', action: () => {
                    setDialogue('Monitor: "BZZZT. Ich sehe... die Musik der Sphären. Danke, Visionär."');
                    setFlag('feedbackMonitorBackstageQuestCompleted', true);
                    completeQuest('feedback_monitor_backstage');
                    increaseBandMood(40);
                    useStore.getState().increaseSkill('chaos', 5);
                    removeFromInventory('Verstärker-Schaltplan');
                }},
                { text: 'Standard-Frequenzen.', action: () => {
                    setDialogue('Monitor: "BZZZT. Okay, das reicht für einen Standard-Gig."');
                    setFlag('feedbackMonitorBackstageQuestCompleted', true);
                    completeQuest('feedback_monitor_backstage');
                    increaseBandMood(15);
                    removeFromInventory('Verstärker-Schaltplan');
                }}
              ]
            });
            return;
          }

          if (flags.feedbackMonitorBackstageTalked) {
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
                      setFlag('feedbackMonitorBackstageQuestStarted', true);
                      useStore.getState().addQuest('feedback_monitor_backstage', 'Finde den Verstärker-Schaltplan für den Feedback-Monitor');
                    }}
                  ]
                });
                setFlag('feedbackMonitorBackstageTalked', true);
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
            removeFromInventory('Energiedrink');
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

      {/* Exit to TourBus */}
      <Interactable
        position={[-8, 0, 8]}
        emoji="🚐"
        name="Zurück zum Tourbus"
        onInteract={() => {
          setDialogue('Nochmal zum Bus gehen? Sicher ist sicher.');
          if (exitTimeoutRef.current !== null) {
            window.clearTimeout(exitTimeoutRef.current);
          }
          exitTimeoutRef.current = window.setTimeout(() => {
            if (useStore.getState().scene === 'backstage') setScene('tourbus');
            exitTimeoutRef.current = null;
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
