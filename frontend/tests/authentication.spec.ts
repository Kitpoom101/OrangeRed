import { test, expect, Page, Locator } from '@playwright/test';
import { login } from './testfunction';

const BASE_URL   = process.env.TEST_BASE_URL        ?? 'http://localhost:3000';
const CUSTOMER   = {
  email:    process.env.TEST_CUSTOMER_EMAIL     ?? '',
  password: process.env.TEST_CUSTOMER_PASSWORD  ?? '',
};
const SHOP_OWNER = {
  email:    process.env.TEST_SHOP_OWNER_EMAIL    ?? '',
  password: process.env.TEST_SHOP_OWNER_PASSWORD ?? '',
};
const ADMIN = {
  email:    process.env.TEST_ADMIN_EMAIL    ?? '',
  password: process.env.TEST_ADMIN_PASSWORD ?? '',
}
const SHOP_ID    = process.env.TEST_SHOP_ID ?? '';

// ─── US3-1: Google OAuth Login ─────────────────────────────────────────

// ─── US3-2: User views profile ─────────────────────────────────────────
test('US3-2: customer can view their profile', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await page.waitForLoadState('networkidle'); 
  await page.goto(`${BASE_URL}/profile`);
  await expect(page.getByText('Member Profile')).toBeVisible({ timeout: 10000 });

  const registrySection = page.locator('div', { hasText: 'Registry Status' });
  await expect(registrySection.getByText(/Verified Member/i)).toBeVisible();
});


// ─── US3-3: User edits profile ─────────────────────────────────────────
test('US3-3: customer can edit their profile', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await page.waitForLoadState('networkidle'); 
  await page.goto(`${BASE_URL}/profile`);
  await expect(page.getByText('Member Profile')).toBeVisible({ timeout: 10000 });

  await page.getByLabel('Edit profile details').click();

  const nameInput = page.locator('input[type="text"]');
  await nameInput.fill('Updated Name 2026'); 
  await page.getByRole('button', { name: /Confirm Changes|Save/i }).click();

  await expect(page.getByText('Identity Updated Successfully')).toBeVisible();
  
  await expect(page.getByTestId('profile-name')).toHaveText('Updated Name 2026');
});

// ─── US3-4: User add profile avatar ─────────────────────────────────────────

const TEST_AVATAR_URL = "https://i.pinimg.com/736x/93/aa/77/93aa772323aaa7e25093d29e02d82a3e.jpg";

test("US3-4: User adds profile picture via URL", async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await page.waitForLoadState("networkidle");
  await page.goto(`${BASE_URL}/profile`);
  await expect(page.getByText("Member Profile")).toBeVisible({
    timeout: 10000,
  });

await page.getByLabel('Edit profile details').click();

  const urlInput = page.getByPlaceholder('https://image-url.com/avatar.png');
  await expect(urlInput).toBeVisible();

  await urlInput.fill(TEST_AVATAR_URL);

  await page.getByRole("button", { name: "Update Portrait" }).click();


  await expect(page.getByText("Identity Updated Successfully")).toBeVisible();

 
  const profileImg = page.locator('img[alt="Profile"]');

  await expect(profileImg).toHaveAttribute(
    "src",
    new RegExp(encodeURIComponent(TEST_AVATAR_URL)),
  );
});
