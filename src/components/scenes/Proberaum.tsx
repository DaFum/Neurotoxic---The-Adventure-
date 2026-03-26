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
import { Interactable } from '../Interactable';
import { Player } from '../Player';
import { Environment, ContactShadows, Html, Sparkles } from '@react-three/drei';
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
      <color attach="background" args={['#1a1a1a']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 15]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" position={[0, 5, -7.5]}>
        <mesh receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#444" />
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

      {/* Poster */}
      <mesh position={[-5, 3, -7.4]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial color="#111" />
        <Html transform position={[0, 0, 0.01]}>
          <div className="bg-zinc-900 border-4 border-red-800 p-2 text-center text-white font-black uppercase shadow-2xl w-32 h-48 flex flex-col justify-center items-center">
            <span className="text-red-500 text-sm">Tour</span>
            <span className="text-xl">GRIND</span>
            <span className="text-xl">THE</span>
            <span className="text-xl">VOID</span>
          </div>
        </Html>
      </mesh>
      
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
          } else {
            setDialogue('Das Plakat erinnert dich an die chaotischen Anfänge. Der Edding-Spruch scheint sich bei jedem Hinsehen leicht zu verändern.');
          }
          increaseBandMood(5);
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
          const hasForbiddenRiff = hasItem('Verbotenes Riff');
          const hasTalisman = hasItem('Industrie-Talisman');
          const trait = useStore.getState().trait;
          
          if (flags.matzeDeepTalk) {
            setDialogue('Matze: "Ich denke immer noch über das nach, was du gesagt hast. Der Lärm... er ist die einzige Wahrheit. Wir sind bereit für Salzgitter."');
            return;
          }

          if (trait === 'Cynic') {
            setDialogue({
              text: 'Matze: "Hey Manager, hast du auch das Gefühl, dass diese ganze Tour nur ein schlechter Witz ist, der darauf wartet, erzählt zu werden?"',
              options: [
                { text: 'Absolut. Wir sind nur Statisten in einer billigen Industrial-Soap.', action: () => {
                  setDialogue('Matze: "Haha! Endlich jemand, der es kapiert. Lass uns den Witz so laut wie möglich erzählen!"');
                  increaseBandMood(20);
                  useStore.getState().increaseSkill('chaos', 5);
                }}
              ]
            });
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
              text: bandMood > 40 
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
                { text: 'Erzähl mir von der Tour 1982.', action: () => {
                  setDialogue({
                    text: 'Matze: "1982... da war der Lärm noch rein. Wir haben in einer alten Gießerei gespielt. Der Bassist ist damals verschwunden, aber der Sound war legendär. Wir suchen ihn immer noch."',
                    options: [
                      { 
                        text: 'Ich sehe Muster im Lärm. [Visionary]', 
                        requiredTrait: 'Visionary',
                        action: () => {
                          setDialogue('Matze: "Du siehst sie auch?! Die Geometrie des Feedbacks... Du bist der Manager, den wir brauchen. In Salzgitter wird alles zusammenfallen."');
                          setFlag('matzeDeepTalk', true);
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
          const hasBeer = hasItem('Bier');
          
          if (flags.larsDrumPhilosophy) {
            setDialogue('Lars: "Der Rhythmus ist das Skelett der Welt. Wir sind nur die Knochenbrecher."');
            return;
          }

          if (hasBeer && !flags.gaveBeerToLars) {
            setDialogue({
              text: 'Lars: "Ist das... ein kühles Blondes? Gib her, ich sterbe vor Durst!"',
              options: [
                { text: 'Hier, lass es dir schmecken.', action: () => {
                  setDialogue('Lars: "Du bist ein Lebensretter! Jetzt kann ich die Double-Bass-Drums durchtreten!"');
                  removeFromInventory('Bier');
                  setFlag('gaveBeerToLars', true);
                  increaseBandMood(20);
                }},
                { text: 'Was ist deine Drum-Philosophie?', action: () => {
                  setDialogue({
                    text: 'Lars: "Meine Philosophie? Schlag so hart zu, dass die Realität Risse bekommt. Jeder Schlag ist ein Schlag gegen die Stille. Willst du mehr wissen?"',
                    options: [
                      { 
                        text: 'Ja, lehre mich den Beat. [Chaos 3]', 
                        requiredSkill: { name: 'chaos', level: 3 },
                        action: () => {
                          setDialogue('Lars: "Der Beat kommt nicht aus den Armen, er kommt aus dem Zorn. Wenn du in Salzgitter spielst, denk an den Zorn der Maschinen. Du hast das Potenzial, Manager."');
                          setFlag('larsDrumPhilosophy', true);
                          increaseBandMood(20);
                          useStore.getState().increaseSkill('chaos', 2);
                        }
                      },
                      { 
                        text: 'Analysiere die Schlagkraft. [Technical 3]', 
                        requiredSkill: { name: 'technical', level: 3 },
                        action: () => {
                          setDialogue('Lars: "Exakt 120 Newton pro Schlag. Du hast ein Auge für die Mechanik. Das gefällt mir."');
                          setFlag('larsDrumPhilosophy', true);
                          increaseBandMood(15);
                          useStore.getState().increaseSkill('technical', 2);
                        }
                      },
                      { text: 'Klingt anstrengend.', action: () => {
                        setDialogue('Lars: "Ist es auch. Aber wer will schon ein leichtes Leben?"');
                      }}
                    ]
                  });
                }},
                { text: 'Das ist für Marius.', action: () => setDialogue('Lars: "Marius? Der hat doch schon genug Ego. Na gut, ich trommel weiter auf dem Trockenen."') }
              ]
            });
            return;
          }

          if (!hasItem('Mop')) {
            setDialogue('Lars: "Ich hab hier irgendwo einen Wischmopp gesehen... Such mal danach!"');
          } else if (!flags.waterCleaned) {
            setDialogue('Lars: "Du hast den Mopp! Wisch die Pfütze in der Mitte auf!"');
          } else {
            const moodText = bandMood > 60 
              ? 'Lars: "Dieser Beat... er kommt direkt aus der Hölle! Ich liebe es!"'
              : 'Lars: "Geiler Beat, oder? Lass uns loslegen!"';
            setDialogue(moodText);
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
            setDialogue(moodText);
          }
        }}
      />

      {/* Items */}
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
            setDialogue('Amp: "Ich brauche einen Lötkolben und Schrottmetall, um meine Schaltkreise zu reparieren."');
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
            setDialogue('TR-8080: "Hast du das Riff? Nein? Dann stör mich nicht beim Selbst-Oszillieren."');
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
      <Environment preset="night" />
      
      {/* Dust Particles */}
      <Sparkles count={100} scale={20} size={1.5} speed={0.5} opacity={0.2} color="#fff" />
    </>
  );
}
