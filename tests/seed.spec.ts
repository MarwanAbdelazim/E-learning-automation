import { test, expect } from '../src/fixtures';

/**
 * Seed test for the Playwright Test Agents (planner / generator / healer).
 * It boots the app with the project's fixtures so generated tests start from the same state.
 */
test.describe('Seed', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*/);
  });
});
