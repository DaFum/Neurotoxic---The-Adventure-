import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';
import { buildKaminstubeWirtPreludeDialogue } from './wirtPrelude';

export function buildKaminstubeWirtDialogue(): Dialogue {
  const store = game();
  const preludeDialogue = buildKaminstubeWirtPreludeDialogue();

  if (preludeDialogue) {
    return preludeDialogue;
  }

  if (store.bandMood > 80 && !store.flags.wirtLegacy1982) {
    const knowsSecret =
      store.flags.askedAbout1982 || store.flags.ghostSecretRevealed;

    if (knowsSecret) {
      const options: DialogueOption[] = [
        {
          text: 'Erzähl mir die ganze Geschichte von 1982.',
          action: () => {
            game().setDialogue({
              text: 'Wirt: "Das ist gefährliches Wissen... Der Manager von damals, er wusste, worauf er sich einlässt."',
              options: [
                {
                  text: 'Ich bin vertrauenswürdig. [Diplomat]',
                  requiredTrait: 'Diplomat',
                  action: () => {
                    const currentStore = game();
                    currentStore.setDialogue(
                      'Wirt: "Na gut. Er machte einen Pakt mit der Void. Der Bassist war der Preis für den ultimativen Riff. Salzgitter war nur der Anfang. Passt auf euch auf."'
                    );
                    currentStore.completeQuestWithFlag(
                      'wirt_legacy',
                      'wirtLegacy1982',
                      true,
                      'Erfahre die vollständige Geschichte von 1982 vom Wirt'
                    );
                    currentStore.increaseBandMood(25);
                    currentStore.increaseSkill('social', 5);
                  },
                },
                {
                  text: 'Es ist wichtig für die Band. [Social 7]',
                  requiredSkill: { name: 'social', level: 7 },
                  action: () => {
                    const currentStore = game();
                    currentStore.setDialogue(
                      'Wirt: "Für die Band... okay. Der Manager verkaufte den Bassisten an die Leere, um den perfekten Industrial-Sound zu erschaffen. Begeht nicht den gleichen Fehler."'
                    );
                    currentStore.completeQuestWithFlag(
                      'wirt_legacy',
                      'wirtLegacy1982',
                      true,
                      'Erfahre die vollständige Geschichte von 1982 vom Wirt'
                    );
                    currentStore.increaseBandMood(20);
                    currentStore.increaseSkill('social', 3);
                  },
                },
                {
                  text: 'Die Wahrheit muss raus! [Chaos 5]',
                  requiredSkill: { name: 'chaos', level: 5 },
                  action: () => {
                    const currentStore = game();
                    currentStore.setDialogue(
                      'Wirt: "Schrei nicht so! Okay, okay. Der Manager hat den Bassisten geopfert. An die Frequenz! Zufrieden?! Jetzt geh spielen!"'
                    );
                    currentStore.completeQuestWithFlag(
                      'wirt_legacy',
                      'wirtLegacy1982',
                      true,
                      'Erfahre die vollständige Geschichte von 1982 vom Wirt'
                    );
                    currentStore.increaseBandMood(15);
                    currentStore.increaseSkill('chaos', 3);
                  },
                },
                {
                  text: 'Lass gut sein.',
                  action: () => {
                    game().setDialogue(
                      'Wirt: "Besser ist das. Die Wände hier haben Ohren."'
                    );
                  },
                },
              ],
            });
          },
        },
      ];

      if (store.flags.ghostTrustEarned) {
        options.unshift({
          text: 'Der Geist hat mich geschickt.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Wirt: "Der Roadie?! Er ist noch da... dann weißt du es schon. Der Manager hat den Bassisten geopfert. Er hat einen Pakt mit der Void geschlossen. Passt auf, dass euch in Salzgitter nicht dasselbe passiert."'
            );
            currentStore.completeQuestWithFlag(
              'wirt_legacy',
              'wirtLegacy1982',
              true,
              'Erfahre die vollständige Geschichte von 1982 vom Wirt'
            );
            currentStore.increaseBandMood(30);
          },
        });
      }

      return {
        text: 'Wirt: "Ihr habt die Stimmung zum Kochen gebracht. Fast so wie die Jungs von 1982. Ihr erinnert mich so sehr an sie..."',
        options,
      };
    }
  }

  if (store.bandMood > 80) {
    return {
      text: 'Wirt: "Ich hab schon viele Bands hier gesehen, aber ihr... ihr habt den Schmerz und den Stahl im Blut. Die Bühne zittert bereits vor Vorfreude. Was wollt ihr wissen?"',
      options: [
        {
          text: 'Erzähl mir vom Gig 1982.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Wirt: "Es war laut. So laut, dass die Fenster in ganz Tangermünde zersprangen. Der Manager verschwand im Feedback. Manche sagen, er ist immer noch da draußen."'
            );
            currentStore.increaseBandMood(10);
          },
        },
        {
          text: 'Wie kommen wir nach Salzgitter?',
          action: () => {
            game().setDialogue(
              'Wirt: "Folgt dem Lärm. Wenn die Realität dünn wird, seid ihr fast da."'
            );
          },
        },
      ],
    };
  }

  if (store.bandMood < 30) {
    return say(
      'Wirt: "Ihr seht aus, als hättet ihr gerade eure letzte Kassette im Regen verloren. Trinkt was, oder verschwindet. In der Kaminstube überleben nur die Harten."'
    );
  }

  return {
    text: 'Wirt: "Willkommen in der Kaminstube. Hier wurde Industrial Metal erfunden, als ein Heizkessel explodierte und jemand dazu schrie. Was wollt ihr?"',
    options: [
      {
        text: 'Ein Bier, bitte.',
        action: () => {
          const currentStore = game();
          if (currentStore.hasItem('Bier')) {
            currentStore.setDialogue(
              'Wirt: "Du hast doch schon eins! Trink das erst mal aus."'
            );
            return;
          }

          const pickedUpBeer = currentStore.addToInventory('Bier');
          if (pickedUpBeer) {
            currentStore.setDialogue(
              'Wirt: "Klar, hier. Das offizielle Schmiermittel für den Industrial-Motor."'
            );
            return;
          }

          currentStore.setDialogue(
            'Wirt: "Heute ist Schluss mit Freibier. Ich geb dir keins mehr."'
          );
        },
      },
      {
        text: 'Wer bist du?',
        action: () => {
          game().setDialogue(
            'Wirt: "Ich bin der Hüter der Stille, die nach dem Knall kommt. Und ich zapfe das beste Bier der Region."'
          );
        },
      },
    ],
  };
}
