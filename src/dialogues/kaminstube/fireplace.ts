import { type Dialogue, type DialogueOption } from '../../store';
import { game } from '../shared/helpers';

const FORGOTTEN_LORE_QUEST_ID = 'forgotten_lore';
const FORGOTTEN_LORE_QUEST_TEXT =
  'Entschlüssele die vergessene Lore in der Kaminstube';

function completeForgottenLoreQuest(): void {
  game().completeQuestWithFlag(
    FORGOTTEN_LORE_QUEST_ID,
    'kaminFeuerPact',
    true,
    FORGOTTEN_LORE_QUEST_TEXT
  );
}

export function buildKaminstubeFireplaceDialogue(): Dialogue {
  const store = game();
  const loreQuest = store.quests.find(
    (quest) => quest.id === FORGOTTEN_LORE_QUEST_ID
  );
  const loreQuestCompleted = loreQuest?.status === 'completed';
  const loreAlreadyResolved = loreQuestCompleted || store.flags.kaminFeuerPact;
  const options: DialogueOption[] = [];

  if (!loreAlreadyResolved) {
    options.push({
      text: 'Ich fühle deine Wärme, alter Freund. [Mystic]',
      requiredTrait: 'Mystic',
      questDependencies: [{ id: FORGOTTEN_LORE_QUEST_ID, status: 'active' }],
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Du verbindest dich mit der uralten Asche. Der Kamin flüstert von Salzgitter: "Dort wird die Grenze zwischen Musik und Realität brechen. Nur eine vereinte Band kann den Riss schließen."'
        );
        currentStore.discoverLore('kamin_prophecy');
        completeForgottenLoreQuest();
        currentStore.increaseBandMood(20, 'dialogues_kaminstube_fireplace_38');
      },
    });

    options.push({
      text: 'Zwinge das Feuer zu sprechen! [Chaos 7]',
      requiredSkill: { name: 'chaos', level: 7 },
      questDependencies: [{ id: FORGOTTEN_LORE_QUEST_ID, status: 'active' }],
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Du schreist in die Flammen. Das Feuer lodert rot auf und faucht: "Salzgitter wird brennen! Nur Einigkeit rettet euch vor der Leere!"'
        );
        currentStore.discoverLore('kamin_prophecy');
        completeForgottenLoreQuest();
        currentStore.increaseBandMood(10, 'dialogues_kaminstube_fireplace_53');
        currentStore.increaseSkill('chaos', 3);
      },
    });

    options.push({
      text: 'Die Akustik dieses Kamins... [Technical 8]',
      requiredSkill: { name: 'technical', level: 8 },
      questDependencies: [{ id: FORGOTTEN_LORE_QUEST_ID, status: 'active' }],
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Du decodierst die Frequenzen des Knisterns. Eine Nachricht aus der Vergangenheit: "In Salzgitter wird die Grenze brechen. Vereint die Band."'
        );
        currentStore.discoverLore('kamin_prophecy');
        completeForgottenLoreQuest();
        currentStore.increaseBandMood(15, 'dialogues_kaminstube_fireplace_69');
        currentStore.increaseSkill('technical', 3);
      },
    });

    options.push({
      text: 'Versuche, die Sprache zu deuten. [Diplomat]',
      requiredTrait: 'Diplomat',
      questDependencies: [{ id: FORGOTTEN_LORE_QUEST_ID, status: 'active' }],
      action: () => {
        const currentStore = game();
        currentStore.setDialogue(
          'Du verstehst das Flüstern! Es erzählt von einem versteckten Archiv unter der Bühne, das die wahren Ursprünge des Industrial Metal enthält. Du hast die Lore entschlüsselt.'
        );
        currentStore.discoverLore('kamin_prophecy');
        completeForgottenLoreQuest();
        currentStore.increaseBandMood(20, 'dialogues_kaminstube_fireplace_85');
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
