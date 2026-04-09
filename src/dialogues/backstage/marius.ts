import { type Dialogue, type DialogueOption } from '../../store';
import { game } from '../shared/helpers';

const BACKSTAGE_MARIUS_QUEST_ID = 'marius';
const BACKSTAGE_MARIUS_QUEST_TEXT = 'Beruhige Marius vor dem Auftritt';

export function buildBackstageMariusDialogue(): Dialogue {
  const store = game();
  const { bandMood, flags } = store;

  if (flags.mariusCalmed) {
    return {
      text:
        bandMood > 70
          ? 'Marius: "Ich fühle mich wie ein Gott! Tangermünde wird beben! Ich spüre den Stahl in meiner Stimme!"'
          : 'Marius: "Ich bin bereit. Lass uns die Bühne abreißen! Der Lärm wird unser Zeuge sein."',
    };
  }

  const options: DialogueOption[] = [];

  if (!flags.askedAbout1982Attempted) {
    options.push({
      text: 'Denk an den Gig 1982. Wir haben Schlimmeres überlebt.',
      action: () => {
        const currentStore = game();
        if (currentStore.flags.askedAbout1982) {
          currentStore.setDialogue({
            text: 'Marius: "1982... ja. Als die Gießerei bebte. Wenn wir das überlebt haben, ist Tangermünde ein Kinderspiel."',
          });
          currentStore.completeQuestWithFlag(
            BACKSTAGE_MARIUS_QUEST_ID,
            'mariusCalmed',
            true,
            BACKSTAGE_MARIUS_QUEST_TEXT
          );
          currentStore.setFlag('mariusConfidenceBoost', true);
          currentStore.increaseBandMood(25, 'id_7b06461f');
          return;
        }

        currentStore.setDialogue(
          'Marius: "1982? Da war ich noch nicht mal in der Band. Wovon redest du? Das macht mich nur noch nervöser!"'
        );
        currentStore.setFlag('askedAbout1982Attempted', true);
        currentStore.increaseBandMood(-5, 'id_80d225ab');
      },
    });
  }

  options.push(
    {
      text: 'Du bist ein Gott am Mikrofon. Vertrau dir. [Social 5]',
      requiredSkill: { name: 'social', level: 5 },
      questToAdd: {
        id: BACKSTAGE_MARIUS_QUEST_ID,
        text: BACKSTAGE_MARIUS_QUEST_TEXT,
      },
      questToComplete: BACKSTAGE_MARIUS_QUEST_ID,
      flagToSet: { flag: 'mariusCalmed', value: true },
      action: () => {
            const currentStore = game();
        currentStore.setDialogue('Marius: "Ein Gott... ja. Ein Gott des Lärms! Danke, Manager. Ich werde sie alle in Grund und Boden schreien!"');
        currentStore.setFlag('mariusConfidenceBoost', true);
        currentStore.increaseBandMood(30, 'id_666c08b2');
        currentStore.increaseSkill('social', 3);
      },
    },
    {
      text: 'Stell dir vor, du bist der einzige Mensch auf der Bühne. [Performer]',
      requiredTrait: 'Performer',
      questToAdd: {
        id: BACKSTAGE_MARIUS_QUEST_ID,
        text: BACKSTAGE_MARIUS_QUEST_TEXT,
      },
      questToComplete: BACKSTAGE_MARIUS_QUEST_ID,
      flagToSet: { flag: 'mariusCalmed', value: true },
      action: () => {
            const currentStore = game();
        currentStore.setDialogue('Marius: "Nur ich und das Mikrofon... Keine Erwartungen, nur reiner Ausdruck. Das ist brillant!"');
        currentStore.setFlag('mariusConfidenceBoost', true);
        currentStore.setFlag('backstage_performer_speech', true);
        currentStore.increaseBandMood(30, 'id_98df1ddf');
        currentStore.increaseSkill('social', 3);
      },
    },
    {
      text: 'Angst ist Schwäche. Zerstöre sie. [Brutalist]',
      requiredTrait: 'Brutalist',
      questToAdd: {
        id: BACKSTAGE_MARIUS_QUEST_ID,
        text: BACKSTAGE_MARIUS_QUEST_TEXT,
      },
      questToComplete: BACKSTAGE_MARIUS_QUEST_ID,
      flagToSet: { flag: 'mariusCalmed', value: true },
      action: () => {
            const currentStore = game();
        currentStore.setDialogue('Marius: "...Du hast Recht. Zerstören. Einfach alles zerstören!"');
        currentStore.increaseBandMood(20, 'id_e971a377');
        currentStore.increaseSkill('chaos', 3);
      },
    },
    {
      text: 'Lass die Frequenz durch dich fließen. [Mystic]',
      requiredTrait: 'Mystic',
      questToAdd: {
        id: BACKSTAGE_MARIUS_QUEST_ID,
        text: BACKSTAGE_MARIUS_QUEST_TEXT,
      },
      questToComplete: BACKSTAGE_MARIUS_QUEST_ID,
      flagToSet: { flag: 'mariusCalmed', value: true },
      action: () => {
            const currentStore = game();
        currentStore.setDialogue('Marius: "Die Frequenz... ich spüre sie. Ich bin nur das Gefäß. Die Musik spricht."');
        currentStore.setFlag('mariusConfidenceBoost', true);
        currentStore.increaseBandMood(25, 'id_f7d64725');
        currentStore.increaseSkill('chaos', 3);
      },
    },
    {
      text: 'Stell dir einfach vor, sie wären alle aus Lego.',
      questToAdd: {
        id: BACKSTAGE_MARIUS_QUEST_ID,
        text: BACKSTAGE_MARIUS_QUEST_TEXT,
      },
      questToComplete: BACKSTAGE_MARIUS_QUEST_ID,
      flagToSet: { flag: 'mariusCalmed', value: true },
      action: () => {
            const currentStore = game();
        currentStore.setDialogue('Marius: "Lego? Das macht es irgendwie... schmerzhafter? Aber okay, ich versuchs."');
        currentStore.increaseBandMood(10, 'id_45b553b5');
      },
    },
    ...(!flags.backstage_marius_diplomat_claimed && store.trait === 'Diplomat' ? [
      {
        text: 'Lass uns die Setlist durchgehen. Wir haben das alles geprobt. [Diplomat]',
        requiredTrait: 'Diplomat' as const,
        action: () => {
          const currentStore = game();
          currentStore.setFlag('backstage_marius_diplomat_claimed', true);
          currentStore.setDialogue(
            'Marius: "Die Setlist... ja, du hast recht. Wenn wir uns an den Plan halten, kann nichts schiefgehen."'
          );
          currentStore.increaseBandMood(15, 'id_d283daf3');
          currentStore.increaseSkill('social', 3);
        }
      }
    ] : [])
  );

  if (flags.mariusEgoStrategy) {
    options.unshift({
      text: 'Erinnerst du dich an unsere Strategie?',
      questToAdd: {
        id: BACKSTAGE_MARIUS_QUEST_ID,
        text: BACKSTAGE_MARIUS_QUEST_TEXT,
      },
      questToComplete: BACKSTAGE_MARIUS_QUEST_ID,
      flagToSet: { flag: 'mariusCalmed', value: true },
      action: () => {
            const currentStore = game();
        currentStore.setDialogue('Marius: "Die Strategie... ja! Ego-Management aktiviert! Ich habe die absolute Kontrolle!"');
        currentStore.setFlag('mariusConfidenceBoost', true);
        currentStore.increaseBandMood(35, 'id_9661db70');
        currentStore.increaseSkill('social', 5);
      },
    });
  }

  return {
    text:
      bandMood > 50
        ? 'Marius: "Ich bin nervös, aber die Stimmung in der Band gibt mir Kraft. Meinst du, wir schaffen das? Die Fans in Tangermünde sind... intensiv."'
        : 'Marius: "Ich... ich kann das nicht. Da draußen sind Tausende! Was wenn ich meinen Text vergesse? Was wenn die Maschinen versagen?"',
    options,
  };
}
