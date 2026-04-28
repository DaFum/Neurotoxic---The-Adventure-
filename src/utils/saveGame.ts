function isQuestCompleted(q: unknown): boolean {
  if (typeof q === 'object' && q !== null) {
    const quest = q as { status?: unknown; completed?: unknown };
    return quest.status === 'completed' || quest.completed === true;
  }
  return false;
}

function isLoreEntryDiscovered(e: unknown): boolean {
  if (typeof e === 'object' && e !== null) {
    return (e as { discovered?: unknown }).discovered === true;
  }
  return false;
}

function hasAnySkillProgress(skills: unknown): boolean {
  if (typeof skills !== 'object' || skills === null) return false;
  const s = skills as Record<string, unknown>;
  return (
    (typeof s.technical === 'number' && s.technical > 0) ||
    (typeof s.social === 'number' && s.social > 0) ||
    (typeof s.chaos === 'number' && s.chaos > 0)
  );
}

function hasBandMoodProgress(bandMood: unknown): boolean {
  return typeof bandMood === 'number' && bandMood !== 20;
}

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
      Array.isArray(savedRecord.quests) && savedRecord.quests.some(isQuestCompleted);

    const hasLoreProgress =
      Array.isArray(savedRecord.loreEntries) && savedRecord.loreEntries.some(isLoreEntryDiscovered);

    const hasSkillProgress = hasAnySkillProgress(savedRecord.skills);
    const hasMoodProgress = hasBandMoodProgress(savedRecord.bandMood);

    return Boolean(
      hasTrait ||
        hasInventory ||
        hasCompletedQuest ||
        hasLoreProgress ||
        hasSkillProgress ||
        hasMoodProgress,
    );
  } catch (e) {
    console.warn('Failed to parse save game:', e);
    return false;
  }
}
