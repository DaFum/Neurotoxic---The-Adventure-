import { performance } from 'perf_hooks';

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

const RECIPE_LOOKUP = new Map<string, Recipe>();
for (const r of RECIPES) {
  const i1 = r.ingredients[0];
  const i2 = r.ingredients[1];
  RECIPE_LOOKUP.set(i1 < i2 ? `${i1}|${i2}` : `${i2}|${i1}`, r);
}

function runBenchmark() {
  const iterations = 1000000;

  console.log(`Running combineItems benchmark for ${iterations} iterations...`);

  const startTimeArray = performance.now();
  let hits = 0;
  for (let i = 0; i < iterations; i++) {
    const item1 = 'NonExistentItem1';
    const item2 = 'NonExistentItem2';
    const recipe = RECIPES.find(
      (r) =>
        (item1 === r.ingredients[0] && item2 === r.ingredients[1]) ||
        (item1 === r.ingredients[1] && item2 === r.ingredients[0])
    );
    if (recipe) hits++;
  }
  const endTimeArray = performance.now();

  const startTimeMap = performance.now();
  for (let i = 0; i < iterations; i++) {
    const item1 = 'NonExistentItem1';
    const item2 = 'NonExistentItem2';
    const key = item1 < item2 ? `${item1}|${item2}` : `${item2}|${item1}`;
    const recipe = RECIPE_LOOKUP.get(key);
    if (recipe) hits++;
  }
  const endTimeMap = performance.now();

  const startTimeArrayHit = performance.now();
  for (let i = 0; i < iterations; i++) {
    const item1 = 'Frequenzfragment';
    const item2 = 'Splitter der Leere';
    const recipe = RECIPES.find(
      (r) =>
        (item1 === r.ingredients[0] && item2 === r.ingredients[1]) ||
        (item1 === r.ingredients[1] && item2 === r.ingredients[0])
    );
    if (recipe) hits++;
  }
  const endTimeArrayHit = performance.now();

  const startTimeMapHit = performance.now();
  for (let i = 0; i < iterations; i++) {
    const item1 = 'Frequenzfragment';
    const item2 = 'Splitter der Leere';
    const key = item1 < item2 ? `${item1}|${item2}` : `${item2}|${item1}`;
    const recipe = RECIPE_LOOKUP.get(key);
    if (recipe) hits++;
  }
  const endTimeMapHit = performance.now();


  console.log(`Array (misses): ${(endTimeArray - startTimeArray).toFixed(2)} ms`);
  console.log(`Map (misses): ${(endTimeMap - startTimeMap).toFixed(2)} ms`);
  console.log(`Array (hits): ${(endTimeArrayHit - startTimeArrayHit).toFixed(2)} ms`);
  console.log(`Map (hits): ${(endTimeMapHit - startTimeMapHit).toFixed(2)} ms`);
}

runBenchmark();
