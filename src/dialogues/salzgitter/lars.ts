import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';

export function buildSalzgitterLarsDialogue(): Dialogue {
  const store = game();
  const bandMood = store.bandMood;

  if (store.flags.larsVibrating && store.flags.larsDrumPhilosophy) {
    if (store.flags.salzgitter_encore_unlocked) {
      return say(
        'Lars: "DER BEAT IST EWIG! ICH HABE BEREITS DIE MASCHINEN-SEELE ENTFESSELT! DER REST IST NUR NOCH LÄRM!"'
      );
    }

    return {
      text: 'Lars: "ALLES IST ZU LANGSAM! DIE ZEIT, DER RAUM, DAS PUBLIKUM! ICH KANN DIE TAKTSTRICHE IN DER LUFT SEHEN! WAS SOLL ICH TUN, MANAGER?!"',
      options: [
        {
          text: 'Lars, entfessle die Maschinen-Seele! [Chaos 15]',
          requiredSkill: { name: 'chaos', level: 15 },
          flagToSet: { flag: 'salzgitter_encore_unlocked', value: true },
          visualEffect: 'shake',
          nextDialogue: {
            text: 'Lars: "JAAAAAAAAA! DIE DRUMS BRENNEN! DIE REALITÄT KOCHT! DAS IST DER ULTIMATIVE BEAT!"',
            visualEffect: 'shake',
          },
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(40);
            currentStore.increaseSkill('chaos', 5);
          },
        },
        {
          text: 'Fokussiere die kinetische Energie! [Technical 12]',
          requiredSkill: { name: 'technical', level: 12 },
          flagToSet: { flag: 'salzgitter_encore_unlocked', value: true },
          nextDialogue: {
            text: 'Lars: "100% EFFIZIENZ! KEIN MILLIMETER VERSCHWENDET! ICH BIN DER ROBOTER-GOTT DER SNARE!"',
          },
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(40);
            currentStore.increaseSkill('technical', 5);
          },
        },
        {
          text: 'Einfach durchatmen.',
          nextDialogue: {
            text: 'Lars: "ATMEN IST FÜR FLEISCHSÄCKE! ABER OKAY!"',
          },
        },
      ],
    };
  }

  if (store.flags.lars_paced) {
    if (!store.flags.salzgitter_lars_paced_talked) {
      return {
        text: 'Lars: "Danke, dass du mich im Backstage gebremst hast. Meine Schläge sind jetzt... chirurgisch. Jeder Akzent sitzt wie ein Skalpell."',
        options: [
          {
            text: 'Halte den Puls.',
            action: () => {
              const currentStore = game();
              currentStore.setFlag('salzgitter_lars_paced_talked', true);
              currentStore.increaseBandMood(25);
              currentStore.setDialogue(
                'Lars: "Ich halte den Puls. Keine Verschwendung, nur Präzision."'
              );
            },
          },
        ],
      };
    }

    return say(
      'Lars: "Danke, dass du mich im Backstage gebremst hast. Meine Schläge sind jetzt... chirurgisch. Jeder Akzent sitzt wie ein Skalpell."'
    );
  }

  if (store.flags.larsRhythmPact && !store.flags.larsRhythmPactClaimed) {
    const options: DialogueOption[] = [];
    if (store.flags.larsVibrating) {
      options.push({
        text: 'Hyperpowered Lars!',
        flagToSet: { flag: 'larsRhythmPactClaimed', value: true },
        nextDialogue: {
          text: 'Lars: "DER RHYTHMUS IST IN MIR EXPLODIERT! DER PAKT WIRD DIE REALITÄT ZERFETZEN!"',
        },
        action: () => {
          const currentStore = game();
          currentStore.increaseBandMood(50);
          currentStore.increaseSkill('chaos', 5);
        },
      });
    } else {
      options.push({
        text: 'Lass uns die Realität zertrümmern.',
        flagToSet: { flag: 'larsRhythmPactClaimed', value: true },
        nextDialogue: { text: 'Lars: "Jeder Schlag ein Beben."' },
        action: () => {
          const currentStore = game();
          currentStore.increaseBandMood(30);
        },
      });
    }

    return {
      text: 'Lars: "Der Pakt ist erfüllt, Manager. Der Rhythmus verlangt nach Auslassung!"',
      options,
    };
  }

  if (store.flags.larsVibrating) {
    return {
      text: 'Lars: "ICH BIN DIE MASCHINE! MEIN HERZ IST EIN DIESELMOTOR! ICH SEHE DIE SOUNDWELLEN ALS PHYSISCHE OBJEKTE!"',
      options: [
        ...(!store.flags.salzgitter_lars_technical_claimed
          ? [
              {
                text: 'Synchronisiere die Frequenz. [Technical 10]',
                requiredSkill: { name: 'technical' as const, level: 10 },
                nextDialogue: {
                  text: 'Lars: "SYNC_COMPLETE! ICH BIN JETZT EIN TEIL DES NETZWERKS! DER BEAT IST ABSOLUT!"',
                },
                action: () => {
                  const currentStore = game();
                  currentStore.setFlag('salzgitter_lars_technical_claimed', true);
                  currentStore.increaseBandMood(30);
                  currentStore.increaseSkill('technical', 5);
                },
              },
            ]
          : []),
        {
          text: 'Halt durch, Lars!',
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(10);
            currentStore.setDialogue(
              'Lars: "KEINE ZEIT FÜR PAUSEN! NUR NOCH LÄRM!"'
            );
          },
        },
      ],
    };
  }

  if (store.flags.larsDrumPhilosophy) {
    // Intentional encounter reward: this mirrors legacy onInteract behavior.
    // Positive gains are one-shot per callsite via bandMoodGainClaims.
    store.increaseBandMood(5);
    return say(
      'Lars: "Ich denke an den Zorn der Maschinen. Jeder Schlag ist ein Urteil. Salzgitter wird beben!"'
    );
  }

  if (bandMood > 70) {
    return say(
      'Lars: "MEIN HERZ SCHLÄGT IM TAKT DER MASCHINEN! ICH BIN BEREIT!"'
    );
  }

  return say(
    'Lars: "Die Drums sind mikrofoniert. Ich bin bereit, alles zu geben!"'
  );
}
