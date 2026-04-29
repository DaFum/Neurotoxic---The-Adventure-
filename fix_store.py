import re

with open('src/store.ts', 'r') as f:
    content = f.read()

content = content.replace("const id = quests[i].id;", "const id = quests[i]?.id;")
content = content.replace("const fixCableQuest = quests[fixCableQuestIndex];", "const fixCableQuest = quests[fixCableQuestIndex];\n  if (!fixCableQuest) return quests;")
content = content.replace("const cableQuest = quests[cableQuestIndex];", "const cableQuest = quests[cableQuestIndex];\n    if (!cableQuest) return quests;")
content = content.replace("if (q.id !== 'fix_cable') {", "if (q && q.id !== 'fix_cable') {")
content = content.replace("q.id === 'cable' && q.status !== mergedStatus ? { ...q, status: mergedStatus } : q,", "q.id === 'cable' && q.status !== mergedStatus ? ({ ...q, status: mergedStatus } as Quest) : q,")
content = content.replace("updatedQuests[fixCableQuestIndex] = { ...fixCableQuest, id: 'cable' };", "updatedQuests[fixCableQuestIndex] = { ...fixCableQuest, id: 'cable' } as Quest;")
content = content.replace("currentQuestIds.add(q.id);", "if (!q) continue;\n          currentQuestIds.add(q.id);")
content = content.replace("status: normalizeQuestStatus(pq.status, pq.completed),", "status: normalizeQuestStatus(pq.status, pq.completed),\n            } as Quest;")
content = content.replace("} as Quest;\n            };", "} as Quest;")
content = content.replace("? { ...e, discovered: persistedEntry.discovered === true }", "? ({ ...e, discovered: persistedEntry.discovered === true } as LoreEntry)")
content = content.replace("newEntries[idx] = { ...newEntries[idx], discovered: true };", "newEntries[idx] = { ...newEntries[idx], discovered: true } as LoreEntry;")

with open('src/store.ts', 'w') as f:
    f.write(content)
