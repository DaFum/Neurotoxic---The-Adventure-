import { type Dialogue, type DialogueOption, type Skills } from '../../store';
import { game, say } from '../shared/helpers';

type SkillName = keyof Skills;

const bassistActionWrapper = (
  mood: number,
  skillName: SkillName,
  skillIncrease: number
) => {
  const store = game();
  if (store.flags.voidBassistRewarded) {
    return;
  }
  store.setFlag('voidBassistRewarded', true);
  store.increaseBandMood(mood, 'id_2cecf9c5');
  store.discoverLore('bassist_wahrheit');
  store.increaseSkill(skillName, skillIncrease);
};

export function buildVoidTerminalDialogue(): Dialogue {
  const store = game();
  if (store.flags.voidTerminalRead) {
    return say(
      'Das Terminal flackert nur noch schwach. Du kennst die 1982-Logs bereits.'
    );
  }

  return {
    text: 'Ein flackerndes Terminal zeigt Logbucheinträge einer vergessenen Tour von 1982.',
    options: [
      {
        text: 'Logs lesen',
        action: () => {
          const currentStore = game();
          currentStore.setFlag('voidTerminalRead', true);
          game().discoverLore('void_1982');
          game().increaseBandMood(5, 'id_15515ca2');
          currentStore.setDialogue(
            'Log: "Tag 44. Der Bassist ist in die 4. Dimension gefallen. Der Sound ist jetzt viel klarer. Wir haben die Kaminstube erreicht. Die Fans bestehen aus reinem Feedback."'
          );
        }
      }
    ]
  };
}

export function buildVoidCosmicEchoDialogue(): Dialogue {
  const store = game();
  if (store.flags.cosmic_echo) {
    store.startAndFinishQuest(
      'cosmic_echo',
      'Untersuche das kosmische Echo in der Void Station'
    );
    return say(
      'Das kosmische Echo ist bereits entschlüsselt. Die Koordinaten nach Salzgitter stehen fest.'
    );
  }

  store.addQuest(
    'cosmic_echo',
    'Untersuche das kosmische Echo in der Void Station'
  );

  return {
    text: 'Du hörst ein Flüstern aus der Leere. Es klingt wie eine alte NEUROTOXIC-Aufnahme, die rückwärts abgespielt wird.',
    options: [
      {
        text: 'Versuche, die Nachricht zu entschlüsseln. [Visionary]',
        requiredTrait: 'Visionary',
        questToAdd: {
          id: 'cosmic_echo',
          text: 'Untersuche das kosmische Echo in der Void Station',
        },
        questToComplete: 'cosmic_echo',
        flagToSet: { flag: 'cosmic_echo', value: true },
        action: () => {
            const currentStore = game();
          currentStore.setDialogue('Du erkennst ein Muster in der Verzerrung. Es ist ein Koordinaten-Code für Salzgitter! Du hast das Echo entschlüsselt.');
          if (!currentStore.flags.voidCosmicEchoRewarded) {
            currentStore.setFlag('voidCosmicEchoRewarded', true);
            game().discoverLore('cosmic_echo_decoded');
            game().increaseBandMood(20, 'id_0ea02c8e');
          }
        },
      },
      {
        text: 'Ignoriere das Flüstern.',
        nextDialogue: { text: 'Es ist nur das Rauschen der Leere.' },
      },
    ],
  };
}

export function buildVoidBassistEncounterDialogue(): Dialogue {
  return {
    text: 'Eine geisterhafte Gestalt zupft an einem vier-saitigen Instrument aus purer Energie. Bassist: "Die Frequenz... sie ist hier so laut. Ich kann nicht zurück."',
    options: [
      {
        text: 'Die Band vermisst dich. [Social 8]',
        requiredSkill: { name: 'social', level: 8 },
        flagToSet: { flag: 'bassist_contacted', value: true },
        questToAdd: {
          id: 'bassist_mystery',
          text: 'Erforsche das Geheimnis des schwebenden Bassisten',
        },
        questToComplete: 'bassist_mystery',
        action: () => {
            const currentStore = game();
              currentStore.setDialogue('Bassist: "Sie vermissen mich? Nach all der Zeit? Ich... ich spüre den Groove wieder. Sag ihnen, ich bin bereit. Für das eine, wahre Riff."');
          game().setFlag('voidBassistSpoken', true);
          bassistActionWrapper(25, 'social', 3);
        },
      },
      {
        text: 'Ich kann deine Frequenz messen. [Technical 8]',
        requiredSkill: { name: 'technical', level: 8 },
        flagToSet: { flag: 'bassist_contacted', value: true },
        questToAdd: {
          id: 'bassist_mystery',
          text: 'Erforsche das Geheimnis des schwebenden Bassisten',
        },
        questToComplete: 'bassist_mystery',
        action: () => {
            game().setDialogue('Du justierst die Phasenverschiebung in der Umgebung des Bassisten. Bassist: "Die Dissonanz ist weg! Ich höre den Grundton wieder! Wir sehen uns in Salzgitter!"');
          game().setFlag('voidBassistSpoken', true);
          bassistActionWrapper(50, 'technical', 3);
        },
      },
      {
        text: 'Ich höre deine Melodie. [Mystic]',
        requiredTrait: 'Mystic',
        flagToSet: { flag: 'bassist_contacted', value: true },
        questToAdd: {
          id: 'bassist_mystery',
          text: 'Erforsche das Geheimnis des schwebenden Bassisten',
        },
        questToComplete: 'bassist_mystery',
        action: () => {
            game().setDialogue('Bassist: "Du hast recht. Ich muss nicht in den Körper zurück, ich muss nur in den Song zurück. Der Bass ist überall."');
          game().setFlag('voidBassistSpoken', true);
          bassistActionWrapper(40, 'chaos', 3);
        },
      },
      {
        text: 'Ich sehe dich zwischen den Dimensionen. [Visionary]',
        requiredTrait: 'Visionary',
        flagToSet: { flag: 'bassist_contacted', value: true },
        questToAdd: {
          id: 'bassist_mystery',
          text: 'Erforsche das Geheimnis des schwebenden Bassisten',
        },
        questToComplete: 'bassist_mystery',
        action: () => {
            game().setDialogue('Bassist: "Du siehst das ganze Bild... Ich bin nicht verloren, ich bin das Fundament. Ich werde den Gig in Salzgitter stützen."');
          game().setFlag('voidBassistSpoken', true);
          bassistActionWrapper(40, 'chaos', 3);
        },
      },
      {
        text: 'Ich lass dich besser in Ruhe.',
        nextDialogue: {
          text: 'Bassist: "Die Frequenzen... so viele Frequenzen..."',
        },
      },
    ],
  };
}

export function buildVoidEgoDialogue(): Dialogue {
  const store = game();

  const egoActionWrapper = (originalAction: () => void) => () => {
    game().discoverLore('ego_philosophy');
    originalAction();
  };

  const addContainedEgo = (fallbackText: string) => {
    const currentStore = game();
    if (currentStore.flags.egoContained) {
      currentStore.setDialogue(
        "Marius' Ego ist bereits gebunden und kann nicht erneut eingefangen werden."
      );
      return false;
    }

    const pickedUpEgo = currentStore.addToInventory('Marius Ego');
    if (!pickedUpEgo) {
      currentStore.setDialogue(fallbackText + ' Aber dein Inventar ist voll.');
      return false;
    }

    currentStore.completeQuestWithFlag(
      'ego',
      'egoContained',
      true
    );
    return true;
  };

  const options: DialogueOption[] = [
    {
      text: 'Du bist die Vision, die uns leitet. [Visionary]',
      requiredTrait: 'Visionary',
      action: egoActionWrapper(() => {
        const currentStore = game();
        if (
          !addContainedEgo(
            'Marius\' Ego: "Endlich jemand, der meine wahre Bedeutung versteht! Die Vision ist zu groß für die Leere. Ich kehre zurück, um die Welt zu erleuchten."'
          )
        ) {
          return;
        }
        currentStore.setDialogue(
          'Marius\' Ego: "Endlich jemand, der meine wahre Bedeutung versteht! Die Vision ist zu groß für die Leere. Ich kehre zurück, um die Welt zu erleuchten."'
        );
        game().increaseBandMood(30, 'id_b603686a');
        game().increaseSkill('chaos', 5);
      }),
    },
    {
      text: 'Deine Resonanzfrequenz ist instabil. [Technical 8]',
      requiredSkill: { name: 'technical', level: 8 },
      action: egoActionWrapper(() => {
        const currentStore = game();
        if (
          !addContainedEgo(
            'Marius\' Ego: "Instabil?! Ich bin die perfekte Schwingung! ... Warte, du hast recht. Die Entropie hier draußen zersetzt meine Brillanz. Schnell, fang mich ein!"'
          )
        ) {
          return;
        }
        currentStore.setDialogue(
          'Marius\' Ego: "Instabil?! Ich bin die perfekte Schwingung! ... Warte, du hast recht. Die Entropie hier draußen zersetzt meine Brillanz. Schnell, fang mich ein!"'
        );
        game().increaseBandMood(20, 'id_b9a8043e');
        game().increaseSkill('technical', 5);
      }),
    },
    {
      text: 'Die Fans brauchen dich. [Social 8]',
      requiredSkill: { name: 'social', level: 8 },
      action: egoActionWrapper(() => {
        const currentStore = game();
        if (
          !addContainedEgo(
            'Marius\' Ego: "Die Fans... ja. Meine Anbetung ist hier draußen so... abstrakt. Ich brauche den Schweiß und die Tränen der ersten Reihe. Bring mich zurück!"'
          )
        ) {
          return;
        }
        currentStore.setDialogue(
          'Marius\' Ego: "Die Fans... ja. Meine Anbetung ist hier draußen so... abstrakt. Ich brauche den Schweiß und die Tränen der ersten Reihe. Bring mich zurück!"'
        );
        game().increaseBandMood(25, 'id_fc8b8d21');
        game().increaseSkill('social', 5);
      }),
    },
    {
      text: 'Komm einfach mit, du aufgeblasene Kugel.',
      action: egoActionWrapper(() => {
        const currentStore = game();
        if (
          !addContainedEgo(
            'Marius\' Ego: "Wie unhöflich! Aber die Leere ist langweilig. Na gut, aber ich erwarte eine Sonderbehandlung im Tourbus."'
          )
        ) {
          return;
        }
        currentStore.setDialogue(
          'Marius\' Ego: "Wie unhöflich! Aber die Leere ist langweilig. Na gut, aber ich erwarte eine Sonderbehandlung im Tourbus."'
        );
        game().increaseBandMood(10, 'id_f9e2d024');
      }),
    },
    {
      text: 'Ich zwinge dich zurück! [Brutalist]',
      requiredTrait: 'Brutalist',
      action: egoActionWrapper(() => {
        const currentStore = game();
        if (
          !addContainedEgo(
            "Du packst die leuchtende Sphäre mit roher Gewalt. Marius' Ego wimmert und fügt sich."
          )
        ) {
          return;
        }
        currentStore.setDialogue(
          "Du packst die leuchtende Sphäre mit roher Gewalt. Marius' Ego wimmert und fügt sich."
        );
        game().increaseBandMood(15, 'id_5c92986e');
        game().increaseSkill('chaos', 3);
      }),
    },
    {
      text: 'Verhandeln wir. [Diplomat]',
      requiredTrait: 'Diplomat',
      action: egoActionWrapper(() => {
        const currentStore = game();
        if (
          !addContainedEgo(
            'Marius\' Ego: "Eine Verhandlung? Endlich jemand mit Kultur. Ich stimme den Konditionen zu."'
          )
        ) {
          return;
        }
        currentStore.setDialogue(
          'Marius\' Ego: "Eine Verhandlung? Endlich jemand mit Kultur. Ich stimme den Konditionen zu."'
        );
        game().increaseBandMood(25, 'id_1b23de68');
        game().increaseSkill('social', 3);
      }),
    },
  ];

  if (store.flags.mariusEgoStrategy) {
    options.unshift({
      text: 'Wende unsere Strategie an.',
      action: egoActionWrapper(() => {
        const currentStore = game();
        if (
          !addContainedEgo(
            'Marius\' Ego: "Ah, die Strategie! Perfekte Synthese. Ich füge mich nahtlos ein!"'
          )
        ) {
          return;
        }
        currentStore.setDialogue(
          'Marius\' Ego: "Ah, die Strategie! Perfekte Synthese. Ich füge mich nahtlos ein!"'
        );
        game().increaseBandMood(35, 'id_93b03b84');
      }),
    });
  }

  if (store.flags.marius_tourbus_doubt) {
    options.unshift({
      text: 'Marius glaubt nicht mehr an sich. Du musst ihn retten. [Diplomat]',
      requiredTrait: 'Diplomat',
      action: egoActionWrapper(() => {
        const currentStore = game();
        if (
          !addContainedEgo(
            'Marius\' Ego: "Was?! Dieser weinerliche Fleischsack verzweifelt ohne mich?! Das kann ich nicht zulassen! Ich bin der Gott des Lärms, nicht der Gott des Jammers! Fang mich ein, schnell!"'
          )
        ) {
          return;
        }
        currentStore.setDialogue(
          'Marius\' Ego: "Was?! Dieser weinerliche Fleischsack verzweifelt ohne mich?! Das kann ich nicht zulassen! Ich bin der Gott des Lärms, nicht der Gott des Jammers! Fang mich ein, schnell!"'
        );
        currentStore.setFlag('mariusConfidenceBoost', true);
        game().increaseBandMood(40, 'id_087e60e5');
        game().increaseSkill('social', 5);
      }),
    });
  }

  return {
    text: 'Marius\' Ego: "Ich bin das Zentrum des Universums! Ohne mich wäre dieser Gig nur ein Haufen rostiger Nägel. Warum sollte ich zurück in diesen winzigen Körper?"',
    options,
  };
}

export function buildVoidDarkMatterPickupDialogue(): Dialogue {
  return {
    text: 'Vor dir schwebt ein Klumpen Dunkle Materie. Er saugt das Licht aus deiner Umgebung.',
    options: [
      {
        text: 'Aufheben',
        action: () => {
          const currentStore = game();
          const pickedUpDarkMatter = currentStore.addToInventory('Dunkle Materie');

          if (pickedUpDarkMatter) {
            currentStore.setDialogue(
              'Du hast einen Klumpen Dunkle Materie aufgehoben. Er saugt das Licht aus deiner Umgebung.'
            );
          } else {
            currentStore.setDialogue(
              'Die Dunkle Materie entgleitet dir. Du kannst gerade keinen weiteren Klumpen tragen.'
            );
          }
        },
      },
      {
        text: 'Liegen lassen',
        nextDialogue: {
          text: 'Du lässt die Dunkle Materie dort schweben.'
        }
      }
    ],
  };
}

export function buildVoidPortalDialogue(): Dialogue {
  const store = game();
  if (store.flags.voidRefueled) {
    return say(
      'Das Portal stabilisiert sich. Nächster Halt: Die Kaminstube... oder was davon übrig ist.'
    );
  }
  return say('Das Portal ist instabil. Wir brauchen den Treibstoff!');
}

export function buildVoidDiplomatenInterfaceDialogue(): Dialogue {
  const store = game();
  return {
    text: 'Ein beschädigtes Terminal, das als Übersetzer für die Entitäten der Leere dient. Es wartet auf Input.',
    options: [
      store.flags.void_diplomat_negotiation
        ? {
            text: 'Status prüfen.',
            nextDialogue: {
              text: 'Die Verhandlung ist abgeschlossen. Die Leere hat zugestimmt, die Akkorde von Salzgitter nicht zu verschlingen.',
            },
          }
        : {
            text: 'Verhandle mit der Leere. [Diplomat]',
            requiredTrait: 'Diplomat',
            flagToSet: { flag: 'void_diplomat_negotiation', value: true },
            action: () => {
            game().setDialogue('Du triffst eine Vereinbarung mit den abstrakten Mächten dieses Ortes. Der Gig in Salzgitter wird durch das Gefüge der Raumzeit geschützt.');
              game().discoverLore('schaltpult_record');
              game().increaseBandMood(30, 'id_91b76ef4');
              game().increaseSkill('social', 5);
            },
          },
      {
        text: 'Lies die Aufzeichnungen.',
        action: () => {
            const currentStore = game();
              currentStore.setDialogue('Du entzifferst die fragmentierten Logs: Aufnahmen von Frequenzen, die 1982 in Salzgitter gemessen wurden. Etwas hat damals angefangen - und noch nicht aufgehört.');
          game().discoverLore('schaltpult_record');
        },
      },
      {
        text: 'Verlassen.',
        nextDialogue: { text: 'Du lässt das Terminal in Ruhe.' },
      },
    ],
  };
}

export function buildVoidMagnetbandDialogue(): Dialogue {
  const store = game();
  return {
    text: 'Mehrere Magnetbänder schweben schwerelos umher. Sie sind mit "1982 SESSION" beschriftet. Ein leises Riff ist zu hören.',
    options: [
      store.flags.magnetbandPlayed
        ? {
            text: 'Ein Band abspielen.',
            nextDialogue: {
              text: 'Du lauschst der Aufnahme erneut. Die Leere hallt weiter nach.',
            },
          }
        : {
            text: 'Ein Band abspielen. [Technical 5]',
            requiredSkill: { name: 'technical', level: 5 },
            flagToSet: { flag: 'magnetbandPlayed', value: true },
            action: () => {
            game().setDialogue('Du bastelst ein Abspielgerät aus dem Nichts. Du hörst den Moment, als die Leere sich öffnete.');
              game().discoverLore('magnetband_session');
              game().increaseBandMood(10, 'id_74124307');
              game().increaseSkill('technical', 3);
            },
          },
      {
        text: 'Bänder schweben lassen.',
        nextDialogue: {
          text: 'Manche Sessions sollten besser ungespielt bleiben.',
        },
      },
    ],
  };
}

export function buildVoidDetektorDialogue(): Dialogue {
  const store = game();

  if (!store.flags.frequenzDetektorRead) {
    return {
      text: 'Ein seltsames Gerät piept rhythmisch. Es warnt vor einer "Resonanz-Anomalie".',
      options: [
        {
          text: 'Untersuchen',
          action: () => {
            const currentStore = game();
            currentStore.setFlag('frequenzDetektorRead', true);
            game().discoverLore('frequenz_anomaly');
            currentStore.setDialogue(buildVoidDetektorDialogue());
          }
        }
      ]
    };
  }

  return {
    text: 'Ein seltsames Gerät piept rhythmisch. Es warnt vor einer "Resonanz-Anomalie".',
    options: [
      store.flags.frequenzCalibrated
        ? {
            text: 'Gerät kalibrieren.',
            nextDialogue: {
              text: 'Das Gerät ist bereits optimal kalibriert. Die Station atmet im Hintergrund weiter.',
            },
          }
        : {
            text: 'Gerät kalibrieren. [Technical 6]',
            requiredSkill: { name: 'technical', level: 6 },
            flagToSet: { flag: 'frequenzCalibrated', value: true },
            action: () => {
            const currentStore = game();
              currentStore.setDialogue('Du justierst die Antennen. Die Anzeige offenbart: Die gesamte Station atmet. Sie ist am Leben.');
              game().increaseBandMood(15, 'id_a59ff433');
              game().increaseSkill('technical', 4);
            },
          },
      {
        text: 'In Ruhe lassen.',
        nextDialogue: { text: 'Das Piepsen ist nervig, aber ungefährlich.' },
      },
    ],
  };
}

export function buildVoidInschriftDialogue(): Dialogue {
  const store = game();
  return {
    text: 'Eine blutrote, phosphoreszierende Inschrift schwebt in der Luft. Die Buchstaben winden sich wie Würmer.',
    options: [
      store.flags.inschriftDecoded
        ? {
            text: 'Erneut lesen.',
            nextDialogue: {
              text: 'Du verinnerlichst die Warnung vor der finalen Kadenz in Salzgitter erneut.',
            },
          }
        : {
            text: 'Vollständig entschlüsseln. [cosmic_echo complete]',
            questDependencies: ['cosmic_echo'],
            flagToSet: { flag: 'inschriftDecoded', value: true },
            action: () => {
            const currentStore = game();
              currentStore.setDialogue('Die Inschrift warnt vor einer Kadenz, die die Stille für immer töten wird. Salzgitter ist der Katalysator.');
              game().discoverLore('inschrift_warning');
              game().increaseBandMood(20, 'id_6275141e');
            },
          },
      {
        text: 'Nur den Anfang lesen.',
        nextDialogue: {
          text: 'Du liest die ersten Worte, aber der Rest ist zu verschlüsselt.',
        },
      },
    ],
  };
}
