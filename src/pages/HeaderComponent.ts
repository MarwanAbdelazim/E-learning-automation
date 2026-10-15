import { expect, type Page } from '@playwright/test';
import { text } from './text';

/** Site-wide banner: navigation, language toggle and auth entry points. */
export class HeaderComponent {
  constructor(private readonly page: Page) {}

  get banner() {
    return this.page.getByRole('banner');
  }

  get loginLink() {
    return this.banner.getByRole('link', { name: text.headerLogin });
  }

  get signupLink() {
    return this.banner.getByRole('link', { name: text.headerSignup });
  }

  get languageToggle() {
    return this.page.getByRole('button', { name: text.languageToggle });
  }

  async expectLoggedIn() {
    await expect(this.loginLink, 'login link should disappear once signed in').toBeHidden({ timeout: 15_000 });
  }

  async expectLoggedOut() {
    await expect(this.loginLink, 'login link should be shown when signed out').toBeVisible({ timeout: 15_000 });
  }
}
