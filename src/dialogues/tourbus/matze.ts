import { type Dialogue, type DialogueOption } from '../../store';
import { game, when, say } from '../shared/helpers';

export function buildTourbusMatzeDialogue(): Dialogue | string {
  const store = game();
  const { flags, bandMood, hasItem } = store;

  if (bandMood < 20 && !hasItem('Repariertes Kabel') && !flags.cableFixed && !flags.tourbus_sabotage_discovered) {
    return say('Matze: "Lass mich in Ruhe. Dieses kaputte Kabel ist das Ende der Band."');
  }

  if (hasItem('Repariertes Kabel') && !store.quests.find(q => q.id === 'cable' && q.status === 'completed')) {
    return {
      text: 'Matze: "Hast du Angst vor Salzgitter?"',
      options: [
        {
          text: 'Ich sehe unseren Sieg. [Visionary]',
          requiredTrait: 'Visionary',
          consumeItems: ['Repariertes Kabel'],
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Deine Visionen... sie geben mir Kraft. Wir werden siegen." (Kabel übergeben)');
            currentStore.increaseBandMood(15);
            currentStore.completeQuestWithFlag('cable', 'cableFixed', true, 'Repariere Matzes Kabel mit Klebeband und defektem Kabel');
          }
        },
        {
          text: 'Ich habe den Soundcheck analysiert. [Technical 5]',
          requiredSkill: { name: 'technical', level: 5 },
          consumeItems: ['Repariertes Kabel'],
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Die Akustik? Beruhigend, dass jemand den Überblick behält." (Kabel übergeben)');
            currentStore.increaseBandMood(20);
            currentStore.increaseSkill('technical', 3);
            currentStore.completeQuestWithFlag('cable', 'cableFixed', true, 'Repariere Matzes Kabel mit Klebeband und defektem Kabel');
          }
        },
        {
          text: 'Wir schaffen das zusammen. [Social 5]',
          requiredSkill: { name: 'social', level: 5 },
          consumeItems: ['Repariertes Kabel'],
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Zusammen... ja. Wir sind eine verdammte Einheit." (Kabel übergeben)');
            currentStore.increaseBandMood(15);
            currentStore.increaseSkill('social', 3);
            currentStore.completeQuestWithFlag('cable', 'cableFixed', true, 'Repariere Matzes Kabel mit Klebeband und defektem Kabel');
          }
        },
        {
          text: 'Ein bisschen schon.',
          consumeItems: ['Repariertes Kabel'],
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Gut. Angst hält uns wach." (Kabel übergeben)');
            currentStore.completeQuestWithFlag('cable', 'cableFixed', true, 'Repariere Matzes Kabel mit Klebeband und defektem Kabel');
          }
        },
        {
          text: 'Lass uns die Bühne abreißen!',
          consumeItems: ['Repariertes Kabel'],
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(10);
            currentStore.setDialogue('Matze: "Das ist die richtige Einstellung!" (Kabel übergeben)');
            currentStore.completeQuestWithFlag('cable', 'cableFixed', true, 'Repariere Matzes Kabel mit Klebeband und defektem Kabel');
          }
        }
      ]
    };
  }

  if (flags.tourbus_sabotage_discovered && !flags.tourbus_matze_confession) {
    if (flags.marius_tourbus_doubt) {
      return {
        text: 'Matze: "Das zerschnittene Kabel... okay, ich geb\'s ja zu. Irgendwas stimmt nicht."',
        options: [
          {
            text: 'Matze, ich glaube Marius zweifelt an der Band. [Social 5]',
            requiredSkill: { name: 'social', level: 5 },
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Matze: "Oh Gott... ich war es! Ich hab das Kabel durchtrennt! Ich hatte solche Angst vor dem Gig in Salzgitter..."');
              currentStore.completeQuestWithFlag('tourbus_saboteur', 'tourbus_matze_confession', true, 'Finde heraus, wer das Kabel sabotiert hat');
              currentStore.increaseBandMood(10);
              currentStore.increaseSkill('social', 3);
            }
          },
          {
            text: 'Wer auch immer das war, kriegt eine Abreibung. [Brutalist]',
            requiredTrait: 'Brutalist',
            action: () => {
              const currentStore = game();
              currentStore.setDialogue('Matze schaut ertappt weg und schweigt schuldbewusst.');
              currentStore.increaseBandMood(-5);
            }
          },
          {
            text: 'Wir finden den Schuldigen.',
            action: () => game().setDialogue('Matze: "Ja... genau. Wir suchen weiter."')
          }
        ]
      };
    } else {
      return say('Matze: "Wer würde uns absichtlich sabotieren? Wir müssen Beweise finden."');
    }
  }

  if (bandMood < 30) {
    if (flags.cableFixed) {
      return say('Matze: "Alter, ich hab so schlechte Laune. Aber wenigstens funktioniert das Kabel wieder."');
    }
    return say('Matze: "Alter, ich hab so schlechte Laune. Die Tour fängt ja super an... und mein Kabel ist auch noch im Eimer."');
  } else {
    if (flags.cableFixed) {
      return say('Matze: "Wir sind bereit. Die Bühne gehört uns."');
    }
    return {
      text: 'Matze: "Geht schon. Aber mein Kabel ist im Eimer. Hast du Klebeband?"',
      options: [
        {
          text: 'Ich suche danach.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Beeil dich, ohne Kabel kein Metal."');
            currentStore.addQuest('cable', 'Repariere Matzes Kabel mit Klebeband und defektem Kabel');
          }
        },
        {
          text: 'Das Kabel wurde nicht gebrochen, es wurde durchtrennt. [Technical 5]',
          requiredSkill: { name: 'technical', level: 5 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Was?! Wer würde uns so sabotieren?!" Er sieht sehr geschockt aus.');
            currentStore.startQuestWithFlag('tourbus_saboteur', 'Finde heraus, wer das Kabel sabotiert hat', 'tourbus_sabotage_discovered', true);
            currentStore.discoverLore('tourbus_saboteur');
            currentStore.increaseBandMood(20);
            currentStore.increaseSkill('technical', 5);
          }
        },
        {
          text: 'Vielleicht ist es Schicksal.',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue('Matze: "Schicksal? Das ist Sabotage! Such das Tape!"');
            currentStore.increaseBandMood(-5);
          }
        }
      ]
    };
  }
}