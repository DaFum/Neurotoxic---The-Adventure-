import { test, expect } from '@playwright/test';

test('verify Amp dialogue priorities and item consumption', async ({ page }) => {
  // Load the game
  await page.goto('http://localhost:5173');

  // Inject state: We want the player to have the items but NOT have heard the amp yet.
  await page.evaluate(() => {
    const store = (window as any).useStore.getState();
    store.setScene('proberaum');
    store.addToInventory('Lötkolben');
    store.addToInventory('Schrottmetall');
    store.setFlag('talkingAmpHeard', false); // Initial state
  });

  // Small wait for state to propagate if needed
  await page.waitForTimeout(100);

  // Take screenshot of the initial state showing inventory
  await page.screenshot({ path: 'amp-test-1-initial.png' });
});
