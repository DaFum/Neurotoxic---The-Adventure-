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
import type { DialogueOption } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import { Stars, Float, Text, Sparkles } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useCallback, useEffect, useRef } from 'react';
import { SceneEnvironmentSetpieces } from './SceneEnvironmentSetpieces';

/**
 * Renders the 3D scene environment and logic for Backstage.
 * @returns The 3D group containing scene interactables, NPCs, and boundaries.
 */
export function Backstage() {
  const addToInventory = useStore((state) => state.addToInventory);
  const canPickupItem = useStore((state) => state.canPickupItem);
  const setDialogue = useStore((state) => state.setDialogue);
  const setScene = useStore((state) => state.setScene);
  const flags = useStore((state) => state.flags);
  const setFlag = useStore((state) => state.setFlag);
  const addQuest = useStore((state) => state.addQuest);
  const completeQuest = useStore((state) => state.completeQuest);
  const startAndFinishQuest = useStore((state) => state.startAndFinishQuest);
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const increaseSkill = useStore((state) => state.increaseSkill);
  const hasItem = useStore((state) => state.hasItem);
  const inventory = useStore((state) => state.inventory);
  const removeFromInventory = useStore((state) => state.removeFromInventory);
  const exitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Register the setlist quest when the player first enters Backstage.
    // On legacy saves setlistFound may already be true — use startAndFinishQuest
    // so the quest lands as 'completed' rather than stuck as 'active'.
    const { flags } = useStore.getState();
    if (flags.setlistFound) {
      startAndFinishQuest('setlist', 'Finde die Setliste im Backstage');
    } else {
      addQuest('setlist', 'Finde die Setliste im Backstage');
    }
    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [addQuest, startAndFinishQuest]);

  const ritualActionWrapper = useCallback((mood: number, skillName: "chaos"|"social"|"technical"|null, skillIncrease: number, dialogueText: string) => {
    setDialogue(dialogueText);
    setFlag('backstageRitualPerformed', true);
    // addQuest is idempotent; completeQuest then transitions the quest regardless of
    // whether it was already registered as 'active' (via the ritual-circle discovery path)
    // or not yet registered at all.
    addQuest('backstage_ritual', 'Führe ein Bandritual vor dem Auftritt durch');
    completeQuest('backstage_ritual');
    increaseBandMood(mood);
    if (skillName) {
      increaseSkill(skillName, skillIncrease);
    }
  }, [setDialogue, setFlag, addQuest, completeQuest, increaseBandMood, increaseSkill]);

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
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
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
          font="/fonts/pressstart2p-v16.ttf"
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
                      useStore.getState().completeQuest('maschinen_seele');
                      useStore.getState().discoverLore('maschinen_bewusstsein');
                      useStore.getState().increaseBandMood(40);
                      useStore.getState().increaseSkill('chaos', 5);
                  }},
                  { text: 'Verbinde die Schaltkreise logisch. [Technical 7]', requiredSkill: { name: 'technical', level: 7 }, action: () => {
                      useStore.getState().setDialogue('Du schließt die Systeme kurz. Ein Funkenregen, dann Stabilität. Das Netzwerk steht.');
                      useStore.getState().setFlag('maschinen_seele_complete', true);
                      useStore.getState().completeQuest('maschinen_seele');
                      useStore.getState().discoverLore('maschinen_bewusstsein');
                      useStore.getState().increaseBandMood(30);
                      useStore.getState().increaseSkill('technical', 5);
                  }},
                  { text: 'Lass die Verbindung einfach laufen.', action: () => {
                      useStore.getState().setDialogue('Monitor: "BZZZT... Unkonventionell. Aber es funktioniert. Die Stimmen werden eins. Wir sind bereit."');
                      useStore.getState().setFlag('maschinen_seele_complete', true);
                      useStore.getState().completeQuest('maschinen_seele');
                      useStore.getState().discoverLore('maschinen_bewusstsein');
                      useStore.getState().increaseBandMood(20);
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
                    useStore.getState().completeQuestWithFlag('feedback_monitor_backstage', 'feedbackMonitorBackstageQuestCompleted', true, 'Untersuche den kranken Monitor im Backstage');
                    useStore.getState().increaseBandMood(30);
                    useStore.getState().increaseSkill('technical', 5);
                    useStore.getState().removeFromInventory('Verstärker-Schaltplan');
                }},
                { text: 'Transzendente Frequenzen. [Visionary]', requiredTrait: 'Visionary', action: () => {
                    useStore.getState().setDialogue('Monitor: "BZZZT. Ich sehe... die Musik der Sphären. Danke, Visionär."');
                    useStore.getState().completeQuestWithFlag('feedback_monitor_backstage', 'feedbackMonitorBackstageQuestCompleted', true, 'Untersuche den kranken Monitor im Backstage');
                    useStore.getState().increaseBandMood(40);
                    useStore.getState().increaseSkill('chaos', 5);
                    useStore.getState().removeFromInventory('Verstärker-Schaltplan');
                }},
                { text: 'Standard-Frequenzen.', action: () => {
                    useStore.getState().setDialogue('Monitor: "BZZZT. Okay, das reicht für einen Standard-Gig."');
                    useStore.getState().completeQuestWithFlag('feedback_monitor_backstage', 'feedbackMonitorBackstageQuestCompleted', true, 'Untersuche den kranken Monitor im Backstage');
                    useStore.getState().increaseBandMood(15);
                    useStore.getState().removeFromInventory('Verstärker-Schaltplan');
                }}
              ]
            });
            return;
          }

          if (store.flags.feedbackMonitorBackstageTalked) {
            const options: DialogueOption[] = [
              { text: 'Noch nicht.', action: () => useStore.getState().setDialogue('Monitor: "BZZZT. Beeil dich. Das Rauschen wird lauter."') }
            ];
            if (store.flags.ampSentient && !store.flags.feedbackMonitorBackstageQuestStarted) {
              options.unshift({ text: 'Der Amp hat mir von dir erzählt.', action: () => {
                useStore.getState().setDialogue('Monitor: "Der Amp... er hat gesprochen? Dann gibt es Hoffnung. Verbinde unsere Schaltkreise, Manager. Du musst den Schaltplan finden. Wir sind Brüder im Rauschen."');
                useStore.getState().increaseBandMood(25);
                useStore.getState().increaseSkill('technical', 5);
                useStore.getState().setFlag('feedbackMonitorBackstageQuestStarted', true);
                useStore.getState().addQuest('feedback_monitor_backstage', 'Finde den Verstärker-Schaltplan für den Feedback-Monitor');
              }});
            } else if (!store.flags.feedbackMonitorBackstageQuestStarted) {
              options.unshift({ text: 'Wie kann ich dir helfen?', action: () => {
                useStore.getState().setDialogue('Monitor: "BZZZT. Finde den Verstärker-Schaltplan. Er ist irgendwo im Tourbus versteckt."');
                useStore.getState().setFlag('feedbackMonitorBackstageQuestStarted', true);
                useStore.getState().addQuest('feedback_monitor_backstage', 'Finde den Verstärker-Schaltplan für den Feedback-Monitor');
              }});
            }
            store.setDialogue({
              text: 'Monitor: "BZZZT. Ich habe schon tausend Sänger kommen und gehen sehen. Marius? Der klingt wie eine rostige Kreissäge in einem Mixer. BZZZT. Aber er hat... Seele. Eine sehr, sehr verzerrte Seele. Hast du den Schaltplan gefunden?"',
              options
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
        position={[-4, 1, -5]}
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

          const options: DialogueOption[] = [
            {
              text: 'Du bist ein Gott am Mikrofon. Vertrau dir. [Social 5]',
              requiredSkill: { name: 'social', level: 5 },
              action: () => {
                useStore.getState().setDialogue('Marius: "Ein Gott... ja. Ein Gott des Lärms! Danke, Manager. Ich werde sie alle in Grund und Boden schreien!"');
                useStore.getState().setFlag('mariusCalmed', true);
                useStore.getState().startAndFinishQuest('marius', 'Beruhige Marius vor dem Auftritt');
                useStore.getState().setFlag('mariusConfidenceBoost', true);
                useStore.getState().increaseBandMood(30);
                useStore.getState().increaseSkill('social', 3);
              }
            },
            {
              text: 'Stell dir vor, du bist der einzige Mensch auf der Bühne. [Performer]',
              requiredTrait: 'Performer',
              action: () => {
                useStore.getState().setDialogue('Marius: "Nur ich und das Mikrofon... Keine Erwartungen, nur reiner Ausdruck. Das ist brillant!"');
                useStore.getState().setFlag('mariusCalmed', true);
                useStore.getState().startAndFinishQuest('marius', 'Beruhige Marius vor dem Auftritt');
                useStore.getState().setFlag('mariusConfidenceBoost', true);
                useStore.getState().setFlag('backstage_performer_speech', true);
                useStore.getState().increaseBandMood(30);
                useStore.getState().increaseSkill('social', 3);
              }
            },
            {
              text: 'Angst ist Schwäche. Zerstöre sie. [Brutalist]',
              requiredTrait: 'Brutalist',
              action: () => {
                useStore.getState().setDialogue('Marius: "...Du hast Recht. Zerstören. Einfach alles zerstören!"');
                useStore.getState().setFlag('mariusCalmed', true);
                useStore.getState().startAndFinishQuest('marius', 'Beruhige Marius vor dem Auftritt');
                useStore.getState().increaseBandMood(20);
                useStore.getState().increaseSkill('chaos', 3);
              }
            },
            {
              text: 'Lass die Frequenz durch dich fließen. [Mystic]',
              requiredTrait: 'Mystic',
              action: () => {
                useStore.getState().setDialogue('Marius: "Die Frequenz... ich spüre sie. Ich bin nur das Gefäß. Die Musik spricht."');
                useStore.getState().setFlag('mariusCalmed', true);
                useStore.getState().startAndFinishQuest('marius', 'Beruhige Marius vor dem Auftritt');
                useStore.getState().setFlag('mariusConfidenceBoost', true);
                useStore.getState().increaseBandMood(25);
                useStore.getState().increaseSkill('chaos', 3);
              }
            },
            { text: 'Stell dir einfach vor, sie wären alle aus Lego.', action: () => {
              useStore.getState().setDialogue('Marius: "Lego? Das macht es irgendwie... schmerzhafter? Aber okay, ich versuchs."');
              useStore.getState().setFlag('mariusCalmed', true);
              useStore.getState().startAndFinishQuest('marius', 'Beruhige Marius vor dem Auftritt');
              useStore.getState().increaseBandMood(10);
            }},
            { text: 'Denk an den Gig 1982. Wir haben Schlimmeres überlebt.', action: () => {
              if (useStore.getState().flags.askedAbout1982) {
                useStore.getState().setDialogue('Marius: "1982... ja. Als die Gießerei bebte. Wenn wir das überlebt haben, ist Tangermünde ein Kinderspiel."');
                useStore.getState().setFlag('mariusCalmed', true);
                useStore.getState().startAndFinishQuest('marius', 'Beruhige Marius vor dem Auftritt');
                useStore.getState().setFlag('mariusConfidenceBoost', true);
                useStore.getState().increaseBandMood(25);
              } else {
                useStore.getState().setDialogue('Marius: "1982? Da war ich noch nicht mal in der Band. Wovon redest du? Das macht mich nur noch nervöser!"');
                useStore.getState().increaseBandMood(-5);
              }
            }}
          ];

          if (store.flags.mariusEgoStrategy) {
            options.unshift({
              text: 'Erinnerst du dich an unsere Strategie?',
              action: () => {
                useStore.getState().setDialogue('Marius: "Die Strategie... ja! Ego-Management aktiviert! Ich habe die absolute Kontrolle!"');
                useStore.getState().setFlag('mariusCalmed', true);
                useStore.getState().startAndFinishQuest('marius', 'Beruhige Marius vor dem Auftritt');
                useStore.getState().setFlag('mariusConfidenceBoost', true);
                useStore.getState().increaseBandMood(35);
                useStore.getState().increaseSkill('social', 5);
              }
            });
          }

          store.setDialogue({
            text: bandMood > 50
              ? 'Marius: "Ich bin nervös, aber die Stimmung in der Band gibt mir Kraft. Meinst du, wir schaffen das? Die Fans in Tangermünde sind... intensiv."'
              : 'Marius: "Ich... ich kann das nicht. Da draußen sind Tausende! Was wenn ich meinen Text vergesse? Was wenn die Maschinen versagen?"',
            options
          });
        }}

      />


      {/* Lars - Needs Energy */}
      <Interactable
        position={[4, 1, -5]}
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
            const options: DialogueOption[] = [
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
            ];

            if (store.flags.larsRhythmPact) {
               options.unshift({ text: 'Der Pakt hält.', action: () => {
                  useStore.getState().setDialogue('Lars: "Der Pakt hält! Diese Energie... sie speist direkt das Zentrum des Rhythmus!"');
                  useStore.getState().removeFromInventory('Turbo-Koffein');
                  useStore.getState().setFlag('larsEnergized', true);
                  useStore.getState().increaseBandMood(40);
               }});
               options.unshift({ text: 'Lass den Rhythmus explodieren! [Chaos 5]', requiredSkill: { name: 'chaos', level: 5 }, action: () => {
                  useStore.getState().setDialogue('Lars: "EXPLOSION! DER PAKT BRICHT DIE GRENZEN!"');
                  useStore.getState().removeFromInventory('Turbo-Koffein');
                  useStore.getState().setFlag('larsEnergized', true);
                  useStore.getState().setFlag('larsVibrating', true);
                  useStore.getState().increaseBandMood(50);
               }});
            }

            store.setDialogue({
              text: 'Lars: "WAS IST DAS?! Turbo-Koffein?! Gib her, ich will die Schallmauer durchbrechen!"',
              options
            });
          } else if (store.hasItem('Energiedrink')) {
            const energyText = store.flags.larsRhythmPact
              ? 'Lars: "JA! Der Treibstoff für unseren Pakt! Der Rhythmus explodiert in mir!"'
              : 'Lars: "JA! Das ist der Treibstoff, den ich brauche! Nicht so gut wie Turbo-Koffein, aber es reicht."';
            store.setDialogue(energyText);
            store.removeFromInventory('Energiedrink');
            store.setFlag('larsEnergized', true);
            store.increaseBandMood(store.flags.larsRhythmPact ? 35 : 10);
          } else {
            store.setDialogue('Lars: "Ich bin total platt. Ohne Koffein geht hier gar nichts. Hast du was Stärkeres als Wasser?"');
          }
        }}
      />

      {/* Items */}
      {!flags.setlistFound && canPickupItem('Setliste') && !inventory.includes('Setliste') && (
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

      {canPickupItem('Stift') && !inventory.includes('Stift') && (
        <Interactable
          position={[8, 0, 2]}
          emoji="🖊️"
          name="Stift"
          onInteract={() => {
            addToInventory('Stift');
            setDialogue('Ein wasserfester Edding. Perfekt für Autogramme auf verschwitzten T-Shirts oder um "NEUROTOXIC" auf fremde Tourbusse zu schreiben.');
          }}
        />
      )}

      {canPickupItem('Lötkolben') && !inventory.includes('Lötkolben') && (
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

          if (store.flags.mariusCalmed && !store.flags.backstageRitualPerformed) {
             store.setDialogue({
                text: 'Manager: "Zeit für unser Ritual. Lasst uns die Energien bündeln."',
                options: [
                   { text: 'Kosmisches Ritual. [Mystic]', requiredTrait: 'Mystic', action: () => {
                      ritualActionWrapper(35, 'chaos', 5, 'Ihr haltet euch an den Händen und channelt die Frequenzen der Void Station. Ein kosmisches Summen erfüllt den Raum.');
                   }},
                   { text: 'Showmanship Ritual. [Performer]', requiredTrait: 'Performer', action: () => {
                      ritualActionWrapper(30, 'social', 5, 'Ein lauter Schlachtruf, eine Pose für unsichtbare Kameras. Die Energie ist elektrisierend!');
                   }},
                   { text: 'Frequenz-Anpassung. [Technician]', requiredTrait: 'Technician', action: () => {
                      ritualActionWrapper(25, 'technical', 5, 'Ihr atmet exakt auf 120 BPM und stimmt eure inneren Frequenzen auf 432 Hz ab. Perfekte Synchronisation.');
                   }},
                   { text: 'Einfacher Gruppen-Chant.', action: () => {
                      ritualActionWrapper(15, null, 0, 'Ihr legt die Hände übereinander. "1, 2, 3... NEUROTOXIC!"');
                   }}
                ]
             });
             return;
          }

          if (store.flags.frequenz1982_complete) {
             store.setDialogue('Der Kreis leuchtet stetig im Takt von 1982. Die Realität hat hier einen Riss.');
             return;
          }

          const hasFrequenzfragment = store.hasItem('Frequenzfragment');

          if (hasResonanz && store.flags.backstage_blueprint_found) {
             store.setDialogue({
               text: 'Du hast den Resonanz-Kristall und die Blaupause. Der Ritual-Kreis pulsiert in einem unnatürlichen Takt.',
               options: [
                 { text: 'Vollende die Frequenz von 1982. [Mystic]', requiredTrait: 'Mystic', action: () => {
                   useStore.getState().setDialogue('Du legst den Kristall in die Mitte. Ein dröhnender Bass geht durch den Raum. Du hast das Geheimnis der Gießerei entschlüsselt!');
                   useStore.getState().setFlag('frequenz1982_complete', true);
                   useStore.getState().completeQuest('frequenz_1982');
                   useStore.getState().discoverLore('frequenz_1982_decoded');
                   useStore.getState().increaseBandMood(50);
                   useStore.getState().removeFromInventory('Resonanz-Kristall');
                 }},
                 { text: 'Zerschmettere den Kristall im Zentrum! [Brutalist]', requiredTrait: 'Brutalist', action: () => {
                   useStore.getState().setDialogue('Du schleuderst den Kristall auf den Kreismittelpunkt. Er zersplittert in Scherben aus reiner Frequenz. Funken fliegen, die Realität weint. Die Frequenz gehört jetzt NEUROTOXIC!');
                   useStore.getState().removeFromInventory('Resonanz-Kristall');
                   useStore.getState().setFlag('frequenz1982_complete', true);
                   useStore.getState().completeQuest('frequenz_1982');
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

          if (hasFrequenzfragment && store.flags.backstage_blueprint_found) {
             store.setDialogue({
               text: 'Du hast das Frequenzfragment und die Blaupause. Der Ritual-Kreis summt latent.',
               options: [
                 { text: 'Erzwinge die Frequenz mit purer Kraft! [Brutalist]', requiredTrait: 'Brutalist', action: () => {
                   useStore.getState().setDialogue('Du drückst das rohe Fragment ins Zentrum und schlägst darauf ein. Funken fliegen, die Realität weint. Die Frequenz gehört jetzt NEUROTOXIC!');
                   useStore.getState().removeFromInventory('Frequenzfragment');
                   useStore.getState().setFlag('frequenz1982_complete', true);
                   useStore.getState().completeQuest('frequenz_1982');
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
          } else if (store.flags.backstageRitualPerformed) {
             store.setDialogue('Die Kerzen brennen noch intensiver nach eurem Ritual. Ihr seid bereit.');
          } else {
             store.setDialogue('Ein Kreis aus schwarzen Kerzen und zerbrochenen Plektren. Marius muss erst beruhigt werden, bevor ihr das Ritual abhalten könnt.');
             if (!store.quests.find(q => q.id === 'backstage_ritual')) {
               store.addQuest('backstage_ritual', 'Führe ein Bandritual vor dem Auftritt durch');
               store.increaseBandMood(5);
             }
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
          const store = useStore.getState();
          if (store.flags.mariusCalmed && store.flags.setlistFound) {
            setDialogue('Die Welt beginnt zu flimmern. Wir verlassen die bekannte Realität.');
            if (exitTimeoutRef.current !== null) {
              window.clearTimeout(exitTimeoutRef.current);
            }
            exitTimeoutRef.current = window.setTimeout(() => {
              if (useStore.getState().scene === 'backstage') {
                useStore.getState().setScene('void_station');
              }
              exitTimeoutRef.current = null;
            }, 1000);
          } else {
            setDialogue('Wir können noch nicht raus. Marius braucht Hilfe und die Setliste fehlt!');
          }
        }}
      />

      <SceneEnvironmentSetpieces variant="backstage" />

      <Player bounds={{ x: [-14, 14], z: [-9, 9] }} />
    </>
  );
}
