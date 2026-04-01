import { type Dialogue } from '../../store';
import { game, say } from '../shared/helpers';

const FREQUENZ_1982_QUEST_ID = 'frequenz_1982';
const FREQUENZ_1982_QUEST_TEXT = 'Sammle die Frequenzfragmente von 1982';

type RitualActionWrapper = (
  mood: number,
  skillName: 'chaos' | 'social' | 'technical' | null,
  skillIncrease: number,
  dialogueText: string
) => void;

function hasCompletedFrequenz1982Quest(): boolean {
  const store = game();
  const questStatus = store.quests.find(
    (quest) => quest.id === FREQUENZ_1982_QUEST_ID
  )?.status;
  return questStatus === 'completed' || store.flags.frequenz1982_complete;
}

function completeFrequenz1982Quest(): void {
  game().completeQuestWithFlag(
    FREQUENZ_1982_QUEST_ID,
    'frequenz1982_complete',
    true,
    FREQUENZ_1982_QUEST_TEXT
  );
}

export function buildBackstageRitualCircleDialogue(
  ritualActionWrapper: RitualActionWrapper
): Dialogue {
  const store = game();
  const hasForbiddenRiff = store.hasItem('Verbotenes Riff');
  const hasPlasmaZunder = store.hasItem('Plasma-Zünder');
  const hasResonanz = store.hasItem('Resonanz-Kristall');

  if (store.flags.mariusCalmed && !store.flags.backstageRitualPerformed) {
    return {
      text: 'Manager: "Zeit für unser Ritual. Lasst uns die Energien bündeln."',
      options: [
        {
          text: 'Kosmisches Ritual. [Mystic]',
          requiredTrait: 'Mystic',
          action: () => {
            ritualActionWrapper(
              35,
              'chaos',
              5,
              'Ihr haltet euch an den Händen und channelt die Frequenzen der Void Station. Ein kosmisches Summen erfüllt den Raum.'
            );
          },
        },
        {
          text: 'Showmanship Ritual. [Performer]',
          requiredTrait: 'Performer',
          action: () => {
            ritualActionWrapper(
              30,
              'social',
              5,
              'Ein lauter Schlachtruf, eine Pose für unsichtbare Kameras. Die Energie ist elektrisierend!'
            );
          },
        },
        {
          text: 'Frequenz-Anpassung. [Technician]',
          requiredTrait: 'Technician',
          action: () => {
            ritualActionWrapper(
              25,
              'technical',
              5,
              'Ihr atmet exakt auf 120 BPM und stimmt eure inneren Frequenzen auf 432 Hz ab. Perfekte Synchronisation.'
            );
          },
        },
        {
          text: 'Einfacher Gruppen-Chant.',
          action: () => {
            ritualActionWrapper(
              15,
              null,
              0,
              'Ihr legt die Hände übereinander. "1, 2, 3... NEUROTOXIC!"'
            );
          },
        },
      ],
    };
  }

  if (hasCompletedFrequenz1982Quest()) {
    return say(
      'Der Kreis leuchtet stetig im Takt von 1982. Die Realität hat hier einen Riss.'
    );
  }

  const hasFrequenzfragment = store.hasItem('Frequenzfragment');

  if (hasResonanz && store.flags.backstage_blueprint_found) {
    return {
      text: 'Du hast den Resonanz-Kristall und die Blaupause. Der Ritual-Kreis pulsiert in einem unnatürlichen Takt.',
      options: [
        {
          text: 'Vollende die Frequenz von 1982. [Mystic]',
          requiredTrait: 'Mystic',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Du legst den Kristall in die Mitte. Ein dröhnender Bass geht durch den Raum. Du hast das Geheimnis der Gießerei entschlüsselt!'
            );
            completeFrequenz1982Quest();
            currentStore.discoverLore('frequenz_1982_decoded');
            currentStore.increaseBandMood(50);
            currentStore.removeFromInventory('Resonanz-Kristall');
          },
        },
        {
          text: 'Zerschmettere den Kristall im Zentrum! [Brutalist]',
          requiredTrait: 'Brutalist',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Du schleuderst den Kristall auf den Kreismittelpunkt. Er zersplittert in Scherben aus reiner Frequenz. Funken fliegen, die Realität weint. Die Frequenz gehört jetzt NEUROTOXIC!'
            );
            currentStore.removeFromInventory('Resonanz-Kristall');
            completeFrequenz1982Quest();
            currentStore.discoverLore('frequenz_1982_decoded');
            currentStore.increaseBandMood(40);
            currentStore.increaseSkill('chaos', 5);
          },
        },
        {
          text: 'Zurücktreten.',
          action: () => {
            game().setDialogue('Das ist zu gefährlich vor dem Gig.');
          },
        },
      ],
    };
  }

  if (hasFrequenzfragment && store.flags.backstage_blueprint_found) {
    return {
      text: 'Du hast das Frequenzfragment und die Blaupause. Der Ritual-Kreis summt latent.',
      options: [
        {
          text: 'Erzwinge die Frequenz mit purer Kraft! [Brutalist]',
          requiredTrait: 'Brutalist',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Du drückst das rohe Fragment ins Zentrum und schlägst darauf ein. Funken fliegen, die Realität weint. Die Frequenz gehört jetzt NEUROTOXIC!'
            );
            currentStore.removeFromInventory('Frequenzfragment');
            completeFrequenz1982Quest();
            currentStore.discoverLore('frequenz_1982_decoded');
            currentStore.increaseBandMood(40);
            currentStore.increaseSkill('chaos', 5);
          },
        },
        {
          text: 'Zurücktreten.',
          action: () => {
            game().setDialogue('Das ist zu gefährlich vor dem Gig.');
          },
        },
      ],
    };
  }

  if (hasPlasmaZunder) {
    return {
      text: 'Du benutzt den Plasma-Zünder. Die Kerzen flammen in einem unnatürlichen Blau auf! Marius: "WOAH! Das ist die krasseste Pyro, die wir je hatten! Ich bin bereit!"',
      options: [
        {
          text: 'Plasma-Zünder einsetzen.',
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(30);
            currentStore.removeFromInventory('Plasma-Zünder');
            currentStore.setDialogue(
              'Du benutzt den Plasma-Zünder. Die Kerzen flammen in einem unnatürlichen Blau auf! Marius: "WOAH! Das ist die krasseste Pyro, die wir je hatten! Ich bin bereit!"'
            );
          },
        },
      ],
    };
  }

  if (hasForbiddenRiff) {
    return {
      text: 'Das Verbotene Riff resoniert mit dem Ritual-Kreis.',
      options: [
        {
          text: 'Lass das Riff durch den Kreis hallen.',
          action: () => {
            const currentStore = game();
            currentStore.increaseBandMood(15);
            currentStore.setDialogue(
              'Der Ritual-Kreis beginnt schwarz zu leuchten, als du dich mit dem Verbotenen Riff näherst. Marius: "Spürst du das? Die Ahnen des Industrial Metal rufen uns!"'
            );
          },
        },
      ],
    };
  }

  if (store.flags.backstageRitualPerformed) {
    return say(
      'Die Kerzen brennen noch intensiver nach eurem Ritual. Ihr seid bereit.'
    );
  }

  if (!store.quests.find((quest) => quest.id === 'backstage_ritual')) {
    store.addQuest(
      'backstage_ritual',
      'Führe ein Bandritual vor dem Auftritt durch'
    );
    store.increaseBandMood(5);
  }
  return say(
    'Ein Kreis aus schwarzen Kerzen und zerbrochenen Plektren. Marius muss erst beruhigt werden, bevor ihr das Ritual abhalten könnt.'
  );
}
