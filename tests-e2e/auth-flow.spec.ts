import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should send OTP and auto-fill code in dev mode', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Switch to UZ
    await page.click('button:has-text("UZ")');
    await expect(page.locator('h1')).toHaveText('Tizimga kirish', { timeout: 8000 });

    // Switch to OTP mode
    await page.locator('.login-mode-switcher').locator('text=SMS Kod').click();

    // Verify OTP mode is active
    await expect(page.locator('#identifier')).toBeVisible();

    // Enter phone number
    await page.fill('#identifier', '+998991234567');

    // Click 'Kod olish' to request OTP
    await page.locator('.resend-link').click();

    // In dev mode, the OTP code is auto-filled from the backend response
    // Wait for #otp-code to receive the value '123456'
    await expect(page.locator('#otp-code')).toHaveValue('123456', { timeout: 10000 });
  });

  test('should toggle language and verify hero heading changes', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const navSwitcher = page.locator('.lang-pill-switcher');
    await expect(navSwitcher).toBeVisible();

    // Switch to RU
    await navSwitcher.locator('button:has-text("RU")').click();
    await expect(page.locator('h1').first()).toContainText('профиль', { timeout: 5000 });

    // Switch to UZ
    await navSwitcher.locator('button:has-text("UZ")').click();
    await expect(page.locator('h1').first()).toContainText('muloqot', { timeout: 5000 });
  });
});
