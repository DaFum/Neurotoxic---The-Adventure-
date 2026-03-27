import { test, expect } from '@playwright/test';

test('Tourbus frontend verification', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('neurotoxic-game-storage', JSON.stringify({
      state: {
        scene: 'tourbus',
        inventory: ['Frequenzfragment', 'Kabel'],
        flags: {
          tourbus_sabotage_discovered: true,
          bassist_wahrheit: true,
          bassist_clue_matze: true
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

  // Wait for React to mount and the scene to render
  await page.waitForTimeout(3000);

  // Take a screenshot
  await page.screenshot({ path: 'tourbus.png', fullPage: true });
});
