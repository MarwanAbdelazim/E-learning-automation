import { expect, type Locator, type Page } from '@playwright/test';
import { env } from '../config/env';
import type { TestUser } from '../data/userFactory';
import { BasePage, PAGE_READY_TIMEOUT } from './BasePage';
import { text } from './text';

/**
 * Sign-up wizard at /register:
 *   account type → Step 1 of 4 "account details" (mobile verified by SMS OTP) → steps 2–4.
 */
export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get form() {
    return this.page.getByRole('region', { name: text.signupRegion });
  }

  // ---- Account type step ----
  get accountTypeHeading() {
    return this.form.getByRole('heading', { name: text.accountTypeHeading });
  }

  get schoolStudentOption() {
    return this.form.getByRole('radio', { name: text.schoolStudent });
  }

  get universityStudentOption() {
    return this.form.getByRole('radio', { name: text.universityStudent });
  }

  get continueButton() {
    return this.form.getByRole('button', { name: text.continue });
  }

  get backButton() {
    return this.form.getByRole('button', { name: text.back });
  }

  get loginLink() {
    return this.form.getByRole('link', { name: text.haveAccountLogin });
  }

  // ---- Step 1: account details ----
  stepIndicator(step = 1, total?: number) {
    return this.form.getByText(text.stepOf(step, total), { exact: false }).first();
  }

  get detailsHeading() {
    return this.form.getByRole('heading', { name: text.detailsHeading });
  }

  get fullNameInput() {
    return this.form.locator('input[name="full_name"]');
  }

  genderOption(gender: 'male' | 'female') {
    return this.form.getByRole('radiogroup', { name: text.gender }).getByRole('radio', { name: gender === 'male' ? text.male : text.female });
  }

  get usernameInput() {
    return this.form.locator('input[name="username"]');
  }

  get nationalIdInput() {
    return this.form.locator('input[name="identity_number"]');
  }

  get emailInput() {
    return this.form.locator('input[name="email"]');
  }

  get mobileInput() {
    return this.form.locator('input[name="mobile"]');
  }

  get whatsappInput() {
    return this.form.locator('input[name="whatsapp"]');
  }

  get passwordInput() {
    return this.form.locator('input[name="password"]');
  }

  get confirmPasswordInput() {
    return this.form.locator('input[name="confirmPassword"]');
  }

  get passwordRuleHint() {
    return this.form.getByText(text.passwordRule);
  }

  get governorateButton() {
    return this.form.getByRole('button', { name: text.governorate });
  }

  get cityButton() {
    return this.form.getByRole('button', { name: text.city });
  }

  get verifyMobileButton() {
    return this.form.getByRole('button', { name: text.verifyMobile });
  }

  get otpInput() {
    return this.form.getByRole('textbox', { name: text.otpInput });
  }

  get confirmOtpButton() {
    return this.form.getByRole('button', { name: text.confirmOtp });
  }

  /** Options of the currently open governorate/city picker. */
  get pickerOptions(): Locator {
    return this.page.getByRole('listbox').getByRole('option');
  }

  get pickerSearch(): Locator {
    return this.page.getByRole('searchbox');
  }

  async open() {
    await this.goto(env.signupPath);
    await expect(this.accountTypeHeading).toBeVisible({ timeout: PAGE_READY_TIMEOUT });
  }

  /** Account type step → Step 1 of 4. */
  async startAs(type: 'school' | 'university' = 'school') {
    await (type === 'school' ? this.schoolStudentOption : this.universityStudentOption).click();
    await this.continueButton.click();
    await expect(this.detailsHeading).toBeVisible({ timeout: PAGE_READY_TIMEOUT });
  }

  async openAtDetailsStep(type: 'school' | 'university' = 'school') {
    await this.open();
    await this.startAs(type);
  }

  /** Picks an option (by name, or the first one) from the governorate or city picker. */
  async pick(trigger: Locator, option?: string | RegExp) {
    await trigger.click();
    await expect(this.pickerOptions.first()).toBeVisible();
    const target = option ? this.pickerOptions.filter({ hasText: option }).first() : this.pickerOptions.first();
    const label = (await target.innerText()).trim();
    await target.click();
    return label;
  }

  async selectLocation(governorate?: string | RegExp, city?: string | RegExp) {
    const gov = await this.pick(this.governorateButton, governorate);
    await expect(this.cityButton).toBeEnabled();
    const c = await this.pick(this.cityButton, city);
    return { governorate: gov, city: c };
  }

  /** Fills every Step 1 field except the OTP. */
  async fillDetails(user: TestUser) {
    await this.fullNameInput.fill(user.fullName);
    await this.genderOption(user.gender).check();
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.mobileInput.fill(user.mobile);
    await this.whatsappInput.fill(user.whatsapp);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.selectLocation();
  }

  /** Sends the SMS code and confirms it. Only call with a staging test number. */
  async verifyMobile(otp: string) {
    await this.verifyMobileButton.click();
    await expect(this.otpInput).toBeVisible();
    await this.otpInput.fill(otp);
    await this.confirmOtpButton.click();
  }

  async blur(field: Locator) {
    await field.press('Tab');
  }
}
