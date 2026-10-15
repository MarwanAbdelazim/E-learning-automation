import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const trimSlash = (url: string) => url.replace(/\/+$/, '');

export const env = {
  baseUrl: trimSlash(process.env.BASE_URL || 'https://stage.ednuva-website-8tf.pages.dev'),
  loginPath: process.env.LOGIN_PATH || '/login',
  signupPath: process.env.SIGNUP_PATH || '/signup',
  testUserEmail: process.env.TEST_USER_EMAIL || '',
  testUserPassword: process.env.TEST_USER_PASSWORD || '',
  testEmailDomain: process.env.TEST_EMAIL_DOMAIN || 'mailinator.com',
  headless: process.env.HEADLESS !== 'false',
  isCI: !!process.env.CI,
};

export const paths = {
  authDir: path.resolve(__dirname, '../../.auth'),
  storageState: path.resolve(__dirname, '../../.auth/storage-state.json'),
  userFile: path.resolve(__dirname, '../../.auth/user.json'),
};
