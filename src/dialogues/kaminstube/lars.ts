import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';

export function buildKaminstubeLarsDialogue(): Dialogue {
  const store = game();

  if (store.flags.kaminstube_lars_talked) {
    return {
      text: 'Lars: "Die Schmiede ruft. Ich habe den Takt verinnerlicht."',
      options: [
        ...(!store.flags.lars_drum_maintenance && store.hasItem('Lötkolben') ? [
          {
            text: 'Willst du deinen Hocker noch schweißen? [Lötkolben]',
            consumeItems: ['Lötkolben'],
            action: () => {
              const currentStore = game();
              currentStore.setFlag('lars_drum_maintenance', true);
              currentStore.setDialogue('Lars: "Perfekt, der Hocker hat vorhin schon gewackelt wie ein Kuhschwanz. Jetzt ist er stabil!"');
              currentStore.increaseBandMood(15);
              currentStore.increaseSkill('technical', 2);
            }
          }
        ] : []),
        {
          text: 'Gut so.',
          action: () => game().setDialogue('Lars: "Immer bereit."')
        }
      ]
    };
  }

  const options: DialogueOption[] = [
    {
      text: 'Dann spiel im Takt der Hämmer. [Technical 5]',
      requiredSkill: { name: 'technical', level: 5 },
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Lars: "Genau! 120 BPM, hart auf die Snare. Die Akustik des Raumes wird die Schläge verdoppeln!"'
        );
        currentStore.setFlag('kaminstube_lars_talked', true);
        currentStore.increaseBandMood(15);
        currentStore.increaseSkill('technical', 3);
      },
    },
    {
      text: 'Zerschmettere die Hämmer mit deinem Rhythmus. [Chaos 5]',
      requiredSkill: { name: 'chaos', level: 5 },
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Lars: "JA! Ein Polyrhythmus, der die Architektur der Halle in Frage stellt!"'
        );
        currentStore.setFlag('kaminstube_lars_talked', true);
        currentStore.increaseBandMood(20);
        currentStore.increaseSkill('chaos', 3);
      },
    },
    {
      text: 'Hauptsache du bleibst im Takt.',
      action: () => {
        const currentStore = game();
        currentStore.setFlag('kaminstube_lars_talked', true);
        currentStore.setDialogue(
          'Lars: "Takt ist relativ. Aber okay, ich bemühe mich."'
        );
      },
    },
  ];

  if (store.flags.larsRhythmPact) {
    options.unshift({
      text: 'Dieser Ort hat einen eigenen Rhythmus.',
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Lars: "Ja... der Pakt wird stärker. Ich spüre die Hämmer der alten Gießerei in mir schlagen. Wir sind bereit."'
        );
        currentStore.setFlag('kaminstube_lars_talked', true);
        currentStore.increaseBandMood(10);
      },
    });
  }

  return {
    text: 'Lars: "Wusstest du, dass die Kaminstube früher eine echte Schmiede war? Der Rhythmus der Hämmer steckt noch in den Wänden. Ich spüre ihn!"',
    options,
  };
}
