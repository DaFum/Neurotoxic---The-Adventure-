import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';

export function buildSalzgitterBassistDialogue(): Dialogue {
  const store = game();

  if (store.flags.bassist_restored) {
    return say(
      'Bassist: "Ich bin bereit. Der Grundton schwingt in meinem Blut. Wir bringen die Gießerei zurück."'
    );
  }

  if (
    store.flags.voidBassistSpoken &&
    store.quests.find(
      (q) => q.id === 'bassist_mystery' && q.status === 'completed'
    ) &&
    !store.hasItem('Bassist-Saite') &&
    !store.hasItem('Resonanz-Kristall')
  ) {
    return {
      text: 'Bassist: "Du erinnerst dich an mich. Du hast die Frequenz verstanden. Ich segne diesen Gig mit der Kraft der 432 Hz."',
      options: [
        {
          text: '(Weiter)',
          action: () => {
            const currentStore = game();
            if (!currentStore.flags.bassist_restored) {
              currentStore.increaseBandMood(30);
              currentStore.setFlag('bassist_restored', true);
            }
          },
        },
      ],
    };
  }

  const options: DialogueOption[] = [
    {
      text: 'Wir sehen uns auf der anderen Seite.',
      nextDialogue: { text: 'Bassist: "Der Sound ist alles."' },
    },
  ];

  if (store.hasItem('Bassist-Saite')) {
    options.unshift({
      text: 'Gib ihm die Bassist-Saite aus dem Echo. [Mystic]',
      requiredTrait: 'Mystic',
      consumeItems: ['Bassist-Saite'],
      flagToSet: { flag: 'bassist_restored', value: true },
      nextDialogue: {
        text: 'Bassist: "Das... das ist ein Teil von mir! Mein alter Rhythmus... ich erinnere mich!"',
      },
      action: () => {
        const currentStore = game();
        currentStore.discoverLore('bassist_wahrheit');
        currentStore.increaseBandMood(40);
      },
    });
  }

  if (store.hasItem('Resonanz-Kristall')) {
    options.unshift({
      text: 'Nimm den Resonanz-Kristall. Vollende das Riff.',
      consumeItems: ['Resonanz-Kristall'],
      flagToSet: { flag: 'bassist_restored', value: true },
      nextDialogue: {
        text: 'Bassist: "Der Kristall... er verbindet die Dimensionen. Ich setze ihn ein, wenn wir die letzte Note spielen. Danke, Manager."',
      },
      action: () => {
        const currentStore = game();
        currentStore.discoverLore('bassist_wahrheit');
        currentStore.increaseBandMood(30);
      },
    });
  }

  if (store.flags.voidBassistSpoken) {
    options.unshift({
      text: 'Du erinnerst dich an mich.',
      nextDialogue: {
        text: 'Bassist: "Ja... du hast mir in der Leere zugehört. Meine Töne gehören heute euch."',
      },
      action: () => {
        const currentStore = game();
        if (!currentStore.flags.voidBassistMoodGiven) {
          currentStore.increaseBandMood(20);
          currentStore.setFlag('voidBassistMoodGiven', true);
        }
      },
    });
  }

  return {
    text: 'Bassist: "Du hast mich gefunden. Hier, in der Frequenz. Danke. Sag der Band... der Sound war es wert."',
    options,
  };
}

export function buildSalzgitterFanDialogue(): Dialogue {
  const store = game();
  const hasSignedSetlist = store.hasItem('Signierte Setliste');
  const hasTalisman = store.hasItem('Industrie-Talisman');

  if (store.flags.fanMovement) {
    return say('Fan: "DIE BEWEGUNG IST GESTARTET! WIR SIND ALLE NEUROTOXIC!"');
  }

  if (hasTalisman) {
    return {
      text: 'Fan: "Ist das... ein echter Industrie-Talisman?! Den hab ich nur in den Legenden von 1982 gesehen!"',
      options: [
        {
          text: 'Ein Geschenk für dich.',
          consumeItems: ['Industrie-Talisman'],
          nextDialogue: {
            text: 'Fan: "Ich werde ihn in Ehren halten! Du bist der beste Manager der Welt! Ich spüre die pure Kraft des Stahls!"',
          },
          action: () => {
            game().increaseBandMood(40);
          },
        },
      ],
    };
  }

  if (hasSignedSetlist) {
    return {
      text: 'Fan: "OH MEIN GOTT! Eine signierte Setliste! Das ist der beste Tag meines Lebens! Darf ich dich umarmen?"',
      options: [
        {
          text: 'Klar, komm her!',
          consumeItems: ['Signierte Setliste'],
          nextDialogue: {
            text: 'Fan: "Du riechst nach Erfolg und... altem Kaffee. Danke!"',
          },
          action: () => {
            game().increaseBandMood(25);
          },
        },
        {
          text: 'Abstand halten, bitte.',
          consumeItems: ['Signierte Setliste'],
          nextDialogue: {
            text: 'Fan: "Verstehe. Die Aura eines Managers ist zu stark. Danke für die Liste!"',
          },
          action: () => {
            game().increaseBandMood(15);
          },
        },
      ],
    };
  }

  if (store.flags.backstage_performer_speech) {
    if (!store.flags.salzgitter_fan_speech_heard) {
      return {
        text: 'Fan: "DU! Du warst der, der den Backstage-Speech gegeben hat! Ich hab es durch die Wand gehört! Ihr seid Götter!"',
        options: [
          {
            text: '(Weiter)',
            action: () => {
              const currentStore = game();
              if (!currentStore.flags.salzgitter_fan_speech_heard) {
                currentStore.setFlag('salzgitter_fan_speech_heard', true);
                currentStore.increaseBandMood(5);
              }
            },
          },
        ],
      };
    }
    return say(
      'Fan: "DU! Du warst der, der den Backstage-Speech gegeben hat! Ich hab es durch die Wand gehört! Ihr seid Götter!"'
    );
  }

  if (store.flags.kaminstube_crowd_rallied) {
    return say(
      'Fan: "Tangermünde spricht noch immer über euch! Ihr seid Legenden! Bitte macht ein Foto mit mir!"'
    );
  }

  const options: DialogueOption[] = [];

  options.push({
    text: 'Folgt mir! [Performer]',
    requiredTrait: 'Performer',
    flagToSet: { flag: 'fanMovement', value: true },
    questToAdd: {
      id: 'fan_movement',
      text: 'Starte eine Fan-Bewegung beim Konzert',
    },
    questToComplete: 'fan_movement',
    nextDialogue: {
      text: 'Du reißt die Arme hoch und beginnst einen Rhythmus. Der Fan stimmt ein, dann die Menge. Ein epischer Chor entsteht!',
    },
    action: () => {
      game().increaseBandMood(35);
    },
  });
  options.push({
    text: 'Lasst uns zusammen singen! [Social 8]',
    requiredSkill: { name: 'social', level: 8 },
    flagToSet: { flag: 'fanMovement', value: true },
    questToAdd: {
      id: 'fan_movement',
      text: 'Starte eine Fan-Bewegung beim Konzert',
    },
    questToComplete: 'fan_movement',
    nextDialogue: {
      text: 'Ein Chor aus hunderten Kehlen beginnt das Intro eures größten Hits zu singen. Die Energie ist greifbar!',
    },
    action: () => {
      game().increaseBandMood(30);
    },
  });
  options.push({
    text: 'Wir sind alle eins mit der Musik. [Diplomat]',
    requiredTrait: 'Diplomat',
    flagToSet: { flag: 'fanMovement', value: true },
    questToAdd: {
      id: 'fan_movement',
      text: 'Starte eine Fan-Bewegung beim Konzert',
    },
    questToComplete: 'fan_movement',
    nextDialogue: {
      text: 'Der Fan weint vor Ergriffenheit. "Ja... wir sind eins!" Er reicht die Botschaft an die Menge weiter.',
    },
    action: () => {
      game().increaseBandMood(25);
    },
  });

  if (!store.flags.gaveDiplomatSouvenir) {
    options.push({
      text: 'Hier, ein Andenken. [Diplomat]',
      requiredTrait: 'Diplomat',
      flagToSet: { flag: 'gaveDiplomatSouvenir', value: true },
      nextDialogue: {
        text: 'Fan: "Wow, danke! Ein echtes Tour-Artefakt! Du bist ein Diplomat des Lärms!"',
      },
      action: () => {
        game().increaseBandMood(20);
      },
    });
  }

  options.push({
    text: 'Ich schau mal was ich tun kann.',
    nextDialogue: {
      text: 'Fan: "Bitte beeil dich, ich steh hier schon seit 4 Uhr morgens!"',
    },
  });
  options.push({
    text: 'Wer bist du nochmal?',
    nextDialogue: {
      text: 'Fan: "Ich bin dein größter Albtraum... und dein treuester Fan!"',
    },
    action: () => {
      game().increaseBandMood(-2);
    },
  });

  return {
    text: 'Fan: "Ich liebe NEUROTOXIC! Hast du vielleicht ein Autogramm für mich? Oder ein Plektrum?"',
    options,
  };
}

export function buildSalzgitterFinaleDialogue(): Dialogue {
  const store = game();
  const finalQuestCompleted =
    store.quests.find((quest) => quest.id === 'final')?.status ===
      'completed' || store.flags.salzgitter_finalized;
  const frequenz1982Completed =
    store.quests.find((quest) => quest.id === 'frequenz_1982')?.status ===
      'completed' || store.flags.frequenz1982_complete;

  if (finalQuestCompleted) {
    return say(
      'Die Bühne schweigt. Das Riff hallt noch immer nach. Es war das Größte, das je gespielt wurde.'
    );
  }

  let endingsCount = 0;
  if (store.flags.salzgitterBandUnited) endingsCount++;
  if (store.flags.fanMovement) endingsCount++;
  if (store.flags.backstageRitualPerformed) endingsCount++;
  if (store.flags.wirtLegacy1982) endingsCount++;
  if (store.flags.voidBassistSpoken) endingsCount++;

  return {
    text: 'Die Bühne ist bereitet. Bist du bereit, das letzte Riff zu spielen?',
    options: [
      {
        text: 'Beginne das Finale.',
        action: () => {
          const currentStore = game();
          if (!currentStore.flags.salzgitter_finalized) {
            currentStore.completeQuestWithFlag(
              'final',
              'salzgitter_finalized',
              true,
              'Spiele das Finale in Salzgitter'
            );
          }

          if (
            currentStore.flags.salzgitter_true_ending &&
            currentStore.flags.bassist_restored &&
            currentStore.flags.maschinen_seele_complete
          ) {
            currentStore.increaseBandMood(100);
            currentStore.discoverLore('bassist_wahrheit');
            currentStore.discoverLore('maschinen_bewusstsein');
            currentStore.discoverLore('frequenz_1982_decoded');
            currentStore.setDialogue(
              'Die Maschinen singen. Der Bassist schwingt im Grundton. Marius ist unantastbar. Der Manager hat nicht nur eine Tour gemanagt - er hat eine Frequenz wiederhergestellt, die seit 1982 verklungen war. NEUROTOXIC ist unsterblich. [TRUE ENDING]'
            );
            return;
          }

          if (currentStore.flags.salzgitter_encore_unlocked) {
            currentStore.increaseBandMood(50);
            currentStore.setDialogue(
              'ZUGABE! Die Band spielt das Verbotene Riff! Lars zerschmettert die Snare, Matze lässt die Röhren glühen und Marius schreit die Halle in Grund und Boden. Die Realität bebt! [SECRET ENCORE]'
            );
            return;
          }

          if (
            endingsCount >= 4 ||
            (frequenz1982Completed &&
              currentStore.flags.mariusConfidenceBoost &&
              currentStore.bandMood > 70)
          ) {
            let baseText =
              'Die Frequenz von 1982 hat die Halle erfüllt. Der Sound war perfekt. Die Fans liegen sich heulend in den Armen. Ein meisterhafter Auftritt!';
            if (endingsCount >= 4) {
              baseText +=
                ' Der Zyklus von 1982 ist geschlossen. Die Band ist eine Einheit. Der Lärm ist rein.';
            }
            if (currentStore.flags.fanMovement && currentStore.flags.salzgitterBandUnited) {
              baseText += ' Eine wahre Fan-Bewegung ist entstanden!';
            }
            currentStore.increaseBandMood(70);
            currentStore.setDialogue(baseText + ' [BEST ENDING]');
            return;
          }

          if (
            endingsCount >= 2 ||
            (currentStore.bandMood > 70 && currentStore.flags.mariusConfidenceBoost)
          ) {
            currentStore.increaseBandMood(50);
            currentStore.setDialogue(
              'Ein solider Gig. Die Fans jubeln. Marius hat die Kontrolle behalten und NEUROTOXIC ist zufrieden. Die Band hat einiges zusammen durchgestanden. Die Tour ist ein Erfolg! [GOOD ENDING]'
            );
            return;
          }

          currentStore.increaseBandMood(30);
          currentStore.setDialogue(
            'Du hast die Tour gemanagt. NEUROTOXIC hat gespielt. Es war... okay. Die Boxen haben überlebt, und das Bier war kalt. [STANDARD ENDING]'
          );
        },
      },
      {
        text: 'Wir brauchen noch Zeit.',
        nextDialogue: {
          text: 'Die Instrumente warten geduldig auf deinen Einsatz.'
        }
      }
    ],
  };
}
