export function checkHasSavedGame(raw: string | null): boolean {
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;

    const parsedRecord = parsed as Record<string, unknown>;
    const saved = parsedRecord.state;

    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return false;

    const savedRecord = saved as Record<string, unknown>;

    const hasTrait = savedRecord.trait !== null && savedRecord.trait !== undefined;
    const hasInventory = Array.isArray(savedRecord.inventory) && savedRecord.inventory.length > 0;

    const hasCompletedQuest =
      Array.isArray(savedRecord.quests) &&
      savedRecord.quests.some((q: unknown) => {
        if (typeof q === 'object' && q !== null) {
          const quest = q as { status?: unknown; completed?: unknown };
          return quest.status === 'completed' || quest.completed === true;
        }
        return false;
      });

    const hasLoreProgress =
      Array.isArray(savedRecord.loreEntries) &&
      savedRecord.loreEntries.some((e: unknown) => {
        if (typeof e === 'object' && e !== null) {
          return (e as { discovered?: unknown }).discovered === true;
        }
        return false;
      });

    const skills =
      typeof savedRecord.skills === 'object' && savedRecord.skills !== null
        ? (savedRecord.skills as Record<string, unknown>)
        : undefined;

    const hasSkillProgress =
      (typeof skills?.technical === 'number' && skills.technical > 0) ||
      (typeof skills?.social === 'number' && skills.social > 0) ||
      (typeof skills?.chaos === 'number' && skills.chaos > 0);

    const hasMoodOrSkillProgress =
      (savedRecord.bandMood !== undefined &&
        typeof savedRecord.bandMood === 'number' &&
        savedRecord.bandMood !== 20) ||
      hasSkillProgress;

    return Boolean(
      hasTrait || hasInventory || hasCompletedQuest || hasLoreProgress || hasMoodOrSkillProgress,
    );
  } catch (e) {
    console.warn('Failed to parse save game:', e);
    return false;
  }
}
