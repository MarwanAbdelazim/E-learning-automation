import { expect, type Locator, type Page } from '@playwright/test';
import { env } from '../config/env';
import type { TestUser } from '../data/userFactory';
import { BasePage } from './BasePage';
import { HeaderComponent } from './HeaderComponent';
import { text } from './text';

export type SignupOutcome = 'logged-in' | 'verification-required' | 'redirected-to-login' | 'rejected';

export class SignupPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  private field(label: RegExp, css: string): Locator {
    return this.page.getByLabel(label).or(this.page.getByPlaceholder(label)).or(this.page.locator(css)).first();
  }

  get firstNameInput() {
    return this.field(text.firstName, 'input[name*="first" i]');
  }

  get lastNameInput() {
    return this.field(text.lastName, 'input[name*="last" i]');
  }

  get fullNameInput() {
    return this.field(text.fullName, 'input[name="name" i], input[name*="fullname" i], input[name*="full_name" i]');
  }

  get emailInput() {
    return this.field(text.email, 'input[type="email"], input[name*="email" i]');
  }

  get phoneInput() {
    return this.field(text.phone, 'input[type="tel"], input[name*="phone" i], input[name*="mobile" i]');
  }

  get passwordInput() {
    return this.page.locator('input[type="password"]').first();
  }

  get confirmPasswordInput() {
    return this.page.locator('input[type="password"]').nth(1);
  }

  get termsCheckbox() {
    return this.page.getByRole('checkbox', { name: text.terms }).or(this.page.locator('input[type="checkbox"]')).first();
  }

  get studentOption() {
    return this.page.getByRole('radio', { name: text.student }).or(this.page.getByRole('tab', { name: text.student })).first();
  }

  get submitButton() {
    return this.page
      .locator('form')
      .filter({ has: this.passwordInput })
      .locator('button[type="submit"], input[type="submit"]')
      .or(this.page.getByRole('button', { name: text.signup }))
      .first();
  }

  async open() {
    await this.goto(env.signupPath);
    await expect(this.passwordInput, 'sign-up form should render').toBeVisible();
  }

  /** Fills whichever sign-up fields the site renders. */
  async fillForm(user: TestUser, opts: { confirmPassword?: string; acceptTerms?: boolean } = {}) {
    if ((await this.studentOption.count()) > 0 && (await this.studentOption.isVisible())) {
      await this.studentOption.click();
    }
    const hasSplitName = await this.fillIfVisible(this.firstNameInput, user.firstName);
    if (hasSplitName) {
      await this.fillIfVisible(this.lastNameInput, user.lastName);
    } else {
      await this.fillIfVisible(this.fullNameInput, user.fullName);
    }
    await this.emailInput.fill(user.email);
    await this.fillIfVisible(this.phoneInput, user.phone);
    await this.passwordInput.fill(user.password);
    await this.fillIfVisible(this.confirmPasswordInput, opts.confirmPassword ?? user.password);

    const terms = this.termsCheckbox;
    if ((opts.acceptTerms ?? true) && (await terms.count()) > 0 && !(await terms.isChecked())) {
      await terms.check({ force: true });
    }
  }

  async submit() {
    await this.submitButton.click();
    await this.waitForSettled();
  }

  async signup(user: TestUser) {
    await this.fillForm(user);
    await this.submit();
    return this.outcome();
  }

  /** Classifies where the site lands after a sign-up attempt. */
  async outcome(timeout = 20_000): Promise<SignupOutcome> {
    const deadline = Date.now() + timeout;
    const loginPath = new RegExp(`${env.loginPath}/?(\\?|$)`);
    const signupPath = new RegExp(`${env.signupPath}/?(\\?|$)`);
    while (Date.now() < deadline) {
      const url = this.page.url();
      if ((await this.page.getByText(text.verification).first().isVisible().catch(() => false)) || /verify|otp|confirm/i.test(url)) {
        return 'verification-required';
      }
      if (loginPath.test(url)) return 'redirected-to-login';
      if (!signupPath.test(url) && !(await this.header.loginLink.isVisible().catch(() => false))) return 'logged-in';
      if ((await this.errorMessages.filter({ hasText: text.errorHint }).count()) > 0) return 'rejected';
      await this.page.waitForTimeout(500);
    }
    return signupPath.test(this.page.url()) ? 'rejected' : 'logged-in';
  }

  async expectSignupRejected(fields: Locator[] = [this.emailInput, this.passwordInput]) {
    await expect(this.passwordInput, 'should stay on the sign-up form').toBeVisible();
    await this.expectValidationError(fields);
  }
}
