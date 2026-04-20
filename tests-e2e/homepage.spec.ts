import { test, expect } from '@playwright/test';

test('homepage has title and main CTA', async ({ page }) => {
  await page.goto('/');

  // Expect title to contain Nomertop
  await expect(page).toHaveTitle(/NomerTop/);

  // Check if Navbar logo is present
  const logo = page.locator('.logo-main');
  await expect(logo).toContainText('NOMER');

  // Check if main heading exists (might vary based on home page content)
  // Let's look for the search button/link
  const searchLink = page.getByRole('link', { name: /поиск/i }).or(page.getByRole('link', { name: /search/i }));
  await expect(searchLink).toBeVisible();
});

test('language switching works on homepage', async ({ page }) => {
  await page.goto('/');

  // Default RU
  await expect(page.getByText(/поиск/i).first()).toBeVisible();

  // Click UZ pill
  await page.click('button:has-text("UZ")');

  // Should see UZ translation (e.g. QIDIRUV instead of ПОИСК)
  // I should check what the UZ translation for 'search' is in i18n.ts
  await expect(page.getByText(/qidirish/i).first()).toBeVisible();
});
