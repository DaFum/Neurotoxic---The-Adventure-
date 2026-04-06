import { performance } from 'perf_hooks';
import { useStore, STORAGE_KEY } from './src/store';

function runBenchmark() {
  const store = useStore.getState();
  const iterations = 100000;

  console.log(`Running combineItems benchmark for ${iterations} iterations...`);

  const startTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    // Calling with non-existent ingredients so we hit the lookup logic but don't modify state
    store.combineItems('NonExistentItem1', 'NonExistentItem2');
  }
  const endTime = performance.now();

  const duration = endTime - startTime;
  console.log(`Baseline execution time: ${duration.toFixed(2)} ms`);
}

runBenchmark();
