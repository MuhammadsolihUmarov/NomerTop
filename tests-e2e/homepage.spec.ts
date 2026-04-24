import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('has correct title and logo', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NomerTop/);
    await expect(page.locator('.logo')).toContainText('NOMERTOP');
  });

  test('plate search box is visible and accepts input', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input.plate');
    await expect(input).toBeVisible();
    await input.fill('01a777aa');
    await expect(input).toHaveValue('01A777AA'); // uppercased
  });

  test('search form navigates to /search', async ({ page }) => {
    await page.goto('/');
    await page.locator('input.plate').fill('01A777AA');
    await page.locator('button.go').click();
    await expect(page).toHaveURL(/\/search\?q=01A777AA/);
  });

  test('feature cards are visible', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.feat');
    await expect(cards).toHaveCount(3);
  });

  test('language switch RU → UZ changes nav text', async ({ page }) => {
    await page.goto('/');
    // Switch to UZ
    await page.locator('.lang-switch button:has-text("UZ")').click();
    await expect(page.locator('.desktop-links a').first()).toContainText(/Izlash/i);

    // Switch back to RU
    await page.locator('.lang-switch button:has-text("RU")').click();
    await expect(page.locator('.desktop-links a').first()).toContainText(/Поиск/i);
  });

  test('hero title changes on language switch', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang-switch button:has-text("UZ")').click();
    await expect(page.locator('h1').first()).toContainText(/mashinaga/i);

    await page.locator('.lang-switch button:has-text("RU")').click();
    await expect(page.locator('h1').first()).toContainText(/водителю/i);
  });

  test('footer links to agreement and privacy pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href="/agreement"]')).toBeVisible();
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
  });
});
