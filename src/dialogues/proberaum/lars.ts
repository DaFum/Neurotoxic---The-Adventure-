import { type Dialogue } from '../../store';
import { game, say } from '../shared/helpers';

export function buildProberaumLarsDialogue(): Dialogue {
  const store = game();
  const { flags, bandMood, hasItem } = store;

  const hasBeer = hasItem('Bier');

  if (flags.larsDrumPhilosophy && flags.larsRhythmPact) {
    if (hasBeer && !flags.gaveBeerToLars) {
      return {
        text: 'Lars: "Der Pakt steht. Wir sind das Skelett der Welt. Und... ist das ein kühles Blondes?"',
        options: [
          {
            text: 'Hier, lass es dir schmecken.',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Lars: "Du bist ein Lebensretter! Jetzt kann ich die Double-Bass-Drums durchtreten!"');
              currentStore.removeFromInventory('Bier');
              currentStore.setFlag('gaveBeerToLars', true);
              currentStore.increaseBandMood(20, 'id_c76ea67f');
            }
          },
          {
            text: 'Das ist für jemand anderen.',
            action: () => game().setDialogue('Lars: "Der Pakt steht. Wir sind das Skelett der Welt."')
          }
        ]
      };
    }
    return say('Lars: "Der Pakt steht. Wir sind das Skelett der Welt."');
  }

  if (flags.larsDrumPhilosophy && !flags.larsRhythmPact) {
    return {
      text: 'Lars: "Du kennst jetzt meine Philosophie. Der Beat ist alles. Bist du bereit für den nächsten Schritt?"',
      options: [
        {
          text: 'Lass uns einen Rhythmus-Pakt schließen.',
          action: () => game().setDialogue(buildLarsRhythmusPaktDialogue())
        },
        ...(hasBeer && !flags.gaveBeerToLars ? [{
          text: 'Hier, lass dir dieses kühle Blonde schmecken.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Lars: "Du bist ein Lebensretter! Jetzt kann ich die Double-Bass-Drums durchtreten!"');
            currentStore.removeFromInventory('Bier');
            currentStore.setFlag('gaveBeerToLars', true);
            currentStore.increaseBandMood(20, 'id_a734099e');
          }
        }] : []),
        {
          text: 'Ein andermal.',
          action: () => game().setDialogue('Lars: "Dann trommle ich eben alleine weiter."')
        }
      ]
    };
  }

  if (hasBeer && !flags.gaveBeerToLars) {
    return {
      text: 'Lars: "Ist das... ein kühles Blondes? Gib her, ich sterbe vor Durst!"',
      options: [
        {
          text: 'Hier, lass es dir schmecken.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Lars: "Du bist ein Lebensretter! Jetzt kann ich die Double-Bass-Drums durchtreten!"');
            currentStore.removeFromInventory('Bier');
            currentStore.setFlag('gaveBeerToLars', true);
            currentStore.increaseBandMood(20, 'id_7d90b169');
          }
        },
        ...(!flags.larsDrumPhilosophy ? [{
          text: 'Was ist deine Drum-Philosophie?',
          action: () => game().setDialogue(buildLarsDrumPhilosophieDialogue())
        }] : []),
        {
          text: 'Das ist für Marius.',
          action: () => game().setDialogue('Lars: "Marius? Der hat doch schon genug Ego. Na gut, ich trommel weiter auf dem Trockenen."')
        }
      ]
    };
  }

  if (!hasItem('Mop')) {
    return say('Lars: "Ich hab hier irgendwo einen Wischmopp gesehen... Such mal danach!"');
  } else if (!flags.waterCleaned) {
    return say('Lars: "Du hast den Mopp! Wisch die Pfütze in der Mitte auf!"');
  } else if (bandMood < 20) {
    return say('Lars: "Ich pack meine Sticks ein. Dieser Gig wird ein Desaster."');
  } else {
    if (flags.lars_proberaum_secret) {
      return say('Lars: "Die Hi-Hat ist perfekt. Ich bin bereit."');
    }

    const moodText = bandMood > 60
      ? 'Lars: "Dieser Beat... er kommt direkt aus der Hölle! Ich liebe es!"'
      : 'Lars: "Geiler Beat, oder? Lass uns loslegen!"';

    return {
      text: moodText,
      options: [
        {
          text: 'Zeig mir deinen besten Fill. [Performer]',
          requiredTrait: 'Performer',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Lars: "Boom-Tchak! Der Bassist hat meine Drums früher vor jeder Show gestimmt..."');
            currentStore.setFlag('lars_proberaum_secret', true);
            currentStore.increaseBandMood(15, 'id_0b489973');
            currentStore.increaseSkill('social', 3);
          }
        },
        {
          text: 'Deine Hi-Hat klingt verstimmt. Lass mich mal. [Technical 3]',
          requiredSkill: { name: 'technical', level: 3 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Lars: "Hey, das klingt besser! Die TR-8080 hat übrigens Teile vom alten Amp des Bassisten in sich..."');
            currentStore.setFlag('lars_proberaum_secret', true);
            currentStore.increaseBandMood(10, 'id_e1f424a3');
            currentStore.increaseSkill('technical', 3);
            if (currentStore.flags.talkingAmpHeard) {
              currentStore.addQuest('maschinen_seele', 'Entdecke die Verbindung zwischen den Maschinen');
            }
          }
        },
        {
          text: 'Weiter so.',
          action: () => game().setDialogue('Lars: "Wird gemacht, Manager!"')
        }
      ]
    };
  }
}

export function buildLarsRhythmusPaktDialogue(): Dialogue {
  return {
    text: 'Lars: "Ein Pakt... das ist ernst. Wie soll unser Pakt klingen?"',
    options: [
      {
        text: 'Aggressiv und unaufhaltsam. [Brutalist]',
        requiredTrait: 'Brutalist',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Lars: "JA! Wir werden die Zeit selbst zertrümmern!"');
          currentStore.increaseBandMood(25, 'id_f92eaafd');
          currentStore.increaseSkill('chaos', 5);
          currentStore.setFlag('larsRhythmPact', true);
          currentStore.startAndFinishQuest('rhythm_pact', 'Schließe einen Rhythmus-Pakt mit Lars');
          currentStore.discoverLore('rhythm_pact');
        }
      },
      {
        text: 'Harmonisch und präzise. [Diplomat]',
        requiredTrait: 'Diplomat',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Lars: "Ein perfektes Uhrwerk. Der Rhythmus wird uns leiten."');
          currentStore.increaseBandMood(20, 'id_3e363b55');
          currentStore.increaseSkill('social', 5);
          currentStore.setFlag('larsRhythmPact', true);
          currentStore.startAndFinishQuest('rhythm_pact', 'Schließe einen Rhythmus-Pakt mit Lars');
          currentStore.discoverLore('rhythm_pact');
        }
      },
      {
        text: 'Ich brauche Bedenkzeit.',
        action: () => game().setDialogue('Lars: "Der Beat wartet auf niemanden lange."')
      },
      {
        text: 'Zurück.',
        action: () => game().setDialogue(buildProberaumLarsDialogue())
      }
    ]
  };
}

export function buildLarsDrumPhilosophieDialogue(): Dialogue {
  return {
    text: 'Lars: "Meine Philosophie? Schlag so hart zu, dass die Realität Risse bekommt. Jeder Schlag ist ein Schlag gegen die Stille. Willst du mehr wissen?"',
    options: [
      {
        text: 'Ja, lehre mich den Beat. [Chaos 3]',
        requiredSkill: { name: 'chaos', level: 3 },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Lars: "Der Beat kommt nicht aus den Armen, er kommt aus dem Zorn. Wenn du in Salzgitter spielst, denk an den Zorn der Maschinen. Du hast das Potenzial, Manager."');
          currentStore.setFlag('larsDrumPhilosophy', true);
          currentStore.increaseBandMood(20, 'id_92a8213c');
          currentStore.increaseSkill('chaos', 2);
        }
      },
      {
        text: 'Analysiere die Schlagkraft. [Technical 3]',
        requiredSkill: { name: 'technical', level: 3 },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Lars: "Exakt 120 Newton pro Schlag. Du hast ein Auge für die Mechanik. Das gefällt mir."');
          currentStore.setFlag('larsDrumPhilosophy', true);
          currentStore.increaseBandMood(15, 'id_14916f14');
          currentStore.increaseSkill('technical', 2);
        }
      },
      {
        text: 'Klingt anstrengend.',
        action: () => game().setDialogue('Lars: "Ist es auch. Aber wer will schon ein leichtes Leben?"')
      },
      {
        text: 'Zurück.',
        action: () => game().setDialogue(buildProberaumLarsDialogue())
      }
    ]
  };
}
