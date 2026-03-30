const { createStore } = require('zustand/vanilla');

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
for (let i = 0; i < 60 * 60; i++) { // 1 min of frames
  // Simulating movement where playerPos changes every frame
  store.getState().setPlayerPos([i * 0.01, 1, i * 0.01]);
}
console.timeEnd('Baseline (frequent calls)');
console.log(`Subscriptions triggered: ${subscriptionsTriggered}`);

// We want to optimize the caller side: only update playerPos in the store if it changes significantly,
// or wait, the issue says "Frequent React State Updates in Animation Loop".
// So in Player.tsx, setPlayerPos([clampedX, pos.y, clampedZ]) is called every frame.
// If the player is standing still, the store's deep comparison catches it and returns the same state,
// so no update is triggered.
// BUT if the player IS moving, setPlayerPos creates a NEW array every frame: `[clampedX, pos.y, clampedZ]`.
// Even if it changes, updating a React context or Zustand state 60 times a second can cause a re-render of components that listen to playerPos.
