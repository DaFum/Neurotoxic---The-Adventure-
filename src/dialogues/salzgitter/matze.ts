import { type Dialogue } from '../../store';
import { game, say } from '../shared/helpers';

export function buildSalzgitterMatzeDialogue(): Dialogue {
  const store = game();
  const bandMood = store.bandMood;
  const hasForbiddenRiff = store.hasItem('Verbotenes Riff');
  const hasOldPick = store.hasItem('Altes Plektrum');
  const hasVoidPick = store.hasItem('Void-Plektrum');

  if (hasForbiddenRiff) {
    if (hasVoidPick && !store.flags.matzeRiffDialogueDone) {
      return {
        text: 'Matze: "Dieses Void-Plektrum... es pulsiert! Damit kann ich das Verbotene Riff in die 5. Dimension spielen. Das ist der ultimative Sound!"',
        options: [
          {
            text: 'Kanalisiere den Chaos-Faktor. [Chaos 10]',
            requiredSkill: { name: 'chaos', level: 10 },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Matze: "DU HAST RECHT! ICH WERDE DIE REALE WELT ZERREISSEN! DER LÄRM WIRD UNSER GOTT SEIN!"'
              );
              currentStore.increaseBandMood(70);
              currentStore.increaseSkill('chaos', 5);
              currentStore.setFlag('matzeRiffDialogueDone', true);
            },
          },
          {
            text: 'Optimiere die Saitenspannung. [Technical 10]',
            requiredSkill: { name: 'technical', level: 10 },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Matze: "Präzision im Chaos. Das ist die wahre Kunst. Jede Note wird ein chirurgischer Schnitt in die Stille."'
              );
              currentStore.increaseBandMood(60);
              currentStore.increaseSkill('technical', 5);
              currentStore.setFlag('matzeRiffDialogueDone', true);
            },
          },
          {
            text: 'Viel Erfolg, Matze.',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Matze: "Danke, Boss. Wir sehen uns auf der anderen Seite."'
              );
              currentStore.increaseBandMood(20);
              currentStore.setFlag('matzeRiffDialogueDone', true);
            },
          },
        ],
      };
    }

    if (hasOldPick && !store.flags.matzeRiffDialogueDone) {
      return {
        text: 'Matze: "Manager, mit diesem Alten Plektrum... ich kann das Verbotene Riff bändigen! Es fühlt sich an, als würde ich die Blitze selbst kontrollieren. Wir werden Geschichte schreiben!"',
        options: [
          {
            text: 'Kanalisiere den Chaos-Faktor. [Chaos 10]',
            requiredSkill: { name: 'chaos', level: 10 },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Matze: "DU HAST RECHT! ICH WERDE DIE REALE WELT ZERREISSEN! DER LÄRM WIRD UNSER GOTT SEIN!"'
              );
              currentStore.increaseBandMood(50);
              currentStore.increaseSkill('chaos', 5);
              currentStore.setFlag('matzeRiffDialogueDone', true);
            },
          },
          {
            text: 'Optimiere die Saitenspannung. [Technical 10]',
            requiredSkill: { name: 'technical', level: 10 },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Matze: "Präzision im Chaos. Das ist die wahre Kunst. Jede Note wird ein chirurgischer Schnitt in die Stille."'
              );
              currentStore.increaseBandMood(40);
              currentStore.increaseSkill('technical', 5);
              currentStore.setFlag('matzeRiffDialogueDone', true);
            },
          },
          {
            text: 'Viel Erfolg, Matze.',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Matze: "Danke, Boss. Wir sehen uns auf der anderen Seite."'
              );
              currentStore.increaseBandMood(20);
              currentStore.setFlag('matzeRiffDialogueDone', true);
            },
          },
        ],
      };
    }

    return say(
      'Matze: "Manager, das Verbotene Riff... es brennt in meinen Fingern! Es ist schwer zu kontrollieren. Ich hoffe, ich zerreiße nicht die ganze Realität heute Abend!"'
    );
  }

  if (
    store.flags.matzeDeepTalk &&
    store.flags.wirtLegacy1982 &&
    !store.flags.salzgitterMatzeWirtDone
  ) {
    return {
      text: 'Matze: "Du hast die Wahrheit über 1982 herausgefunden, oder? Wir werden den Zyklus heute Nacht vollenden. Kein Manager wird geopfert, nur der reine Lärm bleibt."',
      options: [
        {
          text: 'Die Frequenzen sind bereit. [Mystic]',
          requiredTrait: 'Mystic',
          action: () => {
            const currentStore = game();
            if (currentStore.flags.backstageRitualPerformed) {
              currentStore.setDialogue(
                'Matze: "Unser Ritual hat die Frequenzen besiegelt. Wir sind unaufhaltsam!"'
              );
              currentStore.increaseBandMood(40);
            } else {
              currentStore.setDialogue(
                'Matze: "Ich spüre es. Die Luft flirrt."'
              );
              currentStore.increaseBandMood(20);
            }
            currentStore.setFlag('salzgitterMatzeWirtDone', true);
          },
        },
        {
          text: 'Wir brechen den Fluch.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Matze: "Mit jedem Akkord ein Stück mehr. Für den Metal!"'
            );
            currentStore.increaseBandMood(20);
            currentStore.setFlag('salzgitterMatzeWirtDone', true);
          },
        },
      ],
    };
  }

  if (store.flags.matzeDeepTalk) {
    return {
      text: 'Matze: "Ich hab über das nachgedacht, was du über den Lärm gesagt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"',
      options: [
        {
          text: 'Ich sehe die Muster. [Visionary]',
          requiredTrait: 'Visionary',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Matze: "Die Geometrie des Feedbacks... sie ist heute Abend perfekt. Wir werden eins mit der Frequenz."'
            );
            currentStore.increaseBandMood(40);
            currentStore.increaseSkill('chaos', 5);
          },
        },
        {
          text: 'Lass uns spielen.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Ja. Der Stahl wartet."');
            currentStore.increaseBandMood(10);
          },
        },
      ],
    };
  }

  if (store.flags.askedAbout1982) {
    return {
      text: 'Matze: "Ich hab über das nachgedacht, was du über 1982 gefragt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"',
      options: [
        {
          text: 'Für alle, die nicht mehr da sind.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Genau. Für den Lärm."');
            currentStore.increaseBandMood(10);
          },
        },
        {
          text: 'Lass uns spielen.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Ja. Der Stahl wartet."');
            currentStore.increaseBandMood(10);
          },
        },
      ],
    };
  }

  if (bandMood > 80) {
    return say(
      'Matze: "Ich hab noch nie so eine Energie gespürt! Salzgitter wird brennen!"'
    );
  }

  return say('Matze: "SZaturday 3 Riff Night! Das wird der Wahnsinn!"');
}
