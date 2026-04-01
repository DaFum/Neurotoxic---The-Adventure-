import { type Dialogue, type DialogueOption } from '../../store';
import { game } from '../shared/helpers';

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

  const options: DialogueOption[] = [
    {
      text: 'Du bist ein Gott am Mikrofon. Vertrau dir. [Social 5]',
      requiredSkill: { name: 'social', level: 5 },
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Marius: "Ein Gott... ja. Ein Gott des Lärms! Danke, Manager. Ich werde sie alle in Grund und Boden schreien!"'
        );
        currentStore.setFlag('mariusCalmed', true);
        currentStore.startAndFinishQuest(
          'marius',
          'Beruhige Marius vor dem Auftritt'
        );
        currentStore.setFlag('mariusConfidenceBoost', true);
        currentStore.increaseBandMood(30);
        currentStore.increaseSkill('social', 3);
      },
    },
    {
      text: 'Stell dir vor, du bist der einzige Mensch auf der Bühne. [Performer]',
      requiredTrait: 'Performer',
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Marius: "Nur ich und das Mikrofon... Keine Erwartungen, nur reiner Ausdruck. Das ist brillant!"'
        );
        currentStore.setFlag('mariusCalmed', true);
        currentStore.startAndFinishQuest(
          'marius',
          'Beruhige Marius vor dem Auftritt'
        );
        currentStore.setFlag('mariusConfidenceBoost', true);
        currentStore.setFlag('backstage_performer_speech', true);
        currentStore.increaseBandMood(30);
        currentStore.increaseSkill('social', 3);
      },
    },
    {
      text: 'Angst ist Schwäche. Zerstöre sie. [Brutalist]',
      requiredTrait: 'Brutalist',
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Marius: "...Du hast Recht. Zerstören. Einfach alles zerstören!"'
        );
        currentStore.setFlag('mariusCalmed', true);
        currentStore.startAndFinishQuest(
          'marius',
          'Beruhige Marius vor dem Auftritt'
        );
        currentStore.increaseBandMood(20);
        currentStore.increaseSkill('chaos', 3);
      },
    },
    {
      text: 'Lass die Frequenz durch dich fließen. [Mystic]',
      requiredTrait: 'Mystic',
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Marius: "Die Frequenz... ich spüre sie. Ich bin nur das Gefäß. Die Musik spricht."'
        );
        currentStore.setFlag('mariusCalmed', true);
        currentStore.startAndFinishQuest(
          'marius',
          'Beruhige Marius vor dem Auftritt'
        );
        currentStore.setFlag('mariusConfidenceBoost', true);
        currentStore.increaseBandMood(25);
        currentStore.increaseSkill('chaos', 3);
      },
    },
    {
      text: 'Stell dir einfach vor, sie wären alle aus Lego.',
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Marius: "Lego? Das macht es irgendwie... schmerzhafter? Aber okay, ich versuchs."'
        );
        currentStore.setFlag('mariusCalmed', true);
        currentStore.startAndFinishQuest(
          'marius',
          'Beruhige Marius vor dem Auftritt'
        );
        currentStore.increaseBandMood(10);
      },
    },
    {
      text: 'Denk an den Gig 1982. Wir haben Schlimmeres überlebt.',
      action: () => {
        const currentStore = game();
        if (currentStore.flags.askedAbout1982) {
          currentStore.setDialogue(
            'Marius: "1982... ja. Als die Gießerei bebte. Wenn wir das überlebt haben, ist Tangermünde ein Kinderspiel."'
          );
          currentStore.setFlag('mariusCalmed', true);
          currentStore.startAndFinishQuest(
            'marius',
            'Beruhige Marius vor dem Auftritt'
          );
          currentStore.setFlag('mariusConfidenceBoost', true);
          currentStore.increaseBandMood(25);
          return;
        }

        currentStore.setDialogue(
          'Marius: "1982? Da war ich noch nicht mal in der Band. Wovon redest du? Das macht mich nur noch nervöser!"'
        );
        currentStore.increaseBandMood(-5);
      },
    },
  ];

  if (flags.mariusEgoStrategy) {
    options.unshift({
      text: 'Erinnerst du dich an unsere Strategie?',
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Marius: "Die Strategie... ja! Ego-Management aktiviert! Ich habe die absolute Kontrolle!"'
        );
        currentStore.setFlag('mariusCalmed', true);
        currentStore.startAndFinishQuest(
          'marius',
          'Beruhige Marius vor dem Auftritt'
        );
        currentStore.setFlag('mariusConfidenceBoost', true);
        currentStore.increaseBandMood(35);
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
