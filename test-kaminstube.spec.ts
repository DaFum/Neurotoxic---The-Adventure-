import { test, expect } from '@playwright/test';

test('Kaminstube frontend verification', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('neurotoxic-game-storage', JSON.stringify({
      state: {
        scene: 'kaminstube',
        inventory: ['Röhre'],
        flags: {
          bassist_contacted: true,
          bassist_clue_wirt: false,
          tourbus_sabotage_discovered: true,
          tourbus_matze_confession: false,
          ampFixed: true,
          forgotten_lore: false,
          kaminstube_crowd_rallied: false,
          egoContained: true
        },
        traits: ['DIPLOMAT'],
        skills: {
          social: 8,
          technical: 8,
          chaos: 7
        },
        bandMood: 85
      },
      version: 0
    }));
  });

  await page.goto('http://localhost:3001');

  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'kaminstube.png', fullPage: true });
});
