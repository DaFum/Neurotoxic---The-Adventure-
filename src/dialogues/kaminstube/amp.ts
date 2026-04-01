import { type Dialogue } from '../../store';
import { game, say } from '../shared/helpers';

export function buildKaminstubeTubePickupDialogue(): Dialogue {
  const store = game();
  const pickedUpTube = store.addToInventory('Röhre');

  if (pickedUpTube) {
    return say('Du hast eine Ersatzröhre für den Amp gefunden!');
  }

  return say('Du kannst gerade keine weitere Ersatzröhre tragen.');
}

export function buildKaminstubeAmpDialogue(): Dialogue {
  const store = game();

  if (!store.hasItem('Röhre')) {
    return say('Der Amp ist stumm. Eine Röhre scheint durchgebrannt zu sein.');
  }

  if (!store.quests.find((quest) => quest.id === 'amp')) {
    store.addQuest('amp', 'Repariere Matzes Amp mit einer Ersatzröhre');
  }

  store.removeFromInventory('Röhre');
  store.setFlag('ampFixed', true);
  store.completeQuest('amp');
  store.increaseBandMood(30);

  return say('Du hast die Röhre ausgetauscht. Der Amp funktioniert wieder!');
}
