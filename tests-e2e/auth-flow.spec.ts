import { test, expect } from '@playwright/test';

const TEST_PHONE = `+99890${Date.now().toString().slice(-7)}`;
const TEST_NAME = 'E2E Test User';
const TEST_PASS = 'testpass123';

test.describe('Registration', () => {
  test('registers a new user and redirects to login', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[type="text"]').fill(TEST_NAME);
    await page.locator('input[type="tel"]').fill(TEST_PHONE);
    await page.locator('input[type="password"]').fill(TEST_PASS);
    await page.locator('button.submit').click();

    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

  test('shows already-registered warning with login link on duplicate phone', async ({ page }) => {
    await page.goto('/register');

    await page.locator('input[type="text"]').fill('Duplicate Test');
    await page.locator('input[type="tel"]').fill(TEST_PHONE);
    await page.locator('input[type="password"]').fill(TEST_PASS);
    await page.locator('button.submit').click();

    await expect(page.locator('.exists-box')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.login-link')).toBeVisible();
  });

  test('phone input rejects letters', async ({ page }) => {
    await page.goto('/register');
    const tel = page.locator('input[type="tel"]');
    await tel.fill('+998abc901963');
    // letters should be stripped
    const val = await tel.inputValue();
    expect(val).not.toMatch(/[a-zA-Z]/);
  });
});

test.describe('Login', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button.submit')).toBeVisible();
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="tel"]').fill('+998900000000');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button.submit').click();
    await expect(page.locator('.err')).toBeVisible({ timeout: 8000 });
  });

  test('logs in with correct credentials from registration', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="tel"]').fill(TEST_PHONE);
    await page.locator('input[type="password"]').fill(TEST_PASS);
    await page.locator('button.submit').click();

    await Promise.race([
      page.waitForURL(/\/dashboard/, { timeout: 20000 }),
      page.locator('.err').waitFor({ state: 'visible', timeout: 20000 }),
    ]);

    const onDashboard = page.url().includes('/dashboard');
    if (!onDashboard) {
      const errText = await page.locator('.err').textContent().catch(() => 'no error element');
      throw new Error(`Password login failed. Error shown: "${errText}". Phone: ${TEST_PHONE}`);
    }
  });

  test('OTP mode toggle appears', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('.mode-switch')).toBeVisible();
    await page.locator('.mode-switch').click();
    await expect(page.locator('input[type="tel"]')).toBeVisible();
  });

  test('OTP auto-fills and logs in (dev mode)', async ({ page }) => {
    await page.goto('/login');
    await page.locator('.mode-switch').click();
    await page.locator('input[type="tel"]').fill(TEST_PHONE);
    await page.locator('.send-btn').click();

    // Wait for either a redirect OR an error message
    await Promise.race([
      page.waitForURL(/\/dashboard/, { timeout: 25000 }),
      page.locator('.err').waitFor({ state: 'visible', timeout: 25000 }),
    ]);

    const onDashboard = page.url().includes('/dashboard');
    if (!onDashboard) {
      const errText = await page.locator('.err').textContent();
      throw new Error(`OTP login failed, error shown: "${errText}". URL: ${page.url()}`);
    }
  });
});

test.describe('Legal pages', () => {
  test('agreement page loads', async ({ page }) => {
    await page.goto('/agreement');
    await expect(page.locator('article.doc')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('article.doc')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
});
