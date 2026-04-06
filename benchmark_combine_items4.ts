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
const RECIPE_DICT: Record<string, Recipe> = Object.create(null);
for (const r of RECIPES) {
  const i1 = r.ingredients[0];
  const i2 = r.ingredients[1];
  const key = i1 < i2 ? `${i1}|${i2}` : `${i2}|${i1}`;
  RECIPE_LOOKUP.set(key, r);
  RECIPE_DICT[key] = r;
}

function runBenchmark() {
  const iterations = 1000000;

  let hits = 0;

  const startTimeMapHit = performance.now();
  for (let i = 0; i < iterations; i++) {
    const item1 = 'Frequenzfragment';
    const item2 = 'Splitter der Leere';
    const key = item1 < item2 ? `${item1}|${item2}` : `${item2}|${item1}`;
    const recipe = RECIPE_LOOKUP.get(key);
    if (recipe) hits++;
  }
  const endTimeMapHit = performance.now();

  const startTimeDictHit = performance.now();
  for (let i = 0; i < iterations; i++) {
    const item1 = 'Frequenzfragment';
    const item2 = 'Splitter der Leere';
    const key = item1 < item2 ? `${item1}|${item2}` : `${item2}|${item1}`;
    const recipe = RECIPE_DICT[key];
    if (recipe) hits++;
  }
  const endTimeDictHit = performance.now();

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

  console.log(`Map (hits): ${(endTimeMapHit - startTimeMapHit).toFixed(2)} ms`);
  console.log(`Dict (hits): ${(endTimeDictHit - startTimeDictHit).toFixed(2)} ms`);
  console.log(`Array (hits): ${(endTimeArrayHit - startTimeArrayHit).toFixed(2)} ms`);
}

runBenchmark();
