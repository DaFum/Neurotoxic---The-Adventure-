/**
 * #1: UPDATES
 * - Added NPCs (Matze, Lars, Marius, Fan) with complex dialogue branches.
 * - Integrated character traits/skills into dialogue options.
 * - Added quest completion logic.
 * - Added 'Performer' trait-exclusive interaction for Marius.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more branching quest outcomes.
 * - Expand lore.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import { Environment, ContactShadows, Html } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export function Salzgitter() {
  const setDialogue = useStore((state) => state.setDialogue);
  const addQuest = useStore((state) => state.addQuest);
  const completeQuest = useStore((state) => state.completeQuest);
  const increaseBandMood = useStore((state) => state.increaseBandMood);
  const flags = useStore((state) => state.flags);

  const spotLight1Ref = useRef<THREE.SpotLight>(null);
  const spotLight2Ref = useRef<THREE.SpotLight>(null);
  const spotLight3Ref = useRef<THREE.SpotLight>(null);
  const tRef = useRef(0);

  useFrame((state, delta) => {
    tRef.current += delta || 0;
    const t = tRef.current;
    const beat = Math.abs(Math.sin(t * 4)); // Simple beat sync

    if (spotLight1Ref.current) {
      spotLight1Ref.current.intensity = 5 + beat * 20;
      spotLight1Ref.current.position.x = Math.sin(t * 2) * 2;
    }
    if (spotLight2Ref.current) {
      spotLight2Ref.current.intensity = 5 + beat * 15;
      spotLight2Ref.current.position.x = -5 + Math.cos(t * 1.5) * 2;
    }
    if (spotLight3Ref.current) {
      spotLight3Ref.current.intensity = 5 + beat * 15;
      spotLight3Ref.current.position.x = 5 + Math.sin(t * 2.5) * 2;
    }
  });

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.2} />
      <spotLight ref={spotLight1Ref} position={[0, 10, -5]} angle={0.3} penumbra={1} intensity={5} color="#00ffcc" />
      <spotLight ref={spotLight2Ref} position={[-5, 10, -5]} angle={0.3} penumbra={1} intensity={5} color="#ff00cc" />
      <spotLight ref={spotLight3Ref} position={[5, 10, -5]} angle={0.3} penumbra={1} intensity={5} color="#ccff00" />
      
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </RigidBody>

      {/* Big Stage */}
      <RigidBody type="fixed" position={[0, 1, -8]}>
        <mesh receiveShadow>
          <boxGeometry args={[20, 2, 6]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 10, -11]}>
        <mesh receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </RigidBody>

      {/* Invisible Walls for bounds */}
      <RigidBody type="fixed" position={[-20, 10, 0]}>
        <boxGeometry args={[1, 20, 20]} />
      </RigidBody>
      <RigidBody type="fixed" position={[20, 10, 0]}>
        <boxGeometry args={[1, 20, 20]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 10, 10]}>
        <boxGeometry args={[40, 20, 1]} />
      </RigidBody>

      {/* Poster */}
      <mesh position={[-6, 5, -10.9]}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial color="#111" />
        <Html transform position={[0, 0, 0.01]} zIndexRange={[2, 0]}>
          <div className="bg-purple-900 border-2 border-purple-500 p-2 text-center text-white font-black uppercase shadow-2xl w-64 h-48 flex flex-col justify-center items-center">
            <span className="text-purple-300 text-sm">SZaturday 3</span>
            <span className="text-3xl text-pink-500">RIFF NIGHT</span>
            <span className="text-lg">SALZGITTER</span>
            <span className="text-xs mt-2">NEUROTOXIC LIVE</span>
          </div>
        </Html>
      </mesh>

      {/* Characters & Objects */}
      <Interactable
        position={[-4, 3, -7]}
        emoji="🎸"
        name="Matze"
        isBandMember={true}
        idleType="headbang"
        onInteract={() => {
          const bandMood = useStore.getState().bandMood;
          const hasForbiddenRiff = useStore.getState().hasItem('Verbotenes Riff');
          const hasOldPick = useStore.getState().hasItem('Altes Plektrum');
          
          if (hasForbiddenRiff) {
            if (hasOldPick) {
              setDialogue({
                text: 'Matze: "Manager, mit diesem Alten Plektrum... ich kann das Verbotene Riff bändigen! Es fühlt sich an, als würde ich die Blitze selbst kontrollieren. Wir werden Geschichte schreiben!"',
                options: [
                  { 
                    text: 'Kanalisiere den Chaos-Faktor. [Chaos 10]', 
                    requiredSkill: { name: 'chaos', level: 10 },
                    action: () => {
                      setDialogue('Matze: "DU HAST RECHT! ICH WERDE DIE REALE WELT ZERREISSEN! DER LÄRM WIRD UNSER GOTT SEIN!"');
                      increaseBandMood(50);
                      useStore.getState().increaseSkill('chaos', 5);
                    }
                  },
                  { 
                    text: 'Optimiere die Saitenspannung. [Technical 10]', 
                    requiredSkill: { name: 'technical', level: 10 },
                    action: () => {
                      setDialogue('Matze: "Präzision im Chaos. Das ist die wahre Kunst. Jede Note wird ein chirurgischer Schnitt in die Stille."');
                      increaseBandMood(40);
                      useStore.getState().increaseSkill('technical', 5);
                    }
                  },
                  { text: 'Viel Erfolg, Matze.', action: () => {
                    setDialogue('Matze: "Danke, Boss. Wir sehen uns auf der anderen Seite."');
                  }}
                ]
              });
              increaseBandMood(20);
            } else {
              setDialogue('Matze: "Manager, das Verbotene Riff... es brennt in meinen Fingern! Es ist schwer zu kontrollieren. Ich hoffe, ich zerreiße nicht die ganze Realität heute Abend!"');
            }
          } else if (flags.matzeDeepTalk) {
            setDialogue({
              text: 'Matze: "Ich hab über das nachgedacht, was du über den Lärm gesagt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"',
              options: [
                { 
                  text: 'Ich sehe die Muster. [Visionary]', 
                  requiredTrait: 'Visionary',
                  action: () => {
                    setDialogue('Matze: "Die Geometrie des Feedbacks... sie ist heute Abend perfekt. Wir werden eins mit der Frequenz."');
                    increaseBandMood(40);
                    useStore.getState().increaseSkill('chaos', 5);
                  }
                },
                { text: 'Lass uns spielen.', action: () => {
                  setDialogue('Matze: "Ja. Der Stahl wartet."');
                }}
              ]
            });
            increaseBandMood(10);
          } else if (flags.askedAbout1982) {
            setDialogue('Matze: "Ich hab über das nachgedacht, was du über 1982 gefragt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"');
            increaseBandMood(10);
          } else if (bandMood > 80) {
            setDialogue('Matze: "Ich hab noch nie so eine Energie gespürt! Salzgitter wird brennen!"');
          } else {
            setDialogue('Matze: "SZaturday 3 Riff Night! Das wird der Wahnsinn!"');
          }
        }}
      />

      <Interactable
        position={[4, 3, -8]}
        emoji="🥁"
        name="Lars"
        isBandMember={true}
        idleType="tap"
        onInteract={() => {
          const bandMood = useStore.getState().bandMood;
          if (flags.larsVibrating) {
            setDialogue({
              text: 'Lars: "ICH BIN DIE MASCHINE! MEIN HERZ IST EIN DIESELMOTOR! ICH SEHE DIE SOUNDWELLEN ALS PHYSISCHE OBJEKTE!"',
              options: [
                { 
                  text: 'Synchronisiere die Frequenz. [Technical 10]', 
                  requiredSkill: { name: 'technical', level: 10 },
                  action: () => {
                    setDialogue('Lars: "SYNC_COMPLETE! ICH BIN JETZT EIN TEIL DES NETZWERKS! DER BEAT IST ABSOLUT!"');
                    increaseBandMood(30);
                    useStore.getState().increaseSkill('technical', 5);
                  }
                },
                { text: 'Halt durch, Lars!', action: () => {
                  setDialogue('Lars: "KEINE ZEIT FÜR PAUSEN! NUR NOCH LÄRM!"');
                }}
              ]
            });
            increaseBandMood(10);
          } else if (flags.larsDrumPhilosophy) {
            setDialogue('Lars: "Ich denke an den Zorn der Maschinen. Jeder Schlag ist ein Urteil. Salzgitter wird beben!"');
            increaseBandMood(5);
          } else if (bandMood > 70) {
            setDialogue('Lars: "MEIN HERZ SCHLÄGT IM TAKT DER MASCHINEN! ICH BIN BEREIT!"');
          } else {
            setDialogue('Lars: "Die Drums sind mikrofoniert. Ich bin bereit, alles zu geben!"');
          }
        }}
      />

      <Interactable
        position={[0, 3, -6]}
        emoji="🎤"
        name="Marius"
        isBandMember={true}
        idleType="sway"
        onInteract={() => {
          const bandMood = useStore.getState().bandMood;
          const trait = useStore.getState().trait;

          if (trait === 'Performer') {
            setDialogue({
              text: 'Marius: "Manager, schau dir diese Menge an! Sie warten nur darauf, dass ich sie mit meiner Stimme in Ekstase versetze. Hast du ein paar Tipps für den perfekten Auftritt?"',
              options: [
                { text: 'Fokussiere dich auf die erste Reihe.', action: () => {
                  setDialogue('Marius: "Gute Idee. Die erste Reihe ist der Anker für die gesamte Energie. Ich werde sie hypnotisieren!"');
                  increaseBandMood(30);
                  useStore.getState().increaseSkill('social', 5);
                }}
              ]
            });
            return;
          }

          if (flags.mariusConfidenceBoost) {
            setDialogue({
              text: 'Marius: "Manager, danke für den Zuspruch im Backstage. Ich fühle mich unbesiegbar. Die Fans werden meine Stimme noch in 100 Jahren hören!"',
              options: [
                { 
                  text: 'Kanalisiere den Zorn. [Chaos 10]', 
                  requiredSkill: { name: 'chaos', level: 10 },
                  action: () => {
                    setDialogue('Marius: "MEINE STIMME WIRD DEN STAHL ZUM SCHMELZEN BRINGEN! ICH BIN DER STURM!"');
                    increaseBandMood(40);
                    useStore.getState().increaseSkill('chaos', 5);
                  }
                },
                { 
                  text: 'Beruhige die Menge. [Social 10]', 
                  requiredSkill: { name: 'social', level: 10 },
                  action: () => {
                    setDialogue('Marius: "Sie werden uns aus der Hand fressen. Ich habe die absolute Kontrolle über ihre Seelen."');
                    increaseBandMood(30);
                    useStore.getState().increaseSkill('social', 5);
                  }
                },
                { text: 'Lass es raus!', action: () => {
                  setDialogue('Marius: "AAAAAAHHHHHHHH!!!!"');
                }}
              ]
            });
            increaseBandMood(15);
          } else if (bandMood > 90) {
            setDialogue('Marius: "Ich bin kein Mensch mehr... ich bin reiner Schall! DANKE FÜR ALLES, MANAGER!"');
          } else if (bandMood > 50) {
            setDialogue('Marius: "Danke, dass du uns als Manager hierher gebracht hast! NEUROTOXIC RULES!"');
          } else {
            setDialogue('Marius: "Ich bin nervös, aber wir ziehen das durch. Für den Metal!"');
          }
        }}
      />

      {/* Lore: Floating Bassist */}
      <Interactable
        position={[0, 8, -5]}
        emoji="🎸"
        name="Schwebender Bassist"
        scale={1.5}
        onInteract={() => {
          setDialogue('Ein Bassist in einer glitzernden Robe schwebt über der Bühne. Er murmelt: "Die 4. Dimension war okay, aber das Catering hier ist besser. Sagt Lars, er soll den 13. Takt weglassen. Er weiß warum."');
          increaseBandMood(10);
        }}
      />

      <Interactable
        position={[8, 0, 5]}
        emoji="🤩"
        name="Fan"
        onInteract={() => {
          const hasSignedSetlist = useStore.getState().hasItem('Signierte Setliste');
          const hasTalisman = useStore.getState().hasItem('Industrie-Talisman');

          if (hasTalisman) {
            setDialogue({
              text: 'Fan: "Ist das... ein echter Industrie-Talisman?! Den hab ich nur in den Legenden von 1982 gesehen!"',
              options: [
                { text: 'Ein Geschenk für dich.', action: () => {
                  setDialogue('Fan: "Ich werde ihn in Ehren halten! Du bist der beste Manager der Welt! Ich spüre die pure Kraft des Stahls!"');
                  useStore.getState().removeFromInventory('Industrie-Talisman');
                  increaseBandMood(40);
                }}
              ]
            });
            return;
          }

          if (hasSignedSetlist) {
            setDialogue({
              text: 'Fan: "OH MEIN GOTT! Eine signierte Setliste! Das ist der beste Tag meines Lebens! Darf ich dich umarmen?"',
              options: [
                { text: 'Klar, komm her!', action: () => {
                  setDialogue('Fan: "Du riechst nach Erfolg und... altem Kaffee. Danke!"');
                  useStore.getState().removeFromInventory('Signierte Setliste');
                  increaseBandMood(25);
                }},
                { text: 'Abstand halten, bitte.', action: () => {
                  setDialogue('Fan: "Verstehe. Die Aura eines Managers ist zu stark. Danke für die Liste!"');
                  useStore.getState().removeFromInventory('Signierte Setliste');
                  increaseBandMood(15);
                }}
              ]
            });
          } else {
            setDialogue({
              text: 'Fan: "Ich liebe NEUROTOXIC! Hast du vielleicht ein Autogramm für mich? Oder ein Plektrum?"',
              options: [
                { text: 'Ich schau mal was ich tun kann.', action: () => setDialogue('Fan: "Bitte beeil dich, ich steh hier schon seit 4 Uhr morgens!"') },
                { text: 'Wer bist du nochmal?', action: () => {
                  setDialogue('Fan: "Ich bin dein größter Albtraum... und dein treuester Fan!"');
                  increaseBandMood(-2);
                }}
              ]
            });
          }
        }}
      />

      <Interactable
        position={[0, 1, 0]}
        emoji="🏆"
        name="Tour Erfolgreich"
        scale={2}
        onInteract={() => {
          completeQuest('final');
          increaseBandMood(50);
          setDialogue('Herzlichen Glückwunsch! Du hast die Tour erfolgreich gemanagt. NEUROTOXIC hat die Bühne gerockt!');
        }}
      />

      <Player bounds={{ x: [-18, 18], z: [-9, 9] }} />
      <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={30} blur={2} far={10} />
      <Environment preset="studio" />
    </>
  );
}
