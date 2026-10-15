import { test, expect } from '../../src/fixtures';
import { createUser, invalidData } from '../../src/data/userFactory';

test.describe('Sign up', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.open();
  });

  test('renders the sign-up form', { tag: '@smoke' }, async ({ signupPage }) => {
    await expect(signupPage.emailInput).toBeVisible();
    await expect(signupPage.passwordInput).toBeVisible();
    await expect(signupPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(signupPage.submitButton).toBeVisible();
  });

  test('registers a new user with valid data', { tag: '@smoke' }, async ({ signupPage }) => {
    const outcome = await signupPage.signup(createUser());
    expect(['logged-in', 'redirected-to-login', 'verification-required']).toContain(outcome);
  });

  test('rejects an email that is already registered', async ({ signupPage, registeredUser }) => {
    await signupPage.fillForm(createUser({ email: registeredUser.email }));
    await signupPage.submit();
    await signupPage.expectSignupRejected([signupPage.emailInput]);
  });

  for (const email of invalidData.malformedEmails) {
    test(`rejects malformed email "${email}"`, async ({ signupPage }) => {
      await signupPage.fillForm(createUser({ email }));
      await signupPage.submit();
      await signupPage.expectSignupRejected([signupPage.emailInput]);
    });
  }

  test('rejects an empty form', async ({ signupPage }) => {
    await signupPage.submit();
    await signupPage.expectSignupRejected();
  });

  test('rejects a weak password', async ({ signupPage }) => {
    const user = createUser({ password: invalidData.weakPassword });
    await signupPage.fillForm(user);
    await signupPage.submit();
    await signupPage.expectSignupRejected([signupPage.passwordInput, signupPage.confirmPasswordInput]);
  });

  test('rejects mismatched password confirmation', async ({ signupPage }) => {
    test.skip((await signupPage.confirmPasswordInput.count()) === 0, 'sign-up form has no confirm-password field');
    await signupPage.fillForm(createUser(), { confirmPassword: 'Different!Pass999' });
    await signupPage.submit();
    await signupPage.expectSignupRejected([signupPage.confirmPasswordInput]);
  });

  test('links to the login page', async ({ page, signupPage }) => {
    const loginLink = page.getByRole('link', { name: /log\s?in|sign\s?in|تسجيل الدخول|دخول/i }).first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(signupPage.confirmPasswordInput).toHaveCount(0);
  });
});
