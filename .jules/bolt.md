## 2024-03-28 - Object Creation in useFrame
**Learning:** Instantiating objects like `new THREE.Vector3()` inside `useFrame` creates garbage collection pressure and can lead to micro-stutters, especially if the component is used multiple times in the scene.
**Action:** Cache vector objects using `useRef` to avoid re-instantiating them inside animation loops like `useFrame`. Update the cached vector's properties (e.g., using `.set()`) inside the loop.

## 2024-05-15 - Unconditional Zustand Updates in Animation Loops
**Learning:** Calling Zustand `set` functions unconditionally within `useFrame` (like `setPlayerPos([x, y, z])`) forces the creation of new arrays every frame (60fps), causing Zustand to see the value as "changed" and needlessly evaluating all subscribers' selectors across the entire app.
**Action:** Always check if the value has actually changed before returning a new object or array in Zustand's `set` callback. Returning the current `state` object tells Zustand to abort the update and skip notifying subscribers.
