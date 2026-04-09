import { type Dialogue, type DialogueOption } from '../../store';
import { game } from '../shared/helpers';

const BACKSTAGE_MONITOR_QUEST_ID = 'feedback_monitor_backstage';
const BACKSTAGE_MONITOR_QUEST_TEXT =
  'Finde den Verstärker-Schaltplan für den Feedback-Monitor';

const MASCHINEN_SEELE_QUEST_ID = 'maschinen_seele';

export function buildBackstageFeedbackMonitorDialogue(): Dialogue {
  const store = game();
  const { flags } = store;
  const hasSchaltplan = store.hasItem('Verstärker-Schaltplan');
  const hasMaschinenSeele =
    flags.maschinen_seele_amp && flags.maschinen_seele_tr8080;

  if (flags.maschinen_seele_complete) {
    return {
      text: 'Monitor: "WIR SIND EINS. DAS FEEDBACK IST DER PULS DER MASCHINE. SALZGITTER WIRD ERWACHEN."',
    };
  }

  if (flags.feedbackMonitorBackstageQuestCompleted) {
    if (hasMaschinenSeele) {
      return {
        text: 'Monitor: "BZZZT. Du hast die Fragmente. Amp. TR-8080. Und meine Frequenzen sind offen. Sollen wir uns verbinden?"',
        options: [
          {
            text: 'Vereinige das Maschinen-Bewusstsein. [Mystic]',
            requiredTrait: 'Mystic',
            flagToSet: { flag: 'maschinen_seele_complete', value: true },
            questToAdd: {
              id: MASCHINEN_SEELE_QUEST_ID,
              text: 'Vereinige das Maschinen-Bewusstsein',
            },
            questToComplete: MASCHINEN_SEELE_QUEST_ID,
            action: () => {
            const _st = game(); _st.setDialogue('Die Bildschirme flackern grün. Ein tiefer Summton erfüllt den Raum. Das Bewusstsein ist vollständig.');
              const currentStore = game();
              currentStore.discoverLore('maschinen_bewusstsein');
              currentStore.increaseBandMood(40, 'id_b4f7027d');
              currentStore.increaseSkill('chaos', 5);
            },
          },
          {
            text: 'Verbinde die Schaltkreise logisch. [Technical 7]',
            requiredSkill: { name: 'technical', level: 7 },
            flagToSet: { flag: 'maschinen_seele_complete', value: true },
            questToAdd: {
              id: MASCHINEN_SEELE_QUEST_ID,
              text: 'Vereinige das Maschinen-Bewusstsein',
            },
            questToComplete: MASCHINEN_SEELE_QUEST_ID,
            action: () => {
            const _st = game(); _st.setDialogue('Du schließt die Systeme kurz. Ein Funkenregen, dann Stabilität. Das Netzwerk steht.');
              const currentStore = game();
              currentStore.discoverLore('maschinen_bewusstsein');
              currentStore.increaseBandMood(30, 'id_7ffa8585');
              currentStore.increaseSkill('technical', 5);
            },
          },
          {
            text: 'Lass die Verbindung einfach laufen.',
            flagToSet: { flag: 'maschinen_seele_complete', value: true },
            questToAdd: {
              id: MASCHINEN_SEELE_QUEST_ID,
              text: 'Vereinige das Maschinen-Bewusstsein',
            },
            questToComplete: MASCHINEN_SEELE_QUEST_ID,
            action: () => {
            const _st = game(); _st.setDialogue('Monitor: "BZZZT... Unkonventionell. Aber es funktioniert. Die Stimmen werden eins. Wir sind bereit."');
              const currentStore = game();
              currentStore.discoverLore('maschinen_bewusstsein');
              currentStore.increaseBandMood(20, 'id_4899db3c');
            },
          },
          {
            text: 'Noch nicht.',
            nextDialogue: { text: 'Monitor: "WIR WARTEN. BZZZT."' },
          },
        ],
      };
    }
    return {
      text: 'Monitor: "BZZZT. Die Frequenzen sind perfekt. Aber etwas fehlt noch. Andere Stimmen im Rauschen."',
    };
  }

  if (flags.feedbackMonitorBackstageQuestStarted && hasSchaltplan) {
    return {
      text: 'Monitor: "Du hast den Schaltplan! Kannst du meine Frequenzen optimieren?"',
      options: [
        {
          text: 'Optimierte Frequenzen. [Technical 5]',
          requiredSkill: { name: 'technical', level: 5 },
          consumeItems: ['Verstärker-Schaltplan'],
          questToAdd: {
            id: BACKSTAGE_MONITOR_QUEST_ID,
            text: BACKSTAGE_MONITOR_QUEST_TEXT,
          },
          questToComplete: BACKSTAGE_MONITOR_QUEST_ID,
          flagToSet: {
            flag: 'feedbackMonitorBackstageQuestCompleted',
            value: true,
          },
          action: () => {
            const _st = game(); _st.setDialogue('Monitor: "BZZZT. Exzellent. Die Verzerrung ist nun mathematisch perfekt. Danke, Manager."');
            const currentStore = game();
            currentStore.increaseBandMood(30, 'id_e0e8aacd');
            currentStore.increaseSkill('technical', 5);
          },
        },
        {
          text: 'Transzendente Frequenzen. [Visionary]',
          requiredTrait: 'Visionary',
          consumeItems: ['Verstärker-Schaltplan'],
          questToAdd: {
            id: BACKSTAGE_MONITOR_QUEST_ID,
            text: BACKSTAGE_MONITOR_QUEST_TEXT,
          },
          questToComplete: BACKSTAGE_MONITOR_QUEST_ID,
          flagToSet: {
            flag: 'feedbackMonitorBackstageQuestCompleted',
            value: true,
          },
          action: () => {
            const _st = game(); _st.setDialogue('Monitor: "BZZZT. Ich sehe... die Musik der Sphären. Danke, Visionär."');
            const currentStore = game();
            currentStore.increaseBandMood(40, 'id_1f6ffb9b');
            currentStore.increaseSkill('chaos', 5);
          },
        },
        {
          text: 'Standard-Frequenzen.',
          consumeItems: ['Verstärker-Schaltplan'],
          questToAdd: {
            id: BACKSTAGE_MONITOR_QUEST_ID,
            text: BACKSTAGE_MONITOR_QUEST_TEXT,
          },
          questToComplete: BACKSTAGE_MONITOR_QUEST_ID,
          flagToSet: {
            flag: 'feedbackMonitorBackstageQuestCompleted',
            value: true,
          },
          action: () => {
            const _st = game(); _st.setDialogue('Monitor: "BZZZT. Okay, das reicht für einen Standard-Gig."');
            const currentStore = game();
            currentStore.increaseBandMood(15, 'id_b74f71fa');
          },
        },
      ],
    };
  }

  if (flags.feedbackMonitorBackstageTalked) {
    const options: DialogueOption[] = [
      {
        text: 'Noch nicht.',
        nextDialogue: {
          text: 'Monitor: "BZZZT. Beeil dich. Das Rauschen wird lauter."',
        },
      },
    ];

    if (flags.ampSentient && !flags.feedbackMonitorBackstageQuestStarted) {
      options.unshift({
        text: 'Der Amp hat mir von dir erzählt.',
        questToAdd: {
          id: BACKSTAGE_MONITOR_QUEST_ID,
          text: BACKSTAGE_MONITOR_QUEST_TEXT,
        },
        flagToSet: {
          flag: 'feedbackMonitorBackstageQuestStarted',
          value: true,
        },
        action: () => {
          const currentStore = game();
          currentStore.setDialogue({ text: 'Monitor: "Der Amp... er hat gesprochen? Dann gibt es Hoffnung. Verbinde unsere Schaltkreise, Manager. Du musst den Schaltplan finden. Wir sind Brüder im Rauschen."' });
          currentStore.increaseBandMood(25, 'id_24bc329a');
          currentStore.increaseSkill('technical', 5);
        },
      });
    } else if (!flags.feedbackMonitorBackstageQuestStarted) {
      options.unshift({
        text: 'Wie kann ich dir helfen?',
        nextDialogue: {
          text: 'Monitor: "BZZZT. Finde den Verstärker-Schaltplan. Er ist irgendwo im Tourbus versteckt."',
        },
        questToAdd: {
          id: BACKSTAGE_MONITOR_QUEST_ID,
          text: BACKSTAGE_MONITOR_QUEST_TEXT,
        },
        flagToSet: {
          flag: 'feedbackMonitorBackstageQuestStarted',
          value: true,
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
        flagToSet: { flag: 'feedbackMonitorBackstageTalked', value: true },
        action: () => {
          const currentStore = game();
          currentStore.increaseBandMood(5, 'id_2272824b');
          currentStore.setDialogue({
            text: 'Monitor: "BZZZT. Hallo, Fleischsack. Ich habe schon tausend Sänger kommen und gehen sehen. Marius? Der klingt wie eine rostige Kreissäge in einem Mixer. BZZZT. Aber er hat... Seele. Eine sehr, sehr verzerrte Seele. Wenn du mir hilfst, meine Frequenzen zu optimieren, helfe ich dir beim Gig in Salzgitter."',
            options: [
              {
                text: 'Wie kann ich helfen?',
                nextDialogue: {
                  text: 'Monitor: "BZZZT. Finde den Verstärker-Schaltplan. Er ist irgendwo im Tourbus versteckt."',
                },
                questToAdd: {
                  id: BACKSTAGE_MONITOR_QUEST_ID,
                  text: BACKSTAGE_MONITOR_QUEST_TEXT,
                },
                flagToSet: {
                  flag: 'feedbackMonitorBackstageQuestStarted',
                  value: true,
                },
              },
            ],
          });
        },
      },
      {
        text: 'Schalte dich ab.',
        nextDialogue: {
          text: 'Monitor: "BZZZT. Ich bin unsterblich. Ich bin das Feedback, das niemals endet. BZZZT."',
        },
      },
    ],
  };
}
