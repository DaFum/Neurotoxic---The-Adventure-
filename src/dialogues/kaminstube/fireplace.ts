import { type Dialogue, type DialogueOption } from '../../store';
import { game } from '../shared/helpers';

export function buildKaminstubeFireplaceDialogue(): Dialogue {
  const store = game();
  const loreAlreadyResolved =
    store.flags.forgotten_lore || store.flags.kaminFeuerPact;
  const options: DialogueOption[] = [];

  if (!loreAlreadyResolved) {
    options.push({
      text: 'Ich fühle deine Wärme, alter Freund. [Mystic]',
      requiredTrait: 'Mystic',
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Du verbindest dich mit der uralten Asche. Der Kamin flüstert von Salzgitter: "Dort wird die Grenze zwischen Musik und Realität brechen. Nur eine vereinte Band kann den Riss schließen."'
        );
        currentStore.setFlag('forgotten_lore', true);
        currentStore.setFlag('kaminFeuerPact', true);
        currentStore.discoverLore('kamin_prophecy');
        currentStore.completeQuest('forgotten_lore');
        currentStore.increaseBandMood(20);
      },
    });

    options.push({
      text: 'Zwinge das Feuer zu sprechen! [Chaos 7]',
      requiredSkill: { name: 'chaos', level: 7 },
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Du schreist in die Flammen. Das Feuer lodert rot auf und faucht: "Salzgitter wird brennen! Nur Einigkeit rettet euch vor der Leere!"'
        );
        currentStore.setFlag('forgotten_lore', true);
        currentStore.setFlag('kaminFeuerPact', true);
        currentStore.discoverLore('kamin_prophecy');
        currentStore.completeQuest('forgotten_lore');
        currentStore.increaseBandMood(10);
        currentStore.increaseSkill('chaos', 3);
      },
    });

    options.push({
      text: 'Die Akustik dieses Kamins... [Technical 8]',
      requiredSkill: { name: 'technical', level: 8 },
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Du decodierst die Frequenzen des Knisterns. Eine Nachricht aus der Vergangenheit: "In Salzgitter wird die Grenze brechen. Vereint die Band."'
        );
        currentStore.setFlag('forgotten_lore', true);
        currentStore.setFlag('kaminFeuerPact', true);
        currentStore.discoverLore('kamin_prophecy');
        currentStore.completeQuest('forgotten_lore');
        currentStore.increaseBandMood(15);
        currentStore.increaseSkill('technical', 3);
      },
    });

    options.push({
      text: 'Versuche, die Sprache zu deuten. [Diplomat]',
      requiredTrait: 'Diplomat',
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Du verstehst das Flüstern! Es erzählt von einem versteckten Archiv unter der Bühne, das die wahren Ursprünge des Industrial Metal enthält. Du hast die Lore entschlüsselt.'
        );
        currentStore.setFlag('forgotten_lore', true);
        currentStore.setFlag('kaminFeuerPact', true);
        currentStore.discoverLore('kamin_prophecy');
        currentStore.completeQuest('forgotten_lore');
        currentStore.increaseBandMood(20);
      },
    });
  }

  options.push({
    text: 'Ignoriere das Flüstern.',
    action: () => {
      game().setDialogue('Es ist nur das Knistern des Feuers.');
    },
  });

  return {
    text: 'Der Kamin flüstert in einer Sprache, die nach verbranntem Holz und alten Geheimnissen klingt. Er scheint etwas über die Geschichte der Kaminstube zu wissen.',
    options,
  };
}
