import { useStore } from './store';
import type { DialogueOption, Quest } from './store';

// Cache for O(1) quest lookups, maintained globally
const cachedQuestsMap = new Map<string, Quest>();

function updateQuestsCache(quests: Quest[]) {
  cachedQuestsMap.clear();
  for (let i = 0; i < quests.length; i++) {
    const q = quests[i];
    if (q) cachedQuestsMap.set(q.id, q);
  }
}

// Initialize cache
updateQuestsCache(useStore.getState().quests);

// Maintain cache synchronously when store updates
useStore.subscribe((state, prevState) => {
  if (state.quests !== prevState.quests) {
    updateQuestsCache(state.quests);
  }
});

/**
 * Note: `getCachedQuest` relies on synchronous Zustand subscriptions for freshness,
 * and this subscription only refreshes the cache when the `quests` array reference changes.
 * Quest updates therefore must be immutable: replace the `quests` array (and any changed
 * quest objects) via Zustand `setState`/slice updates rather than mutating the existing
 * array or quest objects in place, or this cache can become stale.
 */
export function getCachedQuest(id: string): Quest | undefined {
  return cachedQuestsMap.get(id) as Quest | undefined;
}

function hasRequiredItems(
  option: DialogueOption,
  inventoryCounts: Record<string, number>,
): boolean {
  if (!option.requiredItems && !option.consumeItems) return true;

  const neededCounts: Record<string, number> = Object.create(null);

  if (option.requiredItems) {
    for (let i = 0; i < option.requiredItems.length; i++) {
      const item = option.requiredItems[i];
      if (item !== undefined) neededCounts[item] = (neededCounts[item] || 0) + 1;
    }
  }

  if (option.consumeItems) {
    const consumeTallies: Record<string, number> = Object.create(null);
    for (let i = 0; i < option.consumeItems.length; i++) {
      const item = option.consumeItems[i];
      if (item !== undefined) {
        const c = (consumeTallies[item] || 0) + 1;
      consumeTallies[item] = c;
      if (c > (neededCounts[item] || 0)) {
        neededCounts[item] = c;
      }
      }
    }
  }

  for (const item in neededCounts) {
    const needed = neededCounts[item];
    if (needed !== undefined && (inventoryCounts[item] || 0) < needed) return false;
  }

  return true;
}

/**
 * Checks whether a dialogue option's requirements are currently satisfied.
 * Returns true if the option can be selected; false if it is locked.
 *
 * Used by the UI to determine disabled/locked state without executing game-state side-effects.
 */
export function canSelectOption(option: DialogueOption): boolean {
  const { trait, skills, flags, inventoryCounts } = useStore.getState();

  if (option.requiredTrait && trait !== option.requiredTrait) return false;

  if (option.requiredSkill) {
    const { name, level } = option.requiredSkill;
    if (skills[name] < level) return false;
  }

  if (option.questDependencies) {
    for (const dep of option.questDependencies) {
      if (typeof dep === 'string') {
        const q = cachedQuestsMap.get(dep);
        if (!q || q.status !== 'completed') return false;
      } else {
        const q = cachedQuestsMap.get(dep.id);
        if (!q || q.status !== dep.status) return false;
      }
    }
  }

  if (option.requiredFlags && !option.requiredFlags.every((flag) => flags[flag] === true)) {
    return false;
  }

  if (option.forbiddenFlags && option.forbiddenFlags.some((flag) => flags[flag] === true)) {
    return false;
  }

  if (!hasRequiredItems(option, inventoryCounts)) {
    return false;
  }

  return true;
}

/**
 * Executes a dialogue option through the full pipeline:
 *   1. Requirement check — returns false immediately if requirements are not met.
 *   2. Side-effects — runs the option's action callback, applies flag/quest changes.
 *   3. Navigation — moves to nextDialogue or closes the dialogue box.
 *
 * Returns true on success, false if the option was locked.
 */
export function executeDialogueOption(option: DialogueOption): boolean {
  if (!canSelectOption(option)) return false;

  if (option.nextDialogue && option.action) {
    throw new Error(
      'executeDialogueOption: option.nextDialogue and option.action are mutually exclusive. This conflicting pattern is deprecated and no longer allowed.',
    );
  }

  // 1. Consume items
  if (option.consumeItems) {
    option.consumeItems.forEach((item) => {
      useStore.getState().removeFromInventory(item);
    });
  }

  // 2. Apply declarative state effects BEFORE action runs
  // Re-read store state to avoid stale references after inventory consumption
  if (option.flagToSet) useStore.getState().setFlag(option.flagToSet.flag, option.flagToSet.value);
  if (option.questToAdd) useStore.getState().addQuest(option.questToAdd.id, option.questToAdd.text);
  if (option.questToComplete) {
    useStore.getState().completeQuest(option.questToComplete);
  }
  if (option.questToFail) {
    useStore.getState().failQuest(option.questToFail);
  }

  // Snapshot dialogue state before action so we can detect action-driven navigation
  const preActionDialogue = useStore.getState().dialogue;

  // 3. Custom action logic
  option.action?.();

  // 3.5. Visual effects are now evaluated centrally inside useStore.setDialogue(),
  // based exclusively on the `visualEffect` property of the `Dialogue` object.

  const postActionDialogue = useStore.getState().dialogue;

  // 4. Navigation: nextDialogue wins; otherwise auto-close unless action already redirected
  if (option.nextDialogue) {
    useStore.getState().setDialogue(option.nextDialogue);
  } else if (option.closeOnSelect !== false && preActionDialogue === postActionDialogue) {
    useStore.getState().setDialogue(null);
  }

  return true;
}
