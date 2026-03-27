import { test, expect } from '@playwright/test';

test('Backstage frontend verification', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('neurotoxic-game-storage', JSON.stringify({
      state: {
        scene: 'backstage',
        inventory: ['Resonanz-Kristall'],
        flags: {
          tourbus_sabotage_discovered: true,
          backstage_blueprint_found: false,
          frequenz1982_complete: false
        },
        traits: ['MYSTIC'],
        skills: {
          social: 5,
          technical: 5,
          chaos: 2
        },
        bandMood: 80
      },
      version: 0
    }));
  });

  await page.goto('http://localhost:3001');

  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'backstage.png', fullPage: true });
});
