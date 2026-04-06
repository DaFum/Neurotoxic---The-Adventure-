import { performance } from 'perf_hooks';
import { useStore } from './src/store';

// We mock RECIPES inside our benchmark to simulate the old performance.
interface Recipe {
  ingredients: [string, string];
  result: string;
}

const RECIPES: Recipe[] = [
  { ingredients: ['Defektes Kabel', 'Klebeband'], result: 'Repariertes Kabel' },
  { ingredients: ['Setliste', 'Stift'], result: 'Signierte Setliste' },
  { ingredients: ['Energiedrink', 'Kaffee'], result: 'Turbo-Koffein' },
  { ingredients: ['Schrottmetall', 'Lötkolben'], result: 'Industrie-Talisman' },
  { ingredients: ['Batterie', 'Lötkolben'], result: 'Plasma-Zünder' },
  { ingredients: ['Turbo-Koffein', 'Rostiges Plektrum'], result: 'Geister-Drink' },
  { ingredients: ['Splitter der Leere', 'Altes Plektrum'], result: 'Void-Plektrum' },
  { ingredients: ['Frequenzfragment', 'Splitter der Leere'], result: 'Resonanz-Kristall' },
];

function oldCombineItemsLookup(item1: string, item2: string) {
    const recipe = RECIPES.find(
        (r) =>
        (item1 === r.ingredients[0] && item2 === r.ingredients[1]) ||
        (item1 === r.ingredients[1] && item2 === r.ingredients[0])
    );
    return recipe !== undefined;
}


function runBenchmark() {
  const store = useStore.getState();
  const iterations = 1000000;

  console.log(`Running combineItems benchmark for ${iterations} iterations...`);

  // Testing the old lookup performance (array find)
  const startTimeOld = performance.now();
  let oldHits = 0;
  for (let i = 0; i < iterations; i++) {
    // using a non-matching item and a matching item to trigger the lookup but not hit a fast early return
    if (oldCombineItemsLookup('Frequenzfragment', 'NonExistentItem2')) {
        oldHits++;
    }
  }
  const endTimeOld = performance.now();

  // Testing the new lookup performance directly via store.combineItems
  // NOTE: store.combineItems returns early if the item is not found,
  // before mutating any state or throwing. This is equivalent to what oldCombineItemsLookup does.
  const startTimeNew = performance.now();
  for (let i = 0; i < iterations; i++) {
    store.combineItems('Frequenzfragment', 'NonExistentItem2');
  }
  const endTimeNew = performance.now();

  const durationOld = endTimeOld - startTimeOld;
  const durationNew = endTimeNew - startTimeNew;

  console.log(`Baseline execution time (array.find): ${durationOld.toFixed(2)} ms`);
  console.log(`Optimized execution time (dictionary): ${durationNew.toFixed(2)} ms`);

  const improvement = ((durationOld - durationNew) / durationOld) * 100;
  console.log(`Improvement: ${improvement.toFixed(2)}%`);
}

runBenchmark();
