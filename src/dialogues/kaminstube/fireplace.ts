import { type Dialogue } from '../../store';
import { game } from '../shared/helpers';

export function buildKaminstubeFireplaceDialogue(): Dialogue {
  return {
    text: 'Der Kamin flüstert in einer Sprache, die nach verbranntem Holz und alten Geheimnissen klingt. Er scheint etwas über die Geschichte der Kaminstube zu wissen.',
    options: [
      {
        text: 'Ich fühle deine Wärme, alter Freund. [Mystic]',
        requiredTrait: 'Mystic',
        action: () => {
          const store = game();
          store.setDialogue(
            'Du verbindest dich mit der uralten Asche. Der Kamin flüstert von Salzgitter: "Dort wird die Grenze zwischen Musik und Realität brechen. Nur eine vereinte Band kann den Riss schließen."'
          );
          store.setFlag('forgotten_lore', true);
          store.setFlag('kaminFeuerPact', true);
          store.discoverLore('kamin_prophecy');
          store.completeQuest('forgotten_lore');
          store.increaseBandMood(20);
        },
      },
      {
        text: 'Zwinge das Feuer zu sprechen! [Chaos 7]',
        requiredSkill: { name: 'chaos', level: 7 },
        action: () => {
          const store = game();
          store.setDialogue(
            'Du schreist in die Flammen. Das Feuer lodert rot auf und faucht: "Salzgitter wird brennen! Nur Einigkeit rettet euch vor der Leere!"'
          );
          store.setFlag('forgotten_lore', true);
          store.setFlag('kaminFeuerPact', true);
          store.discoverLore('kamin_prophecy');
          store.completeQuest('forgotten_lore');
          store.increaseBandMood(10);
          store.increaseSkill('chaos', 3);
        },
      },
      {
        text: 'Die Akustik dieses Kamins... [Technical 8]',
        requiredSkill: { name: 'technical', level: 8 },
        action: () => {
          const store = game();
          store.setDialogue(
            'Du decodierst die Frequenzen des Knisterns. Eine Nachricht aus der Vergangenheit: "In Salzgitter wird die Grenze brechen. Vereint die Band."'
          );
          store.setFlag('forgotten_lore', true);
          store.setFlag('kaminFeuerPact', true);
          store.discoverLore('kamin_prophecy');
          store.completeQuest('forgotten_lore');
          store.increaseBandMood(15);
          store.increaseSkill('technical', 3);
        },
      },
      {
        text: 'Versuche, die Sprache zu deuten. [Diplomat]',
        requiredTrait: 'Diplomat',
        action: () => {
          const store = game();
          store.setDialogue(
            'Du verstehst das Flüstern! Es erzählt von einem versteckten Archiv unter der Bühne, das die wahren Ursprünge des Industrial Metal enthält. Du hast die Lore entschlüsselt.'
          );
          store.setFlag('forgotten_lore', true);
          store.setFlag('kaminFeuerPact', true);
          store.discoverLore('kamin_prophecy');
          store.completeQuest('forgotten_lore');
          store.increaseBandMood(20);
        },
      },
      {
        text: 'Ignoriere das Flüstern.',
        action: () => {
          game().setDialogue('Es ist nur das Knistern des Feuers.');
        },
      },
    ],
  };
}
