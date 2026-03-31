import { type Dialogue, type DialogueOption } from '../../store';
import { game, when, say } from '../shared/helpers';

export function buildProberaumMariusDialogue(): Dialogue {
  const store = game();
  const { flags, bandMood, hasItem, trait, skills } = store;

  if (!flags.gaveBeerToMarius) {
    return {
      text: 'Marius: "Ohne ein kühles Bier kann ich nicht singen. Besorg mir eins!"',
      options: [
        ...when(hasItem('Bier'), {
          text: 'Hier ist dein Bier.',
          consumeItems: ['Bier'],
          action: () => {
            const currentStore = game();
            currentStore.completeQuestWithFlag('beer', 'gaveBeerToMarius');
            currentStore.completeQuest('marius');
            currentStore.increaseBandMood(15);
            currentStore.setDialogue('Marius: "Endlich! Mein Treibstoff. Jetzt kann die Probe losgehen!"');
          }
        } as DialogueOption),
        {
          text: 'Ich beeile mich.',
          action: () => game().setDialogue('Marius: "Gut. Meine Stimmbänder fühlen sich an wie Schleifpapier."')
        },
        {
          text: 'Trink doch Wasser.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Marius: "Wasser? Bist du wahnsinnig? Ich bin kein Goldfisch!"');
            currentStore.increaseBandMood(-5);
          }
        },
        ...when(!flags.mariusVisionShared && trait === 'Visionary', {
          id: 'marius_vision_shared',
          text: 'Ich verstehe deine Vision. [Visionary]',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Marius: "Du verstehst mich? Die Reinheit des Schreiens... Du bist anders als die anderen Manager. Lass uns Geschichte schreiben."');
            currentStore.setFlag('mariusVisionShared', true);
            currentStore.increaseBandMood(20);
            currentStore.increaseSkill('social', 3);
          }
        } as DialogueOption),
        ...when(!flags.mariusCalmedDown && skills.social >= 5, {
          id: 'marius_calmed_down',
          text: 'Beruhige dich, Star. [Social 5]',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Marius: "Puh... du hast ja recht. Ich bin ein bisschen drüber. Danke für die Erdung."');
            currentStore.setFlag('mariusCalmedDown', true);
            currentStore.increaseBandMood(15);
            currentStore.increaseSkill('social', 2);
          }
        } as DialogueOption)
      ]
    };
  } else {
    const moodText = bandMood > 80
      ? 'Marius: "Ich fühle die Energie! Wir werden die Welt in Schutt und Asche legen!"'
      : 'Marius: "Prost! Die Riff Night in Salzgitter wird legendär!"';

    if (bandMood > 50) {
      return {
        text: moodText,
        options: [
          ...when(!flags.mariusEgoStrategy, {
            text: 'Wie bereitest du dich auf Salzgitter vor?',
            action: () => {
              game().setDialogue({
                text: 'Marius: "Ich meditiere über meine Großartigkeit. Was schlägst du vor?"',
                options: [
                  {
                    text: 'Ich coache deine Bühnenpräsenz. [Performer]',
                    requiredTrait: 'Performer' as const,
                    action: () => {
                      const currentStore = game();
                      currentStore.setDialogue('Marius: "Ah, von einem Meister lernen. Zeig mir, wie ich das Licht fange."');
                      currentStore.increaseBandMood(15);
                      currentStore.increaseSkill('social', 3);
                      currentStore.setFlag('mariusEgoStrategy', true);
                    }
                  },
                  {
                    text: 'Du wirst auf der Bühne sterben. [Cynic]',
                    requiredTrait: 'Cynic' as const,
                    action: () => {
                      const currentStore = game();
                      currentStore.setDialogue('Marius: "WAS?! ...Nein, du hast recht. Ich muss wütender werden!"');
                      currentStore.increaseBandMood(10);
                      currentStore.increaseSkill('chaos', 3);
                      currentStore.setFlag('mariusEgoStrategy', true);
                    }
                  },
                  {
                    text: 'Hier ist ein Ego-Management-Plan. [Social 7]',
                    requiredSkill: { name: 'social' as const, level: 7 },
                    action: () => {
                      const currentStore = game();
                      currentStore.setDialogue('Marius: "Ein... Plan? Ok, das könnte helfen, nicht die Kontrolle zu verlieren."');
                      currentStore.increaseBandMood(20);
                      currentStore.setFlag('mariusEgoStrategy', true);
                    }
                  },
                  {
                    text: 'Bleib einfach cool.',
                    action: () => game().setDialogue('Marius: "Ich bin immer cool."')
                  }
                ]
              });
            }
          } as DialogueOption),
          ...when(!flags.mariusSelfDoubtRevealed && trait === 'Diplomat', {
            id: 'marius_self_doubt',
            text: 'Marius, wie geht es dir wirklich? [Diplomat]',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Marius: "Ehrlich gesagt... ich habe das Gefühl, ich bin nicht gut genug. Die anderen sind so talentiert."');
              currentStore.setFlag('mariusSelfDoubtRevealed', true);
              currentStore.setFlag('marius_tourbus_doubt', true);
              currentStore.increaseBandMood(15);
              currentStore.increaseSkill('social', 3);
            }
          } as DialogueOption),
          ...when(!flags.mariusEgoComplimented && trait === 'Cynic', {
            id: 'marius_ego_cynic',
            text: 'Dein Ego ist groß genug für zwei Dimensionen. [Cynic]',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Marius: "Haha! Das stimmt. Und bald wird es aus mir herausbrechen!"');
              currentStore.setFlag('mariusEgoComplimented', true);
              currentStore.increaseBandMood(5);
              currentStore.increaseSkill('chaos', 2);
            }
          } as DialogueOption),
          {
            text: 'Bereit für den Gig?',
            action: () => game().setDialogue('Marius: "Immer!"')
          }
        ]
      };
    } else {
      return say(moodText);
    }
  }
}