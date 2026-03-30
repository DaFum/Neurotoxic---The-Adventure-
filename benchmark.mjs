import { createStore } from 'zustand/vanilla';

const store = createStore((set) => ({
  playerPos: [0, 1, 0],
  setPlayerPos: (playerPos) => set((state) => {
    if (
      state.playerPos[0] === playerPos[0] &&
      state.playerPos[1] === playerPos[1] &&
      state.playerPos[2] === playerPos[2]
    ) {
      return state;
    }
    return { playerPos };
  }),
}));

let subscriptionsTriggered = 0;
store.subscribe(() => {
  subscriptionsTriggered++;
});

console.time('Baseline (frequent calls)');
for (let i = 0; i < 60 * 60; i++) {
  store.getState().setPlayerPos([i * 0.01, 1, i * 0.01]);
}
console.timeEnd('Baseline (frequent calls)');
console.log(`Subscriptions triggered: ${subscriptionsTriggered}`);

// The optimization:
const optimizedStore = createStore((set) => ({
  playerPos: [0, 1, 0],
  setPlayerPos: (playerPos) => set((state) => {
    if (
      state.playerPos[0] === playerPos[0] &&
      state.playerPos[1] === playerPos[1] &&
      state.playerPos[2] === playerPos[2]
    ) {
      return state;
    }
    return { playerPos };
  }),
}));

let optimizedSubscriptionsTriggered = 0;
optimizedStore.subscribe(() => {
  optimizedSubscriptionsTriggered++;
});

// To optimize, maybe we don't dispatch to store unless distance > threshold
let lastSentPos = [0, 1, 0];
console.time('Optimized (thresholded calls)');
for (let i = 0; i < 60 * 60; i++) {
  const newPos = [i * 0.01, 1, i * 0.01];

  // Calculate distance squared to avoid Math.sqrt
  const dx = newPos[0] - lastSentPos[0];
  const dy = newPos[1] - lastSentPos[1];
  const dz = newPos[2] - lastSentPos[2];

  if (dx * dx + dy * dy + dz * dz > 0.05) { // Threshold
    optimizedStore.getState().setPlayerPos(newPos);
    lastSentPos = newPos;
  }
}
console.timeEnd('Optimized (thresholded calls)');
console.log(`Optimized Subscriptions triggered: ${optimizedSubscriptionsTriggered}`);
