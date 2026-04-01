import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';

export function buildTourbusMariusDialogue(): Dialogue | string {
  const store = game();
  const { bandMood, hasItem } = store;

  const hasEgo = hasItem('Marius Ego');

  if (!hasEgo && bandMood < 30) {
    store.setFlag('marius_tourbus_doubt', true);
  }

  if (hasEgo) {
    return {
      text: 'Marius: "Ist das... mein Ego? Es fühlt sich so... klein an in deiner Tasche."',
      options: [
        {
          text: 'Es ist jetzt sicher.',
          nextDialogue: {
            text: 'Marius: "Danke. Ich fühle mich wieder... vollständig. Und hungrig."',
          },
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(20);
          },
        },
        {
          text: 'Ich behalte es als Pfand.',
          nextDialogue: {
            text: 'Marius: "Du bist grausam, Manager. Aber irgendwie respektiere ich das."',
          },
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(-10);
          },
        },
      ],
    };
  } else {
    if (bandMood < 30) {
      return {
        text: 'Marius: "Ich bin ein Betrug. Ohne mein Ego bin ich nur ein Typ, der in ein Mikrofon schreit."',
        options: [
          {
            text: 'Du brauchst kein Ego, um zu schreien. Zeig es ihnen! [Social 7]',
            requiredSkill: { name: 'social', level: 7 },
            nextDialogue: {
              text: 'Marius: "Vielleicht... hast du recht. Die Kaminstube wird brennen!"',
            },
            action: () => {
              const currentStore = game();
              currentStore.increaseBandMood(10);
            },
          },
          {
            text: 'Die Band braucht dich, Marius. Bleib fokussiert. [Diplomat]',
            requiredTrait: 'Diplomat',
            nextDialogue: {
              text: 'Marius: "Ich werde sie nicht im Stich lassen. Danke, Manager."',
            },
            action: () => {
              const currentStore = game();
              currentStore.increaseBandMood(15);
            },
          },
          {
            text: 'Dann hör auf zu jammern.',
            nextDialogue: { text: 'Marius: "Du verstehst mich nicht..."' },
          },
        ],
      };
    } else {
      const moodText =
        bandMood > 60
          ? 'Marius: "Die Energie im Bus ist fantastisch! Tangermünde wird beben!"'
          : 'Marius: "Nächster Halt: Tangermünde! Bist du bereit für die Kaminstube?"';
      return {
        text: moodText,
        options: [
          {
            text: 'Marius, dein Charisma funktioniert auch ohne Ego. [Performer]',
            requiredTrait: 'Performer',
            flagToSet: { flag: 'marius_tourbus_doubt', value: false },
            nextDialogue: {
              text: 'Marius: "Echtes Charisma... ja, das stimmt. Ich bin der Frontmann!"',
            },
            action: () => {
              const currentStore = game();
              currentStore.increaseBandMood(15);
              currentStore.increaseSkill('social', 3);
            },
          },
          {
            text: 'Wir sind auf dem Weg.',
            nextDialogue: { text: 'Marius: "Lass uns fahren."' },
          },
        ],
      };
    }
  }
}
