import { test, expect } from '../../src/fixtures';
import { invalidData } from '../../src/data/userFactory';
import { paths } from '../../src/config/env';
import { PAGE_READY_TIMEOUT } from '../../src/pages/BasePage';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('LI-01 renders the login form', { tag: ['@smoke', '@i18n'] }, async ({ loginPage }) => {
    await expect(loginPage.identifierInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.createAccountLink).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('LI-02 login button is disabled until both fields are filled', { tag: '@i18n' }, async ({ loginPage }) => {
    await expect(loginPage.submitButton).toBeDisabled();
    await loginPage.identifierInput.fill('qa_user');
    await expect(loginPage.submitButton).toBeDisabled();
    await loginPage.passwordInput.fill('Qa_pass1');
    await expect(loginPage.submitButton).toBeEnabled();
    await loginPage.identifierInput.clear();
    await expect(loginPage.submitButton).toBeDisabled();
  });

  test('LI-03 rejects an unknown user', { tag: ['@smoke', '@i18n'] }, async ({ loginPage }) => {
    await loginPage.login(invalidData.unknownLogin(), invalidData.wrongPassword);
    await loginPage.expectInvalidCredentials();
  });

  test('LI-04 rejects an unknown email', async ({ loginPage }) => {
    await loginPage.login(`${invalidData.unknownLogin()}@mailinator.com`, invalidData.wrongPassword);
    await loginPage.expectInvalidCredentials();
  });

  test('LI-05 rejects an unknown phone number', async ({ loginPage }) => {
    await loginPage.login('01000000000', invalidData.wrongPassword);
    await loginPage.expectInvalidCredentials();
  });

  test('LI-06 rejects a wrong password for a real account', async ({ loginPage, account }) => {
    await loginPage.login(account.login, invalidData.wrongPassword);
    await loginPage.expectInvalidCredentials();
  });

  test('LI-07 shows and hides the password', async ({ loginPage }) => {
    await loginPage.passwordInput.fill('Qa_secret1');
    expect(await loginPage.togglePasswordVisibility(loginPage.passwordInput)).toBe('text');
    expect(await loginPage.togglePasswordVisibility(loginPage.passwordInput)).toBe('password');
    await expect(loginPage.passwordInput).toHaveValue('Qa_secret1');
  });

  test('LI-08 forgot password link opens the reset page', async ({ page, loginPage }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('LI-09 create account link opens sign-up', async ({ page, loginPage, signupPage }) => {
    await loginPage.createAccountLink.click();
    await expect(page).toHaveURL(/\/register/);
    await expect(signupPage.accountTypeHeading).toBeVisible({ timeout: PAGE_READY_TIMEOUT });
  });

  test('LI-10 logs in with valid credentials', { tag: '@smoke' }, async ({ loginPage, account }) => {
    await loginPage.login(account.login, account.password);
    await loginPage.expectLoggedIn();
  });

  test('LI-11 keeps the session after a reload', async ({ page, loginPage, account }) => {
    await loginPage.login(account.login, account.password);
    await loginPage.expectLoggedIn();
    await page.reload();
    await loginPage.header.expectLoggedIn();
  });
});

test.describe('Header entry points', () => {
  test('LI-12 header links open login and sign-up', { tag: '@i18n' }, async ({ page, header, loginPage, signupPage }) => {
    await page.goto('/');
    await header.loginLink.click();
    await expect(loginPage.heading).toBeVisible({ timeout: PAGE_READY_TIMEOUT });
    await page.goto('/');
    await header.signupLink.click();
    await expect(signupPage.accountTypeHeading).toBeVisible({ timeout: PAGE_READY_TIMEOUT });
  });
});

test.describe('Authenticated session', () => {
  test.use({ storageState: paths.storageState });

  test('LI-13 starts signed in from the saved session', async ({ page, header, account }) => {
    await page.goto('/');
    await header.expectLoggedIn();
  });
});
