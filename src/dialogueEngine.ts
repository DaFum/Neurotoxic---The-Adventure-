import { useStore } from './store';
import type { DialogueOption } from './store';

/**
 * Checks whether a dialogue option's requirements are currently satisfied.
 * Returns true if the option can be selected; false if it is locked.
 *
 * Used by the UI to determine disabled/locked state without executing side-effects.
 */
export function canSelectOption(option: DialogueOption): boolean {
  const { trait, skills, quests, flags, inventory } = useStore.getState();

  if (option.requiredTrait && trait !== option.requiredTrait) return false;

  if (option.requiredSkill) {
    const { name, level } = option.requiredSkill;
    if (skills[name] < level) return false;
  }

  if (option.questDependencies) {
    for (const dep of option.questDependencies) {
      if (typeof dep === 'string') {
        const q = quests.find(q => q.id === dep);
        if (!q || q.status !== 'completed') return false;
      } else {
        const q = quests.find(q => q.id === dep.id);
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
    const counts: Record<string, number> = {};
    for (const item of inventory) counts[item] = (counts[item] || 0) + 1;

    const requiredCounts: Record<string, number> = {};
    if (option.requiredItems) {
      for (const item of option.requiredItems) requiredCounts[item] = (requiredCounts[item] || 0) + 1;
    }
    if (option.consumeItems) {
      for (const item of option.consumeItems) requiredCounts[item] = (requiredCounts[item] || 0) + 1;
    }

    for (const [item, needed] of Object.entries(requiredCounts)) {
      if ((counts[item] || 0) < needed) return false;
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
  if (option.questToComplete) useStore.getState().completeQuest(option.questToComplete);
  if (option.questToFail) useStore.getState().failQuest(option.questToFail);

  // Snapshot dialogue state before action so we can detect action-driven navigation
  const preActionDialogue = useStore.getState().dialogue;

  // 3. Custom action logic
  option.action?.();

  const postActionDialogue = useStore.getState().dialogue;

  if (option.nextDialogue && option.action && preActionDialogue !== postActionDialogue) {
    console.warn('executeDialogueOption: option.action called setDialogue(), but option.nextDialogue is also defined. nextDialogue will overwrite the action\'s dialogue change.');
  }

  // 4. Navigation: nextDialogue wins; otherwise auto-close unless action already redirected
  if (option.nextDialogue) {
    useStore.getState().setDialogue(option.nextDialogue);
  } else if (option.closeOnSelect !== false && preActionDialogue === postActionDialogue) {
    useStore.getState().setDialogue(null);
  }

  return true;
}
