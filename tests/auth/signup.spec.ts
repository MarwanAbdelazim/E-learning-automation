import { test, expect } from '../../src/fixtures';
import { canSignUpEndToEnd, MISSING_OTP } from '../../src/data/accounts';
import { createUser, invalidData, PASSWORD_RULE } from '../../src/data/userFactory';
import { env } from '../../src/config/env';
import { PAGE_READY_TIMEOUT } from '../../src/pages/BasePage';

test.describe('Sign up – account type', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.open();
  });

  test('SU-01 offers school and university account types', { tag: ['@smoke', '@i18n'] }, async ({ signupPage }) => {
    await expect(signupPage.schoolStudentOption).toBeVisible();
    await expect(signupPage.universityStudentOption).toBeVisible();
    await expect(signupPage.loginLink).toBeVisible();
  });

  for (const [type, total] of [['school', 4], ['university', 3]] as const) {
    test(`SU-02 ${type} student continues to step 1 of ${total}`, { tag: '@i18n' }, async ({ signupPage }) => {
      await signupPage.startAs(type);
      await expect(signupPage.stepIndicator(1, total)).toBeVisible();
    });
  }

  test('SU-03 back from step 1 returns to account type', async ({ signupPage }) => {
    await signupPage.startAs('school');
    await signupPage.backButton.click();
    await expect(signupPage.accountTypeHeading).toBeVisible();
  });

  test('SU-04 login link opens the login page', async ({ page, signupPage, loginPage }) => {
    await signupPage.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.heading).toBeVisible({ timeout: PAGE_READY_TIMEOUT });
  });
});

test.describe('Sign up – account details (step 1)', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.openAtDetailsStep('school');
  });

  test('SU-05 shows every account detail field', { tag: ['@smoke', '@i18n'] }, async ({ signupPage }) => {
    for (const field of [
      signupPage.fullNameInput,
      signupPage.usernameInput,
      signupPage.nationalIdInput,
      signupPage.emailInput,
      signupPage.mobileInput,
      signupPage.whatsappInput,
      signupPage.passwordInput,
      signupPage.confirmPasswordInput,
      signupPage.governorateButton,
      signupPage.cityButton,
    ]) {
      await expect(field).toBeVisible();
    }
    await expect(signupPage.genderOption('male')).toBeVisible();
    await expect(signupPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(signupPage.passwordRuleHint).toBeVisible();
  });

  test('SU-06 continue is disabled for an empty form', async ({ signupPage }) => {
    await expect(signupPage.continueButton).toBeDisabled();
  });

  for (const name of invalidData.nonArabicNames) {
    test(`SU-07 rejects non-Arabic full name "${name}"`, { tag: '@i18n' }, async ({ signupPage }) => {
      await signupPage.fullNameInput.fill(name);
      await signupPage.blur(signupPage.fullNameInput);
      await signupPage.expectFieldError(signupPage.fullNameInput, /(دخل حروف عربية بس|Please enter Arabic letters only)/i);
    });
  }

  test('SU-08 accepts an Arabic full name', async ({ signupPage }) => {
    await signupPage.fullNameInput.fill(createUser().fullName);
    await signupPage.blur(signupPage.fullNameInput);
    await signupPage.expectFieldValid(signupPage.fullNameInput);
  });

  test('SU-09 city is locked until a governorate is chosen', { tag: '@i18n' }, async ({ signupPage }) => {
    await expect(signupPage.cityButton).toBeDisabled();
    const governorate = await signupPage.pick(signupPage.governorateButton);
    await expect(signupPage.governorateButton).toContainText(governorate);
    await expect(signupPage.cityButton).toBeEnabled();
    const city = await signupPage.pick(signupPage.cityButton);
    await expect(signupPage.cityButton).toContainText(city);
  });

  test('SU-10 governorate search filters the list', async ({ signupPage }) => {
    await signupPage.governorateButton.click();
    const first = (await signupPage.pickerOptions.first().innerText()).trim();
    await signupPage.pickerSearch.fill(first);
    await expect(signupPage.pickerOptions.first()).toHaveText(first);
    await signupPage.pickerSearch.fill('zzzz');
    await expect(signupPage.pickerOptions).toHaveCount(0);
  });

  test('SU-11 shows and hides the password', async ({ signupPage }) => {
    await signupPage.passwordInput.fill('Qa_secret1');
    expect(await signupPage.togglePasswordVisibility(signupPage.passwordInput)).toBe('text');
    expect(await signupPage.togglePasswordVisibility(signupPage.passwordInput)).toBe('password');
  });

  test('SU-12 generated passwords follow the site rule; bad samples break it', async () => {
    expect(createUser().password).toMatch(PASSWORD_RULE);
    for (const bad of invalidData.badPasswords) expect(bad).not.toMatch(PASSWORD_RULE);
  });

  for (const mobile of ['', '123']) {
    test(`SU-13 verify with invalid mobile "${mobile}" sends no code`, async ({ signupPage }) => {
      await signupPage.mobileInput.fill(mobile);
      await signupPage.verifyMobileButton.click();
      await expect(signupPage.otpInput).toBeHidden();
      await expect(signupPage.continueButton).toBeDisabled();
    });
  }

  test('SU-16 invalid mobile shows an error on verify', { annotation: { type: 'bug', description: 'BUG-02: Verify silently does nothing for an empty/short mobile' } }, async ({ signupPage }) => {
    test.fail();
    await signupPage.mobileInput.fill('123');
    await signupPage.verifyMobileButton.click();
    await expect(signupPage.mobileInput).toHaveAttribute('aria-invalid', 'true', { timeout: 5_000 });
  });

  test('SU-17 mobile field ignores letters', { annotation: { type: 'bug', description: 'BUG-03: mobile input accepts letters' } }, async ({ signupPage }) => {
    test.fail();
    await signupPage.mobileInput.pressSequentially('abc');
    await expect(signupPage.mobileInput).toHaveValue('');
  });

  test('SU-14 continue stays disabled until the mobile is verified', { tag: '@smoke' }, async ({ signupPage }) => {
    await signupPage.fillDetails(createUser());
    await expect(signupPage.verifyMobileButton).toBeEnabled();
    await expect(signupPage.continueButton).toBeDisabled();
  });

  test('SU-15 completes step 1 with a verified mobile', async ({ signupPage }) => {
    test.skip(!canSignUpEndToEnd(), MISSING_OTP);
    await signupPage.fillDetails(createUser());
    await signupPage.verifyMobile(env.testOtp);
    await expect(signupPage.continueButton).toBeEnabled();
    await signupPage.continueButton.click();
    await expect(signupPage.stepIndicator(2, 4)).toBeVisible();
  });
});
