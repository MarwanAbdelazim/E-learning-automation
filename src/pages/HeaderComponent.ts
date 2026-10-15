import { expect, type Page } from '@playwright/test';
import { text } from './text';

/** Site-wide navigation bar: entry points to auth and the signed-in user menu. */
export class HeaderComponent {
  constructor(private readonly page: Page) {}

  get loginLink() {
    return this.page.getByRole('link', { name: text.login }).or(this.page.getByRole('button', { name: text.login })).first();
  }

  get signupLink() {
    return this.page.getByRole('link', { name: text.signup }).or(this.page.getByRole('button', { name: text.signup })).first();
  }

  get logoutControl() {
    return this.page.getByRole('button', { name: text.logout }).or(this.page.getByRole('menuitem', { name: text.logout })).or(this.page.getByRole('link', { name: text.logout })).first();
  }

  get userMenu() {
    return this.page
      .locator('[aria-label*="account" i], [aria-label*="profile" i], [aria-label*="user" i], [data-testid*="avatar" i], [class*="avatar" i]')
      .first();
  }

  async openLogin() {
    await this.loginLink.click();
  }

  async openSignup() {
    await this.signupLink.click();
  }

  /** Logs out, opening the user menu first when the logout control is tucked inside it. */
  async logout() {
    if (!(await this.logoutControl.isVisible())) {
      await this.userMenu.click();
    }
    await this.logoutControl.click();
  }

  async expectLoggedIn() {
    await expect(this.loginLink, 'login link should be hidden once signed in').toBeHidden({ timeout: 15_000 });
  }

  async expectLoggedOut() {
    await expect(this.loginLink, 'login link should be visible when signed out').toBeVisible({ timeout: 15_000 });
  }
}
