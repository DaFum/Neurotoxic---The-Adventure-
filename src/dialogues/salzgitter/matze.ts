import { type Dialogue } from '../../store';
import { game, say } from '../shared/helpers';

function getForbiddenRiffDialogue(store: ReturnType<typeof game>): Dialogue {
  const hasVoidPick = store.hasItem('Void-Plektrum');
  const hasOldPick = store.hasItem('Altes Plektrum');

  if (hasVoidPick && !store.flags.matzeRiffDialogueDone) {
    return {
      text: 'Matze: "Dieses Void-Plektrum... es pulsiert! Damit kann ich das Verbotene Riff in die 5. Dimension spielen. Das ist der ultimative Sound!"',
      options: [
        {
          text: 'Kanalisiere den Chaos-Faktor. [Chaos 10]',
          requiredSkill: { name: 'chaos', level: 10 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue({
              text: 'Matze: "DU HAST RECHT! ICH WERDE DIE REALE WELT ZERREISSEN! DER LÄRM WIRD UNSER GOTT SEIN!"',
              visualEffect: 'glitch',
            });
            currentStore.increaseBandMood(70, 'id_1dc74516');
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
              'Matze: "Präzision im Chaos. Das ist die wahre Kunst. Jede Note wird ein chirurgischer Schnitt in die Stille."',
            );
            currentStore.increaseBandMood(60, 'id_021d65a1');
            currentStore.increaseSkill('technical', 5);
            currentStore.setFlag('matzeRiffDialogueDone', true);
          },
        },
        {
          text: 'Viel Erfolg, Matze.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Danke, Boss. Wir sehen uns auf der anderen Seite."');
            currentStore.increaseBandMood(20, 'id_72faf9b5');
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
            currentStore.setDialogue({
              text: 'Matze: "DU HAST RECHT! ICH WERDE DIE REALE WELT ZERREISSEN! DER LÄRM WIRD UNSER GOTT SEIN!"',
              visualEffect: 'glitch',
            });
            currentStore.increaseBandMood(50, 'id_8cab08f6');
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
              'Matze: "Präzision im Chaos. Das ist die wahre Kunst. Jede Note wird ein chirurgischer Schnitt in die Stille."',
            );
            currentStore.increaseBandMood(40, 'id_ac700d73');
            currentStore.increaseSkill('technical', 5);
            currentStore.setFlag('matzeRiffDialogueDone', true);
          },
        },
        {
          text: 'Viel Erfolg, Matze.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Danke, Boss. Wir sehen uns auf der anderen Seite."');
            currentStore.increaseBandMood(20, 'id_38473f78');
            currentStore.setFlag('matzeRiffDialogueDone', true);
          },
        },
      ],
    };
  }

  return say(
    'Matze: "Manager, das Verbotene Riff... es brennt in meinen Fingern! Es ist schwer zu kontrollieren. Ich hoffe, ich zerreiße nicht die ganze Realität heute Abend!"',
  );
}

function get1982RitualDialogue(store: ReturnType<typeof game>): Dialogue | null {
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
                'Matze: "Unser Ritual hat die Frequenzen besiegelt. Wir sind unaufhaltsam!"',
              );
              currentStore.increaseBandMood(40, 'id_325f4251');
            } else {
              currentStore.setDialogue('Matze: "Ich spüre es. Die Luft flirrt."');
              currentStore.increaseBandMood(20, 'id_10724903');
            }
            currentStore.setFlag('salzgitterMatzeWirtDone', true);
          },
        },
        {
          text: 'Wir brechen den Fluch.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Mit jedem Akkord ein Stück mehr. Für den Metal!"');
            currentStore.increaseBandMood(20, 'id_b732ea82');
            currentStore.setFlag('salzgitterMatzeWirtDone', true);
          },
        },
      ],
    };
  }
  return null;
}

function getDeepTalkDialogue(store: ReturnType<typeof game>): Dialogue | null {
  if (store.flags.matzeDeepTalk) {
    if (!store.flags.salzgitterMatzeDeepTalkDone) {
      return {
        text: 'Matze: "Ich hab über das nachgedacht, was du über den Lärm gesagt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"',
        options: [
          {
            text: 'Ich sehe die Muster. [Visionary]',
            requiredTrait: 'Visionary',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue(
                'Matze: "Die Geometrie des Feedbacks... sie ist heute Abend perfekt. Wir werden eins mit der Frequenz."',
              );
              if (!currentStore.flags.salzgitterMatzeDeepTalkDone) {
                currentStore.increaseBandMood(40, 'id_be96cb15');
                currentStore.increaseSkill('chaos', 5);
                currentStore.setFlag('salzgitterMatzeDeepTalkDone', true);
              }
            },
          },
          {
            text: 'Lass uns spielen.',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Matze: "Ja. Der Stahl wartet."');
              currentStore.increaseBandMood(10, 'id_f6e27cfc');
              currentStore.setFlag('salzgitterMatzeDeepTalkDone', true);
            },
          },
        ],
      };
    }
    return say(
      'Matze: "Ich hab über das nachgedacht, was du über den Lärm gesagt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"',
    );
  }
  return null;
}

function getAskedAbout1982Dialogue(store: ReturnType<typeof game>): Dialogue | null {
  if (store.flags.askedAbout1982) {
    return {
      text: 'Matze: "Ich hab über das nachgedacht, was du über 1982 gefragt hast. Heute Abend spielen wir für die, die nicht mehr da sind. Mit vollem Zorn!"',
      options: [
        {
          text: 'Für alle, die nicht mehr da sind.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Genau. Für den Lärm."');
            currentStore.increaseBandMood(10, 'id_0856e5b0');
          },
        },
        {
          text: 'Lass uns spielen.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Ja. Der Stahl wartet."');
            currentStore.increaseBandMood(10, 'id_32745554');
          },
        },
      ],
    };
  }
  return null;
}

export function buildSalzgitterMatzeDialogue(): Dialogue {
  const store = game();
  const bandMood = store.bandMood;

  if (store.hasItem('Verbotenes Riff')) {
    return getForbiddenRiffDialogue(store);
  }

  const ritualDialogue = get1982RitualDialogue(store);
  if (ritualDialogue) return ritualDialogue;

  const deepTalkDialogue = getDeepTalkDialogue(store);
  if (deepTalkDialogue) return deepTalkDialogue;

  const asked1982Dialogue = getAskedAbout1982Dialogue(store);
  if (asked1982Dialogue) return asked1982Dialogue;

  if (bandMood > 80) {
    return say('Matze: "Ich hab noch nie so eine Energie gespürt! Salzgitter wird brennen!"');
  }

  return say('Matze: "SZaturday 3 Riff Night! Das wird der Wahnsinn!"');
}
