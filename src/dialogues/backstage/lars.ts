import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';

function applyLarsEnergyDrinkEffects() {
  const currentStore = game();
  const energyText = currentStore.flags.larsRhythmPact
    ? 'Lars: "JA! Der Treibstoff für unseren Pakt! Der Rhythmus explodiert in mir!"'
    : 'Lars: "JA! Das ist der Treibstoff, den ich brauche! Nicht so gut wie Turbo-Koffein, aber es reicht."';

  currentStore.setDialogue(energyText);
  currentStore.increaseBandMood(currentStore.flags.larsRhythmPact ? 35 : 10, 'id_a0592899');
}

export function buildBackstageLarsDialogue(): Dialogue {
  const store = game();
  const hasTurbo = store.hasItem('Turbo-Koffein');
  const hasEnergyDrink = store.hasItem('Energiedrink');

  if (store.flags.larsEnergized) {
    if (store.flags.larsVibrating) {
      if (store.flags.larsDrumPhilosophy) {
        return say(
          'Lars: "DIE DRUMS SIND NICHT DAS INSTRUMENT. ICH BIN DAS INSTRUMENT. DER TAKT IST NUR EIN VORSCHLAG."',
        );
      }

      return {
        text: 'Lars: "ICH SEHE DIE ZEIT! SIE IST GELB! UND SIE SCHLÄGT IM 4/4 TAKT! MANAGER, WAS IST DAS GEHEIMNIS DES TAKTS?!"',
        options: [
          {
            text: 'Konzentriere dich auf das Chaos. [Chaos 5]',
            requiredSkill: { name: 'chaos', level: 5 },
            flagToSet: { flag: 'larsDrumPhilosophy', value: true },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Lars: "JA! Das Chaos ist die wahre Ordnung! Ich werde den Raum mit Polyrhythmen zerreißen!"',
              );
              currentStore.increaseBandMood(20, 'id_e6a8a82d');
              currentStore.increaseSkill('chaos', 3);
            },
          },
          {
            text: 'Folge dem Metronom. [Technical 5]',
            requiredSkill: { name: 'technical', level: 5 },
            flagToSet: { flag: 'larsDrumPhilosophy', value: true },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Lars: "Nein... das ist zu simpel. Aber... vielleicht hast du recht. Präzision vor Wahnsinn."',
              );
              currentStore.increaseBandMood(10, 'id_506435a1');
            },
          },
          {
            text: 'Schlag einfach hart drauf.',
            nextDialogue: {
              text: 'Lars: "Das ist der Plan! Immerhin habe ich diese Carbon-Sticks!"',
            },
          },
        ],
      };
    }

    const baseOptions: DialogueOption[] = [
      {
        text: 'Lass mich deine Becken nachziehen. [Technician]',
        requiredTrait: 'Technician',
        action: () => {
          const currentStore = game();
          if (!currentStore.flags.backstage_lars_technician_claimed) {
            currentStore.setFlag('backstage_lars_technician_claimed', true);
            currentStore.setDialogue('Lars: "Ah, perfekt kalibriert. Die Becken singen wieder!"');
            currentStore.increaseBandMood(15, 'id_125363be');
            currentStore.increaseSkill('technical', 3);
          } else {
            currentStore.setDialogue('Lars: "Sie sind schon perfekt festgeschraubt."');
          }
        },
      },
      {
        text: 'Rock on.',
        action: () => game().setDialogue({ text: 'Lars: "Immer!"' }),
      },
    ];

    return {
      text: 'Lars: "VOLLGAS! Ich spüre die Farben der Musik!"',
      options: baseOptions,
    };
  }

  if (hasTurbo) {
    const options: DialogueOption[] = [
      {
        text: 'Trink es auf Ex!',
        consumeItems: ['Turbo-Koffein'],
        flagToSet: { flag: 'larsEnergized', value: true },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "ICH BIN EIN BLITZ! ICH BIN DER DONNER! MEINE HÄNDE VIBRIEREN SO SCHNELL, DASS ICH DURCH WÄNDE GEHEN KANN!"',
          );
          currentStore.setFlag('larsVibrating', true);
          currentStore.increaseBandMood(40, 'id_45157c22');
        },
      },
      {
        text: 'Nur einen Schluck. [Diplomat]',
        requiredTrait: 'Diplomat',
        consumeItems: ['Turbo-Koffein'],
        flagToSet: { flag: 'larsEnergized', value: true },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "Du hast recht. Ein kontrollierter Burn. Mein Rhythmus wird unaufhaltsam sein."',
          );
          currentStore.setFlag('lars_paced', true);
          currentStore.increaseBandMood(30, 'id_5ff6a60f');
          currentStore.increaseSkill('social', 3);
        },
      },
      {
        text: 'Nur einen Schluck.',
        consumeItems: ['Turbo-Koffein'],
        flagToSet: { flag: 'larsEnergized', value: true },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "Nur einen Schluck? Bist du wahnsinnig? Das Zeug ist wie Raketentreibstoff! ... Okay, ich fühl mich schon besser."',
          );
          currentStore.increaseBandMood(20, 'id_432b4fc4');
        },
      },
    ];

    if (store.flags.larsRhythmPact) {
      options.unshift({
        text: 'Der Pakt hält.',
        consumeItems: ['Turbo-Koffein'],
        flagToSet: { flag: 'larsEnergized', value: true },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Lars: "Der Pakt hält! Diese Energie... sie speist direkt das Zentrum des Rhythmus!"',
          );
          currentStore.increaseBandMood(40, 'id_5ea33fb8');
        },
      });
      options.unshift({
        text: 'Lass den Rhythmus explodieren! [Chaos 5]',
        requiredSkill: { name: 'chaos', level: 5 },
        consumeItems: ['Turbo-Koffein'],
        flagToSet: { flag: 'larsEnergized', value: true },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Lars: "EXPLOSION! DER PAKT BRICHT DIE GRENZEN!"');
          currentStore.setFlag('larsVibrating', true);
          currentStore.increaseBandMood(50, 'id_c77c699e');
        },
      });
    }

    return {
      text: 'Lars: "WAS IST DAS?! Turbo-Koffein?! Gib her, ich will die Schallmauer durchbrechen!"',
      options,
    };
  }

  if (hasEnergyDrink) {
    return {
      text: 'Lars starrt auf den Energydrink in deiner Hand. Seine Drumsticks zittern vor Erwartung.',
      options: [
        {
          text: 'Gib Lars den Energydrink.',
          consumeItems: ['Energiedrink'],
          flagToSet: { flag: 'larsEnergized', value: true },
          action: () => {
            applyLarsEnergyDrinkEffects();
          },
        },
        {
          text: 'Lieber später.',
          nextDialogue: { text: 'Lars: "Okay... aber ich kippe gleich um."' },
        },
      ],
    };
  }

  return say(
    'Lars: "Ich bin total platt. Ohne Koffein geht hier gar nichts. Hast du was Stärkeres als Wasser?"',
  );
}
