import { performance } from 'perf_hooks';

interface Quest {
  id: string;
  text: string;
  status: string;
}

const quests: Quest[] = Array.from({ length: 100 }, (_, i) => ({
  id: `quest_${i}`,
  text: `Quest ${i}`,
  status: 'active'
}));

const questDeps = Array.from({ length: 10 }, (_, i) => `quest_${i * 10}`);

// Baseline
const startBaseline = performance.now();
for (let i = 0; i < 10000; i++) {
  const titles = questDeps.map((dep) => {
    return quests.find(q => q.id === dep)?.text || dep;
  });
}
const endBaseline = performance.now();

// Optimized
const startOptimized = performance.now();
for (let i = 0; i < 10000; i++) {
  const questMap = new Map<string, string>();
  for (const q of quests) {
    if (q?.id) questMap.set(q.id, q.text);
  }
  const titles = questDeps.map((dep) => {
    return questMap.get(dep) || dep;
  });
}
const endOptimized = performance.now();

console.log(`Baseline: ${endBaseline - startBaseline}ms`);
console.log(`Optimized (per render Map): ${endOptimized - startOptimized}ms`);

// Pre-optimized (useMemo equivalent)
const questMap = new Map<string, string>();
for (const q of quests) {
  if (q?.id) questMap.set(q.id, q.text);
}
const startUseMemo = performance.now();
for (let i = 0; i < 10000; i++) {
  const titles = questDeps.map((dep) => {
    return questMap.get(dep) || dep;
  });
}
const endUseMemo = performance.now();
console.log(`Optimized (useMemo Map): ${endUseMemo - startUseMemo}ms`);
