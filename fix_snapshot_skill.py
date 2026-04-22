import re

with open('.agents/skills/game-improver-workspace/skill-snapshot/SKILL.md', 'r') as f:
    text = f.read()

# Fix persisted fields
text = text.replace(
    "`inventory`, `flags`, `quests`, `bandMood`, `loreEntries`, `trait`, `skills`",
    "`inventory`, `itemPickupCounts`, `flags`, `quests`, `bandMood`, `bandMoodGainClaims`, `loreEntries`, `trait`, `skills`"
)

# Fix numbering
text = text.replace(
"""1. Draft audio ambient fix (ask before writing):

```text
/game-improver action=fixAudioAmbient target=src/audio.ts askConfirm=true
```""",
"""2. Draft audio ambient fix (ask before writing):

```text
/game-improver action=fixAudioAmbient target=src/audio.ts askConfirm=true
```"""
)

with open('.agents/skills/game-improver-workspace/skill-snapshot/SKILL.md', 'w') as f:
    f.write(text)
