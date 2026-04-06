import { performance } from 'perf_hooks';
import { useStore, STORAGE_KEY } from './src/store';

function runBenchmark() {
  const store = useStore.getState();
  const iterations = 1000000;

  store.addToInventory('Frequenzfragment');
  store.addToInventory('Splitter der Leere');

  console.log(`Running combineItems benchmark for ${iterations} iterations...`);

  // Testing the lookup performance when items are not present in inventory,
  // or testing a failing lookup that iterates through all items
  const startTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    store.combineItems('NonExistentItem1', 'NonExistentItem2');
  }
  const endTime = performance.now();

  const duration = endTime - startTime;
  console.log(`Baseline execution time (misses): ${duration.toFixed(2)} ms`);
}

runBenchmark();
