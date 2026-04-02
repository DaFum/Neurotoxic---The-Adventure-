const { performance } = require('perf_hooks');

const stack = new Error().stack;

function original() {
  const lines = stack.split('\n').map((line) => line.trim());
  const sourceLine = lines.find(
    (line) =>
      line &&
      !line.includes('deriveBandMoodGainSource') &&
      !line.includes('increaseBandMood') &&
      !line.includes('store.ts') &&
      !line.includes('zustand') &&
      !line.includes('at set')
  );
  return sourceLine ?? 'unknown_source';
}

function optimized() {
  const lines = stack.split('\n');
  const sourceLine = lines.find((rawLine) => {
    const line = rawLine.trim();
    return (
      line &&
      !line.includes('deriveBandMoodGainSource') &&
      !line.includes('increaseBandMood') &&
      !line.includes('store.ts') &&
      !line.includes('zustand') &&
      !line.includes('at set')
    );
  });
  return sourceLine ? sourceLine.trim() : 'unknown_source';
}

const ITERATIONS = 100000;

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  original();
}
let end = performance.now();
console.log(`Original: ${end - start} ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  optimized();
}
end = performance.now();
console.log(`Optimized: ${end - start} ms`);
