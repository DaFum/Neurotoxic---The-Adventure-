import { useStore } from './store';
import type { DialogueOption } from './store';

/**
 * Checks whether a dialogue option's requirements are currently satisfied.
 * Returns true if the option can be selected; false if it is locked.
 *
 * Used by the UI to determine disabled/locked state without executing side-effects.
 */
export function canSelectOption(option: DialogueOption): boolean {
  const { trait, skills, quests } = useStore.getState();

  if (option.requiredTrait && trait !== option.requiredTrait) return false;

  if (option.requiredSkill) {
    const { name, level } = option.requiredSkill;
    if (skills[name] < level) return false;
  }

  if (option.questDependencies) {
    const completedIds = new Set(
      quests.filter(q => q.status === 'completed').map(q => q.id)
    );
    if (!option.questDependencies.every(id => completedIds.has(id))) return false;
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

  // Snapshot dialogue state before action so we can detect action-driven navigation
  const preActionDialogue = useStore.getState().dialogue;

  // Custom action runs first — it may call setDialogue() internally
  option.action?.();

  // Declarative effects are applied after action (quest/flag changes never redirect dialogue)
  const { setFlag, addQuest, completeQuest, failQuest, setDialogue } = useStore.getState();

  if (option.flagToSet) setFlag(option.flagToSet.flag, option.flagToSet.value);
  if (option.questToAdd) addQuest(option.questToAdd.id, option.questToAdd.text);
  if (option.questToComplete) completeQuest(option.questToComplete);
  if (option.questToFail) failQuest(option.questToFail);

  // Navigation: nextDialogue wins; otherwise auto-close unless action already redirected
  const postActionDialogue = useStore.getState().dialogue;

  if (option.nextDialogue) {
    setDialogue(option.nextDialogue);
  } else if (option.closeOnSelect !== false && preActionDialogue === postActionDialogue) {
    setDialogue(null);
  }

  return true;
}
