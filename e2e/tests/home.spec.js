import { test, expect } from '@playwright/test';

test('etusivu näyttää elokuvakortteja eikä kaadu', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');

  // Odotetaan, että ensimmäinen elokuvakortti ilmestyy
  await expect(page.locator('.movie-card').first()).toBeVisible();

  expect(await page.locator('.movie-card').count()).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});
