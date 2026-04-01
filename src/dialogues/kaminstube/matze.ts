import { type Dialogue } from '../../store';
import { game, say } from '../shared/helpers';

export function buildKaminstubeMatzeDialogue(): Dialogue {
  const store = game();

  if (!store.flags.ampFixed) {
    return say(
      'Matze: "Mein Amp hat den Geist aufgegeben! Er hat wohl zu viel von der 432Hz-Energie aus der Void Station abbekommen."'
    );
  }

  if (!store.flags.tourbus_sabotage_discovered) {
    return say(
      'Matze: "Der Amp läuft wieder! Er klingt jetzt so dreckig wie ein Fabrikgelände im Ruhrpott. Perfekt."'
    );
  }

  if (store.flags.tourbus_matze_confession) {
    return say(
      'Matze: "Der Amp läuft... Ich spiele heute Abend nur für uns. Und für das Riff. Keine Angst, Manager."'
    );
  }

  return {
    text: 'Matze: "Der Amp läuft. Manager... über die Sache im Tourbus. Ich habe das Kabel zerschnitten. Ich hatte Panik, dass wir wie 1982 enden."',
    options: [
      {
        text: 'Wir stehen das gemeinsam durch. [Diplomat]',
        requiredTrait: 'Diplomat',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Matze: "Danke. Ich werde dich nicht enttäuschen. Die Röhren glühen wieder."'
          );
          currentStore.completeQuestWithFlag(
            'tourbus_saboteur',
            'tourbus_matze_confession'
          );
          currentStore.increaseBandMood(30);
        },
      },
      {
        text: 'Kein Fehler mehr, oder du fliegst. [Brutalist]',
        requiredTrait: 'Brutalist',
        action: () => {
          const currentStore = game();
          currentStore.setDialogue(
            'Matze: "Verstanden. Nur noch Hass und Lärm."'
          );
          currentStore.completeQuestWithFlag(
            'tourbus_saboteur',
            'tourbus_matze_confession'
          );
          currentStore.increaseBandMood(15);
        },
      },
    ],
  };
}
