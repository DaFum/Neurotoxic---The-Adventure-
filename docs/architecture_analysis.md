## Comprehensive Architecture Analysis



### **1. GAME.TSX - The Core Orchestrator**

**Role in Architecture:**

- Main entry point and scene manager (menu → 6 playable scenes)

- Handles trait selection and skill initialization

- Controls scene transitions, audio cues, and pause state

- Wraps canvas with physics and keyboard controls

- Renders UI and WorldEvents as global systems

**Non-obvious Patterns & Constraints:**

- **Trait selection locking:** Skills are applied during trait selection (line 160), not modifiable later. An agent adding traits later would bypass initial skill setup

- **Scene-based ambient audio:** Audio switches automatically based on `scene` state (lines 51-56). Changing scenes without proper audio cleanup could cause audio bleeding

- **Physics pause propagation:** `isPaused` state pauses Physics entirely (line 216). This prevents all movement and interactions, not just player input

- **AnimatePresence key:** The outer AnimatePresence uses `key={scene}` (line 199), meaning ALL non-menu content re-mounts on scene change, not just the scene component

- **Canvas suspense fallback:** `Suspense fallback={null}` (line 215) means no loading state. Scene loading issues won't be visible

**Interactions with Other Components:**

- **With Player/Interactable:** Provides keyboard controls and paused state via context

- **With WorldEvents:** Detects scene changes to trigger audio/mood events

- **With UI:** Passes dialogue, inventory, and quest data; receives pause/scene commands

- **With Scenes:** Only one scene renders at a time via conditional rendering

**Gotchas for Agents:**

1. **Don't add dialogue/quests during trait selection** - the modal is outside the game loop and modal closes automatically on trait selection

2. **Scene transitions cause full component remounting** - any timeouts/intervals in scenes need cleanup

3. **Physics.paused affects entire simulation** - can't pause individual objects, all bodies freeze

4. **Keyboard controls only exist inside Canvas** - input binding requires KeyboardControls context

---

### **2. UI.TSX - The Peripheral Display & Interaction Layer**

**Role in Architecture:**

- Displays game state (location, mood, skills, inventory, quests, lore)

- Manages dialogue system with typewriter effect and branching options

- Provides inventory combination UI

- Handles pause menu and lore codex

- Controls focus management and accessibility

**Non-obvious Patterns & Constraints:**

- **Dialogue string coercion (line 156):** `setDialogue()` can accept string, object, or null. Strings are auto-wrapped: `if (typeof dialogue === 'string') dialogue = { text: dialogue }`. Scenes must use proper object syntax for options

- **Typewriter urgency system (line 124):** Urgency 1=fast (15ms), 2=medium (30ms), 3=slow (50ms). Higher urgency = faster text. Counterintuitive naming

- **Option locking is client-side only:** UI checks skill/trait/quest requirements but doesn't prevent action execution. If an action bypasses the UI, it executes regardless

- **combineItems returns boolean:** It silently fails if items don't combine (line 154-161). Agent must check return value

- **Auto-close on option select:** Options auto-close unless `closeOnSelect: false` is set (line 544). Dialogue chains require explicit `nextDialogue`

- **Lore codex auto-closes on pause exit:** Line 63-66 forces closure when unpaused. Can't browse lore while paused if this changes

- **selectedItems limited to 2:** Hard-coded max of 2 items (line 147). Combining 3+ items requires multiple steps

- **Focus trap in lore codex:** Lines 82-111 implement tab trapping inside lore dialog. Escape key bypasses it (line 83-87)

**Interactions with Other Components:**

- **With Store:** Reads dialogue, inventory, quests, skills, bandMood; writes dialogue, flags, quests

- **With Interactables:** Receives interaction triggers that set dialogue

- **With WorldEvents:** Watches bandMood to control glitch overlay intensity

**Gotchas for Agents:**

1. **Don't set dialogue to string + options simultaneously** - string will be auto-wrapped, options will be lost

2. **Option actions execute BEFORE dialogue check** - if action changes dialogue, `nextDialogue` won't override it (line 534-545)

3. **combineItems success is silent** - no feedback unless you explicitly set dialogue on success

4. **Skill requirements check `>=` level** - a skill of 3 satisfies requirement of `<= 3`

5. **Quest dependency check is exact match** - must complete EXACT quest IDs, not partial matches

6. **Closed button has no close-on-escape** - only lore codex has Escape handler

---

### **3. PLAYER.TSX - Character Controller & Camera System**

**Role in Architecture:**

- Handles player movement via keyboard controls

- Manages player position and bounds

- Controls camera follow with procedural shake

- Provides movement feedback (footsteps, particles, sprite animation)

**Non-obvious Patterns & Constraints:**

- **Bounds enforce hard clamp:** Movement outside bounds is clamped, not blocked (lines 87-91). Player slides against invisible walls

- **Initial position snapping:** Player position is set once on mount (lines 41-45) using `useStore.getState()`. Changing `initialPos` after mount has no effect

- **Camera position via lerp:** Camera smoothly follows with 0.1 lerp factor (lines 103-106). Very sluggish by design

- **Velocity reuse pattern:** Velocity vector is reused every frame via `.set()` not `new` (line 53). This is optimization to reduce GC

- **Y velocity preservation:** Y velocity is read from rigidbody every frame (line 80). Gravity acts normally but horizontal control is absolute

- **Footstep timer is local:** Timer persists across frames (line 37). Plays every ~0.3s while moving (line 74)

- **Camera shake global:** CameraShake is stored state, not local. Multiple entities can trigger shake that stacks temporally (not spatially)

- **Facing right state is visual only:** No gameplay logic depends on `facingRight`, just sprite flipping (line 139)

**Interactions with Other Components:**

- **With Interactables:** Interactables read player position from store (line 43) to calculate range

- **With Game:** Receives isPaused state; paused state doesn't stop Player component, just Physics

- **With WorldEvents:** WorldEvents can trigger camera shake via `setCameraShake`

**Gotchas for Agents:**

1. **Don't expect collision prevention** - bounds are soft clamps, not colliders

2. **Camera follow is delayed** - set camera position and it will lerp to target

3. **Initial position is set once** - changing it mid-game requires manual `bodyRef.current.setTranslation()`

4. **Gravity always acts** - can't rely on Y velocity, it will fall

5. **Footstep timer continues across scenes** - very long movement in one scene could cause audio delay in next

6. **Camera shake is frame-based decay** - at 60fps, 0.2 shake decays in ~0.13 seconds

---

### **4. INTERACTABLE.TSX - Stateful Interactive Objects**

**Role in Architecture:**

- Represents interactive world objects (NPCs, items, mechanisms)

- Handles hover/range detection and visual feedback

- Triggers dialogue and actions on interaction

- Displays idle animations based on object type

**Non-obvious Patterns & Constraints:**

- **Range hardcoded to 4.0:** Interaction range is fixed (line 45). Not customizable per interactable

- **Hover state is canvas-relative:** Hover state is per-mesh in 3D space, not UI overlay. Moving mouse between objects rapidly causes state churn

- **isBandMember animations scale with mood:** Idle animations (headbang/tap/sway) have moodFactor (line 49). Higher mood = more intense animation

- **Idle animations bypass normal Y position:** isBandMember objects ignore the base Y position bob (lines 51-61). Non-members always bob at base Y

- **Distance calculation runs every frame:** `useFrame` calculates distance to player every frame (line 44). No caching, could be expensive with many interactables

- **onInteract is fire-and-forget:** No acknowledgment if interaction succeeds or fails beyond the local `interacted` state

- **Interacted flag is 500ms bloom:** Line 71 resets `interacted` after 500ms. Purely visual, not logic-critical

- **Range pulse glow is independent:** Glow effect (line 103) doesn't depend on hover, just range

- **Click stops propagation (line 86):** `e.stopPropagation()` prevents other canvas clicks from firing

**Interactions with Other Components:**

- **With Player:** Reads player position to calculate distance

- **With UI:** Calls `onInteract` callback which usually sets dialogue

- **With Store:** Reads isPaused and bandMood; can trigger dialogue and camera shake

- **With Audio:** Plays interaction sound on click

**Gotchas for Agents:**

1. **Don't expect per-interactable range tuning** - hardcoded to 4.0 units globally

2. **Mood animations are framerate-dependent** - sin-based animations will vary with delta time

3. **Distance calculation runs even when paused** - `useFrame` ignores isPaused, only Player does

4. **Multiple interactables can trigger simultaneously** - if player clicks two at once, both `onInteract` callbacks fire

5. **Hover feedback loops with rapid mouse movement** - flickering between objects is possible

6. **Interacted glow is visual noise only** - doesn't indicate success/failure to dialogue system

---

### **5. WORLDEVENTS.TSX - Global State Event Reactor**

**Role in Architecture:**

- Watches bandMood and triggers side effects

- Controls music tempo scaling

- Injects camera shake based on mood

**Non-obvious Patterns & Constraints:**

- **Music tempo formula is linear:** `250 - (bandMood * 1)` (line 23). At mood 0 = 250ms (120 BPM), at mood 100 = 150ms (200 BPM). Outside this range breaks assumptions

- **Tempo updates every bandMood change:** No debouncing, every mood point updates tempo. Could cause audio stuttering if mood changes rapidly

- **Random shake threshold is 70%:** Shake only triggers if `bandMood > 70` (line 27). Below that, no random events

- **Shake probability is 30% (line 29):** `Math.random() > 0.7` means 30% chance per 2-second interval. Shake probability is not proportional to mood

- **Shake magnitude is fixed 0.3:** All random shakes are exactly 0.3 intensity (line 30). Not scaled by mood

- **Interval cleanup is critical:** Line 33 cleanup prevents double-interval stacking on rerenders. Missing cleanup = memory leak

**Interactions with Other Components:**

- **With Store:** Reads bandMood; writes cameraShake

- **With Audio:** Calls `audio.setTempo()`

- **With Player:** Indirectly triggers camera shake which Player reads

**Gotchas for Agents:**

1. **Don't change bandMood rapidly** - will cause tempo to jump, sounding like audio glitch

2. **Don't expect mood-proportional camera shake** - shake is binary (none vs fixed 0.3)

3. **Shake interval re-creates on every mood change** - cleanup is correct but could be optimized

4. **Music tempo can go negative** - if mood > 250, tempo becomes negative (undefined behavior)

5. **No max cap on bandMood** - theoretically unbounded, could break music at extreme values

---

## **Critical Cross-Component Gotchas**

1. **Store mutations are async during renders:** `useStore.getState()` reads current state but doesn't trigger rerenders. Dialogue set during option action won't reflect until next event loop.

2. **Scene remounting on transition:** When you change scenes, ALL components in the old scene unmount and new ones mount. Any `setTimeout`/`setInterval` from old scene will fire in new scene context.

3. **Physics is all-or-nothing paused:** Can't pause individual objects. When game is paused, nothing moves. Interactables still update state in `useFrame` but physics don't apply.

4. **Dialogue string auto-coercion is lossy:** Converting string to dialogue object loses options. Must always pass full object if options needed.

5. **Skill requirements are checked at display time:** UI renders locked options based on current skills. If skills change mid-dialogue, options don't re-evaluate until dialogue closes and reopens.

6. **Range detection has no spatial partitioning:** Every interactable calculates distance to player every frame. With 20+ interactables, this becomes expensive.

7. **Camera shake is temporal only:** Multiple shake sources don't combine spatially, only decay temporally. Last shake wins.

8. **Inventory has no quantity tracking:** Items are stored as strings in array. Can't have "2x Rostiges Plektrum", only duplicates in array.



