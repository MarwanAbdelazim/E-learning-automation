import { test as setup, expect } from '../src/fixtures';
import { paths } from '../src/config/env';
import { createUser, type TestUser } from '../src/data/userFactory';
import { userStore } from '../src/utils/userStore';
import { LoginPage } from '../src/pages/LoginPage';

/**
 * Prepares an account without manual input:
 *  1. reuse TEST_USER_* from env, or the user saved by a previous run;
 *  2. otherwise sign up a freshly generated user.
 * The signed-in session is saved for tests that start authenticated.
 */
setup('prepare authenticated test user', async ({ page, signupPage }) => {
  setup.setTimeout(120_000);
  const loginPage = new LoginPage(page);

  const tryLogin = async (user: TestUser) => {
    await loginPage.open();
    await loginPage.login(user.email, user.password);
    return loginPage.expectLoggedIn().then(
      () => true,
      () => false,
    );
  };

  const existing = userStore.load();
  if (existing && (await tryLogin(existing))) {
    await page.context().storageState({ path: paths.storageState });
    return;
  }

  const user = createUser();
  await signupPage.open();
  const outcome = await signupPage.signup(user);

  if (outcome === 'rejected') {
    const errors = await signupPage.errorMessages.allInnerTexts();
    throw new Error(`Sign-up of generated user was rejected: ${errors.join(' | ') || 'no error text found'}`);
  }
  if (outcome === 'verification-required') {
    throw new Error(
      'Sign-up requires email/OTP verification. Set TEST_USER_EMAIL/TEST_USER_PASSWORD to a verified account, ' +
        'or add an inbox integration for TEST_EMAIL_DOMAIN.',
    );
  }

  userStore.save(user);
  if (outcome === 'redirected-to-login') {
    expect(await tryLogin(user), 'newly created user should be able to log in').toBe(true);
  }
  await page.context().storageState({ path: paths.storageState });
});
