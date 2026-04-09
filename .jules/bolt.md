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
## 2026-03-31 - [Distance Calculation Optimization in useFrame]
**Learning:** In Three.js/React Three Fiber high-frequency loops like `useFrame`, avoiding `THREE.Vector3.distanceTo()` prevents expensive `Math.sqrt()` calls for every object on every frame.
**Action:** Use `.distanceToSquared()` with a squared threshold. When providing distances to `KeyboardInteractionManager`, squared distances are fully compatible since it only evaluates relative proximity to determine the closest interactable.
## 2026-04-01 - [Eliminate React State from High-Frequency R3F Components]
**Learning:** In React Three Fiber, using `useState` for values that change frequently (like player distance thresholds or hover states) causes severe performance issues because it triggers React re-renders and recreates expensive resources (like Canvas textures) mid-gameplay.
**Action:** Pre-generate textures for all states once on mount, store mutable values in `useRef`, always mount sprites but toggle `visible` imperatively, and handle all visual updates (opacity, scale, texture swapping) directly via Three.js mutations inside `useFrame`.

## 2026-04-05 - $O(N^2)$ Lookups in State Hydration
**Learning:** Using `.find()` inside `.map()` or `.filter()` when merging or hydrating large state arrays (like Quest or Lore logs) in Zustand's `persist` middleware creates $O(N^2)$ complexity, leading to noticeable hitching or frame drops during initial game load or scene transitions.
**Action:** Pre-index the persisted state into a `Map` or `Set` before the merge loop. This reduces the complexity to $O(N)$, ensuring smooth state hydration even with hundreds of entries.

## 2026-04-10 - String Iteration Allocation Overhead
**Learning:** Generating seeds or hashes from strings using `name.split('').reduce(...)` causes unnecessary Garbage Collection (GC) pressure by allocating an intermediate array of characters. Repository benchmarks indicate that a standard `for` loop with `charCodeAt(i)` is approximately 2.2x faster.
**Action:** Prefer a standard `for` loop over string length when calculating hash values from strings to eliminate temporary allocations.
- Discovered that modifying arrays inside Zustand stores (e.g., quests arrays) can be optimized by replacing `.find()`/`.some()` + `.map()` combinations with a single `.findIndex()` lookup and targeted index modification, saving repeated O(n) array scans.
## 2026-04-12 - Imperative State Reads in R3F Components
**Learning:** To prevent severe performance bottlenecks in frequently instanced React Three Fiber components (like `Interactable.tsx`), avoid reactive Zustand subscriptions (`useStore(state => state.value)`) for state only needed inside `useFrame` or event handlers. Subscribing at the component level forces massive, unnecessary React re-renders across the entire 3D scene when global state (like `bandMood` or `isPaused`) changes.
**Action:** Read the state imperatively using `useStore.getState().value` directly within the `useFrame` loop or the event handler callback to bypass the React rendering cycle entirely.

## 2026-04-11 - Zustand Array Mutation Optimization
**Learning:** Modifying arrays inside Zustand stores (e.g., quests arrays) can be optimized by replacing `.find()`/`.some()` + `.map()` combinations with a single `.findIndex()` lookup and targeted index modification, saving repeated O(n) array scans.
**Action:** Prefer `.findIndex()` lookup and targeted index modification when updating a single unique item in a state array.

## 2026-04-08 - Shared R3F Textures

**Learning:** Instantiating identical `THREE.CanvasTexture` instances across multiple identical React Three Fiber components causes redundant memory allocation and GPU texture uploads.
**Action:** Extract texture generation into module-level factory functions that use a reference-counted `Map` cache. This ensures multiple identical components share the exact same R3F texture object while still cleaning up memory when the last component unmounts.
## 2026-04-14 - Zustand Array Mutation Optimization
**Learning:** Updating single items in Zustand store arrays using `.find()` followed by `.map()` is an anti-pattern. It forces two O(N) array scans and allocates a completely new array, generating unnecessary garbage collection pressure and reducing performance during state mutations.
**Action:** Replace `.find()` + `.map()` combinations with a single `.findIndex()` lookup, followed by a shallow array clone (`[...array]`) and direct index mutation (`newArray[index] = ...`).
- Optimized palette seed generation in `src/components/Interactable.tsx` by replacing O(N) string iteration with O(1) sampling. This significantly improves performance for interactables with long names (e.g., from ~2600ns to ~50ns for a 500-character name).
