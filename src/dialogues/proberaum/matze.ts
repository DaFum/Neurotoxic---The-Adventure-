import { type Dialogue, type DialogueOption } from '../../store';
import { game, when, say } from '../shared/helpers';

export function buildProberaumMatzeDialogue(): Dialogue {
  const store = game();
  const { flags, bandMood } = store;

  const hasForbiddenRiff = store.hasItem('Verbotenes Riff');
  const hasTalisman = store.hasItem('Industrie-Talisman');

  if (flags.matzeDeepTalk) {
    return say('Matze: "Ich denke immer noch über das nach, was du gesagt hast. Der Lärm... er ist die einzige Wahrheit. Wir sind bereit für Salzgitter."');
  }

  if (hasTalisman) {
    return {
      text: 'Matze: "Ist das der Industrie-Talisman?! Ich spüre, wie die Saiten meiner Gitarre vor Ehrfurcht vibrieren. Du bist mehr als nur ein Manager."',
      options: [
        {
          text: 'Es ist für die Band.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Wir werden die Welt mit diesem Ding verändern. Danke, Boss. Der Sound wird legendär."');
            currentStore.increaseBandMood(30);
            currentStore.setFlag('matzeDeepTalk', true);
          }
        },
        {
          text: 'Behalte es für dich.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Verstehe. Ein Geheimnis zwischen uns und dem Stahl. Ich mag das. Lass uns die Bühne abreißen."');
            currentStore.increaseBandMood(15);
            currentStore.setFlag('matzeDeepTalk', true);
          }
        }
      ]
    };
  }

  if (hasForbiddenRiff && !flags.showedRiffToMatze) {
    return {
      text: 'Matze: "Warte mal... was ist das für eine Aura? Hast du etwa das Verbotene Riff gefunden?!"',
      options: [
        {
          text: 'Ja, es vibriert in meinem Rucksack.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "UNGLAUBLICH! Damit werden wir die Kaminstube in Schutt und Asche legen! Du bist der beste Manager aller Zeiten!"');
            currentStore.setFlag('showedRiffToMatze', true);
            currentStore.increaseBandMood(30);
          }
        },
        {
          text: 'Nur ein altes Demo-Tape.',
          action: () => game().setDialogue('Matze: "Hm, sah von hier aus mächtiger aus. Egal, lass uns weitermachen."')
        }
      ]
    };
  }

  if (!flags.waterCleaned) {
    return {
      text: bandMood > 60
        ? 'Matze: "Hey Manager! Ich hab ein paar neue Riffs geschrieben! Kriegen wir das Wasser weg, damit ich sie dir zeigen kann?"'
        : bandMood > 40
        ? 'Matze: "Hey Manager! Der Raum ist zwar nass, aber ich bin heiß wie Frittenfett! Kriegen wir das Wasser weg?"'
        : 'Matze: "Verdammt, der Proberaum ist geflutet! Wir müssen das Wasser wegkriegen, bevor die Amps kaputtgehen!"',
      options: [
        {
          text: 'Ich kümmere mich darum.',
          action: () => game().setDialogue('Matze: "Beeil dich, ich höre schon das Kurzschluss-Zischen!"')
        },
        {
          text: 'Vielleicht ist es ein Zeichen für ein neues Genre?',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Sub-Aquatic Industrial? Klingt teuer. Wisch einfach auf."');
            currentStore.increaseBandMood(-5);
          }
        }
      ]
    };
  }

  if (bandMood > 60 && !flags.matzeRiffWarning) {
    return {
      text: 'Matze: "Manager! Ich bin so hyped, ich zeig dir meinen neuen Power-Chord. Bereit?"',
      options: [
        {
          text: 'Lass hören! [Chaos 5]',
          requiredSkill: { name: 'chaos', level: 5 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze schlägt die Saiten an. Ein Riss in der Wand entsteht. "WHOOPS! Aber geil, oder?"');
            currentStore.increaseBandMood(15);
            currentStore.setFlag('matzeRiffWarning', true);
          }
        },
        {
          text: 'Heb es dir für Salzgitter auf.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Stimmt, die Wände hier halten das eh nicht aus."');
            currentStore.setFlag('matzeRiffWarning', true);
          }
        }
      ]
    };
  }

  const moodText = bandMood > 70
    ? 'Matze: "Alter, ich fühl mich wie ein junger Gott! Lass uns Tangermünde zeigen, was Lärm wirklich bedeutet!"'
    : 'Matze: "Puh, danke! Jetzt können wir endlich für den Gig in Tangermünde proben. Bist du bereit für den Wahnsinn?"';

  return {
    text: moodText,
    options: [
      {
        text: 'Immer doch. Rock on!',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Matze: "Das ist die Einstellung! Lass uns die Nachbarn ärgern."');
          currentStore.increaseBandMood(10);
        }
      },
      ...when(!flags.matzePerformerTalk, {
        text: 'Zeig mir, wie du die Crowd liest. [Performer]',
        requiredTrait: 'Performer' as const,
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Matze: "Es geht alles um den ersten Akkord. Wenn der sitzt, gehören sie dir."');
          currentStore.setFlag('matzePerformerTalk', true);
          currentStore.increaseBandMood(20);
          currentStore.increaseSkill('social', 3);
        }
      } as DialogueOption),
      ...when(!flags.matzeCynicOneShot, {
        text: 'Absolut. Wir sind nur Statisten in einer billigen Industrial-Soap. [Cynic]',
        requiredTrait: 'Cynic' as const,
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Matze: "Haha! Endlich jemand, der es kapiert. Lass uns den Witz so laut wie möglich erzählen!"');
          currentStore.increaseBandMood(20);
          currentStore.increaseSkill('chaos', 5);
          currentStore.setFlag('matzeCynicOneShot', true);
        }
      } as DialogueOption),
      {
        text: 'Erzähl mir von der Tour 1982.',
        action: () => game().setDialogue(buildMatze1982Dialogue())
      },
      {
        text: 'Eigentlich wollte ich nur die Buchhaltung machen.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Matze: "Buchhaltung? Wir sind eine Metal-Band, kein Steuerbüro! Geh und hol uns ein Bier."');
          currentStore.increaseBandMood(-2);
        }
      }
    ]
  };
}

export function buildMatze1982Dialogue(): Dialogue {
  return {
    text: 'Matze: "1982... da war der Lärm noch rein. Wir haben in einer alten Gießerei gespielt. Der Bassist ist damals verschwunden, aber der Sound war legendär. Wir suchen ihn immer noch."',
    options: [
      {
        text: 'Ich spüre eine Frequenz in den Wänden... [Mystic]',
        requiredTrait: 'Mystic',
        action: () => {
          const currentStore = game();
          const pickedUpFragment = currentStore.addToInventory('Frequenzfragment');
          currentStore.setFlag('bassist_clue_matze', true);
          currentStore.setFlag('matzeDeepTalk', true);
          currentStore.addQuest('frequenz_1982', 'Sammle die Frequenzfragmente von 1982');
          currentStore.increaseBandMood(25, 'matze_frequenz1982');
          currentStore.increaseSkill('chaos', 4);
          if (pickedUpFragment) {
            currentStore.setFlag('frequenz1982_proberaum', true);
            currentStore.setDialogue('Matze: "Du... spürst sie? Die Wände hier wurden auf dem alten Gießerei-Fundament gebaut! Vielleicht ist das hier ein Teil von ihm..."');
          } else {
            currentStore.setDialogue('Matze: "Du... spürst sie? Das Fragment ist echt, aber du kannst gerade keins mehr tragen."');
          }
        }
      },
      {
        text: 'Lass mich die Wand einschlagen, da ist was dahinter. [Brutalist]',
        requiredTrait: 'Brutalist',
        action: () => {
          const currentStore = game();
          const pickedUpFragment = currentStore.addToInventory('Frequenzfragment');
          currentStore.setFlag('proberaum_brutalist_smash', true);
          currentStore.setFlag('bassist_clue_matze', true);
          currentStore.setFlag('matzeDeepTalk', true);
          currentStore.addQuest('frequenz_1982', 'Sammle die Frequenzfragmente von 1982');
          currentStore.increaseBandMood(10, 'matze_frequenz1982');
          currentStore.increaseSkill('chaos', 3);
          if (pickedUpFragment) {
            currentStore.setFlag('frequenz1982_proberaum', true);
            currentStore.setDialogue('Matze: "WAS?! Nein, warte! -- *CRASH* ...Da ist ein Geheimfach! Und... was ist das für ein Fragment?"');
          } else {
            currentStore.setDialogue('Matze: "WAS?! Nein, warte! -- *CRASH* ...Da ist ein Fragment, aber du kannst keins mehr aufnehmen."');
          }
        }
      },
      {
        text: 'Ich sehe Muster im Lärm. [Visionary]',
        requiredTrait: 'Visionary',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Matze: "Du siehst sie auch?! Die Geometrie des Feedbacks... Du bist der Manager, den wir brauchen. In Salzgitter wird alles zusammenfallen."');
          currentStore.setFlag('matzeDeepTalk', true);
          currentStore.discoverLore('matze_1982_truth');
          currentStore.increaseBandMood(30);
          currentStore.increaseSkill('chaos', 5);
        }
      },
      {
        text: 'Analysiere die Frequenz. [Technical 5]',
        requiredSkill: { name: 'technical', level: 5 },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Matze: "Die Frequenz der Gießerei lag bei exakt 432Hz. Es war, als ob der Stahl selbst schreit. Du hast ein Ohr für Details, Manager."');
          currentStore.setFlag('matzeDeepTalk', true);
          currentStore.increaseBandMood(20);
          currentStore.increaseSkill('technical', 3);
        }
      },
      {
        text: 'Beruhige dich, Matze. [Social 3]',
        requiredSkill: { name: 'social', level: 3 },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Matze: "Du hast recht. Ich steigere mich da zu sehr rein. Lass uns einfach spielen. Danke, Manager."');
          currentStore.setFlag('matzeDeepTalk', true);
          currentStore.increaseBandMood(15);
          currentStore.increaseSkill('social', 2);
        }
      },
      {
        text: 'Interessante Geschichte.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Matze: "Manche Dinge lassen sich nicht in Worte fassen. Lass uns weitermachen."');
          currentStore.setFlag('askedAbout1982', true);
          currentStore.setFlag('bassist_clue_matze', true);
          currentStore.increaseBandMood(10);
        }
      },
      {
        text: 'Zurück.',
        action: () => game().setDialogue(buildProberaumMatzeDialogue())
      }
    ]
  };
}
