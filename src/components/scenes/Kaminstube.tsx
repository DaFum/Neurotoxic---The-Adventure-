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
import type { DialogueOption } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import { ContactShadows, Sparkles } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { SceneEnvironmentSetpieces } from './SceneEnvironmentSetpieces';

/** Kaminstube function. */
export function Kaminstube() {
  const flags = useStore((state) => state.flags);
  const setFlag = useStore((state) => state.setFlag);
  const addToInventory = useStore((state) => state.addToInventory);
  const removeFromInventory = useStore((state) => state.removeFromInventory);
  const addQuest = useStore((state) => state.addQuest);
  const completeQuest = useStore((state) => state.completeQuest);
  const hasItem = useStore((state) => state.hasItem);
  const setDialogue = useStore((state) => state.setDialogue);
  const increaseBandMood = useStore((state) => state.increaseBandMood);

  const pointLightRef = useRef<THREE.PointLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const tRef = useRef(0);

  useFrame((state, delta) => {
    if (flags.ampFixed) {
      // Dynamic lighting when the amp is fixed (show starts)
      tRef.current += delta || 0;
      const t = tRef.current;
      const beat = Math.abs(Math.sin(t * 4)); // Simple beat sync
      
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 4.5 + beat * 10;
        pointLightRef.current.color.setHSL((t * 0.5) % 1, 1, 0.5);
      }
      if (dirLightRef.current) {
        dirLightRef.current.intensity = 1.3 + beat * 2;
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#5b3a2a']} />
      <fog attach="fog" args={['#5a3e2f', 18, 82]} />
      <ambientLight intensity={0.92} />
      <hemisphereLight args={['#fff1dc', '#5a4038', 0.75]} />
      <pointLight ref={pointLightRef} position={[0, 5, -5]} intensity={4.5} color="#ffaa00" />
      <directionalLight ref={dirLightRef} position={[10, 10, 5]} intensity={1.3} color="#ff6a4a" />
      <pointLight position={[-9, 2.4, -3]} intensity={2.3} color="#ff7a3a" />
      <pointLight position={[9, 2.2, -1]} intensity={2.1} color="#ff9c4a" />
      <pointLight position={[0, 2.8, 3.6]} intensity={2} color="#fff2e1" />
      <pointLight position={[0, 3.2, -2.5]} intensity={1.9} color="#7f7dff" />
      
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#5a3f34" emissive="#2f1f1a" emissiveIntensity={0.34} metalness={0.22} roughness={0.76} />
        </mesh>
      </RigidBody>

      {/* Stage */}
      <RigidBody type="fixed" position={[0, 0.5, -6]}>
        <mesh receiveShadow>
          <boxGeometry args={[12, 1, 4]} />
          <meshStandardMaterial color="#1e232b" emissive="#0e141d" emissiveIntensity={0.28} metalness={0.48} roughness={0.65} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 5, -8]}>
        <mesh receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#6e4f45" emissive="#35211a" emissiveIntensity={0.36} metalness={0.2} roughness={0.72} />
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

      {/* Fireplace core */}
      <mesh position={[-11.5, 1.4, 2.2]}>
        <boxGeometry args={[2.1, 2.6, 1.2]} />
        <meshStandardMaterial color="#2a1a12" metalness={0.2} roughness={0.9} />
      </mesh>
      <mesh position={[-11.5, 2.9, 2.15]}>
        <boxGeometry args={[2.4, 0.22, 1.38]} />
        <meshStandardMaterial color="#6f4d34" emissive="#2e1f14" emissiveIntensity={0.26} roughness={0.76} />
      </mesh>
      <mesh position={[-11.5, 4.1, 2.2]}>
        <boxGeometry args={[1.1, 2.2, 0.9]} />
        <meshStandardMaterial color="#5b402e" emissive="#26190f" emissiveIntensity={0.2} roughness={0.82} />
      </mesh>
      <mesh position={[-11.5, 1.1, 2.75]}>
        <planeGeometry args={[1.3, 1.4]} />
        <meshBasicMaterial color="#ff7a2f" transparent opacity={0.7} />
      </mesh>
      <Sparkles count={45} scale={[1.2, 1.2, 1.2]} size={1.6} speed={0.6} color="#ffb36b" position={[-11.5, 1.8, 2.4]} />

      {/* Tables and stools */}
      {[
        [-6, 0.6, 1.5],
        [5.5, 0.6, 2],
        [9, 0.6, -3],
      ].map((pos, idx) => (
        <group key={`table-${idx}`} position={pos as [number, number, number]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.8, 0.9, 0.15, 18]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#5f3a2f' : '#3f2f5f'} emissive={idx % 2 === 0 ? '#2c1712' : '#1b1230'} emissiveIntensity={0.22} />
          </mesh>
          <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.16, 0.9, 10]} />
            <meshStandardMaterial color="#241915" metalness={0.2} />
          </mesh>
          {[-0.85, 0.85].map((x) => (
            <mesh key={`stool-a-${x}`} position={[x, -0.55, 0.3]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.26, 0.6, 10]} />
              <meshStandardMaterial color="#3a2722" emissive="#1a100d" emissiveIntensity={0.14} roughness={0.85} />
            </mesh>
          ))}
          {[-0.85, 0.85].map((x) => (
            <mesh key={`stool-b-${x}`} position={[x, -0.55, -0.3]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.26, 0.6, 10]} />
              <meshStandardMaterial color="#3a2722" emissive="#1a100d" emissiveIntensity={0.14} roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
      {[[-6, 0.78, 1.3], [5.5, 0.78, 1.8], [9, 0.78, -3.2]].map((pos, idx) => (
        <group key={`mug-${idx}`} position={pos as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.14, 0.22, 14]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#f2d28d' : '#9dc8ff'} emissive={idx % 2 === 0 ? '#7f5c26' : '#3a5f87'} emissiveIntensity={0.34} roughness={0.62} />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <torusGeometry args={[0.05, 0.014, 8, 14]} />
            <meshStandardMaterial color="#f2e8d1" metalness={0.22} roughness={0.55} />
          </mesh>
        </group>
      ))}

      {/* Ceiling beams */}
      {[-10, -5, 0, 5, 10].map((x) => (
        <mesh key={`beam-${x}`} position={[x, 6.3, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.35, 15]} />
          <meshStandardMaterial color="#2b1d18" roughness={0.95} />
        </mesh>
      ))}
      {[-9, -3, 3, 9].map((x) => (
        <group key={`lamp-${x}`} position={[x, 5.8, -0.8]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.1, 8]} />
            <meshStandardMaterial color="#33251d" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.65, 0]} castShadow>
            <sphereGeometry args={[0.23, 14, 14]} />
            <meshStandardMaterial color="#ffc56f" emissive="#ffc56f" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}

      {/* Bar counter + bottle shelves */}
      <mesh position={[11.2, 1.05, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 2.1, 8.8]} />
        <meshStandardMaterial color="#5a2f1f" emissive="#2b140d" emissiveIntensity={0.28} metalness={0.2} roughness={0.8} />
      </mesh>
      {[2.6, 0.8, -1, -2.8].map((z, idx) => (
        <group key={`bar-tap-${idx}`} position={[10.34, 1.48, z]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
            <meshStandardMaterial color="#c3ccd6" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.16, 0.1, 0]}>
            <boxGeometry args={[0.24, 0.12, 0.08]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#ffd36e' : '#9d8cff'} emissive={idx % 2 === 0 ? '#a56e18' : '#5b4aa8'} emissiveIntensity={0.44} />
          </mesh>
        </group>
      ))}
      {[2.2, 1.3, 0.4].map((y, idx) => (
        <mesh key={`shelf-${idx}`} position={[10.35, y, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.08, 7.4]} />
          <meshStandardMaterial color="#714330" />
        </mesh>
      ))}
      {[-3, -1.5, 0, 1.5, 3].map((z) => (
        <mesh key={`bottle-${z}`} position={[10.15, 2.35, z]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.45, 10]} />
          <meshStandardMaterial color="#6b8f7f" emissive="#223a31" emissiveIntensity={0.35} />
        </mesh>
      ))}

      {/* Colored stained windows and stage monitors */}
      {[-9, -3, 3, 9].map((x, idx) => (
        <mesh key={`window-${x}`} position={[x, 4.1, -7.88]}>
          <planeGeometry args={[2.2, 2.4]} />
          <meshStandardMaterial color={idx % 2 === 0 ? '#ff9b4d' : '#7d5dff'} emissive={idx % 2 === 0 ? '#5a2d14' : '#24195f'} emissiveIntensity={0.45} transparent opacity={0.48} />
        </mesh>
      ))}
      {[-4.2, -1.2, 1.2, 4.2].map((x) => (
        <mesh key={`monitor-${x}`} position={[x, 0.62, -4.65]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.8, 0.9]} />
          <meshStandardMaterial color="#1f2430" emissive="#0f1a2b" emissiveIntensity={0.3} metalness={0.58} roughness={0.45} />
        </mesh>
      ))}

      {/* Stage drum kit and cable coils */}
      <group position={[0.2, 0.66, -5.55]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.72, 0.75, 0.8, 22]} />
          <meshStandardMaterial color="#344863" emissive="#1a2f49" emissiveIntensity={0.35} metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh position={[-0.95, 0.16, 0.2]} castShadow>
          <cylinderGeometry args={[0.36, 0.38, 0.46, 18]} />
          <meshStandardMaterial color="#3f5877" emissive="#1f3652" emissiveIntensity={0.32} metalness={0.5} roughness={0.42} />
        </mesh>
        <mesh position={[0.98, 0.18, 0.15]} castShadow>
          <cylinderGeometry args={[0.4, 0.42, 0.5, 18]} />
          <meshStandardMaterial color="#3f5877" emissive="#1f3652" emissiveIntensity={0.32} metalness={0.5} roughness={0.42} />
        </mesh>
        <mesh position={[-0.35, 0.74, -0.12]}>
          <cylinderGeometry args={[0.38, 0.38, 0.06, 20]} />
          <meshStandardMaterial color="#d8e0ea" metalness={0.92} roughness={0.14} />
        </mesh>
        <mesh position={[0.72, 0.94, -0.12]} rotation={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.46, 0.46, 0.05, 20]} />
          <meshStandardMaterial color="#f0d37c" emissive="#aa7a1f" emissiveIntensity={0.28} metalness={0.92} roughness={0.14} />
        </mesh>
      </group>
      {[-1.4, -0.6, 0.2, 1].map((x) => (
        <mesh key={`coil-${x}`} position={[x, 0.03, -3.85]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.03, 10, 24]} />
          <meshStandardMaterial color="#1d2330" metalness={0.55} roughness={0.4} />
        </mesh>
      ))}

      {/* Poster */}
      <mesh position={[4, 4, -7.9]}>
        <planeGeometry args={[3, 2]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <group position={[4, 4, -7.87]}>
        <mesh>
          <planeGeometry args={[2.6, 1.6]} />
          <meshStandardMaterial color="#4a1d12" emissive="#2b130c" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.46, 0.01]}>
          <planeGeometry args={[1.9, 0.18]} />
          <meshBasicMaterial color="#fdba74" />
        </mesh>
        <mesh position={[0, 0.02, 0.01]}>
          <planeGeometry args={[1.5, 0.22]} />
          <meshBasicMaterial color="#ffedd5" />
        </mesh>
        <mesh position={[0, -0.36, 0.01]}>
          <planeGeometry args={[1.7, 0.17]} />
          <meshBasicMaterial color="#fed7aa" />
        </mesh>
      </group>

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
                  text: 'Ich fühle deine Wärme, alter Freund. [Mystic]',
                  requiredTrait: 'Mystic',
                  action: () => {
                    useStore.getState().setDialogue('Du verbindest dich mit der uralten Asche. Der Kamin flüstert von Salzgitter: "Dort wird die Grenze zwischen Musik und Realität brechen. Nur eine vereinte Band kann den Riss schließen."');
                    useStore.getState().setFlag('forgotten_lore', true);
                    useStore.getState().setFlag('kaminFeuerPact', true);
                    useStore.getState().discoverLore('kamin_prophecy');
                    useStore.getState().completeQuest('forgotten_lore');
                    useStore.getState().increaseBandMood(20);
                  }
                },
                {
                  text: 'Zwinge das Feuer zu sprechen! [Chaos 7]',
                  requiredSkill: { name: 'chaos', level: 7 },
                  action: () => {
                    useStore.getState().setDialogue('Du schreist in die Flammen. Das Feuer lodert rot auf und faucht: "Salzgitter wird brennen! Nur Einigkeit rettet euch vor der Leere!"');
                    useStore.getState().setFlag('forgotten_lore', true);
                    useStore.getState().setFlag('kaminFeuerPact', true);
                    useStore.getState().discoverLore('kamin_prophecy');
                    useStore.getState().completeQuest('forgotten_lore');
                    useStore.getState().increaseBandMood(10);
                    useStore.getState().increaseSkill('chaos', 3);
                  }
                },
                {
                  text: 'Die Akustik dieses Kamins... [Technical 8]',
                  requiredSkill: { name: 'technical', level: 8 },
                  action: () => {
                    useStore.getState().setDialogue('Du decodierst die Frequenzen des Knisterns. Eine Nachricht aus der Vergangenheit: "In Salzgitter wird die Grenze brechen. Vereint die Band."');
                    useStore.getState().setFlag('forgotten_lore', true);
                    useStore.getState().setFlag('kaminFeuerPact', true);
                    useStore.getState().discoverLore('kamin_prophecy');
                    useStore.getState().completeQuest('forgotten_lore');
                    useStore.getState().increaseBandMood(15);
                    useStore.getState().increaseSkill('technical', 3);
                  }
                },
                {
                  text: 'Versuche, die Sprache zu deuten. [Diplomat]',
                  requiredTrait: 'Diplomat',
                  action: () => {
                    useStore.getState().setDialogue('Du verstehst das Flüstern! Es erzählt von einem versteckten Archiv unter der Bühne, das die wahren Ursprünge des Industrial Metal enthält. Du hast die Lore entschlüsselt.');
                    useStore.getState().setFlag('forgotten_lore', true);
                    useStore.getState().setFlag('kaminFeuerPact', true);
                    useStore.getState().discoverLore('kamin_prophecy');
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
                  useStore.getState().discoverLore('wirt_confession');
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
                  useStore.getState().discoverLore('wirt_vergangenheit');
                  useStore.getState().addToInventory('Turbo-Koffein');
                  useStore.getState().increaseBandMood(30);
                }}
              ]
            });
            return;
          }

          if (store.flags.wirtSecretItem) {
            store.setDialogue('Wirt: "Viel Erfolg beim Gig. Salzgitter wartet auf den Knall."');
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


          if (bandMood > 80 && !store.flags.wirtLegacy1982) {
            const knowsSecret = store.flags.askedAbout1982 || store.flags.ghostSecretRevealed;
            if (knowsSecret) {
               const wirtOptions: DialogueOption[] = [
                  { text: 'Erzähl mir die ganze Geschichte von 1982.', action: () => {
                     useStore.getState().setDialogue({
                        text: 'Wirt: "Das ist gefährliches Wissen... Der Manager von damals, er wusste, worauf er sich einlässt."',
                        options: [
                           { text: 'Ich bin vertrauenswürdig. [Diplomat]', requiredTrait: 'Diplomat', action: () => {
                              useStore.getState().setDialogue('Wirt: "Na gut. Er machte einen Pakt mit der Void. Der Bassist war der Preis für den ultimativen Riff. Salzgitter war nur der Anfang. Passt auf euch auf."');
                              useStore.getState().setFlag('wirtLegacy1982', true);
                              useStore.getState().addQuest('wirt_legacy', 'Erfahre die vollständige Geschichte von 1982 vom Wirt');
                              useStore.getState().completeQuest('wirt_legacy');
                              useStore.getState().increaseBandMood(25);
                              useStore.getState().increaseSkill('social', 5);
                           }},
                           { text: 'Es ist wichtig für die Band. [Social 7]', requiredSkill: { name: 'social', level: 7 }, action: () => {
                              useStore.getState().setDialogue('Wirt: "Für die Band... okay. Der Manager verkaufte den Bassisten an die Leere, um den perfekten Industrial-Sound zu erschaffen. Begeht nicht den gleichen Fehler."');
                              useStore.getState().setFlag('wirtLegacy1982', true);
                              useStore.getState().addQuest('wirt_legacy', 'Erfahre die vollständige Geschichte von 1982 vom Wirt');
                              useStore.getState().completeQuest('wirt_legacy');
                              useStore.getState().increaseBandMood(20);
                              useStore.getState().increaseSkill('social', 3);
                           }},
                           { text: 'Die Wahrheit muss raus! [Chaos 5]', requiredSkill: { name: 'chaos', level: 5 }, action: () => {
                              useStore.getState().setDialogue('Wirt: "Schrei nicht so! Okay, okay. Der Manager hat den Bassisten geopfert. An die Frequenz! Zufrieden?! Jetzt geh spielen!"');
                              useStore.getState().setFlag('wirtLegacy1982', true);
                              useStore.getState().addQuest('wirt_legacy', 'Erfahre die vollständige Geschichte von 1982 vom Wirt');
                              useStore.getState().completeQuest('wirt_legacy');
                              useStore.getState().increaseBandMood(15);
                              useStore.getState().increaseSkill('chaos', 3);
                           }},
                           { text: 'Lass gut sein.', action: () => useStore.getState().setDialogue('Wirt: "Besser ist das. Die Wände hier haben Ohren."') }
                        ]
                     });
                  }}
               ];
               if (store.flags.ghostTrustEarned) {
                  wirtOptions.unshift({ text: 'Der Geist hat mich geschickt.', action: () => {
                     useStore.getState().setDialogue('Wirt: "Der Roadie?! Er ist noch da... dann weißt du es schon. Der Manager hat den Bassisten geopfert. Er hat einen Pakt mit der Void geschlossen. Passt auf, dass euch in Salzgitter nicht dasselbe passiert."');
                     useStore.getState().setFlag('wirtLegacy1982', true);
                     useStore.getState().addQuest('wirt_legacy', 'Erfahre die vollständige Geschichte von 1982 vom Wirt');
                     useStore.getState().completeQuest('wirt_legacy');
                     useStore.getState().increaseBandMood(30);
                  }});
               }
               store.setDialogue({
                  text: 'Wirt: "Ihr habt die Stimmung zum Kochen gebracht. Fast so wie die Jungs von 1982. Ihr erinnert mich so sehr an sie..."',
                  options: wirtOptions
               });
               return;
            }
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

          const options: DialogueOption[] = [
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
          ];

          if (store.flags.larsRhythmPact) {
            options.unshift({ text: 'Dieser Ort hat einen eigenen Rhythmus.', action: () => {
               useStore.getState().setDialogue('Lars: "Ja... der Pakt wird stärker. Ich spüre die Hämmer der alten Gießerei in mir schlagen. Wir sind bereit."');
               useStore.getState().setFlag('kaminstube_lars_talked', true);
               useStore.getState().increaseBandMood(10);
            }});
          }

          store.setDialogue({
            text: 'Lars: "Wusstest du, dass die Kaminstube früher eine echte Schmiede war? Der Rhythmus der Hämmer steckt noch in den Wänden. Ich spüre ihn!"',
            options: options
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
            if (store.flags.mariusEgoStrategy) {
               store.setDialogue('Marius: "Unsere Strategie funktioniert. Ich fühle mich... geerdet. Das Ego ist fokussiert wie ein Laser."');
            } else if (store.flags.egoContained) {
               store.setDialogue('Marius: "Mein Ego brennt in mir! Ich werde diese Menge verschlingen und als Lärm wieder ausspucken! Salzgitter wird unser Altar sein!"');
            } else {
               store.setDialogue('Marius: "Underground Metal Fest! Wir bringen euch den Sound der Maschinen und das Echo der Verzweiflung!"');
            }
          }
        }}
      />

      {/* Items */}
      {!hasItem('Röhre') && !flags.ampFixed && (
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
              const state = useStore.getState();
              if (!state.quests.find((q) => q.id === 'amp')) {
                addQuest('amp', 'Repariere Matzes Amp mit einer Ersatzröhre');
              }
              removeFromInventory('Röhre');
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
          const store = useStore.getState();
          store.setDialogue('Ein alter TR-808, der aussieht, als wäre er in einem Hochofen geschmolzen. Er gibt nur noch ein rhythmisches Klacken von sich, das seltsam beruhigend wirkt. Lars: "Das ist das Herzstück der ersten NEUROTOXIC-Platte. Er ist gestorben, als wir versuchten, ihn an ein Atomkraftwerk anzuschließen."');
          if (!store.flags.kaminstubeDrumLoreHeard) {
            store.increaseBandMood(10);
            store.setFlag('kaminstubeDrumLoreHeard', true);
          }
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

      <SceneEnvironmentSetpieces variant="kaminstube" />

      <Player bounds={{ x: [-14, 14], z: [-7, 7] }} />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={10} />
    </>
  );
}
