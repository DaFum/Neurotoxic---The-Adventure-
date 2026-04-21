## COMPREHENSIVE SCENE ARCHITECTURE ANALYSIS

### 1. COMMON PATTERNS ACROSS ALL SCENES

#### Store Integration Pattern

All scenes follow a consistent destructuring pattern from `useStore`:

```typescript

const [action] = useStore((state) => state.[action]);

```

**Essential store methods used across all scenes:**

- State queries: `flags`, `bandMood`, `trait`, `skills`, `hasItem`

- Mutations: `setFlag`, `setDialogue`, `setScene`, `addToInventory`, `removeFromInventory`, `increaseBandMood`, `completeQuest`, `addQuest`, `discoverLore`, `increaseSkill`

**Critical gotcha:** Any new scene MUST destructure from useStore as individual destructured items, not as a single object. Accessing via `useStore.getState()` within onInteract callbacks is the exception (see Proberaum line 119, 139).

#### Physics Body Structure

Every scene wraps its environment in `<RigidBody>`:

```typescript

<RigidBody type="fixed" position={[x, y, z]}>

  <mesh>

    <geometry args={[...]} />

    <material />

  </mesh>

</RigidBody>

```

**Pattern conventions:**

- Floor: `type="fixed"` at `position={[0, -0.1, 0]}` with rotation `[-Math.PI / 2, 0, 0]` (horizontal)

- Walls: `type="fixed"` meshes or box geometries

- Invisible boundary walls: `boxGeometry` without visible mesh material

- All visible meshes have `receiveShadow` enabled

#### Interactable Component Pattern

All NPCs and interactive objects use `<Interactable>` with consistent structure:

```typescript

<Interactable

  position={[x, y, z]}

  emoji="..."

  name="String"

  [optional: appearance, scale]

  onInteract={() => { /* dialogue logic */ }}

/>

```

**Band member specific appearance prop:**

- `appearance={{ isBandMember: true, idleType: "headbang" | "tap" | "sway" }}` (affects animation state)

#### Dialogue System Pattern

Two dialogue types are used across all scenes:

**Simple dialogue (string):**

```typescript
setDialogue('Text');
```

**Complex dialogue (with options):**

```typescript
setDialogue({
  text: 'Main dialogue text',

  options: [
    {
      text: 'Option text. [SkillName Level]',

      requiredSkill: { name: 'skillname', level: X },

      requiredTrait: 'TraitName',

      questDependencies: ['quest_id'],

      action: () => {
        /* handler */
      },
    },
  ],
});
```

**Gotcha:** Skill checks use lowercase names ('technical', 'chaos', 'social'), but traits use Title Case ('Visionary', 'Cynic', 'Diplomat', 'Mystic', 'Technician', 'Performer').

#### Scene Transition Pattern

Exit points consistently check preconditions before allowing scene change:

```typescript

<Interactable

  position={[0, 1, -6]}

  emoji="🚪"

  name="Exit Name"

  onInteract={() => {

    if (condition) {

      useStore.getState().setScene('scenename');

      // optional: additional setup

    } else {

      setDialogue('Cannot proceed message');

    }

  }}

/>

```

---

### 2. NON-OBVIOUS CONVENTIONS

#### Quest & Lore Tracking

All scenes use a combination of `flags` and `quests`:

- **Flags** (`setFlag`): Simple boolean state, persists across scenes

- **Quests** (`addQuest`, `completeQuest`): Tracked tasks for player progression

- **Lore** (`discoverLore`): Narrative fragments stored separately

**Convention:** Quest IDs are snake_case ('repair_amp', 'ghost_recipe', 'cosmic_echo'). Flag names are camelCase ('waterCleaned', 'matzeDeepTalk').

#### Conditional Rendering of Interactables

Items disappear once acquired or after quest completion using conditional rendering:

```typescript

{!hasItem('ItemName') && (

  <Interactable ... />

)}

{!flags.questFlag && (

  <Interactable ... />

)}

```

**Gotcha:** This is MANDATORY. If you don't use conditional rendering, the interactable will remain even after being "taken", causing duplicate interactions.

#### Band Mood as Dynamic Multiplier

`bandMood` is used as a branching factor for dialogue throughout ALL scenes:

```typescript
const moodText = bandMood > 60 ? 'Enthusiastic response' : 'Neutral/Sad response';
```

**Pattern:** High mood (60+) unlocks "positive" dialogue branches. This is used to gate player-facing consequences of earlier choices.

#### Callback Closures with useStore.getState()

Inside `onInteract` callbacks, accessing state that doesn't need reactivity uses `useStore.getState()`:

```typescript
const hasForbiddenRiff = hasItem('Verbotenes Riff'); // Direct destructured call

const trait = useStore.getState().trait; // Within callback for non-reactive access
```

**Gotcha:** Don't destructure `trait` or `skills` at the top level if you only use them inside callbacks during initialization—it won't update. Use `useStore.getState()` inside the callback.

#### Item Combinations & Quest Dependencies

Complex quests chain items and flags (see TourBus, VoidStation):

- Geister-Drink requires: Turbo-Koffein + Rostiges Plektrum

- Ghost Recipe completion requires: showing the crafted Geister-Drink to Ghost NPC

- Each step is gated by a flag and quest ID

**Convention:** Items used for crafting are NOT removed from inventory by default—manual removal via `removeFromInventory` is required.

#### Scene-Specific Lighting

Each scene has distinct lighting to establish mood:

- Proberaum: Dark industrial (`#1a1a1a` background, minimal ambient)

- TourBus: Warm accent lighting (orange/yellow pointLight, 0.2 ambient)

- Backstage: Stars + night preset (atmosphere-heavy)

- Kaminstube: Red/orange ambient (1982 nostalgia)

- Salzgitter: Dynamic colored spotlights that sync to beat using `useRef` and `useFrame`

- VoidStation: Surreal magenta/cyan points (alien dimension feel)

**Pattern:** Use `useRef` + `useFrame` ONLY when you need animated lighting tied to beat/time (Salzgitter, Kaminstube do this).

---

### 3. GOTCHAS & CONSTRAINTS

#### Critical Gotcha #1: Conditional Rendering Must Block All Reachable Instances

In Proberaum, there are TWO Feedback-Monitor interactables (lines 612 & 635):

```typescript

{!flags.feedbackMonitorTalked && (

  <Interactable position={[-6, 0.5, 5]} ... />

)}

{flags.feedbackMonitorTalked && !flags.feedbackMonitorQuestCompleted && (

  <Interactable position={[-6, 0.5, 5]} ... />

)}

```

**Why this exists:** The first interaction sets `feedbackMonitorTalked`, triggering the second variant which accepts the item. If both render, player can interact with both simultaneously.

**Agent constraint:** When adding any new conditional interactables at the same position, ensure mutual exclusivity using flags. Test by visiting the position multiple times and checking the dialogue doesn't repeat incorrectly.

#### Critical Gotcha #2: removeFromInventory Must Be Explicit

In TourBus line 256, after giving the Geister-Drink to the Ghost NPC:

```typescript
removeFromInventory('Geister-Drink');
```

**Gotcha:** Simply showing the item in dialogue doesn't consume it. You MUST call `removeFromInventory` or the player keeps the item AND completes the quest.

#### Critical Gotcha #3: Scene Transitions Require Exact Scene Names

Scene names must match exactly (case-sensitive) in `setScene`:

- 'proberaum'

- 'tourbus'

- 'backstage'

- 'void_station' (underscore, not camelCase!)

- 'kaminstube'

- 'salzgitter'

**Gotcha:** Backstage uses `setTimeout` before calling `setScene` (line 348). This allows dialogue to display before the scene changes. Copy this pattern for narrative clarity.

#### Critical Gotcha #4: Bound Limits Restrict Player Movement

Each scene defines `<Player bounds>` which creates an invisible collision zone:

```typescript

<Player bounds={{ x: [-14, 14], z: [-7, 7] }} />

```

**Pattern:** X is left/right, Z is forward/backward. These must align with invisible wall positions (RigidBody boxes). If you add a wall, adjust bounds accordingly.

**Gotcha in VoidStation:** Bounds are `{ x: [-20, 20], z: [-20, 20] }` (larger) to allow exploration of the surreal environment. Don't shrink these without testing.

#### Critical Gotcha #5: Dialogue Option Display Dependencies

In VoidStation line 169:

```typescript

{

  text: 'Das kosmische Echo hat mir etwas gezeigt. [cosmic_echo complete]',

  questDependencies: ['cosmic_echo'],

  action: () => { ... }

}

```

**Gotcha:** `questDependencies` hides the option unless the quest is completed. This requires the quest to exist in state. If the quest is never added, the option vanishes silently.

**Agent constraint:** Always verify that any `questDependencies` reference a quest that's guaranteed to be added earlier in the scene's flow.

#### Critical Gotcha #6: Skill Requirements Must Use requiredSkill Object

Correct pattern (Salzgitter line 128):

```typescript

requiredSkill: { name: 'chaos', level: 10 }

```

Incorrect pattern (will fail silently):

```typescript
requiredSkill: 'chaos';
```

#### Critical Gotcha #7: Float Component Usage

Used in multiple scenes (TourBus line 405, Backstage line 69, VoidStation line 54):

```typescript

<Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>

  <Text ... /> or <mesh />

</Float>

```

**Gotcha:** Float only works on THREE objects. Don't wrap HTML elements or non-mesh content directly in Float—it will cause rendering errors. Check TourBus Text component carefully: it's wrapped in Float with a mesh backing.

#### Critical Gotcha #8: discoverLore Must Precede Lore References

In VoidStation line 104:

```typescript
discoverLore('tankwart_truth');
```

**Gotcha:** There's no validation that a lore ID is valid. If you call `discoverLore('invalid_id')`, it silently adds it to state without warning. Ensure lore IDs are consistent across all scenes where they're referenced.

#### Critical Gotcha #9: useFrame Hook Requires useRef Cleanup

In Salzgitter and Kaminstube, `useRef` is used for light animation:

```typescript
const spotLight1Ref = useRef<THREE.SpotLight>(null);

useFrame((state) => {
  if (spotLight1Ref.current) {
    spotLight1Ref.current.intensity = 5 + beat * 20;
  }
});
```

**Gotcha:** If refs aren't checked for `null` before access, you'll get runtime errors. The pattern of `if (ref.current)` is MANDATORY.

#### Critical Gotcha #10: Band Members MUST Have Position Y >= 1

All band member interactables are positioned at Y=1 or higher (Proberaum line 111, Kaminstube line 201). This prevents clipping into the floor (which is at Y=-0.1).

#### Critical Gotcha #11: Trait-Specific Dialogue Options

Some interactables provide special dialogue if the player has a specific trait:

- 'Diplomat': Amp Therapy (Proberaum)

- 'Visionary': Sees patterns (Multiple scenes)

- 'Cynic': Understands existential jokes (Proberaum line 126)

- 'Technician': Repairs amp in TourBus (line 140)

- 'Performer': Gets special Marius dialogue in Salzgitter (line 232)

- 'Mystic': Gets special Tankwart dialogue in VoidStation (line 84)

**Gotcha:** These checks happen with `useStore.getState().trait` inside callbacks. If you add new trait-specific content, ensure the trait name is exact and consistent with store definitions.

#### Critical Gotcha #12: Skill Increases Are Side Effects

Skills are increased via:

```typescript
useStore.getState().increaseSkill('skillname', amount);
```

**Gotcha:** This happens INSIDE dialogue option actions, not in the main component. If you increase a skill at component level, it will increase every frame. Always put skill increases inside action callbacks.

#### Critical Gotcha #13: Environment Presets & Mood

Different scenes use different `<Environment>` presets:

- Proberaum: "night"

- Backstage: "night"

- Kaminstube: "city"

- Salzgitter: "studio"

- VoidStation: "night"

**Gotcha:** These are NOT cosmetic. They affect lighting calculations and player perception. Changing them requires testing the visual mood matches the scene's narrative purpose.

---

### 4. SUMMARY TABLE: WHAT MUST BE DONE FOR NEW CONTENT

| Task | Required | Example | Gotcha |

|------|----------|---------|--------|

| Add item/NPC | Conditional render + dialogue | `{!hasItem(...) && <Interactable />}` | Can't be reached twice |

| Remove item after use | Explicit `removeFromInventory()` | Line TourBus 256 | Silent failure if omitted |

| Gate scene exit | Check flags/items before `setScene()` | Proberaum 670 | Wrong scene name crashes silently |

| Add quest reward | `increaseSkill()` in action callback | Proberaum 210 | Doing it at render level breaks state |

| Trait-gate dialogue | `useStore.getState().trait === 'Name'` | Proberaum 126 | Exact case-sensitive string match |

| Require skill | `requiredSkill: { name: '', level: X }` | Salzgitter 129 | Object form, not string |

| Make lore discoverable | `discoverLore('id')` call | VoidStation 104 | No validation of ID existence |

| Animate lights | Use `useRef` + `useFrame` | Salzgitter 35 | Must null-check refs |

| Show floating text | Wrap in `<Float>` with mesh | TourBus 405 | Can't float HTML directly |

| Change dialogue by mood | Conditional string in dialogue | Proberaum 176 | Evaluate OUTSIDE setDialogue call |

---

### FILES INVOLVED

- `/home/user/Neurotoxic---The-Adventure-/src/components/scenes/Proberaum.tsx`

- `/home/user/Neurotoxic---The-Adventure-/src/components/scenes/TourBus.tsx`

- `/home/user/Neurotoxic---The-Adventure-/src/components/scenes/Backstage.tsx`

- `/home/user/Neurotoxic---The-Adventure-/src/components/scenes/VoidStation.tsx`

- `/home/user/Neurotoxic---The-Adventure-/src/components/scenes/Kaminstube.tsx`

- `/home/user/Neurotoxic---The-Adventure-/src/components/scenes/Salzgitter.tsx`
