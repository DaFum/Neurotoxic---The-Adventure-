import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';

export function buildBackstageLarsDialogue(): Dialogue {
  const store = game();
  const hasTurbo = store.hasItem('Turbo-Koffein');

  if (store.flags.larsEnergized) {
    if (store.flags.larsVibrating) {
      if (store.flags.larsDrumPhilosophy) {
        return say(
          'Lars: "DIE DRUMS SIND NICHT DAS INSTRUMENT. ICH BIN DAS INSTRUMENT. DER TAKT IST NUR EIN VORSCHLAG."'
        );
      }

      return {
        text: 'Lars: "ICH SEHE DIE ZEIT! SIE IST GELB! UND SIE SCHLÄGT IM 4/4 TAKT! MANAGER, WAS IST DAS GEHEIMNIS DES TAKTS?!"',
        options: [
          {
            text: 'Konzentriere dich auf das Chaos. [Chaos 5]',
            requiredSkill: { name: 'chaos', level: 5 },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Lars: "JA! Das Chaos ist die wahre Ordnung! Ich werde den Raum mit Polyrhythmen zerreißen!"'
              );
              currentStore.setFlag('larsDrumPhilosophy', true);
              currentStore.increaseBandMood(20);
              currentStore.increaseSkill('chaos', 3);
            },
          },
          {
            text: 'Folge dem Metronom. [Technical 5]',
            requiredSkill: { name: 'technical', level: 5 },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Lars: "Nein... das ist zu simpel. Aber... vielleicht hast du recht. Präzision vor Wahnsinn."'
              );
              currentStore.setFlag('larsDrumPhilosophy', true);
              currentStore.increaseBandMood(10);
            },
          },
          {
            text: 'Schlag einfach hart drauf.',
            action: () => {
              game().setDialogue(
                'Lars: "Das ist der Plan! Immerhin habe ich diese Carbon-Sticks!"'
              );
            },
          },
        ],
      };
    }

    return say('Lars: "VOLLGAS! Ich spüre die Farben der Musik!"');
  }

  if (hasTurbo) {
    const options: DialogueOption[] = [
      {
        text: 'Trink es auf Ex!',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "ICH BIN EIN BLITZ! ICH BIN DER DONNER! MEINE HÄNDE VIBRIEREN SO SCHNELL, DASS ICH DURCH WÄNDE GEHEN KANN!"'
          );
          currentStore.removeFromInventory('Turbo-Koffein');
          currentStore.setFlag('larsEnergized', true);
          currentStore.setFlag('larsVibrating', true);
          currentStore.increaseBandMood(40);
        },
      },
      {
        text: 'Nur einen Schluck. [Diplomat]',
        requiredTrait: 'Diplomat',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "Du hast recht. Ein kontrollierter Burn. Mein Rhythmus wird unaufhaltsam sein."'
          );
          currentStore.removeFromInventory('Turbo-Koffein');
          currentStore.setFlag('larsEnergized', true);
          currentStore.setFlag('lars_paced', true);
          currentStore.increaseBandMood(30);
          currentStore.increaseSkill('social', 3);
        },
      },
      {
        text: 'Nur einen Schluck.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "Nur einen Schluck? Bist du wahnsinnig? Das Zeug ist wie Raketentreibstoff! ... Okay, ich fühl mich schon besser."'
          );
          currentStore.removeFromInventory('Turbo-Koffein');
          currentStore.setFlag('larsEnergized', true);
          currentStore.increaseBandMood(20);
        },
      },
    ];

    if (store.flags.larsRhythmPact) {
      options.unshift({
        text: 'Der Pakt hält.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "Der Pakt hält! Diese Energie... sie speist direkt das Zentrum des Rhythmus!"'
          );
          currentStore.removeFromInventory('Turbo-Koffein');
          currentStore.setFlag('larsEnergized', true);
          currentStore.increaseBandMood(40);
        },
      });
      options.unshift({
        text: 'Lass den Rhythmus explodieren! [Chaos 5]',
        requiredSkill: { name: 'chaos', level: 5 },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "EXPLOSION! DER PAKT BRICHT DIE GRENZEN!"'
          );
          currentStore.removeFromInventory('Turbo-Koffein');
          currentStore.setFlag('larsEnergized', true);
          currentStore.setFlag('larsVibrating', true);
          currentStore.increaseBandMood(50);
        },
      });
    }

    return {
      text: 'Lars: "WAS IST DAS?! Turbo-Koffein?! Gib her, ich will die Schallmauer durchbrechen!"',
      options,
    };
  }

  if (store.hasItem('Energiedrink')) {
    const energyText = store.flags.larsRhythmPact
      ? 'Lars: "JA! Der Treibstoff für unseren Pakt! Der Rhythmus explodiert in mir!"'
      : 'Lars: "JA! Das ist der Treibstoff, den ich brauche! Nicht so gut wie Turbo-Koffein, aber es reicht."';

    store.removeFromInventory('Energiedrink');
    store.setFlag('larsEnergized', true);
    store.increaseBandMood(store.flags.larsRhythmPact ? 35 : 10);

    return { text: energyText };
  }

  return say(
    'Lars: "Ich bin total platt. Ohne Koffein geht hier gar nichts. Hast du was Stärkeres als Wasser?"'
  );
}
