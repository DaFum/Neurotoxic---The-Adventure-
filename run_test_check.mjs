import { readFileSync, writeFileSync } from 'fs';

const code = readFileSync('src/dialogueEngine.ts', 'utf8');
const newCode = code.replace(
  /if \(option\.nextDialogue && option\.action && preActionDialogue !== postActionDialogue\) \{[^}]+\}/,
  '// removed'
).replace(
  /\/\/ 1\. Consume items/,
  `if (option.nextDialogue && option.action && useStore.getState().dialogue !== option.nextDialogue) {
     // Wait, the action might change useStore.getState().dialogue!
  }

  // 1. Consume items`
);

writeFileSync('src/dialogueEngine.ts', newCode);
