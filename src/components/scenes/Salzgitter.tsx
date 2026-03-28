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

  useFrame((state) => {
    const t = state.clock.elapsedTime;
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
        <Html transform position={[0, 0, 0.01]}>
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
          const store = useStore.getState();
          const bandMood = store.bandMood;

          if (store.flags.larsVibrating && store.flags.larsDrumPhilosophy) {
            store.setDialogue({
              text: 'Lars: "ALLES IST ZU LANGSAM! DIE ZEIT, DER RAUM, DAS PUBLIKUM! ICH KANN DIE TAKTSTRICHE IN DER LUFT SEHEN! WAS SOLL ICH TUN, MANAGER?!"',
              options: [
                { text: 'Lars, entfessle die Maschinen-Seele! [Chaos 15]', requiredSkill: { name: 'chaos', level: 15 }, action: () => {
                  useStore.getState().setDialogue('Lars: "JAAAAAAAAA! DIE DRUMS BRENNEN! DIE REALITÄT KOCHT! DAS IST DER ULTIMATIVE BEAT!"');
                  useStore.getState().setFlag('salzgitter_encore_unlocked', true);
                  useStore.getState().increaseBandMood(40);
                  useStore.getState().increaseSkill('chaos', 5);
                }},
                { text: 'Fokussiere die kinetische Energie! [Technical 12]', requiredSkill: { name: 'technical', level: 12 }, action: () => {
                  useStore.getState().setDialogue('Lars: "100% EFFIZIENZ! KEIN MILLIMETER VERSCHWENDET! ICH BIN DER ROBOTER-GOTT DER SNARE!"');
                  useStore.getState().setFlag('salzgitter_encore_unlocked', true);
                  useStore.getState().increaseBandMood(40);
                  useStore.getState().increaseSkill('technical', 5);
                }},
                { text: 'Einfach durchatmen.', action: () => {
                  useStore.getState().setDialogue('Lars: "ATMEN IST FÜR FLEISCHSÄCKE! ABER OKAY!"');
                }}
              ]
            });
            return;
          }

          if (store.flags.lars_paced) {
             store.setDialogue('Lars: "Danke, dass du mich im Backstage gebremst hast. Meine Schläge sind jetzt... chirurgisch. Jeder Akzent sitzt wie ein Skalpell."');
             if (!store.flags.salzgitter_lars_paced_talked) {
                 store.setFlag('salzgitter_lars_paced_talked', true);
                 store.increaseBandMood(25);
             }
             return;
          }

          if (store.flags.larsVibrating) {
            store.setDialogue({
              text: 'Lars: "ICH BIN DIE MASCHINE! MEIN HERZ IST EIN DIESELMOTOR! ICH SEHE DIE SOUNDWELLEN ALS PHYSISCHE OBJEKTE!"',
              options: [
                { 
                  text: 'Synchronisiere die Frequenz. [Technical 10]', 
                  requiredSkill: { name: 'technical', level: 10 },
                  action: () => {
                    useStore.getState().setDialogue('Lars: "SYNC_COMPLETE! ICH BIN JETZT EIN TEIL DES NETZWERKS! DER BEAT IST ABSOLUT!"');
                    useStore.getState().increaseBandMood(30);
                    useStore.getState().increaseSkill('technical', 5);
                  }
                },
                { text: 'Halt durch, Lars!', action: () => {
                  useStore.getState().setDialogue('Lars: "KEINE ZEIT FÜR PAUSEN! NUR NOCH LÄRM!"');
                }}
              ]
            });
            store.increaseBandMood(10);
          } else if (store.flags.larsDrumPhilosophy) {
            store.setDialogue('Lars: "Ich denke an den Zorn der Maschinen. Jeder Schlag ist ein Urteil. Salzgitter wird beben!"');
            store.increaseBandMood(5);
          } else if (bandMood > 70) {
            store.setDialogue('Lars: "MEIN HERZ SCHLÄGT IM TAKT DER MASCHINEN! ICH BIN BEREIT!"');
          } else {
            store.setDialogue('Lars: "Die Drums sind mikrofoniert. Ich bin bereit, alles zu geben!"');
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
          const store = useStore.getState();
          const bandMood = store.bandMood;
          const trait = store.trait;

          if (trait === 'Performer' && !store.flags.salzgitter_performer_talked) {
            store.setDialogue({
              text: 'Marius: "Manager, schau dir diese Menge an! Sie warten nur darauf, dass ich sie mit meiner Stimme in Ekstase versetze. Hast du ein paar Tipps für den perfekten Auftritt?"',
              options: [
                { text: 'Fokussiere dich auf die erste Reihe.', action: () => {
                  useStore.getState().setDialogue('Marius: "Gute Idee. Die erste Reihe ist der Anker für die gesamte Energie. Ich werde sie hypnotisieren!"');
                  useStore.getState().setFlag('salzgitter_performer_talked', true);
                  useStore.getState().increaseBandMood(30);
                  useStore.getState().increaseSkill('social', 5);
                }}
              ]
            });
            return;
          }

          if (store.flags.mariusConfidenceBoost) {
            const options: any[] = [
              {
                text: 'Kanalisiere den Zorn. [Chaos 10]',
                requiredSkill: { name: 'chaos', level: 10 },
                action: () => {
                  useStore.getState().setDialogue('Marius: "MEINE STIMME WIRD DEN STAHL ZUM SCHMELZEN BRINGEN! ICH BIN DER STURM!"');
                  useStore.getState().increaseBandMood(40);
                  useStore.getState().increaseSkill('chaos', 5);
                }
              },
              {
                text: 'Beruhige die Menge. [Social 10]',
                requiredSkill: { name: 'social', level: 10 },
                action: () => {
                  useStore.getState().setDialogue('Marius: "Sie werden uns aus der Hand fressen. Ich habe die absolute Kontrolle über ihre Seelen."');
                  useStore.getState().increaseBandMood(30);
                  useStore.getState().increaseSkill('social', 5);
                }
              },
              { text: 'Lass es raus!', action: () => {
                useStore.getState().setDialogue('Marius: "AAAAAAHHHHHHHH!!!!"');
              }}
            ];

            if (store.flags.egoContained && store.flags.bassist_contacted) {
               options.unshift({
                 text: 'Marius, der Bassist ist bei uns. Sing für ihn. [Social 12]',
                 requiredSkill: { name: 'social', level: 12 },
                 action: () => {
                   useStore.getState().setDialogue('Marius: "Ich spüre es. Eine tiefe, vibrierende Kraft. Ich singe nicht mehr für mich. Ich singe für die Ewigkeit!"');
                   useStore.getState().setFlag('salzgitter_true_ending', true);
                   useStore.getState().increaseBandMood(50);
                 }
               });
            } else if (store.flags.backstage_performer_speech) {
               options.unshift({
                 text: 'Du hast die erste Reihe. Jetzt nimm sie alle. [Performer]',
                 requiredTrait: 'Performer',
                 action: () => {
                   useStore.getState().setDialogue('Marius: "Ja. Jeder Einzelne hier wird mich spüren. Sie werden meine Frequenz atmen!"');
                   useStore.getState().increaseBandMood(30);
                   useStore.getState().increaseSkill('social', 5);
                 }
               });
            }

            store.setDialogue({
              text: 'Marius: "Manager, danke für den Zuspruch im Backstage. Ich fühle mich unbesiegbar. Die Fans werden meine Stimme noch in 100 Jahren hören!"',
              options
            });
            store.increaseBandMood(15);
          } else if (bandMood > 90) {
            store.setDialogue('Marius: "Ich bin kein Mensch mehr... ich bin reiner Schall! DANKE FÜR ALLES, MANAGER!"');
          } else if (bandMood > 50) {
            store.setDialogue('Marius: "Danke, dass du uns als Manager hierher gebracht hast! NEUROTOXIC RULES!"');
          } else {
            store.setDialogue('Marius: "Ich bin nervös, aber wir ziehen das durch. Für den Metal!"');
          }
        }}
      />

      {/* Lore: Floating Bassist */}
      {flags.bassist_contacted && (
        <Interactable
          position={[0, 8, -5]}
          emoji="🎸"
          name="Schwebender Bassist"
          scale={1.5}
          onInteract={() => {
            const store = useStore.getState();
            if (store.flags.bassist_restored) {
               store.setDialogue('Bassist: "Ich bin bereit. Der Grundton schwingt in meinem Blut. Wir bringen die Gießerei zurück."');
               return;
            }

            const options: any[] = [
               { text: 'Wir sehen uns auf der anderen Seite.', action: () => {
                 useStore.getState().setDialogue('Bassist: "Der Sound ist alles."');
               }}
            ];

            if (store.hasItem('Bassist-Saite')) {
               options.unshift({
                 text: 'Gib ihm die Bassist-Saite aus dem Echo. [Mystic]',
                 requiredTrait: 'Mystic' as any,
                 action: () => {
                   useStore.getState().setDialogue('Bassist: "Das... das ist ein Teil von mir! Mein alter Rhythmus... ich erinnere mich!"');
                   useStore.getState().setFlag('bassist_restored', true);
                   useStore.getState().discoverLore('bassist_wahrheit');
                   useStore.getState().increaseBandMood(40);
                   useStore.getState().removeFromInventory('Bassist-Saite');
                 }
               });
            }

            if (store.hasItem('Resonanz-Kristall')) {
               options.unshift({
                 text: 'Nimm den Resonanz-Kristall. Vollende das Riff.',
                 action: () => {
                   useStore.getState().setDialogue('Bassist: "Der Kristall... er verbindet die Dimensionen. Ich setze ihn ein, wenn wir die letzte Note spielen. Danke, Manager."');
                   useStore.getState().setFlag('bassist_restored', true);
                   useStore.getState().discoverLore('bassist_wahrheit');
                   useStore.getState().increaseBandMood(30);
                   useStore.getState().removeFromInventory('Resonanz-Kristall');
                 }
               });
            }

            store.setDialogue({
              text: 'Bassist: "Du hast mich gefunden. Hier, in der Frequenz. Danke. Sag der Band... der Sound war es wert."',
              options
            });
          }}
        />
      )}

      <Interactable
        position={[8, 0, 5]}
        emoji="🤩"
        name="Fan"
        onInteract={() => {
          const store = useStore.getState();
          const hasSignedSetlist = store.hasItem('Signierte Setliste');
          const hasTalisman = store.hasItem('Industrie-Talisman');

          if (hasTalisman) {
            store.setDialogue({
              text: 'Fan: "Ist das... ein echter Industrie-Talisman?! Den hab ich nur in den Legenden von 1982 gesehen!"',
              options: [
                { text: 'Ein Geschenk für dich.', action: () => {
                  useStore.getState().setDialogue('Fan: "Ich werde ihn in Ehren halten! Du bist der beste Manager der Welt! Ich spüre die pure Kraft des Stahls!"');
                  useStore.getState().removeFromInventory('Industrie-Talisman');
                  useStore.getState().increaseBandMood(40);
                }}
              ]
            });
            return;
          }

          if (hasSignedSetlist) {
            store.setDialogue({
              text: 'Fan: "OH MEIN GOTT! Eine signierte Setliste! Das ist der beste Tag meines Lebens! Darf ich dich umarmen?"',
              options: [
                { text: 'Klar, komm her!', action: () => {
                  useStore.getState().setDialogue('Fan: "Du riechst nach Erfolg und... altem Kaffee. Danke!"');
                  useStore.getState().removeFromInventory('Signierte Setliste');
                  useStore.getState().increaseBandMood(25);
                }},
                { text: 'Abstand halten, bitte.', action: () => {
                  useStore.getState().setDialogue('Fan: "Verstehe. Die Aura eines Managers ist zu stark. Danke für die Liste!"');
                  useStore.getState().removeFromInventory('Signierte Setliste');
                  useStore.getState().increaseBandMood(15);
                }}
              ]
            });
            return;
          }

          if (store.flags.backstage_performer_speech) {
            store.setDialogue('Fan: "DU! Du warst der, der den Backstage-Speech gegeben hat! Ich hab es durch die Wand gehört! Ihr seid Götter!"');
            store.increaseBandMood(5); // Only triggered repeatedly for small boosts, or just narrative flavor
            return;
          }

          if (store.flags.kaminstube_crowd_rallied) {
            store.setDialogue('Fan: "Tangermünde spricht noch immer über euch! Ihr seid Legenden! Bitte macht ein Foto mit mir!"');
            return;
          }

          const options: any[] = [
             { text: 'Hier, ein Andenken. [Diplomat]', requiredTrait: 'Diplomat', action: () => {
               useStore.getState().setDialogue('Fan: "Wow, danke! Ein echtes Tour-Artefakt! Du bist ein Diplomat des Lärms!"');
               useStore.getState().increaseBandMood(20);
             }},
             { text: 'Ich schau mal was ich tun kann.', action: () => useStore.getState().setDialogue('Fan: "Bitte beeil dich, ich steh hier schon seit 4 Uhr morgens!"') },
             { text: 'Wer bist du nochmal?', action: () => {
               useStore.getState().setDialogue('Fan: "Ich bin dein größter Albtraum... und dein treuester Fan!"');
               useStore.getState().increaseBandMood(-2);
             }}
          ];
          store.setDialogue({
            text: 'Fan: "Ich liebe NEUROTOXIC! Hast du vielleicht ein Autogramm für mich? Oder ein Plektrum?"',
            options
          });
        }}
      />

      <Interactable
        position={[0, 1, 0]}
        emoji="🏆"
        name="Das Finale"
        scale={2}
        onInteract={() => {
          const store = useStore.getState();
          store.completeQuest('final');

          if (store.flags.salzgitter_true_ending && store.flags.bassist_restored && store.flags.maschinen_seele_complete) {
             store.setDialogue('Die Maschinen singen. Der Bassist schwingt im Grundton. Marius ist unantastbar. Der Manager hat nicht nur eine Tour gemanagt — er hat eine Frequenz wiederhergestellt, die seit 1982 verklungen war. NEUROTOXIC ist unsterblich. [TRUE ENDING]');
             store.increaseBandMood(100);
             // Discover remaining lore logically associated with true ending
             store.discoverLore('bassist_wahrheit');
             store.discoverLore('maschinen_bewusstsein');
             store.discoverLore('frequenz_1982_decoded');
          } else if (store.flags.salzgitter_encore_unlocked) {
             store.setDialogue('ZUGABE! Die Band spielt das Verbotene Riff! Lars zerschmettert die Snare, Matze lässt die Röhren glühen und Marius schreit die Halle in Grund und Boden. Die Realität bebt! [SECRET ENCORE]');
             store.increaseBandMood(50);
          } else if (store.flags.frequenz1982_complete && store.flags.mariusConfidenceBoost && store.bandMood > 70) {
             store.setDialogue('Die Frequenz von 1982 hat die Halle erfüllt. Der Sound war perfekt. Die Fans liegen sich heulend in den Armen. Ein meisterhafter Auftritt! [GREAT ENDING]');
             store.increaseBandMood(70);
          } else if (store.bandMood > 70 && store.flags.mariusConfidenceBoost) {
             store.setDialogue('Ein solider Gig. Die Fans jubeln. Marius hat die Kontrolle behalten und NEUROTOXIC ist zufrieden. Die Tour ist ein Erfolg! [GOOD ENDING]');
             store.increaseBandMood(50);
          } else {
             store.setDialogue('Du hast die Tour gemanagt. NEUROTOXIC hat gespielt. Es war... okay. Die Boxen haben überlebt, und das Bier war kalt. [STANDARD ENDING]');
             store.increaseBandMood(30);
          }
        }}
      />

      <Player bounds={{ x: [-18, 18], z: [-9, 9] }} />
      <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={30} blur={2} far={10} />
      <Environment preset="studio" />
    </>
  );
}
