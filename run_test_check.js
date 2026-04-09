const { readFileSync } = require('fs');

const code = readFileSync('src/dialogueEngine.ts', 'utf8');
const newCode = code.replace(
  /if \(option\.nextDialogue && option\.action && preActionDialogue !== postActionDialogue\) \{/,
  '// removed'
).replace(
  /\/\/ 1\. Consume items/,
  `if (option.nextDialogue && option.action) {
    throw new Error('executeDialogueOption: option.action called setDialogue(), but option.nextDialogue is also defined. This conflicting pattern is deprecated and no longer allowed.');
  }

  // 1. Consume items`
);

require('fs').writeFileSync('src/dialogueEngine.ts', newCode);
