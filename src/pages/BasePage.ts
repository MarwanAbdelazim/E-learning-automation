import { expect, type Locator, type Page } from '@playwright/test';

/** Lazy-loaded route chunks can be slow on staging; page-ready checks get a longer budget than element checks. */
export const PAGE_READY_TIMEOUT = 30_000;

export abstract class BasePage {
  constructor(readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForSettled();
  }

  /** SPA keeps fetching after DOMContentLoaded; wait for the network to go quiet (best effort). */
  async waitForSettled(timeout = 10_000) {
    await this.page.waitForLoadState('networkidle', { timeout }).catch(() => undefined);
  }

  /** Toast area ("Notifications" region) used by the site for API results. */
  get toasts(): Locator {
    return this.page.getByRole('region', { name: 'Notifications' });
  }

  async expectToast(message: RegExp) {
    await expect(this.toasts.getByText(message).first()).toBeVisible({ timeout: 15_000 });
  }

  /** Text of the elements referenced by the field's aria-describedby (inline hint/error). */
  async describedBy(field: Locator): Promise<string> {
    return field.evaluate((el) =>
      (el.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent ?? '')
        .join(' ')
        .trim(),
    );
  }

  async expectFieldError(field: Locator, message: RegExp) {
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect.poll(() => this.describedBy(field)).toMatch(message);
  }

  async expectFieldValid(field: Locator) {
    await expect(field).not.toHaveAttribute('aria-invalid', 'true');
  }

  /** Toggles a password field's visibility with its eye button and returns the resulting input type. */
  async togglePasswordVisibility(field: Locator): Promise<string | null> {
    const wrapper = field.locator('xpath=..');
    await wrapper.getByRole('button').first().click();
    return field.getAttribute('type');
  }
}
