import { useStore, QuestNotFoundError } from './store';
import type { DialogueOption, Quest } from './store';

// Cache for O(1) quest lookups
let lastQuestsRef: Quest[] | null = null;
const cachedQuestsMap = new Map<string, Quest>();

export function clearQuestCache() {
  cachedQuestsMap.clear();
  lastQuestsRef = null;
}

/**
 * Checks whether a dialogue option's requirements are currently satisfied.
 * Returns true if the option can be selected; false if it is locked.
 *
 * Used by the UI to determine disabled/locked state without executing game-state side-effects.
 */
export function canSelectOption(option: DialogueOption): boolean {
  const { trait, skills, quests, flags, inventoryCounts } = useStore.getState();

  if (option.requiredTrait && trait !== option.requiredTrait) return false;

  if (option.requiredSkill) {
    const { name, level } = option.requiredSkill;
    if (skills[name] < level) return false;
  }

  if (option.questDependencies) {
    if (quests !== lastQuestsRef) {
      cachedQuestsMap.clear();
      for (let i = 0; i < quests.length; i++) {
        cachedQuestsMap.set(quests[i].id, quests[i]);
      }
      lastQuestsRef = quests;
    }

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

  if (option.requiredFlags && !option.requiredFlags.every(flag => flags[flag] === true)) {
    return false;
  }

  if (option.forbiddenFlags && option.forbiddenFlags.some(flag => flags[flag] === true)) {
    return false;
  }

  if (option.requiredItems || option.consumeItems) {
    // Inventory needs to support multiple of the same item if `requiredItems` or `consumeItems` specifies duplicates
    // the player must have max(requiredCount, consumeCount) of each item.
    const neededCounts: Record<string, number> = Object.create(null);
    if (option.requiredItems) {
      for (const item of option.requiredItems) {
        neededCounts[item] = (neededCounts[item] || 0) + 1;
      }
    }
    if (option.consumeItems) {
      const consumeTallies: Record<string, number> = Object.create(null);
      for (const item of option.consumeItems) {
        const c = (consumeTallies[item] || 0) + 1;
        consumeTallies[item] = c;
        if (c > (neededCounts[item] || 0)) {
          neededCounts[item] = c;
        }
      }
    }

    for (const item in neededCounts) {
      if ((inventoryCounts[item] || 0) < neededCounts[item]) return false;
    }
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

  // 1. Consume items
  if (option.consumeItems) {
    option.consumeItems.forEach(item => {
      useStore.getState().removeFromInventory(item);
    });
  }

  // 2. Apply declarative state effects BEFORE action runs
  // Re-read store state to avoid stale references after inventory consumption
  if (option.flagToSet) useStore.getState().setFlag(option.flagToSet.flag, option.flagToSet.value);
  if (option.questToAdd) useStore.getState().addQuest(option.questToAdd.id, option.questToAdd.text);
  if (option.questToComplete) {
    try {
      useStore.getState().completeQuest(option.questToComplete);
    } catch (error) {
      if (!(error instanceof QuestNotFoundError)) {
        throw error;
      }
    }
  }
  if (option.questToFail) {
    try {
      useStore.getState().failQuest(option.questToFail);
    } catch (error) {
      if (!(error instanceof QuestNotFoundError)) {
        throw error;
      }
    }
  }

  // Snapshot dialogue state before action so we can detect action-driven navigation
  const preActionDialogue = useStore.getState().dialogue;

  // 3. Custom action logic
  option.action?.();

  // 3.5. Visual effects are now evaluated centrally inside useStore.setDialogue(),
  // based exclusively on the `visualEffect` property of the `Dialogue` object.

  const postActionDialogue = useStore.getState().dialogue;

  if (option.nextDialogue && option.action && preActionDialogue !== postActionDialogue) {
    throw new Error('executeDialogueOption: option.action called setDialogue(), but option.nextDialogue is also defined. This conflicting pattern is deprecated and no longer allowed.');
  }

  // 4. Navigation: nextDialogue wins; otherwise auto-close unless action already redirected
  if (option.nextDialogue) {
    useStore.getState().setDialogue(option.nextDialogue);
  } else if (option.closeOnSelect !== false && preActionDialogue === postActionDialogue) {
    useStore.getState().setDialogue(null);
  }

  return true;
}
