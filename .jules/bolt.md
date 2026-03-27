## 2025-03-03 - R3F `useFrame` hot path allocations
**Learning:** In React Three Fiber (R3F) applications, instantiating `THREE.Vector3` objects inside the `useFrame` loop (e.g., `new THREE.Vector3().distanceTo()`) creates significant garbage collection pressure, leading to stuttering as it runs on every frame for every instance of the component.
**Action:** Use `useRef` to cache and reuse `Vector3` instances, and update their values with `.set()`. Furthermore, replace expensive operations like `.distanceTo` (which uses `Math.sqrt`) with `.distanceToSquared` for faster comparisons.
