## 2024-03-28 - Object Creation in useFrame
**Learning:** Instantiating objects like `new THREE.Vector3()` inside `useFrame` creates garbage collection pressure and can lead to micro-stutters, especially if the component is used multiple times in the scene.
**Action:** Cache vector objects using `useRef` to avoid re-instantiating them inside animation loops like `useFrame`. Update the cached vector's properties (e.g., using `.set()`) inside the loop.

## 2024-05-15 - Unconditional Zustand Updates in Animation Loops
**Learning:** Calling Zustand `set` functions unconditionally within `useFrame` (like `setPlayerPos([x, y, z])`) forces the creation of new arrays every frame (60fps), causing Zustand to see the value as "changed" and needlessly evaluating all subscribers' selectors across the entire app.
**Action:** Always check if the value has actually changed before returning a new object or array in Zustand's `set` callback. Returning the current `state` object tells Zustand to abort the update and skip notifying subscribers.

## 2024-05-18 - Unconditional React State Updates in Animation Loops
**Learning:** Calling React state setters (e.g., `setFacingRight(true)`) unconditionally inside high-frequency loops like `useFrame` forces React to trigger bailout mechanisms or re-renders at 60fps, even if the value hasn't logically changed.
**Action:** Always wrap `useState` setters in `useFrame` with strict equality checks (`if (newValue !== currentValue) setState(newValue)`) to prevent unnecessary reconciliation work and performance overhead.

## 2024-05-20 - Zustand useFrame Throttling
**Learning:** Updating continuous values like 3D positions in Zustand from `useFrame` will spam state subscribers and force component re-evaluations every frame during movement, even if the state reducer checks for shallow equality.
**Action:** Throttle continuous updates by maintaining a `useRef` of the last sent value. Calculate the delta (e.g., squared distance) and only dispatch a state update when the threshold is exceeded.
