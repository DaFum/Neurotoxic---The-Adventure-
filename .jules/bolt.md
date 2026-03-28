## 2024-03-28 - Object Creation in useFrame
**Learning:** Instantiating objects like `new THREE.Vector3()` inside `useFrame` creates garbage collection pressure and can lead to micro-stutters, especially if the component is used multiple times in the scene.
**Action:** Always use `useRef(new THREE.Vector3()).current` to cache and reuse vectors in animation loops.
