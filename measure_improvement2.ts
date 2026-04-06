import { performance } from 'perf_hooks';
import { useStore } from './src/store';

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

  const startTimeOld = performance.now();
  let oldHits = 0;
  for (let i = 0; i < iterations; i++) {
    if (oldCombineItemsLookup('Frequenzfragment', 'NonExistentItem2')) {
        oldHits++;
    }
  }
  const endTimeOld = performance.now();

  // Actually, store.combineItems involves a LOT of extra logic inside if we mock it wrong.
  // Wait, let's look at `store.combineItems` early exit
  // `const key = item1 < item2 ? \`\${item1}|\${item2}\` : \`\${item2}|\${item1}\`;`
  // `const recipe = RECIPE_LOOKUP[key];`
  // `if (!recipe) return false;`

  // To do an apple-to-apple comparison, let's do exactly what we did before.

  const RECIPE_LOOKUP: Record<string, Recipe> = Object.create(null);
  for (const r of RECIPES) {
    const i1 = r.ingredients[0];
    const i2 = r.ingredients[1];
    const key = i1 < i2 ? `${i1}|${i2}` : `${i2}|${i1}`;
    RECIPE_LOOKUP[key] = r;
  }

  const startTimeNew = performance.now();
  let newHits = 0;
  for (let i = 0; i < iterations; i++) {
    const item1 = 'Frequenzfragment';
    const item2 = 'NonExistentItem2';
    const key = item1 < item2 ? `${item1}|${item2}` : `${item2}|${item1}`;
    const recipe = RECIPE_LOOKUP[key];
    if (recipe) newHits++;
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
