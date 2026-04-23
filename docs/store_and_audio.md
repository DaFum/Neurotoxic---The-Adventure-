## Comprehensive Analysis

### 1. FULL STORE SHAPE AND ALL ACTIONS/STATE

**File:** `/home/user/Neurotoxic---The-Adventure-/src/store.ts`

**Core State:**

- `scene`: One of 'menu' | 'proberaum' | 'tourbus' | 'backstage' | 'void_station' | 'kaminstube' | 'salzgitter'

- `trait`: Selected player trait (Visionary, Technician, Brutalist, Diplomat, Mystic, Performer, Cynic) or null

- `skills`: Object with `{ technical: number, social: number, chaos: number }`

- `dialogue`: Current dialogue display (text + optional clickable options)

- `inventory`: Array of item strings (supports item combinations)

- `flags`: Large Record<string, boolean> tracking quest progression and story milestones (23+ flags)

- `playerPos`: [number, number, number] (3D position)

- `isPaused`: boolean for pause state

- `quests`: Array of { id, text, completed } - 9 main quests tracked

- `bandMood`: number (0-100) representing band morale

- `cameraShake`: number for screen effects

- `loreEntries`: Array of LoreEntry objects (10 entries, discoverable via flags)

**State Setters (Actions):**

- `setScene(scene)` - Sets scene AND resets playerPos to [0, 1, 0]

- `setTrait(trait)` - Sets selected trait

- `increaseSkill(skill, amount)` - Adds to skill value

- `setDialogue(dialogue | string | null)` - Sets dialogue; plays interact sound if non-null

- `addToInventory(item)` - Adds item, plays pickup sound

- `removeFromInventory(item)` - Removes item by value

- `hasItem(item)` - Checks inventory membership

- `combineItems(item1, item2)` - **Smart function**: Combines items (Cable+Tape=RepairCable, etc); 7 combinations defined

- `setFlag(flag, value)` - Sets boolean flag

- `setPlayerPos(pos)` - Updates player position

- `setPaused(paused)` - Toggles pause

- `addQuest(id, text)` - Adds or updates quest

- `completeQuest(id)` - Marks quest completed

- `increaseBandMood(amount)` - Increases mood capped at 100

- `setCameraShake(shake)` - Sets shake amount

- `discoverLore(id)` - Marks lore entry discovered (guards against re-discovery)

- `resetGame()` - Resets to initialState

---

### 2. PERSISTENCE MECHANISM (zustand persist middleware)

**File:** `/home/user/Neurotoxic---The-Adventure-/src/store.ts` (lines 173-371)

**Storage Key:** `'neurotoxic-game-storage'` (uses browser localStorage)

**Partialize (What Gets Saved):**

Only these fields are persisted:

```typescript

inventory, flags, quests, bandMood, loreEntries, trait, skills

```

NOT persisted: scene, playerPos, dialogue, isPaused, cameraShake. Hinweis: `bandMood` wird persistiert und überschreibt beim Rehydrate seinen Initialwert.

**Custom Merge Function (lines 290-316):**

This is CRITICAL for managing save compatibility:

1. **Quest Merging**: Preserves completion status from saved quests but allows new quests to be added in new game versions

2. **Lore Merging**: Same pattern - new lore entries from code are discovered:false, but previously discovered entries stay discovered

3. **Dynamic Quests**: If saved game has quests not in initialState, they're preserved

4. **Flags**: Spread syntax merges flags, with persisted flags overriding defaults

**Rehydration Migration (lines 318-368):**

Runs AFTER storage loads.

**GOTCHA:** The merge runs `onRehydrateStorage` callback with a setTimeout(0), allowing state updates AFTER initial hydration. This is crucial for migration logic.
The migration routines (legacy quest migration, feedback monitor flag consolidation, legacyLoreMigrated flag handling) are guarded by idempotency checks (e.g., checking `legacyLoreMigrated` or the existing consolidated flag before applying changes) to ensure that future/repeated rehydrations are safe and don't re-run migrations unnecessarily.

---

### 3. AUDIO MANAGEMENT

**File:** `/home/user/Neurotoxic---The-Adventure-/src/audio.ts`

**AudioEngine Class (Singleton Pattern):**

```typescript

export const audio = new AudioEngine();

```

**Properties:**

- `ctx`: AudioContext (WebAudio API)

- `tempo`: Number (default 250ms) - controls music speed

- `isPlayingMusic`: boolean flag

- `currentAmbient`: Current ambient track type or null

- `musicInterval`, `ambientInterval`: setInterval IDs for loop management

**Key Methods:**

1. **init()** - Initializes AudioContext if not exists; resumes suspended context

2. **playTone(freq, type, duration, vol)** - Low-level tone generator using OscillatorNode + GainNode

3. **Sound Effects** (all call init internally):
   - `playInteract()` - 440Hz + 880Hz square waves (dialogue interaction)

   - `playPickup()` - Sawtooth sweep 300→400→500→800Hz (item pickup)

   - `playFootstep()` - Low sine burst ~60Hz

   - `playInteraction()` - 1200Hz + 1600Hz sine (UI feedback)

   - `playTypewriter()` - Random 600-800Hz sine (text typing)

4. **Ambient Tracks** (scene-specific, loop every 1000ms except Kaminstube=100ms):
   - `proberaum`: Muffled thumping (40Hz sine)

   - `tourbus`: Engine hum (50Hz sine)

   - `backstage`: Crowd chatter simulation (200-250Hz sine)

   - `void_station`: Cosmic glitches (800-2800Hz sawtooth + 20-50Hz square)

   - `kaminstube`: Fire crackling (complex bandpass filter on sawtooth)

   - `salzgitter`: City hum (60Hz sine with occasional 200-300Hz bursts)

5. **Music System**:
   - `startMusic()` - Plays hardcoded bassline + kick + snare pattern

   - Bassline: [A1, A1, C2, A1, D2, A1, E2, C2] repeating

   - Kick on even steps, snare on step%4===2

   - `setTempo(newTempo)` - Changes BPM; restarts music if playing

**Used in store.ts:**

- `audio.playInteract()` - When dialogue set

- `audio.playPickup()` - When item added or combined

**Used in Game.tsx:**

- `audio.startAmbient(scene)` - When scene changes (NOT on menu)

- `audio.stopAmbient()` - When entering menu

- `audio.startMusic()` - When trait selected at game start

---

### 4. NON-OBVIOUS PATTERNS, CONVENTIONS, GOTCHAS

#### A. Item Combination System

- `combineItems()` checks BOTH orders: (A,B) OR (B,A) for flexibility

- 7 combinations hardcoded but easily extensible

- Removes both items and adds new item in ONE state update

- Plays pickup sound on successful combination

#### B. Dialogue System

- Can pass string or full Dialogue object to `setDialogue()`

- If string, auto-wraps in `{ text: string }` object

- DialogueOption supports conditional requirements: `requiredSkill`, `requiredTrait`, `questDependencies`

- Options can chain to next dialogue OR close on select OR trigger actions

#### C. Quest Deduplication

- `addQuest()` filters out old quest with same ID before adding
  - Line 257: `...state.quests.filter(q => q.id !== id), { id, text, completed: false }`

- This allows replacing quest text without duplicates

#### D. Lore Discovery Guard

- `discoverLore()` explicitly checks if already discovered (line 268)

- Returns unchanged state if already discovered - prevents unnecessary updates

- Used by both flags and direct lore discovery

#### E. Scene Transitions

- `setScene()` ALWAYS resets playerPos to [0, 1, 0]

- This is critical for consistent spawn behavior across scenes

- Scenes must be ready to receive player at this position

#### F. Audio Context Lifecycle

- AudioContext can be "suspended" on some browsers - `init()` handles resume

- All sound methods call `init()` internally (defensive coding)

- Intervals checked for `this.ctx.state !== 'running'` to handle suspensions gracefully

#### G. Persistence Merge Strategy

- Uses `partialize` to select fields (don't persist dialogue/isPaused)

- Custom `merge` function combines old + new state intelligently

- `onRehydrateStorage` callback for POST-load migrations via setTimeout

- This pattern supports adding new quests/lore without breaking saves

#### H. Trait Selection Initialization

- Traits assigned BEFORE scene transition (Game.tsx line 160)

- Skills increased via direct `getState()` call in event handler

- Then music starts, then scene changes

- Order matters: trait → skills → music → scene

#### I. Pause Behavior

- Escape key toggles pause, but only if NOT on menu (Game.tsx line 60)

- Physics simulation pauses via `<Physics paused={isPaused}>`

- Ambient continues playing during pause (no audio pause logic)

#### J. Store Comments Document History

- File has `#1 UPDATES`, `#2 NEXT STEPS`, `#3 ERRORS & SOLUTIONS` sections

- These track implementation notes and known workarounds

- Example: "removeFromInventory not found in TourBus.tsx. Solution: Destructured removeFromInventory from useStore."

---

### 5. APP BOOTSTRAP SEQUENCE

**Entry Point:** `/home/user/Neurotoxic---The-Adventure-/src/main.tsx`

1. React 18 `createRoot()` on `#root` DOM element

2. Wraps App in `<StrictMode>` (development mode safety)

3. Renders `/src/App.tsx`

**App Component:** `/home/user/Neurotoxic---The-Adventure-/src/App.tsx`

- Pure wrapper: simply renders `<Game />`

**Game Component Bootstrap:** `/home/user/Neurotoxic---The-Adventure-/src/components/Game.tsx`

**Initialization Flow:**

1. Zustand store hydrates from localStorage (auto on create)
   - Merge function reconciles old + new state

   - onRehydrateStorage migrations run async (setTimeout)

2. Game component renders

3. useEffects execute:
   - Effect 1 (line 50-56): Watches `scene` state
     - Starts ambient audio for non-menu scenes

     - Stops ambient for menu

   - Effect 2 (line 58-66): Sets up Escape key listener
     - Toggles `isPaused` state

4. **Menu Screen Flow** (if scene === 'menu'):
   - Displays animated "NEUROTOXIC" title

   - Shows "Initialize_Tour" button

   - Clicking opens trait selection modal

   - Trait selection triggers:

     a. `setTrait(traitId)`

     b. Loop through trait's skills and `increaseSkill()`

     c. `audio.startMusic()` - begins hardcoded bassline loop

     d. `setSelectingTrait(false)` - closes modal

     e. `setScene('proberaum')` - transitions to game

5. **Game Scene Rendering** (if scene !== 'menu'):
   - Three.js `<Canvas>` with:
     - Camera at [0, 5, 10]

     - `<KeyboardControls>` for WASD/arrows

     - `<Physics>` with gravity [0, -9.81, 0], paused={isPaused}

   - Scene component renders based on `scene` state (6 scene components)

   - Renders `<WorldEvents>` + `<UI>` overlay components

**Critical State Flow:**

```typescript

localStorage → zustand hydrate → merge + migration

    ↓

Game mounts → scene is forced to menu during merge

    ↓

    Show menu, wait for trait selection

```

---

### KEY ARCHITECTURAL INSIGHTS FOR AGENTS

1. **Persistence is smart**: New quests/lore added in code won't overwrite player progress due to merge function

2. **Audio is lazy-loaded**: AudioContext only created on first sound - no overhead for silent scenes

3. **Scene transitions reset position**: Always true - design every scene around [0, 1, 0] entry point

4. **Trait selection is the real game init**: This is where skills are granted and music starts

5. **Flags are the quest backbone**: Every quest completion/milestone tracked here, drives dialogue/lore

6. **Three-tier audio**: Effects (playInteract/pickup) + Ambient (scene loops) + Music (global bassline)

7. **Dialogue supports conditional logic**: questDependencies, requiredTrait, requiredSkill check at render time

8. **Item combinations are reversible**: Order-agnostic matching for UX

9. **Lore discovery is idempotent**: Calling discoverLore() twice on same ID is safe

10. **Physics pauses with game**: Escape key pauses physics + allows resume mid-scene
