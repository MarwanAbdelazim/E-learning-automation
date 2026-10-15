import { expect, type Page } from '@playwright/test';
import { env } from '../config/env';
import { BasePage, PAGE_READY_TIMEOUT } from './BasePage';
import { HeaderComponent } from './HeaderComponent';
import { text } from './text';

export class LoginPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  get form() {
    return this.page.getByRole('region', { name: text.loginRegion });
  }

  get heading() {
    return this.form.getByRole('heading', { name: text.loginHeading });
  }

  get identifierInput() {
    return this.form.getByLabel(text.loginIdentifier);
  }

  get passwordInput() {
    return this.form.getByLabel(text.password);
  }

  get showPasswordButton() {
    return this.form.getByRole('button', { name: text.showPassword });
  }

  get submitButton() {
    return this.form.getByRole('button', { name: text.loginButton });
  }

  get forgotPasswordLink() {
    return this.form.getByRole('link', { name: text.forgotPassword });
  }

  get createAccountLink() {
    return this.form.getByRole('link', { name: text.createAccount });
  }

  async open() {
    await this.goto(env.loginPath);
    await expect(this.heading).toBeVisible({ timeout: PAGE_READY_TIMEOUT });
  }

  async fill(identifier: string, password: string) {
    await this.identifierInput.fill(identifier);
    await this.passwordInput.fill(password);
  }

  async login(identifier: string, password: string) {
    await this.fill(identifier, password);
    await this.submitButton.click();
  }

  async expectLoggedIn() {
    await expect(this.page, 'should leave the login page').not.toHaveURL(new RegExp(`${env.loginPath}/?(\\?|$)`), { timeout: 20_000 });
    await this.header.expectLoggedIn();
  }

  async expectInvalidCredentials() {
    await this.expectToast(text.invalidCredentials);
    await expect(this.page).toHaveURL(new RegExp(`${env.loginPath}/?(\\?|$)`));
    await expect(this.heading).toBeVisible();
  }
}
