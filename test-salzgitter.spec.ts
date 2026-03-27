import { test, expect } from '@playwright/test';

test('Salzgitter frontend verification', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('neurotoxic-game-storage', JSON.stringify({
      state: {
        scene: 'salzgitter',
        inventory: ['Resonanz-Kristall'],
        flags: {
          bassist_contacted: true,
          bassist_restored: false,
          maschinen_seele_complete: true,
          mariusConfidenceBoost: true,
          egoContained: true,
          salzgitter_true_ending: false
        },
        traits: ['MYSTIC'],
        skills: {
          social: 12,
          technical: 12,
          chaos: 15
        },
        bandMood: 95
      },
      version: 0
    }));
  });

  await page.goto('http://localhost:3001');

  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'salzgitter.png', fullPage: true });
});
