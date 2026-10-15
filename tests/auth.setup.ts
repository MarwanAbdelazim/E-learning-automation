import fs from 'fs';
import { test as setup } from '../src/fixtures';
import { paths } from '../src/config/env';
import { loadAccount, MISSING_ACCOUNT } from '../src/data/accounts';

/**
 * Saves a signed-in session for tests that start authenticated.
 * Runs without manual input when a verified account is configured; otherwise it records an
 * empty session and the authenticated tests skip with an explanation.
 */
setup('prepare authenticated session', async ({ page, loginPage }) => {
  fs.mkdirSync(paths.authDir, { recursive: true });
  const account = loadAccount();
  if (!account) {
    fs.writeFileSync(paths.storageState, JSON.stringify({ cookies: [], origins: [] }));
    setup.skip(true, MISSING_ACCOUNT);
    return;
  }
  await loginPage.open();
  await loginPage.login(account.login, account.password);
  await loginPage.expectLoggedIn();
  await page.context().storageState({ path: paths.storageState });
});
