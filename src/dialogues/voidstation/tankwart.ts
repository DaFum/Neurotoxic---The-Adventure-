import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';

export function buildVoidTankwartDialogue(): Dialogue {
  const store = game();
  const bandMood = store.bandMood;
  const hasForbiddenRiff = store.hasItem('Verbotenes Riff');
  const hasTalisman = store.hasItem('Industrie-Talisman');
  const trait = store.trait;

  if (store.flags.tankwartPhilosophy) {
    return say(
      'Tankwart: "Die Zeit ist nur ein Loop in einem kaputten Tape-Deck. Spielt weiter."'
    );
  }

  if (store.flags.ghostTrustEarned && !store.flags.tankwartBargain) {
    return {
      text: 'Tankwart: "Ich sehe den Staub von 1982 an deinen Schuhen. Der Geist hat dich geschickt."',
      options: [
        {
          text: 'Wir brauchen deine Hilfe.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Tankwart: "Für einen Freund des Geistes gibt es einen besonderen Rabatt in der Leere."'
            );
            currentStore.setFlag('tankwartBargain', true);
            currentStore.increaseBandMood(20, 'dialogues_voidstation_tankwart_29');
          },
        },
      ],
    };
  }

  if (trait === 'Mystic' && !store.flags.tankwartMysticDone) {
    return {
      text: 'Tankwart: "Deine Aura... sie schwingt in Frequenzen, die ich seit Äonen nicht mehr gespürt habe. Du bist ein Wanderer zwischen den Welten. Was suchst du in der Leere?"',
      options: [
        {
          text: 'Ich suche die Wahrheit.',
          action: () => {
            const currentStore = game();
            const pickedUpShard =
              currentStore.addToInventory('Splitter der Leere');
            if (pickedUpShard) {
              currentStore.setDialogue(
                'Tankwart: "Die Wahrheit ist ein Riff, das niemals endet. Hier, nimm diesen Splitter der Leere. Er wird dir helfen, das Verbotene Riff zu verstehen."'
              );
              currentStore.setFlag('tankwartMysticDone', true);
              currentStore.increaseBandMood(30, 'dialogues_voidstation_tankwart_51');
              return;
            }

            currentStore.setDialogue(
              'Tankwart: "Der Splitter ist für dich bestimmt, aber du kannst gerade keinen weiteren tragen."'
            );
          },
        },
      ],
    };
  }

  if (hasTalisman) {
    return {
      text: 'Tankwart: "Dieser Talisman... er ist ein Fragment der Ur-Maschine. Er vibriert mit der Frequenz der Schöpfung. Willst du die Wahrheit über den Lärm hören?"',
      options: [
        {
          text: 'Ja, lehre mich.',
          action: () => {
            const currentStore = game();
            currentStore.discoverLore('tankwart_truth');
            currentStore.setDialogue(
              'Tankwart: "Lärm ist nicht das Chaos. Lärm ist die Ordnung, die wir noch nicht verstehen. Jedes Feedback ist ein Gebet an die Leere. In Salzgitter werdet ihr die Antwort finden."'
            );
            currentStore.setFlag('tankwartPhilosophy', true);
            currentStore.increaseBandMood(20, 'dialogues_voidstation_tankwart_77');
          },
        },
        {
          text: 'Ich will nur den Gig spielen.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Tankwart: "So begrenzt. Aber okay. Die Leere braucht auch Handwerker."'
            );
            currentStore.increaseBandMood(5, 'dialogues_voidstation_tankwart_87');
          },
        },
      ],
    };
  }

  if (hasForbiddenRiff && !store.flags.tankwartReactedToRiff) {
    return {
      text: 'Tankwart: "Dieses Riff... es ist der Schlüssel zum Ende der Zeit. Es wurde vor Äonen von den ersten Maschinen-Göttern in den Stahl geätzt. Bist du bereit für die Konsequenzen?"',
      options: [
        {
          text: 'Ich bin bereit.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Tankwart: "Spielt es laut, spielt es stolz. Die Leere wartet auf diesen Akkord. Er wird die Sterne zum Erlöschen bringen."'
            );
            currentStore.setFlag('tankwartReactedToRiff', true);
            currentStore.increaseBandMood(15, 'dialogues_voidstation_tankwart_106');
          },
        },
        {
          text: 'Was für Konsequenzen?',
          action: () => {
            game().setDialogue(
              'Tankwart: "Die Realität wird sich biegen, die Fans werden zu Schatten. Ein kleiner Preis für den perfekten Gig."'
            );
          },
        },
      ],
    };
  }

  if (store.flags.voidRefueled) {
    return say(
      bandMood > 60
        ? 'Tankwart: "Eure Aura strahlt heller als eine Supernova. Der Gig wird die Galaxie erschüttern. Die Kaminstube ist bereit für die Transzendenz."'
        : 'Tankwart: "Die Leere ist gesättigt. Eure Reise durch den Lärm kann fortgesetzt werden. Vergesst nicht: Stille ist der Feind."'
    );
  }

  if (store.hasItem('Dunkle Materie')) {
    const hasKristall = store.hasItem('Resonanz-Kristall');
    const options: DialogueOption[] = [
      {
        text: '440Hz - Standard Industrial Power.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Tankwart: "Eine solide Wahl. Der Lärm wird mächtig sein und die Wände der Realität einreißen."'
          );
          currentStore.removeFromInventory('Dunkle Materie');
          currentStore.completeQuestWithFlag('void', 'voidRefueled');
          currentStore.increaseBandMood(25, 'dialogues_voidstation_tankwart_141');
        },
      },
      {
        text: '432Hz - Wir wollen die Chakren der Fans öffnen.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Tankwart: "Interessant. Die Fans werden verwirrt sein, aber ihre Seelen werden im Takt des Universums schwingen."'
          );
          currentStore.removeFromInventory('Dunkle Materie');
          currentStore.completeQuestWithFlag('void', 'voidRefueled');
          currentStore.increaseBandMood(10, 'dialogues_voidstation_tankwart_153');
        },
      },
    ];

    if (hasKristall) {
      options.push({
        text: 'Betanke ihn mit der Frequenz des Resonanz-Kristalls. [Mystic]',
        requiredTrait: 'Mystic',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Tankwart: "Die Frequenz von 1982... Du hast sie gefunden! Der Van wird nicht fahren, er wird DURCH die Realität schneiden. Salzgitter wird niemals wieder dasselbe sein."'
          );
          currentStore.removeFromInventory('Dunkle Materie');
          currentStore.completeQuestWithFlag('void', 'voidRefueled');
          currentStore.increaseBandMood(40, 'dialogues_voidstation_tankwart_169');
        },
      });
    }

    return {
      text: 'Tankwart: "Ah, die Essenz des Nichts. Dunkle Materie ist der Treibstoff der Träume, die wir nie zu träumen wagten. Soll ich den Van mit 440Hz-Vibrationen oder 432Hz-Heilfrequenzen betanken?"',
      options,
    };
  }

  return {
    text:
      bandMood < 30
        ? 'Tankwart: "Eure Seelen sind so leer wie mein Tank. Findet Dunkle Materie, bevor ihr in der Bedeutungslosigkeit verblasst. Diese Station existiert nur für jene mit wahrem Lärm im Herzen."'
        : store.flags.backstageRitualPerformed
          ? 'Tankwart: "Ich spüre die Energie eures Rituals. Ihr seid vorbereitet auf den Lärm. Was suchst du hier wirklich?"'
          : 'Tankwart: "Willkommen an der Station zwischen den Takten. Hier wird die Zeit gedehnt und der Schall zur Materie. Der Van benötigt Dunkle Materie, um die Realität zu durchbrechen. Was suchst du hier wirklich?"',
    options: [
      {
        text: 'Nur Treibstoff für den Gig.',
        action: () => {
          game().setDialogue(
            'Tankwart: "So pragmatisch. Sucht in den Ecken der Existenz, wo das Licht sich krümmt."'
          );
        },
      },
      ...(!store.flags.tankwartBargain
        ? [
            {
              id: 'tankwart_cynic',
              text: 'Das ist doch alles Quatsch. Gib mir Sprit. [Cynic]',
              requiredTrait: 'Cynic' as const,
              action: () => {
                const currentStore = game();
                currentStore.setDialogue(
                  'Tankwart: "Quatsch? Schau dich um, Fleischsack. Du stehst in der 5. Dimension. Hier ist der Sprit."'
                );
                currentStore.increaseBandMood(15, 'dialogues_voidstation_tankwart_207');
                currentStore.increaseSkill('chaos', 3);
                currentStore.setFlag('tankwartBargain', true);
              },
            },
            {
              id: 'tankwart_diplomat',
              text: 'Wir können sicher ein Arrangement treffen. [Diplomat]',
              requiredTrait: 'Diplomat' as const,
              action: () => {
                const currentStore = game();
                currentStore.setDialogue(
                  'Tankwart: "Ein Arrangement? Die Leere nimmt nur, aber für einen Vermittler des Lärms mache ich eine Ausnahme."'
                );
                currentStore.increaseBandMood(20, 'dialogues_voidstation_tankwart_221');
                currentStore.increaseSkill('social', 5);
                currentStore.setFlag('tankwartBargain', true);
              },
            },
            {
              id: 'tankwart_performer',
              text: 'Ich spiele für dich, Tankwart. [Performer]',
              requiredTrait: 'Performer' as const,
              action: () => {
                const currentStore = game();
                currentStore.setDialogue(
                  'Du legst eine kosmische Performance hin. Der Tankwart applaudiert lautlos. "Bravo. Die Leere liebt eine gute Show."'
                );
                currentStore.increaseBandMood(25, 'dialogues_voidstation_tankwart_235');
                currentStore.increaseSkill('social', 5);
                currentStore.setFlag('tankwartBargain', true);
              },
            },
          ]
        : []),
      {
        text: 'Die Antwort auf das ultimative Riff.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Tankwart: "Das Riff ist in dir... und in der Pfütze im Proberaum, die seit 1982 niemals getrocknet ist."'
          );
          currentStore.increaseBandMood(5, 'dialogues_voidstation_tankwart_249');
        },
      },
      {
        text: 'Das kosmische Echo hat mir etwas gezeigt. [cosmic_echo complete]',
        questDependencies: ['cosmic_echo'],
        action: () => {
          const currentStore = game();
          currentStore.discoverLore('cosmic_echo_decoded');
          currentStore.setDialogue(
            'Tankwart: "Das Echo... du hast es entschlüsselt. Dann weißt du, was in Salzgitter passieren wird. Die Koordinaten sind nicht nur ein Ort - sie sind ein Zeitpunkt. Ihr spielt am Ende aller Dinge."'
          );
          currentStore.increaseBandMood(15, 'dialogues_voidstation_tankwart_261');
          currentStore.setFlag('tankwartPhilosophy', true);
        },
      },
    ],
  };
}
