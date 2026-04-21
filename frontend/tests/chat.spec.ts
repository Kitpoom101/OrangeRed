import { test, expect, Page, Locator } from '@playwright/test';

const BASE_URL   = process.env.TEST_BASE_URL        ?? 'http://localhost:3000';
const CUSTOMER   = {
  email:    process.env.TEST_CUSTOMER_EMAIL     ?? '',
  password: process.env.TEST_CUSTOMER_PASSWORD  ?? '',
};
const SHOP_OWNER = {
  email:    process.env.TEST_SHOP_OWNER_EMAIL    ?? '',
  password: process.env.TEST_SHOP_OWNER_PASSWORD ?? '',
};
const SHOP_ID    = process.env.TEST_SHOP_ID ?? '';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/signin`);
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
}

async function goToShop(page: Page) {
  await page.goto(`${BASE_URL}/shop/${SHOP_ID}`);
  // Works for both roles: customer sees textarea, shop owner sees sidebar first
  await page.getByPlaceholder('Compose your message...')
    .or(page.getByText('Guest Inquiries'))
    .first()
    .waitFor({ timeout: 10000 });
}

// Wait for Pusher to replace the temp ID with the real server ID before acting
async function sendAndConfirm(page: Page, text: string) {
  await page.getByPlaceholder('Compose your message...').fill(text);
  await page.getByRole('button', { name: 'Send' }).click();
  await page.locator('[data-msg-id]:not([data-msg-id^="temp-"])')
    .filter({ hasText: text })
    .waitFor({ timeout: 10000 });
}

// Returns the last bubble containing the text (most recently sent)
function getBubble(page: Page, text: string): Locator {
  return page.locator('[class*="group/bubble"]').filter({ hasText: text }).last();
}

// ─── US2-1: Customer sends a message ─────────────────────────────────────────

test('US2-1: customer can send a message to a shop', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  const textarea = page.getByPlaceholder('Compose your message...');
  await textarea.fill('Hello, do you have Thai massage?');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(
    page.locator('span[class*="overflow-wrap"]').filter({ hasText: 'Hello, do you have Thai massage?' }).first()
  ).toBeVisible();
  await expect(textarea).toHaveValue('');
});

test('US2-1: send button is disabled when textarea is empty', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  await expect(page.getByRole('button', { name: 'Send' })).toBeDisabled();
});

// ─── US2-2: Customer views chat history ──────────────────────────────────────

test('US2-2: customer sees previous messages after page reload', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  const msgText = `history check ${Date.now()}`;
  await sendAndConfirm(page, msgText);

  await page.reload();
  await page.getByPlaceholder('Compose your message...').waitFor();

  await expect(
    page.locator('span[class*="overflow-wrap"]').filter({ hasText: msgText }).first()
  ).toBeVisible();
});

test('US2-2: deleted messages show placeholder text', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  const msgText = `delete view ${Date.now()}`;
  await sendAndConfirm(page, msgText);

  const bubble = getBubble(page, msgText);
  await bubble.hover();
  await bubble.getByTitle('Delete').click();

  await expect(page.getByText('Withdraw Message?')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm Deletion' }).click();

  await expect(page.getByText('Message vanished into silence').first()).toBeVisible();
});

test('US2-2: edited messages show (refined) label', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  const msgText = `edit view ${Date.now()}`;
  await sendAndConfirm(page, msgText);

  const bubble = getBubble(page, msgText);
  await bubble.hover();
  await bubble.getByTitle('Edit').click();

  const editInput = page.locator('input[class*="bg-transparent"]');
  await expect(editInput).toBeVisible();
  await editInput.clear();
  await editInput.fill(`${msgText} edited`);
  await editInput.press('Enter');

  await expect(page.getByText('(refined)').first()).toBeVisible();
});

// ─── US2-3: Shop owner views customer threads ─────────────────────────────────

test('US2-3: shop owner sees Guest Inquiries sidebar on their own shop', async ({ page }) => {
  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await goToShop(page);

  await expect(page.getByText('Guest Inquiries')).toBeVisible();
});

test('US2-3: shop owner can click a room to see customer messages', async ({ page }) => {
  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await goToShop(page);

  const roomBtn = page.locator('button').filter({ hasText: 'Active Conversation' }).first();
  await expect(roomBtn).toBeVisible();
  await roomBtn.click();

  await expect(page.getByPlaceholder('Compose your message...')).toBeVisible();
});

test('US2-3: shop owner can reply to a customer', async ({ page }) => {
  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await goToShop(page);

  await page.locator('button').filter({ hasText: 'Active Conversation' }).first().click();

  const replyText = `owner reply ${Date.now()}`;
  const textarea = page.getByPlaceholder('Compose your message...');
  await textarea.fill(replyText);
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(
    page.locator('span[class*="overflow-wrap"]').filter({ hasText: replyText }).first()
  ).toBeVisible();
});

test('US2-3: customer does not see Guest Inquiries sidebar', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  await expect(page.getByText('Guest Inquiries')).toHaveCount(0);
});

// ─── US2-4: Edit a message ───────────────────────────────────────────────────

test('US2-4: customer can edit their own message', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  const ts = Date.now();
  const original = `Message to edit ${ts}`;
  const edited   = `Message after edit ${ts}`;

  await sendAndConfirm(page, original);

  const bubble = getBubble(page, original);
  await bubble.hover();
  await bubble.getByTitle('Edit').click();

  const editInput = page.locator('input[class*="bg-transparent"]');
  await expect(editInput).toBeVisible();
  await editInput.clear();
  await editInput.fill(edited);
  await editInput.press('Enter');

  await expect(
    page.locator('span[class*="overflow-wrap"]').filter({ hasText: edited }).first()
  ).toBeVisible();
  await expect(page.getByText('(refined)').first()).toBeVisible();
});

test('US2-4: edit button not visible on other users messages', async ({ page }) => {
  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await goToShop(page);

  await page.locator('button').filter({ hasText: 'Active Conversation' }).first().click();

  const firstBubble = page.locator('[class*="group/bubble"]').first();
  await firstBubble.hover();

  await expect(firstBubble.getByTitle('Edit')).toHaveCount(0);
});

// ─── US2-5: Delete a message ─────────────────────────────────────────────────

test('US2-5: customer can delete their own message', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  const msgText = `Message to delete ${Date.now()}`;
  await sendAndConfirm(page, msgText);

  const bubble = getBubble(page, msgText);
  await bubble.hover();
  await bubble.getByTitle('Delete').click();

  await expect(page.getByText('Withdraw Message?')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm Deletion' }).click();

  await expect(
    page.locator('span[class*="overflow-wrap"]').filter({ hasText: msgText })
  ).toHaveCount(0);
  await expect(page.getByText('Message vanished into silence').first()).toBeVisible();
});

test('US2-5: delete confirm popup has cancel option', async ({ page }) => {
  await login(page, CUSTOMER.email, CUSTOMER.password);
  await goToShop(page);

  const keepText = `Keep this message ${Date.now()}`;
  await sendAndConfirm(page, keepText);

  const bubble = getBubble(page, keepText);
  await bubble.hover();
  await bubble.getByTitle('Delete').click();

  await page.getByRole('button', { name: 'Keep it' }).click();

  await expect(
    page.locator('span[class*="overflow-wrap"]').filter({ hasText: keepText }).first()
  ).toBeVisible();
});

test('US2-5: delete button not visible on other users messages', async ({ page }) => {
  await login(page, SHOP_OWNER.email, SHOP_OWNER.password);
  await goToShop(page);

  await page.locator('button').filter({ hasText: 'Active Conversation' }).first().click();

  const firstBubble = page.locator('[class*="group/bubble"]').first();
  await firstBubble.hover();

  await expect(firstBubble.getByTitle('Delete')).toHaveCount(0);
});
