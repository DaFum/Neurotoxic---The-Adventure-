import { test, expect } from '@playwright/test';

test('VoidStation frontend verification', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('neurotoxic-game-storage', JSON.stringify({
      state: {
        scene: 'void_station',
        inventory: ['Dunkle Materie', 'Resonanz-Kristall'],
        flags: {
          bassist_clue_matze: true,
          bassist_clue_ghost: true,
          bassist_contacted: false,
          marius_tourbus_doubt: true,
          egoContained: false,
          void_diplomat_negotiation: false
        },
        traits: ['MYSTIC'],
        skills: {
          social: 8,
          technical: 8,
          chaos: 2
        },
        bandMood: 80
      },
      version: 0
    }));
  });

  await page.goto('http://localhost:3001');

  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'voidstation.png', fullPage: true });
});
