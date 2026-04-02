import { performance } from 'perf_hooks';

interface Quest {
  id: string;
  text: string;
  status: string;
}

const quests: Quest[] = Array.from({ length: 100 }, (_, i) => ({
  id: `quest_${i}`,
  text: `Quest ${i}`,
  status: i % 2 === 0 ? 'active' : 'completed'
}));

// Baseline
const startBaseline = performance.now();
for (let i = 0; i < 100000; i++) {
  const openQuestCount = quests.filter((q) => q.status === 'active').length;
}
const endBaseline = performance.now();

// Optimized (reduce)
const startOptimizedReduce = performance.now();
for (let i = 0; i < 100000; i++) {
  const openQuestCount = quests.reduce((acc, q) => acc + (q.status === 'active' ? 1 : 0), 0);
}
const endOptimizedReduce = performance.now();

// Optimized (for loop)
const startOptimizedFor = performance.now();
for (let i = 0; i < 100000; i++) {
  let openQuestCount = 0;
  for (let j = 0; j < quests.length; j++) {
    if (quests[j].status === 'active') openQuestCount++;
  }
}
const endOptimizedFor = performance.now();

console.log(`Baseline (filter.length): ${endBaseline - startBaseline}ms`);
console.log(`Optimized (reduce): ${endOptimizedReduce - startOptimizedReduce}ms`);
console.log(`Optimized (for loop): ${endOptimizedFor - startOptimizedFor}ms`);
