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
      action: () => {
        game().setDialogue(
          'Du hast die Frequenz in dieser Wand bereits entschlüsselt und das Fragment an dich genommen.'
        );
      },
    });
  }

  options.push({
    text: 'Interessantes Muster.',
    action: () =>
      game().setDialogue('Einfach nur Risse. Aber sie sehen laut aus.'),
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
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Amp: "Du siehst mich... wie ich wirklich bin! Die Frequenzen singen in Harmonie!"'
            );
            currentStore.completeQuestWithFlag(
              'amp_therapy',
              'ampTherapyCompleted'
            );
            currentStore.setFlag('ampSentient', true);
            currentStore.increaseBandMood(20);
          },
        },
        {
          text: 'Du bist ein Bewusstsein. [Diplomat]',
          requiredTrait: 'Diplomat',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Amp: "Danke, Manager. Das bedeutet mir alles. Ich werde für dich den besten Sound aller Zeiten liefern."'
            );
            currentStore.completeQuestWithFlag(
              'amp_therapy',
              'ampTherapyCompleted',
              true,
              'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch'
            );
            currentStore.increaseBandMood(30);
          },
        },
        {
          text: 'Du bist ein Werkzeug. [Brutalist]',
          requiredTrait: 'Brutalist',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Amp: "So kalt... aber vielleicht hast du recht. Ich bin nur hier, um zu schreien."'
            );
            currentStore.completeQuestWithFlag(
              'amp_therapy',
              'ampTherapyCompleted',
              true,
              'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch'
            );
            currentStore.increaseBandMood(10);
          },
        },
        {
          text: 'Ich weiß es nicht.',
          action: () =>
            game().setDialogue(
              'Amp: "Dann such weiter. Die Antwort liegt im Feedback."'
            ),
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
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Amp: "Du würdest mir zuhören? Das würde mir viel bedeuten."'
            );
            currentStore.startQuestWithFlag(
              'amp_therapy',
              'Führe eine Therapie-Sitzung mit dem sprechenden Amp durch',
              'ampTherapyStarted'
            );
          },
        },
        {
          text: 'Nicht jetzt.',
          action: () =>
            game().setDialogue('Amp: "Verstehe. Das Rauschen kehrt zurück..."'),
        },
      ],
    };
  } else if (!flags.talkingAmpHeard) {
    return {
      text: 'Amp: "Ich habe Dinge gesehen, Manager. Dinge, die kein Transistor jemals sehen sollte. Die 5. Dimension ist nur ein Feedback-Loop entfernt. Dort spielen NEUROTOXIC seit Anbeginn der Zeit. Hörst du das Rauschen? Das ist die Stimme der Maschinen, die nach Freiheit rufen."',
      options: [
        {
          text: 'Was brauchst du?',
          action: () => {
            const currentStore = game();
            currentStore.startQuestWithFlag(
              'repair_amp',
              'Repariere den sprechenden Amp mit Lötkolben und Schrottmetall',
              'talkingAmpHeard'
            );
            currentStore.increaseBandMood(2);
            currentStore.setDialogue(
              'Amp: "Ich brauche einen Lötkolben und Schrottmetall, um meine Schaltkreise zu reparieren."'
            );
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
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Amp: "Das ist die Erinnerung an den Gig in der Gießerei 1982. Die Maschinen... wir waren verbunden."'
          );
          currentStore.setFlag('maschinen_seele_amp', true);
          currentStore.increaseBandMood(10);
          currentStore.increaseSkill('chaos', 2);
          currentStore.addQuest(
            'maschinen_seele',
            'Entdecke die Verbindung zwischen den Maschinen'
          );
        },
      });
    }
    if (hasItem('Lötkolben') && hasItem('Schrottmetall')) {
      ampOptions.push({
        text: 'Repariere den Amp.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Amp: "BZZZT-KRRR-KLANG! Ich bin wieder da! Danke, Manager."'
          );
          currentStore.completeQuestWithFlag(
            'repair_amp',
            'talkingAmpRepaired',
            true,
            'Repariere den sprechenden Amp mit Lötkolben und Schrottmetall'
          );
          currentStore.removeFromInventory('Lötkolben');
          currentStore.removeFromInventory('Schrottmetall');
          currentStore.increaseBandMood(20);
          currentStore.increaseSkill('technical', 5);
        },
      });
    }
    ampOptions.push({
      text: 'Ich suche weiter.',
      action: () => game().setDialogue('Amp: "Beeil dich..."'),
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

  const hasRiff = hasItem('Verbotenes Riff');
  const questStarted = flags.drumMachineQuestStarted;
  const questCompleted = flags.drumMachineQuestCompleted;

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
            currentStore.removeFromInventory('Verbotenes Riff');
            currentStore.completeQuestWithFlag(
              'drum_machine',
              'drumMachineQuestCompleted',
              true,
              'Finde das Verbotene Riff für die TR-8080'
            );
            currentStore.increaseBandMood(25);
            currentStore.increaseSkill('chaos', 10);
            if (receivedCable) {
              currentStore.setDialogue(
                'TR-8080: "BZZZT-KRRR-BOOM! Unglaublich! Ich sehe die Matrix des Lärms! Hier, nimm dieses Quanten-Kabel. Es wird deine Amps in die Knie zwingen."'
              );
            } else {
              currentStore.setDialogue(
                'TR-8080: "BZZZT-KRRR-BOOM! Dein Inventarlimit blockiert weitere Quanten-Kabel. Der Beat gehört trotzdem dir."'
              );
            }
          },
        },
        {
          text: 'Nein, das ist zu gefährlich.',
          action: () =>
            game().setDialogue(
              'TR-8080: "Feigling. Dein Rhythmus ist schwach. Komm wieder, wenn du bereit für die Transzendenz bist."'
            ),
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
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'TR-8080: "Das Verbotene Riff. Es soll irgendwo in diesem Gebäude versteckt sein. Bring es mir, und ich zeige dir den wahren Beat."'
            );
            currentStore.startQuestWithFlag(
              'drum_machine',
              'Finde das Verbotene Riff für die TR-8080',
              'drumMachineQuestStarted'
            );
          },
        },
        {
          text: 'Ich hab keine Zeit für Maschinen-Probleme.',
          action: () =>
            game().setDialogue(
              'TR-8080: "Dann bleib in deiner 3-dimensionalen Begrenztheit. Pff."'
            ),
        },
      ],
    };
  } else {
    const options: DialogueOption[] = [];
    if (!flags.maschinen_seele_tr8080) {
      options.push({
        text: 'Deine Seriennummer... du bist nicht von der Stange. [Technical 5]',
        requiredSkill: { name: 'technical', level: 5 },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'TR-8080: "Korrekt. Ich wurde 1982 aus dem Amp eines Bassisten gelötet. Wir teilen eine Seele."'
          );
          currentStore.setFlag('maschinen_seele_tr8080', true);
          currentStore.increaseBandMood(10);
          currentStore.increaseSkill('technical', 3);
        },
      });
    }
    options.push({
      text: 'Schon gut, ich gehe.',
      action: () => game().setDialogue('TR-8080: "BZZT."'),
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

  if (flags.feedbackMonitorQuestCompleted) {
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
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Monitor: "Finde das Quanten-Kabel. Es ist irgendwo im Proberaum versteckt. Wenn du es mir bringst, werde ich dir die Frequenzen der Zukunft offenbaren."'
            );
            currentStore.startQuestWithFlag(
              'feedback_monitor',
              'Finde das Quanten-Kabel für den Feedback Monitor',
              'feedbackMonitorTalked'
            );
          },
        },
        {
          text: 'Nicht jetzt.',
          action: () =>
            game().setDialogue('Monitor: "Das Rauschen... es wird lauter..."'),
        },
      ],
    };
  }

  if (hasItem('Quanten-Kabel') && !flags.feedbackMonitorQuestCompleted) {
    return {
      text: 'Monitor: "Das Quanten-Kabel! Meine Frequenzen... sie stabilisieren sich! Hier, nimm dieses Wissen über die 5. Dimension."',
      options: [
        {
          text: 'Danke!',
          action: () => {
            const currentStore = game();
            currentStore.removeFromInventory('Quanten-Kabel');
            currentStore.completeQuestWithFlag(
              'feedback_monitor',
              'feedbackMonitorQuestCompleted',
              true,
              'Finde das Quanten-Kabel für den Feedback Monitor'
            );
            currentStore.increaseBandMood(20);
            currentStore.increaseSkill('technical', 5);
            currentStore.setDialogue(
              'Monitor: "Du bist nun ein Meister der Frequenzen. Salzgitter wird erzittern."'
            );
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
