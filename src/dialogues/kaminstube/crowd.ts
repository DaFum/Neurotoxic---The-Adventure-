import { type Dialogue } from '../../store';
import { game } from '../shared/helpers';

export function buildKaminstubeCrowdDialogue(): Dialogue {
  const store = game();

  if (store.flags.kaminstube_crowd_rallied) {
    return { text: 'Die Menge tobt! Tangermünde gehört uns!' };
  }

  return {
    text: 'Die Menge wartet ungeduldig. Ein paar rufen nach einer Cover-Band. Wir müssen sie auf unsere Seite ziehen.',
    options: [
      {
        text: 'Ruft sie zur Ordnung. [Social 5]',
        requiredSkill: { name: 'social', level: 5 },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Manager: "Tangermünde! Seid ihr bereit für den Lärm?!" Die Menge brüllt zurück. Sie gehören uns.'
          );
          currentStore.setFlag('kaminstube_crowd_rallied', true);
          currentStore.increaseBandMood(20, 'dialogues_kaminstube_crowd_23');
          currentStore.increaseSkill('social', 3);
        },
      },
      {
        text: 'Startet mit einem dissonanten Feedback. [Chaos 7]',
        requiredSkill: { name: 'chaos', level: 7 },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Ein ohrenbetäubendes Fiepen zerschneidet die Stille. Die Cover-Band-Rufer verstummen in Schock. Der Rest der Halle rastet aus!'
          );
          currentStore.setFlag('kaminstube_crowd_rallied', true);
          currentStore.increaseBandMood(25, 'dialogues_kaminstube_crowd_36');
          currentStore.increaseSkill('chaos', 4);
        },
      },
      {
        text: 'Ignorieren und aufbauen.',
        action: () => {
          game().setDialogue(
            'Du ignorierst die Zwischenrufe. Die Musik wird für sich selbst sprechen.'
          );
        },
      },
    ],
  };
}
