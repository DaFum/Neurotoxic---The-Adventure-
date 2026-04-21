import { type Dialogue } from '../../store';
import { say, game } from '../shared/helpers';

export function buildKaminstubeMariusDialogue(): Dialogue {
  const store = game();

  if (!store.flags.ampRepaired) {
    return say(
      'Marius: "Die Stille hier ist unerträglich. Sie erinnert mich an die Leere zwischen den Sternen. Wir müssen Lärm machen, Matze!"',
    );
  }

  if (store.flags.mariusEgoStrategy) {
    return say(
      'Marius: "Unsere Strategie funktioniert. Ich fühle mich... geerdet. Das Ego ist fokussiert wie ein Laser."',
    );
  }

  if (store.flags.egoContained) {
    return say(
      'Marius: "Mein Ego brennt in mir! Ich werde diese Menge verschlingen und als Lärm wieder ausspucken! Salzgitter wird unser Altar sein!"',
    );
  }

  return say(
    'Marius: "Underground Metal Fest! Wir bringen euch den Sound der Maschinen und das Echo der Verzweiflung!"',
  );
}
