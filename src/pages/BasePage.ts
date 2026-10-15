import { expect, type Locator, type Page } from '@playwright/test';
import { text } from './text';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForSettled();
  }

  /** SPA pages keep loading after DOMContentLoaded; wait for the network to go quiet (best effort). */
  async waitForSettled(timeout = 10_000) {
    await this.page.waitForLoadState('networkidle', { timeout }).catch(() => undefined);
  }

  /** Fills a field only when the site renders it, so optional fields don't break flows. */
  protected async fillIfVisible(locator: Locator, value: string): Promise<boolean> {
    const field = locator.first();
    if ((await field.count()) === 0 || !(await field.isVisible())) return false;
    await field.fill(value);
    return true;
  }

  /** Visible error/validation messages rendered by the app. */
  get errorMessages(): Locator {
    return this.page
      .locator(
        [
          '[role="alert"]',
          '[aria-live="assertive"]',
          '[class*="error" i]',
          '[class*="invalid" i]',
          '[class*="danger" i]',
          '[class*="destructive" i]',
          '[class*="toast" i]',
          '[data-sonner-toast]',
          '.Toastify__toast',
        ].join(', '),
      )
      .filter({ hasText: /\S/ });
  }

  /** True when the browser or the app flags the field as invalid. */
  async isFieldInvalid(field: Locator): Promise<boolean> {
    return field.first().evaluate((el) => {
      const input = el as HTMLInputElement;
      const nativeInvalid = typeof input.checkValidity === 'function' && !input.checkValidity();
      return nativeInvalid || input.getAttribute('aria-invalid') === 'true';
    });
  }

  /**
   * Asserts the form was rejected: either native/ARIA validation marks one of the fields
   * as invalid, or the app shows an error message.
   */
  async expectValidationError(fields: Locator[], message: RegExp = text.errorHint) {
    await expect
      .poll(
        async () => {
          for (const field of fields) {
            if ((await field.count()) > 0 && (await this.isFieldInvalid(field))) return true;
          }
          const errors = this.errorMessages.filter({ hasText: message });
          return (await errors.count()) > 0 && (await errors.first().isVisible());
        },
        { message: 'expected a validation error to be shown', timeout: 10_000 },
      )
      .toBe(true);
  }
}
