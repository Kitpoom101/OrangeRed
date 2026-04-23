import { test, expect, Page, Locator } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const CUSTOMER = {
  email: process.env.TEST_CUSTOMER_EMAIL ?? "",
  password: process.env.TEST_CUSTOMER_PASSWORD ?? "",
};
const SHOP_OWNER = {
  email: process.env.TEST_SHOP_OWNER_EMAIL ?? "",
  password: process.env.TEST_SHOP_OWNER_PASSWORD ?? "",
};
const ADMIN = {
  email: process.env.TEST_ADMIN_EMAIL ?? "",
  password: process.env.TEST_ADMIN_PASSWORD ?? "",
};
const SHOP_ID = process.env.TEST_SHOP_ID ?? "";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/signin`);
  await page.getByTestId("email-input").fill(email);
  await page.getByTestId("password-input").fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL(new RegExp(`${BASE_URL}/?$`), { timeout: 10000 });
}

export async function goToShop(page: Page) {
  await page.goto(`${BASE_URL}/shop/${SHOP_ID}`);
  // Works for both roles: customer sees textarea, shop owner sees sidebar first
  await page
    .getByPlaceholder("Compose your message...")
    .or(page.getByText("Guest Inquiries"))
    .first()
    .waitFor({ timeout: 10000 });
}

// Wait for Pusher to replace the temp ID with the real server ID before acting
export async function sendAndConfirm(page: Page, text: string) {
  await page.getByPlaceholder("Compose your message...").fill(text);
  await page.getByRole("button", { name: "Send" }).click();
  await page
    .locator('[data-msg-id]:not([data-msg-id^="temp-"])')
    .filter({ hasText: text })
    .waitFor({ timeout: 10000 });
}

// Returns the last bubble containing the text (most recently sent)
export function getBubble(page: Page, text: string): Locator {
  return page
    .locator('[class*="group/bubble"]')
    .filter({ hasText: text })
    .last();
}
