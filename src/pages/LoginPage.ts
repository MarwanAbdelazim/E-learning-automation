import { expect, type Locator, type Page } from '@playwright/test';
import { env } from '../config/env';
import { BasePage } from './BasePage';
import { HeaderComponent } from './HeaderComponent';
import { text } from './text';

export class LoginPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  get form(): Locator {
    return this.page.locator('form').filter({ has: this.page.locator('input[type="password"]') }).first();
  }

  get emailInput(): Locator {
    return this.page
      .getByLabel(text.emailOrPhone)
      .or(this.page.getByPlaceholder(text.emailOrPhone))
      .or(this.page.locator('input[type="email"], input[name*="email" i], input[autocomplete="username"]'))
      .first();
  }

  get passwordInput(): Locator {
    return this.page.locator('input[type="password"]').first();
  }

  get submitButton(): Locator {
    return this.form
      .locator('button[type="submit"], input[type="submit"]')
      .or(this.page.getByRole('button', { name: text.login }))
      .first();
  }

  get forgotPasswordLink(): Locator {
    return this.page.getByRole('link', { name: /forgot|reset|نسيت/i }).first();
  }

  get signupLink(): Locator {
    return this.page.getByRole('link', { name: text.signup }).first();
  }

  async open() {
    await this.goto(env.loginPath);
    await expect(this.passwordInput, 'login form should render').toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.waitForSettled();
  }

  async expectLoggedIn() {
    await expect(this.page, 'should navigate away from the login page').not.toHaveURL(new RegExp(`${env.loginPath}/?(\\?|$)`), {
      timeout: 20_000,
    });
    await expect(this.passwordInput, 'login form should be gone').toBeHidden();
    await this.header.expectLoggedIn();
  }

  async expectLoginRejected() {
    await expect(this.passwordInput, 'should stay on the login form').toBeVisible();
    await this.expectValidationError([this.emailInput, this.passwordInput]);
  }
}
