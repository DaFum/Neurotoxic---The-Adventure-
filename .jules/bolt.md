## 2024-03-28 - Object Creation in useFrame
**Learning:** Instantiating objects like `new THREE.Vector3()` inside `useFrame` creates garbage collection pressure and can lead to micro-stutters, especially if the component is used multiple times in the scene.
**Action:** Cache vector objects using `useRef` to avoid re-instantiating them inside animation loops like `useFrame`. Update the cached vector's properties (e.g., using `.set()`) inside the loop.
