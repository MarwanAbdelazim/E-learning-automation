import { test, expect } from '../../src/fixtures';
import { invalidData } from '../../src/data/userFactory';
import { paths } from '../../src/config/env';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('renders the login form', { tag: '@smoke' }, async ({ loginPage }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('logs in with valid credentials', { tag: '@smoke' }, async ({ loginPage, registeredUser }) => {
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoggedIn();
  });

  test('keeps the session after a reload', async ({ page, loginPage, registeredUser }) => {
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoggedIn();
    await page.reload();
    await loginPage.header.expectLoggedIn();
  });

  test('logs out', async ({ loginPage, registeredUser }) => {
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoggedIn();
    await loginPage.header.logout();
    await loginPage.header.expectLoggedOut();
  });

  test('rejects a wrong password', async ({ loginPage, registeredUser }) => {
    await loginPage.login(registeredUser.email, invalidData.wrongPassword);
    await loginPage.expectLoginRejected();
  });

  test('rejects an unregistered email', async ({ loginPage }) => {
    await loginPage.login(invalidData.unregisteredEmail(), invalidData.wrongPassword);
    await loginPage.expectLoginRejected();
  });

  test('rejects empty credentials', async ({ loginPage }) => {
    await loginPage.submitButton.click();
    await loginPage.expectLoginRejected();
  });

  test('rejects a malformed email', async ({ loginPage }) => {
    await loginPage.login(invalidData.malformedEmails[0], invalidData.wrongPassword);
    await loginPage.expectLoginRejected();
  });

  test('links to sign-up and forgot password', async ({ loginPage }) => {
    await expect(loginPage.signupLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });
});

test.describe('Authenticated session', () => {
  test.use({ storageState: paths.storageState });

  test('starts signed in from the saved session', async ({ page, header }) => {
    await page.goto('/');
    await header.expectLoggedIn();
  });
});
