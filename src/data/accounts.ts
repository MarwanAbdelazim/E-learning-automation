import fs from 'fs';
import { env, paths } from '../config/env';

export interface Account {
  login: string;
  password: string;
}

/** Account for positive login tests: TEST_USER_* from env, else the one saved by a setup sign-up. */
export function loadAccount(): Account | null {
  if (env.testUserLogin && env.testUserPassword) {
    return { login: env.testUserLogin, password: env.testUserPassword };
  }
  if (fs.existsSync(paths.userFile)) {
    return JSON.parse(fs.readFileSync(paths.userFile, 'utf-8')) as Account;
  }
  return null;
}

export function saveAccount(account: Account) {
  fs.mkdirSync(paths.authDir, { recursive: true });
  fs.writeFileSync(paths.userFile, JSON.stringify(account, null, 2));
}

export const canSignUpEndToEnd = () => !!(env.testMobile && env.testOtp);

export const MISSING_ACCOUNT =
  'No verified account: set TEST_USER_LOGIN/TEST_USER_PASSWORD, or TEST_MOBILE/TEST_OTP so setup can sign one up.';
export const MISSING_OTP = 'Sign-up needs SMS verification: set TEST_MOBILE and TEST_OTP (staging test number + bypass code).';
