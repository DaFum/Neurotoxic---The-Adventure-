import { type Dialogue, type DialogueOption, type GameState } from '../../store';
import { game, say, when } from '../shared/helpers';

export function buildSalzgitterMariusDialogue(): Dialogue {
  const store = game();
  const bandMood = store.bandMood;

  const performerOpener = getPerformerOpenerDialogue(store);
  if (performerOpener) return performerOpener;

  const bandUnited = getBandUnitedDialogue(store);
  if (bandUnited) return bandUnited;

  const confident = getConfidentMariusDialogue(store);
  if (confident) return confident;

  if (bandMood > 90) {
    return say(
      'Marius: "Ich bin kein Mensch mehr... ich bin reiner Schall! DANKE FÜR ALLES, MANAGER!"',
    );
  }

  if (bandMood > 50) {
    return say('Marius: "Danke, dass du uns als Manager hierher gebracht hast! NEUROTOXIC RULES!"');
  }

  return say('Marius: "Ich bin nervös, aber wir ziehen das durch. Für den Metal!"');
}

function getPerformerOpenerDialogue(store: GameState): Dialogue | null {
  if (store.trait === 'Performer' && !store.flags.salzgitter_performer_talked) {
    return {
      text: 'Marius: "Manager, schau dir diese Menge an! Sie warten nur darauf, dass ich sie mit meiner Stimme in Ekstase versetze. Hast du ein paar Tipps für den perfekten Auftritt?"',
      options: [
        {
          text: 'Fokussiere dich auf die erste Reihe.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Marius: "Gute Idee. Die erste Reihe ist der Anker für die gesamte Energie. Ich werde sie hypnotisieren!"',
            );
            currentStore.setFlag('salzgitter_performer_talked', true);
            currentStore.increaseBandMood(30, 'id_d7c3f0fc');
            currentStore.increaseSkill('social', 5);
          },
        },
      ],
    };
  }
  return null;
}

function getBandUnitedDialogue(store: GameState): Dialogue | null {
  if (
    store.flags.mariusEgoStrategy &&
    store.flags.mariusConfidenceBoost &&
    store.flags.egoContained &&
    !store.flags.salzgitterBandUnited
  ) {
    const bandReady = store.flags.matzeDeepTalk && store.flags.larsDrumPhilosophy;
    return {
      text: 'Marius: "Du hast mich gerettet, Manager. Mein Ego, meine Angst... alles ist jetzt gebündelt in pure Energie. Wie stehen wir da?"',
      options: [
        bandReady
          ? {
              text: 'Die Band ist vereint.',
              action: () => {
                const currentStore = game();
                currentStore.setDialogue(
                  'Marius: "Wir sind eine Wand aus Lärm. Lasst uns die Welt niederreißen!"',
                );
                currentStore.setFlag('salzgitterBandUnited', true);
                currentStore.startAndFinishQuest(
                  'unite_band',
                  'Vereinige die Band vor dem Finale in Salzgitter',
                );
                currentStore.increaseBandMood(30, 'id_14d8d982');
              },
            }
          : {
              text: 'Wir geben unser Bestes.',
              action: () => {
                game().setDialogue('Marius: "Ja, wir werden alles geben."');
              },
            },
      ],
    };
  }
  return null;
}

function getConfidentMariusDialogue(store: GameState): Dialogue | null {
  if (!store.flags.mariusConfidenceBoost) return null;

  const options: DialogueOption[] = [
    ...when(!store.flags.salzgitter_marius_greeted, {
      text: 'Gut, dass du bereit bist.',
      action: () => {
        const currentStore = game();
        currentStore.setFlag('salzgitter_marius_greeted', true);
        currentStore.increaseBandMood(15, 'id_8ded0f13');
        currentStore.setDialogue('Marius: "Gut, dass du da bist, Manager. Jetzt geht es los!"');
      },
    }),
    ...when(store.flags.egoContained && store.flags.bassist_contacted, {
      text: 'Marius, der Bassist ist bei uns. Sing für ihn. [Social 12]',
      requiredSkill: { name: 'social' as const, level: 12 },
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Marius: "Ich spüre es. Eine tiefe, vibrierende Kraft. Ich singe nicht mehr für mich. Ich singe für die Ewigkeit!"',
        );
        currentStore.setFlag('salzgitter_true_ending', true);
        currentStore.increaseBandMood(50, 'id_cf381586');
      },
    }),
    ...when(
      store.flags.backstage_performer_speech && !store.flags.salzgitter_marius_performer_claimed,
      {
        text: 'Du hast die erste Reihe. Jetzt nimm sie alle. [Performer]',
        requiredTrait: 'Performer',
        action: () => {
          const currentStore = game();
          currentStore.setFlag('salzgitter_marius_performer_claimed', true);
          currentStore.setDialogue(
            'Marius: "Ja. Jeder Einzelne hier wird mich spüren. Sie werden meine Frequenz atmen!"',
          );
          currentStore.increaseBandMood(30, 'id_e74c6cca');
          currentStore.increaseSkill('social', 5);
        },
      },
    ),
    ...when(!store.flags.salzgitter_marius_chaos_claimed, {
      text: 'Kanalisiere den Zorn. [Chaos 10]',
      requiredSkill: { name: 'chaos' as const, level: 10 },
      action: () => {
        const currentStore = game();
        currentStore.setFlag('salzgitter_marius_chaos_claimed', true);
        currentStore.setDialogue(
          'Marius: "MEINE STIMME WIRD DEN STAHL ZUM SCHMELZEN BRINGEN! ICH BIN DER STURM!"',
        );
        currentStore.increaseBandMood(40, 'id_f382013b');
        currentStore.increaseSkill('chaos', 5);
      },
    }),
    ...when(!store.flags.salzgitter_marius_social_claimed, {
      text: 'Beruhige die Menge. [Social 10]',
      requiredSkill: { name: 'social' as const, level: 10 },
      action: () => {
        const currentStore = game();
        currentStore.setFlag('salzgitter_marius_social_claimed', true);
        currentStore.setDialogue(
          'Marius: "Sie werden uns aus der Hand fressen. Ich habe die absolute Kontrolle über ihre Seelen."',
        );
        currentStore.increaseBandMood(30, 'id_536e150a');
        currentStore.increaseSkill('social', 5);
      },
    }),
    {
      text: 'Lass es raus!',
      action: () => {
        game().setDialogue('Marius: "AAAAAAHHHHHHHH!!!!"');
      },
    },
  ];

  return {
    text: 'Marius: "Manager, danke für den Zuspruch im Backstage. Ich fühle mich unbesiegbar. Die Fans werden meine Stimme noch in 100 Jahren hören!"',
    options,
  };
}
