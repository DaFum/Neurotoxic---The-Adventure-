import { type Dialogue } from '../../store';
import { game } from '../shared/helpers';

export function buildTourbusMariusDialogue(): Dialogue | string {
  const store = game();
  const { bandMood, hasItem } = store;

  const hasEgo = hasItem('Marius Ego');

  if (!hasEgo && bandMood < 30 && !store.flags.marius_tourbus_doubt) {
    return {
      text: 'Marius starrt ins Leere. Er scheint an sich zu zweifeln.',
      options: [
        {
          text: '(Nähern)',
          action: () => {
            game().setFlag('marius_tourbus_doubt', true);
            game().setDialogue(buildTourbusMariusDialogue());
          }
        }
      ]
    };
  }

  if (hasEgo) {
    return {
      text: 'Marius: "Ist das... mein Ego? Es fühlt sich so... klein an in deiner Tasche."',
      options: [
        {
          text: 'Es ist jetzt sicher.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Marius: "Danke. Ich fühle mich wieder... vollständig. Und hungrig."');
            currentStore.removeFromInventory('Marius Ego');
            currentStore.increaseBandMood(20, 'id_1d3ac6c4');
          },
        },
        {
          text: 'Ich behalte es als Pfand.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Marius: "Du bist grausam, Manager. Aber irgendwie respektiere ich das."');
            currentStore.increaseBandMood(-10, 'id_f3887664');
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
            action: () => {
            const currentStore = game();
              currentStore.setDialogue('Marius: "Vielleicht... hast du recht. Ich muss nicht ich selbst sein — ich muss Marius sein. Die Kaminstube wird brennen!"');
              currentStore.increaseBandMood(10, 'id_47daa02e');
            },
          },
          {
            text: 'Die Band braucht dich, Marius. Bleib fokussiert. [Diplomat]',
            requiredTrait: 'Diplomat',
            action: () => {
            const currentStore = game();
              currentStore.setDialogue('Marius: "Ich werde sie nicht im Stich lassen. Danke, Manager."');
              currentStore.increaseBandMood(15, 'id_26d4ed71');
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
          ? 'Marius: "Die Energie im Bus ist fantastisch! Salzgitter wird beben!"'
          : 'Marius: "Nächster Halt: Salzgitter! Bist du bereit für Backstage?"';
      return {
        text: moodText,
        options: [
          ...(!store.flags.marius_tourbus_performer_claimed
            ? [
                {
                  text: 'Marius, dein Charisma funktioniert auch ohne Ego. [Performer]',
                  requiredTrait: 'Performer' as const,
                  flagToSet: { flag: 'marius_tourbus_doubt' as const, value: false },
                  action: () => {
            const currentStore = game();
                    currentStore.setDialogue('Marius: "Echtes Charisma... ja, das stimmt. Ich bin der Frontmann!"');
                    currentStore.setFlag('marius_tourbus_performer_claimed', true);
                    currentStore.increaseBandMood(15, 'id_30261faf');
                    currentStore.increaseSkill('social', 3);
                  },
                },
              ]
            : []),
          {
            text: 'Wir sind auf dem Weg.',
            nextDialogue: { text: 'Marius: "Lass uns fahren."' },
          },
        ],
      };
    }
  }
}
