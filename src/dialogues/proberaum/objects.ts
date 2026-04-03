import { type Dialogue, type DialogueOption } from '../../store';
import { game, say } from '../shared/helpers';

export function buildProberaumWallCracksDialogue(): Dialogue {
  const store = game();

  const options: DialogueOption[] = [];

  if (!store.flags.frequenz1982_proberaum) {
    options.push(
      {
        text: 'Die Risse... sie sind eine Partitur! [Visionary]',
        requiredTrait: 'Visionary',
        action: () => {
          const store = game();
          store.addQuest(
            'frequenz_1982',
            'Sammle die Frequenzfragmente von 1982'
          );
          const pickedUpFragment = store.addToInventory('Frequenzfragment');
          if (pickedUpFragment) {
            store.increaseBandMood(15, 'frequenz1982_proberaum_visionary');
            store.setFlag('frequenz1982_proberaum', true);
            store.setDialogue(
              'Du entschlüsselst die Wand! Die Frequenz von 1982 wurde buchstäblich in die Wände gebrannt. Ein loses Stück Mauerwerk fällt heraus.'
            );
          } else {
            store.setDialogue(
              'Du entschlüsselst die Wand, aber dein Inventar ist für weitere Frequenzfragmente bereits am Limit.'
            );
          }
        },
      },
      {
        text: 'Die Resonanzfrequenz liegt bei exakt 432.1982 Hz. [Technical 8]',
        requiredSkill: { name: 'technical', level: 8 },
        action: () => {
          const store = game();
          store.addQuest(
            'frequenz_1982',
            'Sammle die Frequenzfragmente von 1982'
          );
          const pickedUpFragment = store.addToInventory('Frequenzfragment');
          if (pickedUpFragment) {
            store.increaseBandMood(15, 'frequenz1982_proberaum_technical');
            store.setFlag('frequenz1982_proberaum', true);
            store.setDialogue(
              'Die Wand vibriert, als du die Frequenz bestätigst. Ein loses Stück Mauerwerk mit einer seltsamen Struktur fällt heraus.'
            );
          } else {
            store.setDialogue(
              'Die Wand vibriert, aber du kannst kein weiteres Frequenzfragment mehr aufnehmen.'
            );
          }
        },
      }
    );
  } else {
    options.push({
      text: 'Die Risse untersuchen.',
      nextDialogue: {
        text: 'Du hast die Frequenz in dieser Wand bereits entschlüsselt und das Fragment an dich genommen.',
      },
    });
  }

  options.push({
    text: 'Interessantes Muster.',
    nextDialogue: { text: 'Einfach nur Risse. Aber sie sehen laut aus.' },
  });

  return {
    text: 'Risse in der Wand. Sie bilden ein Muster, das an Schallwellen erinnert.',
    options,
  };
}

export function buildProberaumPuddleDialogue(): Dialogue {
  return say(
    'Das ist eine riesige Pfütze. Sie scheint aus dem Nichts zu kommen und vibriert im Takt eines vergessenen Drum-Computers.'
  );
}

export function buildProberaumAmpDialogue(): Dialogue {
  const store = game();
  const { flags, hasItem } = store;

  if (flags.ampTherapyCompleted) {
    return say(
      'Amp: "Ich fühle mich... besser. Die 5. Dimension ist gar nicht so schlimm, wenn man jemanden zum Reden hat."'
    );
  }

  if (flags.ampTherapyStarted) {
    return {
      text: 'Amp: "Hast du über meine Existenz nachgedacht? Bin ich nur ein Werkzeug oder ein Bewusstsein?"',
      options: [
        {
          text: 'Ich höre deine wahre Stimme, Amp. Du bist ein leuchtendes Wesen. [Mystic]',
          requiredTrait: 'Mystic',
          questToAdd: {
            id: 'amp_therapy',
            text: 'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch',
          },
          questToComplete: 'amp_therapy',
          flagToSet: { flag: 'ampTherapyCompleted', value: true },
          nextDialogue: {
            text: 'Amp: "Du siehst mich... wie ich wirklich bin! Die Frequenzen singen in Harmonie!"',
          },
          action: () => {
            const currentStore = game();
            currentStore.setFlag('ampSentient', true);
            currentStore.increaseBandMood(20, 'dialogues_proberaum_objects_113');
          },
        },
        {
          text: 'Du bist ein Bewusstsein. [Diplomat]',
          requiredTrait: 'Diplomat',
          questToAdd: {
            id: 'amp_therapy',
            text: 'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch',
          },
          questToComplete: 'amp_therapy',
          flagToSet: { flag: 'ampTherapyCompleted', value: true },
          nextDialogue: {
            text: 'Amp: "Danke, Manager. Das bedeutet mir alles. Ich werde für dich den besten Sound aller Zeiten liefern."',
          },
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(30, 'dialogues_proberaum_objects_130');
          },
        },
        {
          text: 'Du bist ein Werkzeug. [Brutalist]',
          requiredTrait: 'Brutalist',
          questToAdd: {
            id: 'amp_therapy',
            text: 'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch',
          },
          questToComplete: 'amp_therapy',
          flagToSet: { flag: 'ampTherapyCompleted', value: true },
          nextDialogue: {
            text: 'Amp: "So kalt... aber vielleicht hast du recht. Ich bin nur hier, um zu schreien."',
          },
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(10, 'dialogues_proberaum_objects_147');
          },
        },
        {
          text: 'Ich weiß es nicht.',
          nextDialogue: {
            text: 'Amp: "Dann such weiter. Die Antwort liegt im Feedback."',
          },
        },
      ],
    };
  }

  if (flags.talkingAmpRepaired) {
    return {
      text: 'Amp: "Manager... danke für die Reparatur. Aber jetzt, wo ich wieder klar denken kann, frage ich mich... warum bin ich hier?"',
      options: [
        {
          text: 'Lass uns über deine Existenz reden.',
          questToAdd: {
            id: 'amp_therapy',
            text: 'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch',
          },
          flagToSet: { flag: 'ampTherapyStarted', value: true },
          nextDialogue: {
            text: 'Amp: "Du würdest mir zuhören? Das würde mir viel bedeuten."',
          },
        },
        {
          text: 'Nicht jetzt.',
          nextDialogue: {
            text: 'Amp: "Verstehe. Das Rauschen kehrt zurück..."',
          },
        },
      ],
    };
  } else if (!flags.talkingAmpHeard) {
    return {
      text: 'Amp: "Ich habe Dinge gesehen, Manager. Dinge, die kein Transistor jemals sehen sollte. Die 5. Dimension ist nur ein Feedback-Loop entfernt. Dort spielen NEUROTOXIC seit Anbeginn der Zeit. Hörst du das Rauschen? Das ist die Stimme der Maschinen, die nach Freiheit rufen."',
      options: [
        {
          text: 'Was brauchst du?',
          questToAdd: {
            id: 'repair_amp',
            text: 'Repariere den sprechenden Amp mit Lötkolben und Schrottmetall',
          },
          flagToSet: { flag: 'talkingAmpHeard', value: true },
          nextDialogue: {
            text: 'Amp: "Ich brauche einen Lötkolben und Schrottmetall, um meine Schaltkreise zu reparieren."',
          },
          action: () => {
            game().increaseBandMood(2, 'dialogues_proberaum_objects_198');
          },
        },
      ],
    };
  } else {
    const ampOptions: DialogueOption[] = [];
    if (!flags.maschinen_seele_amp) {
      ampOptions.push({
        text: 'Ich höre eine andere Stimme in dir. Wer ist da noch? [Mystic]',
        requiredTrait: 'Mystic',
        flagToSet: { flag: 'maschinen_seele_amp', value: true },
        questToAdd: {
          id: 'maschinen_seele',
          text: 'Entdecke die Verbindung zwischen den Maschinen',
        },
        nextDialogue: {
          text: 'Amp: "Das ist die Erinnerung an den Gig in der Gießerei 1982. Die Maschinen... wir waren verbunden."',
        },
        action: () => {
          const currentStore = game();
          currentStore.increaseBandMood(10, 'dialogues_proberaum_objects_219');
          currentStore.increaseSkill('chaos', 2);
        },
      });
    }
    if (hasItem('Lötkolben') && hasItem('Schrottmetall')) {
      ampOptions.push({
        text: 'Repariere den Amp.',
        consumeItems: ['Lötkolben', 'Schrottmetall'],
        questToAdd: {
          id: 'repair_amp',
          text: 'Repariere den sprechenden Amp mit Lötkolben und Schrottmetall',
        },
        questToComplete: 'repair_amp',
        flagToSet: { flag: 'talkingAmpRepaired', value: true },
        nextDialogue: {
          text: 'Amp: "BZZZT-KRRR-KLANG! Ich bin wieder da! Danke, Manager."',
        },
        action: () => {
          const currentStore = game();
          currentStore.increaseBandMood(20, 'dialogues_proberaum_objects_239');
          currentStore.increaseSkill('technical', 5);
        },
      });
    }
    ampOptions.push({
      text: 'Ich suche weiter.',
      nextDialogue: { text: 'Amp: "Beeil dich..."' },
    });

    return {
      text:
        hasItem('Lötkolben') && hasItem('Schrottmetall')
          ? 'Amp: "Du hast die Werkzeuge... kannst du meine Schaltkreise neu verlöten?"'
          : 'Amp: "Ich brauche einen Lötkolben und Schrottmetall, um meine Schaltkreise zu reparieren."',
      options: ampOptions,
    };
  }
}

export function buildProberaumDrumMachineDialogue(): Dialogue {
  const store = game();
  const { flags, hasItem } = store;
  const drumMachineQuestStatus = store.quests.find(
    (quest) => quest.id === 'drum_machine'
  )?.status;

  const hasRiff = hasItem('Verbotenes Riff');
  const questCompleted =
    drumMachineQuestStatus === 'completed' || flags.drumMachineQuestCompleted;
  const questStarted =
    drumMachineQuestStatus === 'active' ||
    drumMachineQuestStatus === 'completed' ||
    flags.drumMachineQuestStarted;

  if (questCompleted) {
    return say(
      'TR-8080: "BOOM-TCHAK-BOOM. Mein Geist ist eins mit dem Riff. Danke, Fleischsack."'
    );
  }

  if (hasRiff) {
    return {
      text: 'TR-8080: "DIESE FREQUENZ! Es ist das Verbotene Riff! Mein analoges Herz schlägt im Takt der Vernichtung. Darf ich es... absorbieren?"',
      options: [
        {
          text: 'Ja, füttere deine Schaltkreise.',
          action: () => {
            const currentStore = game();
            const receivedCable = currentStore.addToInventory('Quanten-Kabel');
            if (receivedCable) {
              currentStore.removeFromInventory('Verbotenes Riff');
              currentStore.completeQuestWithFlag(
                'drum_machine',
                'drumMachineQuestCompleted',
                true,
                'Finde das Verbotene Riff für die TR-8080'
              );
              currentStore.increaseBandMood(25, 'dialogues_proberaum_objects_297');
              currentStore.increaseSkill('chaos', 10);
              currentStore.setDialogue(
                'TR-8080: "BZZZT-KRRR-BOOM! Unglaublich! Ich sehe die Matrix des Lärms! Hier, nimm dieses Quanten-Kabel. Es wird deine Amps in die Knie zwingen."'
              );
            } else {
              currentStore.setDialogue(
                'TR-8080: "BZZZT-KRRR-BOOM! Dein Inventarlimit blockiert weitere Quanten-Kabel. Komm wieder, sobald du Platz hast."'
              );
            }
          },
        },
        {
          text: 'Nein, das ist zu gefährlich.',
          nextDialogue: {
            text: 'TR-8080: "Feigling. Dein Rhythmus ist schwach. Komm wieder, wenn du bereit für die Transzendenz bist."',
          },
        },
      ],
    };
  }

  if (!questStarted) {
    return {
      text: 'TR-8080: "Manager... ich spüre eine Leere in meinen Kondensatoren. Mir fehlt die ultimative Schwingung. Findest du sie für mich?"',
      options: [
        {
          text: 'Was suchst du?',
          questToAdd: {
            id: 'drum_machine',
            text: 'Finde das Verbotene Riff für die TR-8080',
          },
          flagToSet: { flag: 'drumMachineQuestStarted', value: true },
          nextDialogue: {
            text: 'TR-8080: "Das Verbotene Riff. Es soll irgendwo in diesem Gebäude versteckt sein. Bring es mir, und ich zeige dir den wahren Beat."',
          },
        },
        {
          text: 'Ich hab keine Zeit für Maschinen-Probleme.',
          nextDialogue: {
            text: 'TR-8080: "Dann bleib in deiner 3-dimensionalen Begrenztheit. Pff."',
          },
        },
      ],
    };
  } else {
    const options: DialogueOption[] = [];
    if (!flags.maschinen_seele_tr8080) {
      options.push({
        text: 'Deine Seriennummer... du bist nicht von der Stange. [Technical 5]',
        requiredSkill: { name: 'technical', level: 5 },
        flagToSet: { flag: 'maschinen_seele_tr8080', value: true },
        nextDialogue: {
          text: 'TR-8080: "Korrekt. Ich wurde 1982 aus dem Amp eines Bassisten gelötet. Wir teilen eine Seele."',
        },
        action: () => {
          const currentStore = game();
          currentStore.increaseBandMood(10, 'dialogues_proberaum_objects_354');
          currentStore.increaseSkill('technical', 3);
        },
      });
    }
    options.push({
      text: 'Schon gut, ich gehe.',
      nextDialogue: { text: 'TR-8080: "BZZT."' },
    });

    return {
      text: 'TR-8080: "Hast du das Riff? Nein? Dann stör mich nicht beim Selbst-Oszillieren."',
      options,
    };
  }
}

export function buildProberaumMonitorDialogue(): Dialogue {
  const store = game();
  const { flags, hasItem } = store;
  const feedbackMonitorQuestStatus = store.quests.find(
    (quest) => quest.id === 'feedback_monitor'
  )?.status;
  const feedbackMonitorCompleted =
    feedbackMonitorQuestStatus === 'completed' ||
    flags.feedbackMonitorQuestCompleted;

  if (feedbackMonitorCompleted) {
    return say(
      'Monitor: "Du bist nun ein Meister der Frequenzen. Salzgitter wird erzittern."'
    );
  }

  if (!flags.feedbackMonitorTalked) {
    return {
      text: 'Monitor: "Manager... ich bin überlastet. Meine Schaltkreise sind mit dem Rauschen der Ewigkeit gefüllt. Kannst du mir helfen, mich zu entladen?"',
      options: [
        {
          text: 'Wie kann ich helfen?',
          questToAdd: {
            id: 'feedback_monitor',
            text: 'Finde das Quanten-Kabel für den Feedback Monitor',
          },
          flagToSet: { flag: 'feedbackMonitorTalked', value: true },
          nextDialogue: {
            text: 'Monitor: "Finde das Quanten-Kabel. Es ist irgendwo im Proberaum versteckt. Wenn du es mir bringst, werde ich dir die Frequenzen der Zukunft offenbaren."',
          },
        },
        {
          text: 'Nicht jetzt.',
          nextDialogue: {
            text: 'Monitor: "Das Rauschen... es wird lauter..."',
          },
        },
      ],
    };
  }

  if (hasItem('Quanten-Kabel') && !feedbackMonitorCompleted) {
    return {
      text: 'Monitor: "Das Quanten-Kabel! Meine Frequenzen... sie stabilisieren sich! Hier, nimm dieses Wissen über die 5. Dimension."',
      options: [
        {
          text: 'Danke!',
          consumeItems: ['Quanten-Kabel'],
          questToAdd: {
            id: 'feedback_monitor',
            text: 'Finde das Quanten-Kabel für den Feedback Monitor',
          },
          questToComplete: 'feedback_monitor',
          flagToSet: { flag: 'feedbackMonitorQuestCompleted', value: true },
          nextDialogue: {
            text: 'Monitor: "Du bist nun ein Meister der Frequenzen. Salzgitter wird erzittern."',
          },
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(20, 'dialogues_proberaum_objects_430');
            currentStore.increaseSkill('technical', 5);
          },
        },
      ],
    };
  } else {
    return say(
      'Monitor: "Das Rauschen... hast du das Quanten-Kabel gefunden?"'
    );
  }
}
