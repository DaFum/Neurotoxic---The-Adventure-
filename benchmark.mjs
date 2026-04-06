const inventoryCounts = {};
for (let i = 0; i < 1000; i++) {
  inventoryCounts[`item_${i}`] = Math.floor(Math.random() * 10);
}

function runTwoLoops() {
  const result = [];
  for (const item in inventoryCounts) {
    result.push({ item, count: inventoryCounts[item] });
  }
  let sum = 0;
  for (const item in inventoryCounts) {
    sum += inventoryCounts[item];
  }
  return { result, sum };
}

function runOneLoop() {
  const result = [];
  let sum = 0;
  for (const item in inventoryCounts) {
    const count = inventoryCounts[item];
    result.push({ item, count });
    sum += count;
  }
  return { result, sum };
}

let start = performance.now();
for (let i = 0; i < 10000; i++) {
  runTwoLoops();
}
let end = performance.now();
console.log(`Two loops: ${end - start} ms`);

start = performance.now();
for (let i = 0; i < 10000; i++) {
  runOneLoop();
}
end = performance.now();
console.log(`One loop: ${end - start} ms`);
