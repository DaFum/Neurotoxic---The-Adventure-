import { type Dialogue } from '../../store';
import { game, say } from '../shared/helpers';

export function buildKaminstubeWirtPreludeDialogue(): Dialogue | null {
  const store = game();

  if (store.flags.kaminstube_wirt_betrayal) {
    return say(
      'Wirt: "Verschwinde. Der Lärm hat diese Stadt schon einmal ruiniert."'
    );
  }

  if (store.flags.bassist_contacted && !store.flags.bassist_clue_wirt) {
    return {
      text: 'Wirt: "Ihr habt also den Bassisten gefunden... In der Frequenz. Ich wusste, dass er nicht einfach weggelaufen ist. Verdammt, ich schulde euch eine Erklärung."',
      options: [
        {
          text: 'Zwinge ihn zur Wahrheit. [Social 8]',
          requiredSkill: { name: 'social', level: 8 },
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Wirt: "Okay! Ich war es. Ich habe den Amp manipuliert, der ihn in die Leere riss. Der Sound war zu gefährlich. Es tut mir leid."'
            );
            currentStore.setFlag('bassist_clue_wirt', true);
            currentStore.discoverLore('wirt_confession');
            currentStore.increaseBandMood(20, 'id_6562f566');
            currentStore.increaseSkill('social', 5);
          },
        },
        {
          text: 'Drohe ihm mit dem Lärm. [Brutalist]',
          requiredTrait: 'Brutalist',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Wirt: "Nicht! Beschwöre nicht die Maschinen! Ich bekenne! Ich sabotierte den Gig 1982, um die Stadt zu schützen!"'
            );
            currentStore.setFlag('bassist_clue_wirt', true);
            currentStore.discoverLore('wirt_vergangenheit');
            currentStore.increaseBandMood(15, 'id_104745e6');
            currentStore.increaseSkill('chaos', 5);
          },
        },
        {
          text: 'Verzeihe ihm. [Diplomat]',
          requiredTrait: 'Diplomat',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Wirt: "Du hast ein weiches Herz für einen Manager. Ich wollte nur, dass Tangermünde sicher bleibt. Hier, zur Wiedergutmachung..."'
            );
            currentStore.setFlag('bassist_clue_wirt', true);
            currentStore.discoverLore('wirt_vergangenheit');
            currentStore.addToInventory('Turbo-Koffein');
            currentStore.increaseBandMood(30, 'id_f3d9b24e');
          },
        },
      ],
    };
  }

  if (store.flags.wirtSecretItem) {
    return say(
      'Wirt: "Viel Erfolg beim Gig. Salzgitter wartet auf den Knall."'
    );
  }

  if (store.hasItem('Industrie-Talisman') && !store.flags.wirtSecretItem) {
    return {
      text: 'Wirt: "Das ist... der Talisman von 1982. Ich erkenne ihn sofort. Er war der Grund, warum wir die Gießerei schließen mussten. Hier, nimm das. Es gehört zum Set."',
      options: [
        {
          text: 'Was ist das?',
          action: () => {
            const currentStore = game();
            currentStore.setDialogue(
              'Wirt: "Ein Altes Plektrum. Es ist aus dem Knochen einer verstummten Sirene geschnitzt. Es wird Matze helfen, das Verbotene Riff zu bändigen. Er wird es brauchen."'
            );
            currentStore.addToInventory('Altes Plektrum');
            currentStore.setFlag('wirtSecretItem', true);
            currentStore.increaseBandMood(20, 'id_7619882f');
          },
        },
      ],
    };
  }

  return null;
}
