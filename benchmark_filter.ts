import { performance } from 'perf_hooks';

const loreEntries = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  discovered: Math.random() > 0.5
}));

// Baseline using filter
const startFilter = performance.now();
for (let i = 0; i < 100; i++) {
  const count = loreEntries.filter(e => e.discovered).length;
}
const endFilter = performance.now();
console.log(`Baseline (filter): ${endFilter - startFilter} ms`);

// Optimization using manual loop
const startLoop = performance.now();
for (let i = 0; i < 100; i++) {
  let count = 0;
  for (let j = 0; j < loreEntries.length; j++) {
    if (loreEntries[j].discovered) count++;
  }
}
const endLoop = performance.now();
console.log(`Optimized (for loop): ${endLoop - startLoop} ms`);
