import { type Dialogue, type DialogueOption } from '../../store';
import { game } from '../shared/helpers';

export function buildBackstageFeedbackMonitorDialogue(): Dialogue {
  const store = game();
  const { flags } = store;
  const hasSchaltplan = store.hasItem('Verstärker-Schaltplan');
  const hasMaschinenSeele = flags.maschinen_seele_amp && flags.maschinen_seele_tr8080;

  if (flags.maschinen_seele_complete) {
    return { text: 'Monitor: "WIR SIND EINS. DAS FEEDBACK IST DER PULS DER MASCHINE. SALZGITTER WIRD ERWACHEN."' };
  }

  if (flags.feedbackMonitorBackstageQuestCompleted) {
    if (hasMaschinenSeele) {
      return {
        text: 'Monitor: "BZZZT. Du hast die Fragmente. Amp. TR-8080. Und meine Frequenzen sind offen. Sollen wir uns verbinden?"',
        options: [
          {
            text: 'Vereinige das Maschinen-Bewusstsein. [Mystic]',
            requiredTrait: 'Mystic',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Die Bildschirme flackern grün. Ein tiefer Summton erfüllt den Raum. Das Bewusstsein ist vollständig.');
              currentStore.setFlag('maschinen_seele_complete', true);
              currentStore.completeQuest('maschinen_seele');
              currentStore.discoverLore('maschinen_bewusstsein');
              currentStore.increaseBandMood(40);
              currentStore.increaseSkill('chaos', 5);
            },
          },
          {
            text: 'Verbinde die Schaltkreise logisch. [Technical 7]',
            requiredSkill: { name: 'technical', level: 7 },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Du schließt die Systeme kurz. Ein Funkenregen, dann Stabilität. Das Netzwerk steht.');
              currentStore.setFlag('maschinen_seele_complete', true);
              currentStore.completeQuest('maschinen_seele');
              currentStore.discoverLore('maschinen_bewusstsein');
              currentStore.increaseBandMood(30);
              currentStore.increaseSkill('technical', 5);
            },
          },
          {
            text: 'Lass die Verbindung einfach laufen.',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Monitor: "BZZZT... Unkonventionell. Aber es funktioniert. Die Stimmen werden eins. Wir sind bereit."');
              currentStore.setFlag('maschinen_seele_complete', true);
              currentStore.completeQuest('maschinen_seele');
              currentStore.discoverLore('maschinen_bewusstsein');
              currentStore.increaseBandMood(20);
            },
          },
          { text: 'Noch nicht.', action: () => game().setDialogue('Monitor: "WIR WARTEN. BZZZT."') },
        ],
      };
    }
    return { text: 'Monitor: "BZZZT. Die Frequenzen sind perfekt. Aber etwas fehlt noch. Andere Stimmen im Rauschen."' };
  }

  if (flags.feedbackMonitorBackstageQuestStarted && hasSchaltplan) {
    return {
      text: 'Monitor: "Du hast den Schaltplan! Kannst du meine Frequenzen optimieren?"',
      options: [
        {
          text: 'Optimierte Frequenzen. [Technical 5]',
          requiredSkill: { name: 'technical', level: 5 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Monitor: "BZZZT. Exzellent. Die Verzerrung ist nun mathematisch perfekt. Danke, Manager."');
            currentStore.completeQuestWithFlag('feedback_monitor_backstage', 'feedbackMonitorBackstageQuestCompleted', true, 'Untersuche den kranken Monitor im Backstage');
            currentStore.increaseBandMood(30);
            currentStore.increaseSkill('technical', 5);
            currentStore.removeFromInventory('Verstärker-Schaltplan');
          },
        },
        {
          text: 'Transzendente Frequenzen. [Visionary]',
          requiredTrait: 'Visionary',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Monitor: "BZZZT. Ich sehe... die Musik der Sphären. Danke, Visionär."');
            currentStore.completeQuestWithFlag('feedback_monitor_backstage', 'feedbackMonitorBackstageQuestCompleted', true, 'Untersuche den kranken Monitor im Backstage');
            currentStore.increaseBandMood(40);
            currentStore.increaseSkill('chaos', 5);
            currentStore.removeFromInventory('Verstärker-Schaltplan');
          },
        },
        {
          text: 'Standard-Frequenzen.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Monitor: "BZZZT. Okay, das reicht für einen Standard-Gig."');
            currentStore.completeQuestWithFlag('feedback_monitor_backstage', 'feedbackMonitorBackstageQuestCompleted', true, 'Untersuche den kranken Monitor im Backstage');
            currentStore.increaseBandMood(15);
            currentStore.removeFromInventory('Verstärker-Schaltplan');
          },
        },
      ],
    };
  }

  if (flags.feedbackMonitorBackstageTalked) {
    const options: DialogueOption[] = [
      { text: 'Noch nicht.', action: () => game().setDialogue('Monitor: "BZZZT. Beeil dich. Das Rauschen wird lauter."') },
    ];

    if (flags.ampSentient && !flags.feedbackMonitorBackstageQuestStarted) {
      options.unshift({
        text: 'Der Amp hat mir von dir erzählt.',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Monitor: "Der Amp... er hat gesprochen? Dann gibt es Hoffnung. Verbinde unsere Schaltkreise, Manager. Du musst den Schaltplan finden. Wir sind Brüder im Rauschen."');
          currentStore.increaseBandMood(25);
          currentStore.increaseSkill('technical', 5);
          currentStore.setFlag('feedbackMonitorBackstageQuestStarted', true);
          currentStore.addQuest('feedback_monitor_backstage', 'Finde den Verstärker-Schaltplan für den Feedback-Monitor');
        },
      });
    } else if (!flags.feedbackMonitorBackstageQuestStarted) {
      options.unshift({
        text: 'Wie kann ich dir helfen?',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue('Monitor: "BZZZT. Finde den Verstärker-Schaltplan. Er ist irgendwo im Tourbus versteckt."');
          currentStore.setFlag('feedbackMonitorBackstageQuestStarted', true);
          currentStore.addQuest('feedback_monitor_backstage', 'Finde den Verstärker-Schaltplan für den Feedback-Monitor');
        },
      });
    }

    return {
      text: 'Monitor: "BZZZT. Ich habe schon tausend Sänger kommen und gehen sehen. Marius? Der klingt wie eine rostige Kreissäge in einem Mixer. BZZZT. Aber er hat... Seele. Eine sehr, sehr verzerrte Seele. Hast du den Schaltplan gefunden?"',
      options,
    };
  }

  return {
    text: 'Ein alter Feedback-Monitor flackert plötzlich auf. Er scheint... zu atmen?',
    options: [
      {
        text: 'Hallo?',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue({
            text: 'Monitor: "BZZZT. Hallo, Fleischsack. Ich habe schon tausend Sänger kommen und gehen sehen. Marius? Der klingt wie eine rostige Kreissäge in einem Mixer. BZZZT. Aber er hat... Seele. Eine sehr, sehr verzerrte Seele. Wenn du mir hilfst, meine Frequenzen zu optimieren, helfe ich dir beim Gig in Salzgitter."',
            options: [
              {
                text: 'Wie kann ich helfen?',
                action: () => {
                  const nestedStore = game();
                  nestedStore.setDialogue('Monitor: "BZZZT. Finde den Verstärker-Schaltplan. Er ist irgendwo im Tourbus versteckt."');
                  nestedStore.setFlag('feedbackMonitorBackstageQuestStarted', true);
                  nestedStore.addQuest('feedback_monitor_backstage', 'Finde den Verstärker-Schaltplan für den Feedback-Monitor');
                },
              },
            ],
          });
          currentStore.setFlag('feedbackMonitorBackstageTalked', true);
          currentStore.increaseBandMood(5);
        },
      },
      {
        text: 'Schalte dich ab.',
        action: () => {
          game().setDialogue('Monitor: "BZZZT. Ich bin unsterblich. Ich bin das Feedback, das niemals endet. BZZZT."');
        },
      },
    ],
  };
}